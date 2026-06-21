from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
DOMAINS_FILE = ROOT / "training-intelligence-preview" / "course-domains-local.json"
PDF_DIR = ROOT / "training-intelligence-source-pdfs"
JSON_OUTPUT = ROOT / "src" / "components" / "TrainingIntelligence" / "naussCourseCatalog.json"
TS_OUTPUT = ROOT / "src" / "components" / "TrainingIntelligence" / "naussCourseCatalog.ts"


def normalize_arabic(text: str) -> str:
    replacements = {
        "أ": "ا",
        "إ": "ا",
        "آ": "ا",
        "ى": "ي",
        "ة": "ه",
        "ؤ": "و",
        "ئ": "ي",
        "ـ": "",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def clean(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[\t\r]+", " ", text)
    text = re.sub(r" +", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def non_empty_lines(text: str) -> list[str]:
    return [clean(line) for line in text.splitlines() if clean(line)]


def extract_title(lines: list[str]) -> str:
    normalized_lines = [normalize_arabic(line) for line in lines]
    title_marker_indexes = [index for index, normalized_line in enumerate(normalized_lines) if "البرنامج التدريبي" in normalized_line]
    for index in reversed(title_marker_indexes):
        normalized_line = normalized_lines[index]

        original_line = lines[index]
        title_before = re.sub(r":?\s*البرنامج التدريبي\s*:?", "", original_line).strip(" :")
        if len(title_before) > 3:
            return title_before

        title_lines: list[str] = []
        for candidate in lines[index + 1 : index + 5]:
            normalized_candidate = normalize_arabic(candidate)
            if (
                "المقاعد" in normalized_candidate
                or "مقر الجامعه" in normalized_candidate
                or "تقدم باللغه" in normalized_candidate
                or "المجالات الوظيفيه" in normalized_candidate
                or "شروط الالتحاق" in normalized_candidate
                or "شروط االلتحاق" in normalized_candidate
                or "نواتج التعلم" in normalized_candidate
                or "الهدف العام" in normalized_candidate
                or re.search(r"\d", normalized_candidate)
                or "يوم" in normalized_candidate
                or "ايام" in normalized_candidate
            ):
                break
            title_lines.append(candidate)

        return clean(" ".join(title_lines))

    return ""


def find_first(patterns: list[str], text: str) -> re.Match[str] | None:
    normalized = normalize_arabic(text)
    for pattern in patterns:
        match = re.search(pattern, normalized)
        if match:
            return match
    return None


def extract_duration(text: str) -> int | None:
    match = find_first([r"(\d+)\s*(?:يوم|ايام)", r"(?:يوم|ايام)\s*(\d+)"], text)
    return int(match.group(1)) if match else None


def extract_seats(text: str) -> int | None:
    match = find_first([r"(\d+)\s*المقاعد المتاحه", r"المقاعد المتاحه\s*(\d+)"], text)
    return int(match.group(1)) if match else None


def extract_price(text: str) -> int | None:
    normalized = normalize_arabic(text)
    match = re.search(r"([\d,]+)\s*\n?\s*للمتدرب الواحد", normalized)
    if match:
        return int(match.group(1).replace(",", ""))

    values = [int(value.replace(",", "")) for value in re.findall(r"(?<!\d)(\d{1,3}(?:,\d{3})|\d{4,5})(?!\d)", text)]
    values = [value for value in values if 1000 <= value <= 50000]
    return values[-1] if values else None


def extract_language(text: str) -> str:
    normalized = normalize_arabic(text)
    if "اللغه الانجليزيه" in normalized:
        return "الإنجليزية"
    if "اللغه العربيه" in normalized:
        return "العربية"
    return "العربية"


def extract_dates(text: str) -> list[str]:
    return re.findall(r"م\s*\d{4}/\s*\d{1,2}\s*/\s*\d{1,2}\s*[–\-]\s*\d{1,2}|م\d{4}/\d{2}/\d{2}-\d{2}/\d{2}|م\d{4}/\d{2}/\d{2}-\d{2}", text)


def section_after(text: str, start_terms: list[str], end_terms: list[str]) -> str:
    normalized = normalize_arabic(text)
    normalized_start_terms = [normalize_arabic(term) for term in start_terms]
    normalized_end_terms = [normalize_arabic(term) for term in end_terms]

    start = -1
    start_term = ""
    for term in normalized_start_terms:
        index = normalized.find(term)
        if index != -1 and (start == -1 or index < start):
            start = index
            start_term = term

    if start == -1:
        return ""

    start += len(start_term)
    end = len(normalized)
    for term in normalized_end_terms:
        index = normalized.find(term, start)
        if index != -1 and index < end:
            end = index

    # The normalized string has the same length for the replacements we use here often, but not always.
    # For extraction quality we return from normalized text; it is acceptable for matching and recommendations.
    return clean(normalized[start:end].strip(" :\n"))


def bulletize(section: str, limit: int = 6) -> list[str]:
    items: list[str] = []
    for line in non_empty_lines(section):
        line = line.strip("•.:- ")
        if len(line) > 240:
            chunks = re.split(r"\.\s+|،\s+", line)
            items.extend(chunk.strip(" .") for chunk in chunks if len(chunk.strip()) > 18)
        elif len(line) > 8:
            items.append(line)

    unique: list[str] = []
    for item in items:
        if item not in unique:
            unique.append(item)
    return unique[:limit]


def make_id(domain_pdf_name: str, page_number: int, title: str) -> str:
    base = f"{domain_pdf_name.replace('.pdf', '')}-{page_number}-{title}"
    slug = re.sub(r"[^A-Za-z0-9\u0600-\u06ff]+", "-", normalize_arabic(base).lower()).strip("-")
    return slug[:100]


def ensure_pdfs(domains: list[dict]) -> list[dict]:
    PDF_DIR.mkdir(exist_ok=True)
    for domain in domains:
        filename = re.sub(r"[^A-Za-z0-9._-]+", "-", domain["url"].split("/")[-1])
        path = PDF_DIR / filename
        if not path.exists() or path.stat().st_size == 0:
            urllib.request.urlretrieve(domain["url"], path)
        domain["pdfFile"] = str(path)
        domain["pdfName"] = filename
    return domains


def extract_courses() -> list[dict]:
    domains = json.loads(DOMAINS_FILE.read_text(encoding="utf-8"))
    domains = ensure_pdfs(domains)

    courses: list[dict] = []
    for domain in domains:
        pdf_path = Path(domain["pdfFile"])
        document = fitz.open(pdf_path)

        for page_number, page in enumerate(document, start=1):
            text = clean(page.get_text("text"))
            if "البرنامج التدريبي" not in normalize_arabic(text):
                continue

            title = extract_title(non_empty_lines(text))
            if not title or len(title) < 4:
                continue
            title = re.split(r"\s*:?\s*(?:المجاالت|املجاالت|المجالات) الوظيف", title)[0].strip(" :.")
            title = re.split(r"\s*:?\s*شروط ا", title)[0].strip(" :.")

            objective = section_after(
                text,
                ["الهدف العام:", ":الهدف العام"],
                ["المجالات الوظيفية", "في نهاية الدورة", "نواتج التعلم", "شروط الالتحاق", "شروط االلتحاق"],
            )
            outcomes_section = section_after(
                text,
                ["في نهاية الدورة، سيكون المتدرب قادرًاً على", "في نهاية الدورة، سيكون المتدرب قادرا على", "نواتج التعلم"],
                ["الهدف العام", "المجالات الوظيفية", "شروط الالتحاق", "شروط االلتحاق"],
            )
            target_audience = section_after(
                text,
                ["المجالات الوظيفية المستهدفة:", ":المجالات الوظيفية المستهدفة"],
                ["نواتج التعلم", "شروط الالتحاق", "شروط االلتحاق", "الهدف العام"],
            )
            prerequisites = section_after(
                text,
                ["شروط الالتحاق بالدورة", "شروط االلتحاق بالدورة"],
                ["نواتج التعلم", "الهدف العام", "المجالات الوظيفية"],
            )

            duration_days = extract_duration(text)
            price = extract_price(text)
            if duration_days is None and price is None:
                continue

            courses.append(
                {
                    "id": make_id(domain["pdfName"], page_number, title),
                    "domain": domain["name"],
                    "domainPdfUrl": domain["url"],
                    "title": title,
                    "durationDays": duration_days,
                    "seats": extract_seats(text),
                    "language": extract_language(text),
                    "price": price,
                    "location": "مقر الجامعة بالرياض" if "مقر الجامعة بالرياض" in text else "",
                    "dates": extract_dates(text),
                    "objective": objective,
                    "outcomes": bulletize(outcomes_section),
                    "targetAudience": target_audience,
                    "prerequisites": prerequisites,
                    "sourcePage": page_number,
                }
            )

    return courses


def write_outputs(courses: list[dict]) -> None:
    JSON_OUTPUT.write_text(json.dumps(courses, ensure_ascii=False, indent=2), encoding="utf-8")
    TS_OUTPUT.write_text(
        "import courses from \"./naussCourseCatalog.json\"\n\n"
        "export interface NaussCourse {\n"
        "    id: string\n"
        "    domain: string\n"
        "    domainPdfUrl: string\n"
        "    title: string\n"
        "    durationDays: number | null\n"
        "    seats: number | null\n"
        "    language: string\n"
        "    price: number | null\n"
        "    location: string\n"
        "    dates: string[]\n"
        "    objective: string\n"
        "    outcomes: string[]\n"
        "    targetAudience: string\n"
        "    prerequisites: string\n"
        "    sourcePage: number\n"
        "}\n\n"
        "export const naussCourseCatalog = courses as NaussCourse[]\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    extracted_courses = extract_courses()
    write_outputs(extracted_courses)
    print(f"Extracted {len(extracted_courses)} courses")
    domains = sorted({course["domain"] for course in extracted_courses})
    for domain in domains:
        count = sum(1 for course in extracted_courses if course["domain"] == domain)
        print(f"{count:02d} - {domain}")
