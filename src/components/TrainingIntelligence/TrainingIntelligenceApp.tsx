import React, { FormEvent, useMemo, useState } from "react"
import { motion } from "motion/react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
    ArrowRight,
    Award,
    BadgeCheck,
    Banknote,
    BookOpen,
    BookMarked,
    Building2,
    CalendarDays,
    ChevronRight,
    CheckCircle2,
    ClipboardCheck,
    Copy,
    Database,
    Edit3,
    Eye,
    FilePenLine,
    FileText,
    Filter,
    Globe2,
    GraduationCap,
    Home,
    Headphones,
    Layers3,
    Languages,
    MailPlus,
    MapPin,
    Palette,
    Plane,
    Plus,
    Printer,
    Route,
    SearchCheck,
    Send,
    ShieldCheck,
    Sparkles,
    Target,
    Trash2,
    Users,
    X,
    type LucideIcon,
} from "lucide-react"
import { Helmet } from "react-helmet"
import { NaussCourse, naussCourseCatalog } from "./naussCourseCatalog"
import { LmsCourse, lmsCourseCatalog, lmsCourseCatalogData } from "./lmsCourseCatalog"
import { NavBar } from "../ui/tubelight-navbar"

type DurationChoice = "قصيرة" | "متوسطة" | "ممتدة" | "غير محدد"
type OutputMode = "brochure" | "letter"
type PageId = "home" | "needs" | "paths" | "programs" | "courses" | "brochures" | "letters" | "guide"

interface NeedOption {
    id: string
    label: string
    hint: string
    keywords: string[]
}

interface SmartRequest {
    agencyName: string
    domain: string
    needs: string[]
    audience: string
    participants: number
    duration: DurationChoice
    language: string
    executionCity: string
    sector: string
    jobLevel: string
    deliveryMode: string
    urgency: string
}

interface CourseMatch {
    course: NaussCourse
    score: number
    reasons: string[]
}

type BrochureTemplateId = "official" | "field" | "executive" | "gold" | "compact"

interface StrategicTrainingProgram {
    id: string
    title: string
    badge: string
    promise: string
    targetAudience: string
    problem: string
    value: string
    pitch: string
    outcomes: string[]
    sellingAngles: string[]
    keywords: string[]
    icon: LucideIcon
}

const PageHelmet = Helmet as unknown as React.ComponentType<React.PropsWithChildren<Record<string, unknown>>>

const platformNavItems: { id: PageId; name: string; url: string; icon: any }[] = [
    { id: "home", name: "الرئيسية", url: "#home", icon: Home },
    { id: "needs", name: "تحليل الاحتياج التدريبي", url: "#needs", icon: SearchCheck },
    { id: "paths", name: "المسارات التدريبية", url: "#paths", icon: Route },
    { id: "programs", name: "البرامج التدريبية", url: "#programs", icon: Plane },
    { id: "courses", name: "الدورات التدريبية", url: "#courses", icon: Database },
    { id: "brochures", name: "تصميم البرشورات", url: "#brochures", icon: Palette },
    { id: "letters", name: "الخطابات الرسمية", url: "#letters", icon: MailPlus },
    { id: "guide", name: "دليل الدورات 2026", url: "#guide", icon: BookMarked },
]

const videoUrl =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"

const naussLogoUrl = "/nauss-logo-transparent.png"

const partnerItems = [
    { name: "وزارة الداخلية", sector: "قطاع أمني", mark: "دا", gradient: ["#d0b284", "#016564"] },
    { name: "وزارة الدفاع", sector: "قطاع دفاعي", mark: "دف", gradient: ["#9ca3af", "#073b3a"] },
    { name: "وزارة الخارجية", sector: "قطاع دبلوماسي", mark: "خر", gradient: ["#d1fae5", "#016564"] },
    { name: "وزارة الموارد البشرية", sector: "قطاع حكومي", mark: "مب", gradient: ["#bbf7d0", "#15803d"] },
    { name: "أرامكو السعودية", sector: "قطاع الطاقة", mark: "أر", gradient: ["#ccfbf1", "#016564"] },
    { name: "سابك", sector: "قطاع صناعي", mark: "سب", gradient: ["#fef3c7", "#d0b284"] },
    { name: "شركة نجم", sector: "قطاع خدمات", mark: "نج", gradient: ["#e0f2fe", "#016564"] },
    { name: "الشركة السعودية للكهرباء", sector: "قطاع حيوي", mark: "كـ", gradient: ["#fee2e2", "#9f1239"] },
    { name: "تحكم", sector: "قطاع تقني", mark: "تح", gradient: ["#ccfbf1", "#0f766e"] },
]

const needOptions: NeedOption[] = [
    {
        id: "cyber",
        label: "أمن سيبراني",
        hint: "حوادث، اختراقات، حماية بيانات",
        keywords: ["سيبر", "رقمي", "بيانات", "اختراق", "حادث", "فدية", "ويب"],
    },
    {
        id: "forensics",
        label: "تحقيق وأدلة",
        hint: "أدلة جنائية ورقمية وتحليل وقائع",
        keywords: ["أدلة", "ادلة", "جنائي", "تحقيق", "رقمي", "تزوير", "هواتف"],
    },
    {
        id: "border",
        label: "منافذ وحدود",
        hint: "تهريب، مراقبة، إجراءات ميدانية",
        keywords: ["حدود", "منافذ", "تهريب", "مسافرين", "مراقبة"],
    },
    {
        id: "facilities",
        label: "أمن منشآت",
        hint: "منشآت حيوية، حراسات، غرف تحكم",
        keywords: ["منش", "صناعي", "حيوي", "حراسات", "مخاطر", "حماية"],
    },
    {
        id: "leadership",
        label: "قيادة أمنية",
        hint: "قيادات، إشراف، اتخاذ قرار",
        keywords: ["قياد", "إشراف", "اشراف", "إدارة", "ادارة", "اتصال"],
    },
    {
        id: "risk",
        label: "سلامة ومخاطر",
        hint: "إدارة مخاطر، فعاليات، بيئة عمل آمنة",
        keywords: ["مخاطر", "سلامة", "فعاليات", "أزمات", "ازمات", "طوارئ"],
    },
    {
        id: "financial",
        label: "جرائم مالية",
        hint: "احتيال، غسل أموال، تتبع مالي",
        keywords: ["مالي", "غسل", "أموال", "احتيال", "اقتصادي", "عملات"],
    },
    {
        id: "terrorism",
        label: "مكافحة الإرهاب",
        hint: "تهديدات، تطرف، وقاية ومواجهة",
        keywords: ["إرهاب", "ارهاب", "تطرف", "تهديد", "وقاية"],
    },
    {
        id: "ai",
        label: "ذكاء اصطناعي وتقنيات ناشئة",
        hint: "تحليل ذكي، مخاطر تقنية، تطبيقات أمنية",
        keywords: ["ذكاء", "اصطناعي", "تقنيات", "ناشئة", "تحليل"],
    },
    {
        id: "environment",
        label: "أمن بيئي",
        hint: "مخالفات بيئية، رقابة، حماية",
        keywords: ["بيئي", "بيئة", "مخالفات", "حياة فطرية"],
    },
    {
        id: "media",
        label: "إعلام واتصال أمني",
        hint: "رسائل، اتصال أزمات، تواصل مؤسسي",
        keywords: ["إعلام", "اعلام", "اتصال", "تواصل", "رسائل"],
    },
    {
        id: "training",
        label: "تصميم وقياس التدريب",
        hint: "حقائب تدريبية، أثر، تقييم برامج",
        keywords: ["تدريب", "حقائب", "أثر", "تصميم", "تقييم"],
    },
]

const audienceOptions = [
    "ضباط ومختصون",
    "قيادات إشرافية",
    "فرق ميدانية",
    "محللون وفنيون",
    "محققون ومأمورو ضبط",
    "مشرفو عمليات",
    "مدربون داخليون",
    "موظفون غير تقنيين",
]
const sectorOptions = [
    "جهة أمنية",
    "منافذ وحدود",
    "طيران أمني",
    "تحقيق وأدلة جنائية",
    "أمن سيبراني",
    "قيادات أمنية",
    "سلامة وإدارة مخاطر",
    "قطاع حيوي أو صناعي",
]
const jobLevelOptions = ["تنفيذي", "إشرافي", "قيادي", "فني متخصص", "مختلط"]
const deliveryModeOptions = ["حضوري في مقر الجامعة", "حضوري لدى الجهة", "عن بعد", "مدمج", "خارج المملكة"]
const urgencyOptions = ["تطوير سنوي", "احتياج عاجل", "رفع جاهزية", "متطلب تنظيمي", "بناء مسار تدريبي"]
const durationOptions: { value: DurationChoice; label: string }[] = [
    { value: "قصيرة", label: "حتى 3 أيام" },
    { value: "متوسطة", label: "4 إلى 7 أيام" },
    { value: "ممتدة", label: "أكثر من 7 أيام" },
    { value: "غير محدد", label: "حسب ترشيح الجامعة" },
]
const languageOptions = ["العربية", "الإنجليزية"]

const defaultRequest: SmartRequest = {
    agencyName: "جهة أمنية مستفيدة",
    domain: "البرامج التدريبية في الأمن السيبراني",
    needs: ["cyber", "forensics"],
    audience: "ضباط ومختصون",
    participants: 20,
    duration: "متوسطة",
    language: "العربية",
    executionCity: "مقر الجامعة بالرياض",
    sector: "أمن سيبراني",
    jobLevel: "فني متخصص",
    deliveryMode: "حضوري في مقر الجامعة",
    urgency: "رفع جاهزية",
}

const brochureTemplates: Record<
    BrochureTemplateId,
    {
        name: string
        description: string
        shell: string
        topBar: string
        header: string
        bodyOverlay: string
        accent: string
        section: string
        infoGrid: string
        footer: string
        compact?: boolean
    }
> = {
    official: {
        name: "قالب رسمي",
        description: "الأقرب للهوية المرجعية، مناسب للطباعة والخطابات الرسمية.",
        shell: "bg-[#496a80] text-white",
        topBar: "bg-[#3f6177]",
        header: "bg-[#edf2f2] text-[#073b3a]",
        bodyOverlay: "bg-[linear-gradient(135deg,rgba(7,59,58,0.94),rgba(73,106,128,0.82)),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_28%)]",
        accent: "text-[#f3d79c]",
        section: "bg-white/8 ring-1 ring-white/15",
        infoGrid: "border-white/70 bg-white/5",
        footer: "bg-[#6f8799]",
    },
    field: {
        name: "قالب ميداني",
        description: "مناسب للدورات التشغيلية والفعاليات والعمليات الميدانية.",
        shell: "bg-[#073b3a] text-white",
        topBar: "bg-[#d0b284]",
        header: "bg-[#f8f9f9] text-[#073b3a]",
        bodyOverlay: "bg-[linear-gradient(135deg,rgba(1,101,100,0.96),rgba(7,59,58,0.88)),radial-gradient(circle_at_80%_15%,rgba(208,178,132,0.38),transparent_26%)]",
        accent: "text-[#f3d79c]",
        section: "bg-[#073b3a]/28 ring-1 ring-[#d0b284]/30",
        infoGrid: "border-[#d0b284]/70 bg-[#073b3a]/20",
        footer: "bg-[#496a80]",
    },
    executive: {
        name: "قالب تنفيذي",
        description: "هادئ ومباشر للقيادات والملخصات التنفيذية.",
        shell: "bg-[#f8f9f9] text-[#073b3a]",
        topBar: "bg-[#016564]",
        header: "bg-white text-[#073b3a]",
        bodyOverlay: "bg-[linear-gradient(135deg,rgba(248,249,249,0.94),rgba(232,241,240,0.9)),radial-gradient(circle_at_20%_20%,rgba(1,101,100,0.16),transparent_28%)]",
        accent: "text-[#016564]",
        section: "bg-white/88 ring-1 ring-[#d8e3e1]",
        infoGrid: "border-[#d8e3e1] bg-white/80",
        footer: "bg-[#6f8799]",
    },
    gold: {
        name: "قالب ذهبي",
        description: "مخصص للعروض المهمة والشراكات الدولية والبرامج ذات القيمة العالية.",
        shell: "bg-[#173f3e] text-white",
        topBar: "bg-[#d0b284]",
        header: "bg-[#fffaf0] text-[#073b3a]",
        bodyOverlay: "bg-[linear-gradient(135deg,rgba(23,63,62,0.96),rgba(73,69,45,0.86)),radial-gradient(circle_at_18%_18%,rgba(208,178,132,0.5),transparent_28%)]",
        accent: "text-[#f9d98e]",
        section: "bg-white/10 ring-1 ring-[#d0b284]/35",
        infoGrid: "border-[#d0b284]/80 bg-white/7",
        footer: "bg-[#496a80]",
    },
    compact: {
        name: "قالب مختصر",
        description: "نسخة مركزة للمعاينة السريعة والإرسال الأولي.",
        shell: "bg-white text-[#073b3a]",
        topBar: "bg-[#016564]",
        header: "bg-[#f8f9f9] text-[#073b3a]",
        bodyOverlay: "bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,248,247,0.9)),radial-gradient(circle_at_15%_20%,rgba(208,178,132,0.22),transparent_26%)]",
        accent: "text-[#016564]",
        section: "bg-white/90 ring-1 ring-[#d8e3e1]",
        infoGrid: "border-[#d8e3e1] bg-white/85",
        footer: "bg-[#6f8799]",
        compact: true,
    },
}

function cn(...inputs: Parameters<typeof clsx>): string {
    return twMerge(clsx(inputs))
}

function normalize(text: string): string {
    return text
        .replace(/[أإآ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .toLowerCase()
}

function durationFits(course: NaussCourse, duration: DurationChoice): boolean {
    if (!course.durationDays || duration === "غير محدد") return true
    if (duration === "قصيرة") return course.durationDays <= 3
    if (duration === "متوسطة") return course.durationDays >= 4 && course.durationDays <= 7
    return course.durationDays > 7
}

function recommendCourses(request: SmartRequest): CourseMatch[] {
    const selectedNeeds = needOptions.filter((need) => request.needs.includes(need.id))
    const keywords = [
        ...selectedNeeds.flatMap((need) => need.keywords),
        request.sector,
        request.audience,
        request.jobLevel,
        request.urgency,
    ]
    const language = normalize(request.language)

    return naussCourseCatalog
        .map((course) => {
            const text = normalize(
                `${course.domain} ${course.title} ${course.objective} ${course.targetAudience} ${course.outcomes.join(" ")}`
            )
            const reasons: string[] = []
            let score = 24

            if (course.domain === request.domain) {
                score += 36
                reasons.push("ينتمي إلى المجال التدريبي الذي اختارته الجهة.")
            }

            if (text.includes(normalize(request.sector))) {
                score += 10
                reasons.push("يتوافق مع قطاع الجهة المختار.")
            }

            if (course.targetAudience && normalize(course.targetAudience).includes(normalize(request.audience.split(" ")[0] || ""))) {
                score += 8
                reasons.push("الفئة المستهدفة في الدليل قريبة من فئة المشاركين.")
            }

            const matchedKeywords = keywords.filter((keyword) => text.includes(normalize(keyword)))
            if (matchedKeywords.length) {
                score += Math.min(28, matchedKeywords.length * 7)
                reasons.push(`يتوافق مع احتياج واضح مثل: ${Array.from(new Set(matchedKeywords)).slice(0, 3).join("، ")}.`)
            }

            if (durationFits(course, request.duration)) {
                score += 8
                reasons.push("مدة البرنامج مناسبة للتفضيل المختار.")
            }

            if (normalize(course.language).includes(language)) {
                score += 6
                reasons.push("لغة التنفيذ تناسب اختيار الجهة.")
            }

            return {
                course,
                score: Math.min(98, score),
                reasons: reasons.length ? reasons : ["ترشيح مناسب بناء على المجال والبيانات المتاحة في دليل الدورات."],
            }
        })
        .sort((first, second) => second.score - first.score)
        .slice(0, 5)
}

function Button({
    children,
    className,
    type = "button",
    onClick,
}: {
    children: React.ReactNode
    className?: string
    type?: "button" | "submit"
    onClick?: () => void
}): JSX.Element {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full bg-[#016564] px-5 py-3 text-[13px] font-bold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#014f4e]",
                className
            )}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

function NaussBrandMark({ compact = false }: { compact?: boolean }): JSX.Element {
    if (!compact) {
        return (
            <div className="flex items-center" dir="rtl">
                <div className="flex h-20 w-72 items-center justify-center px-1">
                    <img
                        className="max-h-16 w-full object-contain"
                        src={naussLogoUrl}
                        alt="شعار جامعة نايف العربية للعلوم الأمنية"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="relative grid size-9 shrink-0 place-items-center rounded-full border border-[#d0b284]/60 bg-[#016564] text-white shadow-sm">
            <ShieldCheck className="size-5" />
            <span className="absolute -bottom-0.5 -left-0.5 grid size-4 place-items-center rounded-full bg-[#d0b284] text-[7px] font-black text-[#173331]">
                ن
            </span>
        </div>
    )
}

function Hero(): JSX.Element {
    return (
        <section
            dir="rtl"
            className="relative mx-auto flex h-[600px] w-full max-w-[1400px] flex-col overflow-hidden rounded-[48px] border border-[#d8e3e1] bg-white shadow-[0_40px_100px_-20px_rgba(1,101,100,0.12)]"
        >
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#f8f9f9]">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-1000"
                    style={{
                        transform: "scaleX(-1) scale(1.05)",
                        filter: "hue-rotate(-48deg) saturate(0.78) brightness(1.08)",
                    }}
                    src={videoUrl}
                />
            </div>

            <div className="relative z-20 flex flex-1 flex-col items-start px-8 pt-10 md:px-16 md:pt-12">
                <NaussBrandMark />
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="mt-12 max-w-[650px] text-right"
                    dir="rtl"
                >
                    <p className="mb-4 inline-flex rounded-full border border-[#d0b284]/55 bg-white/80 px-4 py-2 text-[12px] font-black text-[#016564] shadow-sm backdrop-blur">
                        وكالة الجامعة للتدريب
                    </p>
                    <h1
                        className="font-display text-[42px] font-black leading-[1.12] tracking-tight text-[#073b3a] md:text-[56px]"
                        style={{ textShadow: "0 2px 18px rgba(255,255,255,0.85)" }}
                    >
                        منصة تحديد
                        <br />
                        الاحتياج التدريبي
                    </h1>
                </motion.div>
            </div>
        </section>
    )
}

function MarqueeScroller(): JSX.Element {
    const repeated = [...partnerItems, ...partnerItems]

    return (
        <div className="marquee-mask mt-10 w-full overflow-hidden">
            <div className="marquee-track flex w-max gap-4">
                {repeated.map((logo, index) => (
                    <div
                        key={`${logo.name}-${index}`}
                        className="group relative flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d8e3e1] bg-white shadow-sm transition-all hover:border-[#d0b284]"
                    >
                        <div
                            className="absolute inset-0 scale-150 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
                            style={{ background: `linear-gradient(135deg, ${logo.gradient[0]}, ${logo.gradient[1]})` }}
                        />
                        <div className="relative z-10 flex items-center gap-3 px-4 text-right" dir="rtl">
                            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#d8e3e1] bg-white text-[13px] font-black text-[#016564] shadow-sm transition group-hover:border-white/60 group-hover:bg-white/95">
                                {logo.mark}
                            </span>
                            <span>
                                <span className="block text-[13px] font-black leading-5 text-[#073b3a] transition group-hover:text-white">
                                    {logo.name}
                                </span>
                                <span className="block text-[11px] font-bold text-[#6f8582] transition group-hover:text-white/80">
                                    {logo.sector}
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Field({
    label,
    children,
    icon: Icon,
}: {
    label: string
    children: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
}): JSX.Element {
    return (
        <label className="block">
            <span className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#5f7774]">
                {Icon && <Icon className="size-4 text-[#016564]" />}
                {label}
            </span>
            {children}
        </label>
    )
}

function Metric({ label, value }: { label: string; value: React.ReactNode }): JSX.Element {
    return (
        <div className="rounded-[22px] border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3">
            <p className="m-0 text-[12px] font-semibold text-[#6f8582]">{label}</p>
            <p className="m-0 mt-1 text-[14px] font-bold leading-6 text-[#073b3a]">{value}</p>
        </div>
    )
}

export default function TrainingIntelligenceApp(): JSX.Element {
    const [activePage, setActivePage] = useState<PageId>("home")
    const [request, setRequest] = useState<SmartRequest>(defaultRequest)
    const [matches, setMatches] = useState<CourseMatch[]>(() => recommendCourses(defaultRequest))
    const [selectedCourseId, setSelectedCourseId] = useState(matches[0]?.course.id)
    const [outputMode, setOutputMode] = useState<OutputMode>("brochure")
    const [previewCourse, setPreviewCourse] = useState<NaussCourse | null>(null)
    const selectedCourse = matches.find((match) => match.course.id === selectedCourseId)?.course || matches[0].course
    const selectedMatch = matches.find((match) => match.course.id === selectedCourse.id) || matches[0]

    const domains = useMemo(() => Array.from(new Set(naussCourseCatalog.map((course) => course.domain))), [])
    const selectedNeedLabels = needOptions.filter((need) => request.needs.includes(need.id)).map((need) => need.label)
    const totalPrice = selectedCourse.price ? selectedCourse.price * request.participants : null

    const updateRequest = <K extends keyof SmartRequest>(key: K, value: SmartRequest[K]): void => {
        setRequest((current) => ({ ...current, [key]: value }))
    }

    const toggleNeed = (id: string): void => {
        setRequest((current) => ({
            ...current,
            needs: current.needs.includes(id) ? current.needs.filter((need) => need !== id) : [...current.needs, id],
        }))
    }

    const analyze = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const nextMatches = recommendCourses(request)
        setMatches(nextMatches)
        setSelectedCourseId(nextMatches[0].course.id)
        setOutputMode("brochure")
    }

    const brochureText = buildBrochure(selectedCourse, request)
    const letterText = buildLetter(selectedCourse, request, totalPrice)

    return (
        <main id="home" dir="rtl" className="min-h-screen bg-[#f8f9f9] px-4 pb-8 pt-24 font-sans text-[#073b3a]">
            <PageHelmet>
                <html lang="ar" dir="rtl" />
                <title>منصة تحديد الاحتياج التدريبي</title>
                <meta
                    name="description"
                    content="تطبيق بسيط لترشيح دورات جامعة نايف العربية للعلوم الأمنية وإعداد برشور وخطاب اعتماد."
                />
            </PageHelmet>

            <NavBar
                items={platformNavItems as any}
                activeName={platformNavItems.find((item) => item.id === activePage)?.name}
                onSelect={(item) => {
                    const nextPage = platformNavItems.find((navItem) => navItem.name === item.name)?.id || "home"
                    setActivePage(nextPage)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                }}
            />

            {activePage === "home" && (
                <>
                    <Hero />
                    <MarqueeScroller />
                </>
            )}

            {activePage === "needs" && (
            <section id="training-app" className="mx-auto max-w-[1180px]">
                <div className="grid gap-5 lg:grid-cols-[430px_1fr]">
                    <form onSubmit={analyze} className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                        <div className="grid gap-4">
                            <Field label="اسم الجهة" icon={Building2}>
                                <input
                                    className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                    value={request.agencyName}
                                    onChange={(event) => updateRequest("agencyName", event.target.value)}
                                />
                            </Field>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="قطاع الجهة" icon={Layers3}>
                                    <select
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        value={request.sector}
                                        onChange={(event) => updateRequest("sector", event.target.value)}
                                    >
                                        {sectorOptions.map((option) => (
                                            <option key={option}>{option}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="عدد المشاركين" icon={GraduationCap}>
                                    <input
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        min={1}
                                        type="number"
                                        value={request.participants}
                                        onChange={(event) => updateRequest("participants", Number(event.target.value))}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="الفئة المستهدفة" icon={ShieldCheck}>
                                    <select
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        value={request.audience}
                                        onChange={(event) => updateRequest("audience", event.target.value)}
                                    >
                                        {audienceOptions.map((option) => (
                                            <option key={option}>{option}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="المستوى الوظيفي" icon={Users}>
                                    <select
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        value={request.jobLevel}
                                        onChange={(event) => updateRequest("jobLevel", event.target.value)}
                                    >
                                        {jobLevelOptions.map((option) => (
                                            <option key={option}>{option}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label="المجال التدريبي" icon={Layers3}>
                                <select
                                    className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                    value={request.domain}
                                    onChange={(event) => updateRequest("domain", event.target.value)}
                                >
                                    {domains.map((domain) => (
                                        <option key={domain}>{domain}</option>
                                    ))}
                                </select>
                            </Field>

                            <div>
                                <p className="mb-2 text-[13px] font-semibold text-[#5f7774]">مجالات الاحتياج</p>
                                <div className="grid max-h-[420px] gap-2 overflow-auto pr-1">
                                    {needOptions.map((need) => {
                                        const active = request.needs.includes(need.id)
                                        return (
                                            <button
                                                key={need.id}
                                                className={cn(
                                                    "flex items-center justify-between rounded-[22px] border px-4 py-3 text-right transition",
                                                    active
                                                        ? "border-[#016564] bg-[#eef8f7] text-[#016564]"
                                                        : "border-[#d8e3e1] bg-white text-[#5f7774] hover:border-[#d0b284]"
                                                )}
                                                type="button"
                                                onClick={() => toggleNeed(need.id)}
                                            >
                                                <span>
                                                    <strong className="block text-[14px]">{need.label}</strong>
                                                    <span className="text-[12px] text-[#6f8582]">{need.hint}</span>
                                                </span>
                                                {active && <BadgeCheck className="size-5" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="نطاق مدة التنفيذ" icon={ClipboardCheck}>
                                    <select
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        value={request.duration}
                                        onChange={(event) => updateRequest("duration", event.target.value as DurationChoice)}
                                    >
                                        {durationOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="اللغة" icon={FileText}>
                                    <select
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        value={request.language}
                                        onChange={(event) => updateRequest("language", event.target.value)}
                                    >
                                        {languageOptions.map((option) => (
                                            <option key={option}>{option}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="نمط التنفيذ" icon={MapPin}>
                                    <select
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        value={request.deliveryMode}
                                        onChange={(event) => updateRequest("deliveryMode", event.target.value)}
                                    >
                                        {deliveryModeOptions.map((option) => (
                                            <option key={option}>{option}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="أولوية الطلب" icon={Target}>
                                    <select
                                        className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none transition focus:border-[#016564] focus:bg-white"
                                        value={request.urgency}
                                        onChange={(event) => updateRequest("urgency", event.target.value)}
                                    >
                                        {urgencyOptions.map((option) => (
                                            <option key={option}>{option}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Button type="submit" className="mt-2 w-full">
                                <SearchCheck className="size-4" />
                                حلل الاحتياج واقترح الدورة
                            </Button>
                        </div>
                    </form>

                    <div className="space-y-5">
                        <section id="course-guide" className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h2 className="m-0 text-xl font-black text-[#073b3a]">الدورات المرشحة</h2>
                                <span className="rounded-full bg-[#eef8f7] px-3 py-1 text-[12px] font-black text-[#016564]">
                                    {matches.length} ترشيحات
                                </span>
                            </div>
                            <div className="grid gap-3">
                            {matches.map((match) => (
                                <button
                                    key={match.course.id}
                                    className={cn(
                                        "flex items-center justify-between gap-4 rounded-[22px] border bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-[#d0b284]",
                                        selectedCourse.id === match.course.id
                                            ? "border-[#016564] ring-4 ring-[#016564]/10"
                                            : "border-[#d8e3e1]"
                                    )}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCourseId(match.course.id)
                                        setPreviewCourse(match.course)
                                    }}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#eef8f7] text-[#016564]">
                                            <BookOpen className="size-5" />
                                        </span>
                                        <span>
                                            <span className="block text-[15px] font-black leading-6 text-[#073b3a]">
                                                {match.course.title}
                                            </span>
                                            <span className="mt-1 block text-[12px] font-bold text-[#6f8582]">
                                                ملاءمة {match.score}% · اضغط لمعاينة تفاصيل الدورة
                                            </span>
                                        </span>
                                    </span>
                                    <Eye className="size-5 shrink-0 text-[#016564]" />
                                </button>
                            ))}
                            </div>
                        </section>

                        <section id="recommended-paths" className="grid gap-3 md:grid-cols-3">
                            {matches.slice(0, 3).map((match, index) => (
                                <button
                                    key={`path-${match.course.id}`}
                                    className="rounded-[24px] border border-[#d8e3e1] bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-[#d0b284]"
                                    type="button"
                                    onClick={() => setPreviewCourse(match.course)}
                                >
                                    <span className="block text-[12px] font-bold text-[#016564]">مرحلة {index + 1}</span>
                                    <span className="mt-2 line-clamp-3 block text-[13px] font-bold leading-6 text-[#073b3a]">
                                        {match.course.title}
                                    </span>
                                </button>
                            ))}
                        </section>

                        <section className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex gap-2">
                                    <button
                                        className={cn(
                                            "rounded-full px-4 py-2 text-[13px] font-bold transition",
                                            outputMode === "brochure" ? "bg-[#016564] text-white" : "bg-[#eef3f2] text-[#5f7774]"
                                        )}
                                        type="button"
                                        onClick={() => setOutputMode("brochure")}
                                    >
                                        برشور الدورة
                                    </button>
                                    <button
                                        className={cn(
                                            "rounded-full px-4 py-2 text-[13px] font-bold transition",
                                            outputMode === "letter" ? "bg-[#016564] text-white" : "bg-[#eef3f2] text-[#5f7774]"
                                        )}
                                        type="button"
                                        onClick={() => setOutputMode("letter")}
                                    >
                                        خطاب الاعتماد
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="bg-white text-[#073b3a] ring-1 ring-[#d8e3e1] hover:bg-white" onClick={() => navigator.clipboard.writeText(outputMode === "brochure" ? brochureText : letterText)}>
                                        <Send className="size-4" />
                                        نسخ
                                    </Button>
                                    <Button className="bg-white text-[#073b3a] ring-1 ring-[#d8e3e1] hover:bg-white" onClick={() => window.print()}>
                                        <Printer className="size-4" />
                                        PDF
                                    </Button>
                                </div>
                            </div>

                            <article className="print-target rounded-[28px] border border-[#d8e3e1] bg-[#f8f9f9] p-3">
                                {outputMode === "brochure" ? (
                                    <Brochure course={selectedCourse} request={request} totalPrice={totalPrice} templateId="official" />
                                ) : (
                                    <Letter course={selectedCourse} request={request} totalPrice={totalPrice} />
                                )}
                            </article>
                        </section>
                    </div>
                </div>
            </section>
            )}

            {activePage === "paths" && <TrainingPathsPage courses={naussCourseCatalog} onPreview={setPreviewCourse} />}
            {activePage === "programs" && <TrainingProgramsPage courses={naussCourseCatalog} onPreview={setPreviewCourse} />}
            {activePage === "courses" && <CoursesAdminPage onPreview={setPreviewCourse} />}
            {activePage === "brochures" && (
                <BrochureStudioPage
                    courses={naussCourseCatalog}
                    selectedCourse={selectedCourse}
                    request={request}
                    totalPrice={totalPrice}
                />
            )}
            {activePage === "letters" && <OfficialLettersPage selectedCourse={selectedCourse} />}
            {activePage === "guide" && <CourseGuidePage courses={naussCourseCatalog} onPreview={setPreviewCourse} />}

            {previewCourse && (
                <CourseDetailsModal
                    course={previewCourse}
                    onClose={() => setPreviewCourse(null)}
                    onUseCourse={() => {
                        setSelectedCourseId(previewCourse.id)
                        setPreviewCourse(null)
                    }}
                />
            )}
        </main>
    )
}

interface TrainingPath {
    title: string
    type: "طويل" | "متوسط" | "قصير"
    targetDays: string
    audience: string
    goal: string
    courses: NaussCourse[]
}

function pickCoursesByKeywords(courses: NaussCourse[], keywords: string[], count: number): NaussCourse[] {
    const normalizedKeywords = keywords.map(normalize)
    const ranked = courses
        .map((course) => {
            const haystack = normalize(`${course.title} ${course.domain} ${course.objective} ${course.outcomes.join(" ")}`)
            const score = normalizedKeywords.reduce((total, keyword) => total + (haystack.includes(keyword) ? 1 : 0), 0)
            return { course, score }
        })
        .sort((first, second) => second.score - first.score || (second.course.durationDays || 0) - (first.course.durationDays || 0))
        .map((item) => item.course)

    return ranked.slice(0, count)
}

function buildDefaultTrainingPaths(courses: NaussCourse[]): TrainingPath[] {
    const fallback = courses.slice(0, 4)
    const path = (title: string, type: TrainingPath["type"], targetDays: string, audience: string, goal: string, keywords: string[], count: number): TrainingPath => ({
        title,
        type,
        targetDays,
        audience,
        goal,
        courses: pickCoursesByKeywords(courses, keywords, count).length ? pickCoursesByKeywords(courses, keywords, count) : fallback.slice(0, count),
    })

    return [
        path("مسار العمليات الميدانية المتقدمة", "طويل", "30 إلى 35 يومًا", "فرق العمليات والمهام الخاصة", "بناء جاهزية ميدانية متقدمة عبر تسلسل تدريبي يبدأ بالتأسيس وينتهي بالتطبيق.", ["سلاح", "قتال", "حماية", "اشتباك", "ميداني"], 4),
        path("مسار التحقيق الجنائي والرقمي المتكامل", "طويل", "30 إلى 35 يومًا", "المحققون ومأمورو الضبط", "رفع كفاءة التحقيق وجمع الأدلة وتحليلها في البيئات التقليدية والرقمية.", ["تحقيق", "أدلة", "جنائي", "رقمي", "تزوير"], 4),
        path("مسار الأمن السيبراني والاستجابة للحوادث", "طويل", "30 إلى 35 يومًا", "فرق الأمن السيبراني ومراكز العمليات", "تأهيل الفرق للتعامل مع الحوادث والتهديدات الرقمية من الرصد حتى الاستجابة.", ["سيبر", "حادث", "رقمي", "اختراق", "بيانات"], 4),
        path("مسار أمن الحدود والمنافذ", "متوسط", "15 إلى 20 يومًا", "العاملون في المنافذ والحدود", "تطوير إجراءات التفتيش والرقابة والتحليل في بيئة المنافذ.", ["حدود", "منافذ", "تهريب", "مسافرين"], 3),
        path("مسار القيادة الأمنية وإدارة الأزمات", "متوسط", "15 إلى 20 يومًا", "القيادات الإشرافية ومديرو العمليات", "تنمية مهارات القيادة واتخاذ القرار أثناء الأزمات والمواقف الأمنية.", ["قياد", "أزمات", "مخاطر", "اتصال", "قرار"], 3),
        path("مسار التهيئة الأمنية للمستجدين", "قصير", "4 إلى 6 أيام", "المستجدون والفرق حديثة التكليف", "تأسيس معرفة أمنية عملية وسريعة قبل الانخراط في مهام العمل.", ["أساس", "توعية", "سلامة", "إجراءات"], 2),
        path("مسار تطوير مهارة تخصصية قصيرة", "قصير", "4 إلى 6 أيام", "الممارسون المميزون والمحترفون", "تنمية مهارة محددة لدى الفئة المتميزة دون الدخول في برنامج طويل.", ["مهارة", "متقدم", "تحليل", "تطبيق"], 2),
    ]
}

function SectionShell({ title, children, subtitle }: { title: string; subtitle?: string; children: React.ReactNode }): JSX.Element {
    return (
        <section className="mx-auto max-w-[1180px]">
            <div className="mb-6">
                <h1 className="m-0 text-3xl font-black text-[#073b3a]">{title}</h1>
                {subtitle && <p className="m-0 mt-2 max-w-3xl text-[14px] font-semibold leading-7 text-[#5f7774]">{subtitle}</p>}
            </div>
            {children}
        </section>
    )
}

function TrainingPathsPage({ courses, onPreview }: { courses: NaussCourse[]; onPreview: (course: NaussCourse) => void }): JSX.Element {
    const paths = useMemo(() => buildDefaultTrainingPaths(courses), [courses])

    return (
        <SectionShell title="المسارات التدريبية">
            <div className="grid gap-5">
                <div className="grid gap-4 md:grid-cols-3">
                    {paths.map((path) => {
                        const totalDays = path.courses.reduce((total, course) => total + (course.durationDays || 0), 0)
                        return (
                            <article key={path.title} className="rounded-[28px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="rounded-full bg-[#eef8f7] px-3 py-1 text-[12px] font-black text-[#016564]">{path.type}</span>
                                    <Route className="size-6 text-[#d0b284]" />
                                </div>
                                <h2 className="m-0 text-xl font-black leading-8 text-[#073b3a]">{path.title}</h2>
                                <p className="m-0 mt-2 text-[13px] font-semibold leading-7 text-[#5f7774]">{path.goal}</p>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <Metric label="المدة المستهدفة" value={path.targetDays} />
                                    <Metric label="مجموع أيام الدورات" value={`${totalDays || "قيد التحديد"} يوم`} />
                                </div>
                                <div className="mt-4 grid gap-2">
                                    {path.courses.map((course, index) => (
                                        <button
                                            key={`${path.title}-${course.id}`}
                                            className="flex items-center gap-3 rounded-2xl border border-[#d8e3e1] bg-[#f8f9f9] p-3 text-right transition hover:border-[#d0b284]"
                                            type="button"
                                            onClick={() => onPreview(course)}
                                        >
                                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#016564] text-[12px] font-black text-white">{index + 1}</span>
                                            <span className="text-[13px] font-bold leading-6 text-[#073b3a]">{course.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </article>
                        )
                    })}
                </div>

                <article className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                    <h2 className="m-0 text-2xl font-black text-[#073b3a]">صمم مسارك</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                        {["المدة المطلوبة", "الفئة المستهدفة", "هدف المسار", "مكان التنفيذ"].map((label) => (
                            <select key={label} className="rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold text-[#073b3a] outline-none">
                                <option>{label}</option>
                                <option>تطوير للمميزين</option>
                                <option>تنمية مهارات المحترفين</option>
                                <option>تهيئة وتأسيس المستجدين</option>
                                <option>رفع جاهزية عاجلة</option>
                            </select>
                        ))}
                    </div>
                    <Button className="mt-4">
                        <SearchCheck className="size-4" />
                        اقتراح مسار من الدليل
                    </Button>
                </article>
            </div>
        </SectionShell>
    )
}

function buildStrategicTrainingPrograms(): StrategicTrainingProgram[] {
    return [
        {
            id: "event-command",
            title: "برنامج أمن وإدارة الفعاليات الكبرى",
            badge: "الأولوية التسويقية",
            promise: "تحويل تأمين الفعاليات من ترتيبات تشغيلية متفرقة إلى منظومة قيادة وسيطرة ووقاية واستجابة.",
            targetAudience: "غرف العمليات، قيادات المواقع، فرق الأمن والسلامة، منظمو الفعاليات، والجهات المشرفة على المواسم والمناسبات الكبرى.",
            problem: "تتعرض الفعاليات الكبرى لمخاطر تزاحم، اختناق مسارات، ضعف تنسيق، فجوات دخول وخروج، قصور في قراءة مؤشرات الحشود، وتعدد جهات دون نموذج قيادة موحد.",
            value: "يوفر البرنامج لغة عمل مشتركة بين الأمن والمنظم والجهات الداعمة، ويبني جاهزية قابلة للقياس قبل الحدث وأثناءه وبعده.",
            pitch: "برنامج جاهز للتسويق للجهات المسؤولة عن المواسم، الملاعب، المؤتمرات، المعارض، الفعاليات الترفيهية، والمناسبات الرسمية عالية الكثافة.",
            outcomes: [
                "تصميم خطة أمن فعالية قابلة للتنفيذ والمراجعة.",
                "إدارة حركة الحشود ومسارات الدخول والخروج وفق مؤشرات مخاطر واضحة.",
                "تفعيل غرف العمليات وسلاسل البلاغ والتصعيد أثناء الفعالية.",
                "بناء سيناريوهات استجابة للحوادث المفاجئة دون تعطيل تجربة الزوار.",
            ],
            sellingAngles: ["جاهزية قبل الحدث", "خفض المخاطر التشغيلية", "إدارة الحشود", "غرفة عمليات موحدة"],
            keywords: ["فعاليات", "حشود", "الفعاليات", "تأمين", "ترفيهية", "جماهير", "مواقف", "إعلام"],
            icon: Users,
        },
        {
            id: "critical-assets",
            title: "برنامج حماية المنشآت الحيوية ومراكز التحكم",
            badge: "للجهات الحساسة",
            promise: "رفع كفاءة الحماية من البوابة إلى غرفة التحكم، وربط الحراسات بالمخاطر والإجراءات والتقارير.",
            targetAudience: "مشرفو الأمن، حراس المنشآت، منسقو غرف التحكم، مسؤولو السلامة، ومديرو المرافق الحيوية.",
            problem: "كثير من المنشآت تملك أنظمة وحراسات، لكنها تفتقد ربطًا مهنيًا بين تقييم المخاطر، الاستجابة الأولى، الاتصالات، والتقارير الأمنية.",
            value: "ينقل البرنامج فرق الأمن من الحراسة التقليدية إلى تشغيل أمني احترافي مبني على المخاطر واليقظة والتوثيق.",
            pitch: "مناسب للطاقة، الصناعة، النقل، البنية التحتية، مقار الجهات الحكومية، والمجمعات ذات الحساسية الأمنية.",
            outcomes: [
                "تصنيف المخاطر الأمنية وربطها بإجراءات حماية عملية.",
                "تحسين أداء غرف التحكم والمراقبة والبلاغات.",
                "رفع جودة التقارير الأمنية ومحاضر الوقائع.",
                "تأهيل المستجيب الأول لتهديدات التفجير أو الاختراق الميداني.",
            ],
            sellingAngles: ["منشآت حيوية", "غرف تحكم", "تقييم مخاطر", "استجابة أولى"],
            keywords: ["منشأة", "المنشأة", "حيوية", "حراس", "غرف", "مراقبة", "تفجير", "مخاطر", "أصول"],
            icon: Building2,
        },
        {
            id: "cyber-forensics",
            title: "برنامج التحقيقات السيبرانية والأدلة الرقمية",
            badge: "تخصص نوعي",
            promise: "تأهيل الفرق للتعامل مع الجريمة الرقمية من لحظة البلاغ إلى التحليل والتوثيق والإسناد.",
            targetAudience: "محققي الجرائم المعلوماتية، فرق الاستجابة، الأدلة الرقمية، وحدات التحري، والمختصون غير التقنيين المرتبطون بالقضايا الرقمية.",
            problem: "تتشابك الأدلة بين هواتف وساعات وويب مظلم وفدية وتزييف عميق، بينما تحتاج الجهة إلى مسار مهني يختصر الفجوة بين التقنية والإجراء.",
            value: "يجمع البرنامج بين الاستجابة والتحقيق والتحليل والتحري الرقمي، ويحول المعرفة التقنية إلى إجراءات مفهومة للضبط والتحقيق.",
            pitch: "قابل للتسويق للجهات الأمنية، وحدات مكافحة الجرائم المعلوماتية، المختبرات الجنائية، والجهات ذات البلاغات الرقمية المتزايدة.",
            outcomes: [
                "حفظ الأدلة الرقمية دون إفساد قيمتها الفنية أو النظامية.",
                "تحليل مسارات الهجوم والابتزاز والفدية الرقمية.",
                "استخراج مؤشرات من الهواتف والساعات ومصادر الإنترنت.",
                "كشف التضليل الرقمي والتزييف الصوتي والعميق.",
            ],
            sellingAngles: ["أدلة رقمية", "فدية رقمية", "ويب مظلم", "تزييف عميق"],
            keywords: ["سيبرانية", "رقمية", "الأدلة", "الفدية", "الويب", "التزييف", "الهواتف", "الساعات", "جرائم"],
            icon: ShieldCheck,
        },
        {
            id: "financial-crime",
            title: "برنامج مكافحة الجرائم المالية والاقتصادية",
            badge: "للتحري والتحقيق",
            promise: "بناء قدرة عملية على قراءة أنماط غسل الأموال والعملات المشفرة والجرائم المصرفية وتحويلها إلى إجراءات ضبط وتحقيق.",
            targetAudience: "محققو الجرائم المالية، وحدات التحريات، الامتثال، الجهات الرقابية، والضباط المرتبطون بقضايا المال والاحتيال.",
            problem: "تتحرك الجرائم المالية بسرعة عبر بنوك ومنصات رقمية وسلاسل بلوك تشين، بينما تحتاج الجهات إلى مهارات تحليل وربط واستدلال دقيقة.",
            value: "يركز البرنامج على فهم السلوك المالي المشبوه، بناء فرضيات التحقيق، وتوظيف الذكاء الاصطناعي في دعم القرار.",
            pitch: "مناسب للجهات الأمنية والرقابية والمؤسسات المالية التي تحتاج رفع جودة البلاغات والتحريات ومحاضر الضبط.",
            outcomes: [
                "تحليل مؤشرات غسل الأموال والاحتيال المالي.",
                "فهم أساسيات التحقيق في العملات المشفرة والبلوك تشين.",
                "صياغة محاضر ضبط واستدلال أكثر دقة.",
                "توظيف أدوات ذكية لدعم التحقيقات المالية.",
            ],
            sellingAngles: ["غسل أموال", "بلوك تشين", "محاضر ضبط", "ذكاء اصطناعي"],
            keywords: ["غسل", "الأموال", "المشفرة", "البلوك", "البنوك", "المالية", "الذكاء"],
            icon: Banknote,
        },
        {
            id: "border-narcotics",
            title: "برنامج أمن الحدود ومكافحة التهريب",
            badge: "عمليات ميدانية",
            promise: "تعزيز مهارات التفتيش والتحليل والتخطيط لمواجهة تهريب المخدرات والممنوعات عبر الحدود والمنافذ.",
            targetAudience: "قادة المنافذ، فرق التفتيش، وحدات مكافحة التهريب، ومحللو المخاطر الحدودية.",
            problem: "تعتمد فعالية الحدود على دقة قراءة السلوك والمؤشرات، وليس على التفتيش التقليدي وحده.",
            value: "يربط البرنامج بين التخطيط الاستراتيجي والتفتيش الأمني وتحليل مؤشرات التهريب.",
            pitch: "يعرض كحل سريع للجهات التي تريد رفع جاهزية المنافذ أو بناء فرق نوعية لمكافحة التهريب.",
            outcomes: [
                "تحديد مؤشرات الاشتباه في المنافذ والحدود.",
                "تطوير إجراءات تفتيش قائمة على المخاطر.",
                "بناء خطة لمكافحة تهريب المخدرات عبر الحدود.",
                "تحسين التنسيق بين فرق التفتيش والتحليل والقيادة.",
            ],
            sellingAngles: ["منافذ", "تهريب", "تفتيش", "مخدرات"],
            keywords: ["حدود", "منافذ", "تهريب", "المخدرات", "التفتيش", "ممنوعات"],
            icon: Globe2,
        },
        {
            id: "investigation-command",
            title: "برنامج التحقيق والاستدلال وإدارة مسرح الجريمة",
            badge: "جنائي تطبيقي",
            promise: "تطوير جودة الاستجواب والتحري ومحاضر الضبط وربطها بمسرح الجريمة والأدلة.",
            targetAudience: "المحققون، ضباط الضبط، فرق مسرح الجريمة، المختبرات، ووحدات الاستدلال.",
            problem: "ضعف الربط بين المقابلة والتحري والمسرح والمحضر يؤدي إلى فجوات في القضية وصعوبة الدفاع عن جودة الإجراء.",
            value: "يبني البرنامج سلسلة مهنية تبدأ من الواقعة وتنتهي بمحضر مضبوط وأدلة أكثر اتساقًا.",
            pitch: "برنامج مقنع للجهات التي تريد تقليل أخطاء الإجراءات وتحسين جودة ملفات القضايا.",
            outcomes: [
                "إدارة مسرح الجريمة وحفظ الأدلة.",
                "تحسين مهارات الاستجواب والمقابلات.",
                "إعداد محاضر ضبط واستدلال محكمة.",
                "ضمان جودة الفحص والتوثيق الجنائي.",
            ],
            sellingAngles: ["مسرح جريمة", "استجواب", "محاضر", "أدلة جنائية"],
            keywords: ["استجواب", "مسرح", "الجريمة", "محاضر", "الضبط", "الأدلة", "التحقيق"],
            icon: ClipboardCheck,
        },
        {
            id: "training-industry",
            title: "برنامج صناعة التدريب الأمني وقياس الأثر",
            badge: "لإدارات التدريب",
            promise: "تحويل التدريب الأمني من تنفيذ دورات إلى منظومة احتياج وتصميم وقياس أثر وتحسين مستمر.",
            targetAudience: "إدارات التدريب، تطوير الأعمال، مصممو البرامج، المدربون، ومراكز التدريب الأمنية.",
            problem: "تتعثر بعض الخطط التدريبية لأنها تبدأ من عنوان الدورة لا من الفجوة التدريبية ومؤشر الأثر.",
            value: "يعطي الجهة أدوات عملية لتحليل الاحتياج، تصميم البرامج، إعداد المدربين، وقياس العائد التدريبي.",
            pitch: "هذا البرنامج يسوق للجهات التي تريد بناء مكتب تدريب محترف أو تطوير وحدة تدريب داخلية.",
            outcomes: [
                "تحليل الاحتياج التدريبي القائم على البيانات.",
                "تصميم برامج ومسارات مرتبطة بمؤشرات أداء.",
                "رفع جودة المدربين والمحتوى وأساليب التنفيذ.",
                "قياس الأثر وتحويل النتائج إلى قرارات تطوير.",
            ],
            sellingAngles: ["تحليل احتياج", "تصميم برامج", "مدربون", "قياس أثر"],
            keywords: ["الاحتياجات", "تدريب", "المدربين", "المؤسسات", "الأثر", "التدريبي"],
            icon: GraduationCap,
        },
        {
            id: "security-media-ai",
            title: "برنامج الإعلام الأمني والذكاء الاصطناعي في القرار",
            badge: "اتصال وسمعة",
            promise: "تمكين الجهات من إدارة المواقف الإعلامية وتحليل البيانات واستخدام أدوات الذكاء الاصطناعي لدعم القرار الأمني.",
            targetAudience: "المتحدثون، الإعلام الأمني، غرف الاتصال، محللو البيانات، والقيادات المشرفة على الرأي العام.",
            problem: "الأزمة الأمنية اليوم لا تحدث في الميدان فقط؛ بل تنتقل إلى الإعلام والشبكات والمنصات خلال دقائق.",
            value: "يمزج البرنامج بين إدارة الموقف الإعلامي وتحليل البيانات وتوظيف الأدوات الذكية في فهم السلوك والمخاطر.",
            pitch: "يعرض للجهات التي تواجه ضغطًا إعلاميًا أو تحتاج بناء رسائل واتصال مؤسسي أثناء الأحداث.",
            outcomes: [
                "إدارة الموقف الإعلامي أثناء الأحداث الأمنية.",
                "تحليل البيانات والمؤشرات لدعم القرار.",
                "توظيف الذكاء الاصطناعي في الرصد والتحليل.",
                "صياغة رسائل اتصال مهني تقلل الالتباس وتحمي السمعة.",
            ],
            sellingAngles: ["إعلام أمني", "رأي عام", "ذكاء اصطناعي", "تحليل بيانات"],
            keywords: ["الإعلام", "التواصل", "الذكاء", "بيانات", "قرار", "مواقف", "إلكترونية"],
            icon: Sparkles,
        },
    ]
}

function TrainingProgramsPage({ courses, onPreview }: { courses: NaussCourse[]; onPreview: (course: NaussCourse) => void }): JSX.Element {
    const programs = useMemo(() => buildStrategicTrainingPrograms(), [])
    const [activeProgramId, setActiveProgramId] = useState(programs[0].id)
    const activeProgram = programs.find((program) => program.id === activeProgramId) || programs[0]
    const linkedCourses = pickCoursesByKeywords(courses, activeProgram.keywords, 6).filter((course) => {
        const haystack = normalize(`${course.title} ${course.domain} ${course.objective}`)
        return activeProgram.keywords.some((keyword) => haystack.includes(normalize(keyword)))
    })
    const displayCourses = linkedCourses.length ? linkedCourses : pickCoursesByKeywords(courses, activeProgram.keywords, 4)
    const totalDays = displayCourses.reduce((sum, course) => sum + (course.durationDays || 0), 0)
    const ActiveIcon = activeProgram.icon

    return (
        <SectionShell
            title="البرامج التدريبية النوعية"
            subtitle="البرنامج النوعي ليس مسارًا زمنيًا بالضرورة؛ هو منتج تدريبي قابل للتسويق حول قضية أمنية محددة، ويمكن أن يتضمن دورات مستقلة أو حزمًا تنفيذية حسب احتياج الجهة."
        >
            <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
                <aside className="grid gap-3">
                    {programs.map((program) => {
                        const Icon = program.icon
                        const active = activeProgramId === program.id
                        return (
                            <button
                                key={program.id}
                                className={cn(
                                    "group rounded-[26px] border p-4 text-right shadow-sm transition",
                                    active ? "border-[#016564] bg-[#eef8f7] text-[#073b3a]" : "border-[#d8e3e1] bg-white text-[#073b3a] hover:border-[#d0b284]"
                                )}
                                type="button"
                                onClick={() => setActiveProgramId(program.id)}
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#016564] ring-1 ring-[#d8e3e1]">{program.badge}</span>
                                    <span className={cn("grid size-11 place-items-center rounded-2xl", active ? "bg-[#016564] text-white" : "bg-[#f8f9f9] text-[#016564]")}>
                                        <Icon className="size-5" />
                                    </span>
                                </div>
                                <h2 className="m-0 text-[17px] font-black leading-7">{program.title}</h2>
                                <p className="m-0 mt-2 text-[12px] font-bold leading-6 text-[#5f7774]">{program.promise}</p>
                            </button>
                        )
                    })}
                </aside>

                <article className="overflow-hidden rounded-[34px] border border-[#d8e3e1] bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-[#073b3a] p-7 text-white">
                        <div className="absolute inset-0 opacity-25">
                            <div className="absolute -left-20 top-0 size-72 rounded-full bg-[#d0b284]" />
                            <div className="absolute -bottom-24 right-10 size-80 rounded-full bg-[#016564]" />
                        </div>
                        <div className="relative grid gap-5 md:grid-cols-[1fr_150px]">
                            <div>
                                <span className="rounded-full bg-white/12 px-4 py-2 text-[12px] font-black text-[#f3d79c] ring-1 ring-white/20">{activeProgram.badge}</span>
                                <h2 className="m-0 mt-4 text-3xl font-black leading-[1.45]">{activeProgram.title}</h2>
                                <p className="m-0 mt-3 max-w-3xl text-[15px] font-semibold leading-8 text-white/82">{activeProgram.promise}</p>
                            </div>
                            <div className="grid place-items-center rounded-[28px] bg-white/10 ring-1 ring-white/20">
                                <ActiveIcon className="size-16 text-[#f3d79c]" strokeWidth={1.6} />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6">
                        <div className="grid gap-3 md:grid-cols-4">
                            <Metric label="عدد الدورات المرتبطة" value={`${displayCourses.length} دورات`} />
                            <Metric label="المدة التقريبية" value={totalDays ? `${totalDays} يوم تدريبي` : "حسب التصميم"} />
                            <Metric label="نمط البيع" value="برنامج نوعي" />
                            <Metric label="جاهزية التسويق" value="قابل للعرض" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoPanel icon={Target} title="المشكلة التي يعالجها" text={activeProgram.problem} />
                            <InfoPanel icon={Award} title="القيمة للجهة" text={activeProgram.value} />
                        </div>

                        <section className="rounded-[26px] border border-[#d8e3e1] bg-[#f8f9f9] p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <Send className="size-6 text-[#016564]" />
                                <h3 className="m-0 text-xl font-black text-[#073b3a]">صياغة تسويقية جاهزة</h3>
                            </div>
                            <p className="m-0 text-[14px] font-semibold leading-8 text-[#5f7774]">{activeProgram.pitch}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {activeProgram.sellingAngles.map((angle) => (
                                    <span key={angle} className="rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#016564] ring-1 ring-[#d8e3e1]">{angle}</span>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-4 md:grid-cols-[1fr_1fr]">
                            <div className="rounded-[26px] border border-[#d8e3e1] bg-white p-5">
                                <h3 className="m-0 mb-3 text-xl font-black text-[#073b3a]">مخرجات البرنامج</h3>
                                <div className="grid gap-2">
                                    {activeProgram.outcomes.map((outcome) => (
                                        <div key={outcome} className="flex items-start gap-2 rounded-[18px] bg-[#f8f9f9] px-4 py-3 text-[13px] font-semibold leading-7 text-[#5f7774]">
                                            <CheckCircle2 className="mt-1 size-5 shrink-0 text-[#016564]" />
                                            <span>{outcome}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[26px] border border-[#d8e3e1] bg-white p-5">
                                <h3 className="m-0 mb-3 text-xl font-black text-[#073b3a]">الدورات المؤسسة من الدليل</h3>
                                <div className="grid gap-2">
                                    {displayCourses.map((course) => (
                                        <button
                                            key={`${activeProgram.id}-${course.id}`}
                                            className="flex items-center justify-between gap-3 rounded-[18px] border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-right transition hover:border-[#d0b284] hover:bg-white"
                                            type="button"
                                            onClick={() => onPreview(course)}
                                        >
                                            <span>
                                                <span className="block text-[13px] font-black leading-6 text-[#073b3a]">{course.title}</span>
                                                <span className="mt-1 block text-[11px] font-bold text-[#6f8582]">{course.durationDays ? `${course.durationDays} أيام` : "مدة مرنة"} · {course.domain}</span>
                                            </span>
                                            <Eye className="size-5 shrink-0 text-[#016564]" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[26px] border border-[#d0b284]/60 bg-[#fffaf0] p-5">
                            <h3 className="m-0 mb-2 text-xl font-black text-[#073b3a]">كيف يختلف عن المسار التدريبي؟</h3>
                            <p className="m-0 text-[14px] font-semibold leading-8 text-[#5f7774]">
                                هذا برنامج نوعي يمكن تسويقه كحل متكامل لقضية محددة، أما المسار التدريبي فهو ترتيب زمني متتابع لعدة دورات تنفذ وراء بعضها للوصول إلى مدة أو كفاءة مستهدفة.
                            </p>
                        </section>
                    </div>
                </article>
            </div>
        </SectionShell>
    )
}

function InfoPanel({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }): JSX.Element {
    return (
        <section className="rounded-[26px] border border-[#d8e3e1] bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
                <Icon className="size-6 text-[#016564]" />
                <h3 className="m-0 text-xl font-black text-[#073b3a]">{title}</h3>
            </div>
            <p className="m-0 text-[14px] font-semibold leading-8 text-[#5f7774]">{text}</p>
        </section>
    )
}

function lmsToNaussCourse(course: LmsCourse): NaussCourse {
    return {
        id: course.id,
        domain: course.domain,
        domainPdfUrl: "",
        title: course.title,
        durationDays: course.durationDays,
        seats: course.seatLimit,
        language: course.title.includes("English") || course.domain.includes("الإنجليزية") ? "الإنجليزية" : "العربية",
        price: course.price,
        location: course.venue || course.room || course.deliveryLocationType,
        dates: [course.startDate, course.endDate].filter(Boolean),
        objective: `تنفيذ ${course.title} ضمن مجال ${course.domain} وفق بيانات منصة التدريب LMS، مع مراعاة الفئة المستهدفة ومتطلبات الجهة المستفيدة.`,
        outcomes: course.hasLearningOutcomes === "نعم" ? ["توجد نواتج تعلم معتمدة في منصة التدريب LMS، ويمكن تحريرها تفصيليًا من صفحة إدارة الدورة."] : [],
        targetAudience: course.category || "غير محدد",
        prerequisites: "قابلة للتعديل من صفحة إدارة الدورة.",
        sourcePage: 0,
    }
}

function CoursesAdminPage({ onPreview }: { onPreview: (course: NaussCourse) => void }): JSX.Element {
    const [managedCourses, setManagedCourses] = useState<LmsCourse[]>(() => lmsCourseCatalog)
    const [query, setQuery] = useState("")
    const [domainFilter, setDomainFilter] = useState("الكل")
    const [statusFilter, setStatusFilter] = useState("الكل")
    const domains = ["الكل", ...lmsCourseCatalogData.summary.domains]
    const statuses = ["الكل", ...Array.from(new Set(managedCourses.map((course) => course.status).filter(Boolean)))]
    const filtered = managedCourses.filter((course) => {
        const matchesQuery = `${course.title} ${course.domain} ${course.trainingId} ${course.venue} ${course.keywords.join(" ")}`.includes(query)
        const matchesDomain = domainFilter === "الكل" || course.domain === domainFilter
        const matchesStatus = statusFilter === "الكل" || course.status === statusFilter
        return matchesQuery && matchesDomain && matchesStatus
    })

    return (
        <SectionShell title="الدورات التدريبية">
            <div className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                <div className="mb-5 grid gap-3 md:grid-cols-4">
                    <Metric label="مصدر البيانات" value={lmsCourseCatalogData.summary.sourceFile} />
                    <Metric label="إجمالي سجلات LMS" value={`${lmsCourseCatalogData.summary.uniqueRecords} دورة`} />
                    <Metric label="المجالات" value={`${lmsCourseCatalogData.summary.domains.length} مجال`} />
                    <Metric label="المعروض بعد الفلترة" value={`${filtered.length} دورة`} />
                </div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <input className="min-w-[280px] flex-1 rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none" placeholder="بحث في الدورات" value={query} onChange={(event) => setQuery(event.target.value)} />
                    <select className="rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[13px] font-bold text-[#073b3a] outline-none" value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)}>
                        {domains.map((domain) => <option key={domain}>{domain}</option>)}
                    </select>
                    <select className="rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[13px] font-bold text-[#073b3a] outline-none" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <Button><Plus className="size-4" /> إضافة دورة</Button>
                    <Button className="bg-white text-[#073b3a] ring-1 ring-[#d8e3e1] hover:bg-white"><Filter className="size-4" /> فلترة</Button>
                </div>
                <div className="overflow-hidden rounded-[22px] border border-[#d8e3e1]">
                    <div className="grid gap-3 bg-[#f8f9f9] p-3 text-[12px] font-black text-[#5f7774] md:grid-cols-[1fr_120px_120px_90px_110px_150px]">
                        <span>اسم الدورة</span>
                        <span>المجال</span>
                        <span>التاريخ</span>
                        <span>المدة</span>
                        <span>السعر</span>
                        <span>الإجراءات</span>
                    </div>
                    {filtered.slice(0, 60).map((course) => (
                        <div key={course.id} className="grid gap-3 border-b border-[#d8e3e1] bg-white p-4 last:border-b-0 md:grid-cols-[1fr_120px_120px_90px_110px_150px]">
                            <button className="text-right text-[14px] font-black leading-7 text-[#073b3a]" type="button" onClick={() => onPreview(lmsToNaussCourse(course))}>{course.title}</button>
                            <span className="text-[12px] font-bold text-[#5f7774]">{course.domain || "غير محدد"}</span>
                            <span className="text-[12px] font-bold text-[#5f7774]">{course.startDate || "غير محدد"}</span>
                            <span className="text-[12px] font-bold text-[#5f7774]">{course.durationDays ? `${course.durationDays} يوم` : "غير محدد"}</span>
                            <span className="text-[12px] font-bold text-[#5f7774]">{course.price ? `${course.price.toLocaleString("ar-SA")} ريال` : "غير محدد"}</span>
                            <span className="flex gap-2">
                                <button className="grid size-9 place-items-center rounded-full bg-[#eef8f7] text-[#016564]" type="button"><Edit3 className="size-4" /></button>
                                <button className="grid size-9 place-items-center rounded-full bg-[#eef8f7] text-[#016564]" type="button" onClick={() => setManagedCourses((current) => [course, ...current])}><Copy className="size-4" /></button>
                                <button className="grid size-9 place-items-center rounded-full bg-red-50 text-red-700" type="button" onClick={() => setManagedCourses((current) => current.filter((item) => item.id !== course.id))}><Trash2 className="size-4" /></button>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </SectionShell>
    )
}

function BrochureStudioPage({ courses, selectedCourse, request, totalPrice }: { courses: NaussCourse[]; selectedCourse: NaussCourse; request: SmartRequest; totalPrice: number | null }): JSX.Element {
    const [courseId, setCourseId] = useState(selectedCourse.id)
    const [templateId, setTemplateId] = useState<BrochureTemplateId>("official")
    const course = courses.find((item) => item.id === courseId) || selectedCourse
    return (
        <SectionShell title="تصميم البرشورات">
            <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
                <aside className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                    <Field label="اختيار دورة موجودة" icon={BookOpen}>
                        <select className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 text-[14px] font-semibold outline-none" value={courseId} onChange={(event) => setCourseId(event.target.value)}>
                            {courses.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                        </select>
                    </Field>
                    <div className="mt-5 grid gap-3">
                        {(Object.entries(brochureTemplates) as [BrochureTemplateId, (typeof brochureTemplates)[BrochureTemplateId]][]).map(([id, template]) => (
                            <button
                                key={id}
                                className={cn(
                                    "rounded-2xl border p-4 text-right transition",
                                    templateId === id ? "border-[#016564] bg-[#eef8f7] text-[#073b3a]" : "border-[#d8e3e1] bg-[#f8f9f9] text-[#073b3a] hover:border-[#d0b284]"
                                )}
                                type="button"
                                onClick={() => setTemplateId(id)}
                            >
                                <span className="block text-[14px] font-black">{template.name}</span>
                                <span className="mt-1 block text-[11px] font-bold leading-5 text-[#6f8582]">{template.description}</span>
                            </button>
                        ))}
                    </div>
                </aside>
                <Brochure course={course} request={request} totalPrice={totalPrice} templateId={templateId} />
            </div>
        </SectionShell>
    )
}

function OfficialLettersPage({ selectedCourse }: { selectedCourse: NaussCourse }): JSX.Element {
    const [agency, setAgency] = useState("وزارة الدفاع")
    const [official, setOfficial] = useState("صاحب الصلاحية")
    const text = `تهديكم وكالة الجامعة للتدريب ممثلة بإدارة تطوير الأعمال أطيب التحايا، وبالإشارة إلى طلبكم الكريم بشأن تنفيذ برنامج ${selectedCourse.title}، يسرنا إحاطة سعادتكم بأن الوكالة درست الاحتياج التدريبي، ومواءمته مع البرامج المتاحة، تمهيدًا لاستكمال إجراءات الاعتماد والارتباط المالي.\n\nوتقبلوا خالص التحية والتقدير.`
    return (
        <SectionShell title="الخطابات الرسمية">
            <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
                <aside className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                    <Field label="اسم الجهة" icon={Building2}><input className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 font-semibold outline-none" value={agency} onChange={(event) => setAgency(event.target.value)} /></Field>
                    <div className="mt-4"><Field label="المسؤول وصفته" icon={Users}><input className="w-full rounded-full border border-[#d8e3e1] bg-[#f8f9f9] px-4 py-3 font-semibold outline-none" value={official} onChange={(event) => setOfficial(event.target.value)} /></Field></div>
                    <Button className="mt-4"><FilePenLine className="size-4" /> توليد الخطاب</Button>
                </aside>
                <article className="rounded-[32px] border border-[#d8e3e1] bg-white p-8 shadow-sm">
                    <p className="m-0 text-[15px] font-bold leading-10 text-[#073b3a]">سعادة {official} في {agency}</p>
                    <p className="mt-6 whitespace-pre-line text-[15px] font-semibold leading-10 text-[#5f7774]">{text}</p>
                </article>
            </div>
        </SectionShell>
    )
}

function CourseGuidePage({ courses, onPreview }: { courses: NaussCourse[]; onPreview: (course: NaussCourse) => void }): JSX.Element {
    const domains = Array.from(new Set(courses.map((course) => course.domain)))
    const [selectedDomain, setSelectedDomain] = useState(domains[0])
    const domainCourses = courses.filter((course) => course.domain === selectedDomain)
    return (
        <SectionShell title="دليل الدورات 2026">
            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                <aside className="grid gap-3">
                    {domains.map((domain) => (
                        <button key={domain} className={cn("rounded-[24px] border p-4 text-right text-[14px] font-black shadow-sm", selectedDomain === domain ? "border-[#016564] bg-[#eef8f7] text-[#016564]" : "border-[#d8e3e1] bg-white text-[#073b3a]")} type="button" onClick={() => setSelectedDomain(domain)}>
                            {domain}
                        </button>
                    ))}
                </aside>
                <div className="rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-sm">
                    <h2 className="m-0 text-2xl font-black text-[#073b3a]">{selectedDomain}</h2>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {domainCourses.map((course) => (
                            <button key={course.id} className="rounded-[22px] border border-[#d8e3e1] bg-[#f8f9f9] p-4 text-right transition hover:border-[#d0b284]" type="button" onClick={() => onPreview(course)}>
                                <span className="block text-[14px] font-black leading-7 text-[#073b3a]">{course.title}</span>
                                <span className="mt-2 block text-[12px] font-bold text-[#6f8582]">{course.durationDays ? `${course.durationDays} أيام` : "مدة غير محددة"} · {course.language}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </SectionShell>
    )
}

function CourseDetailsModal({
    course,
    onClose,
    onUseCourse,
}: {
    course: NaussCourse
    onClose: () => void
    onUseCourse: () => void
}): JSX.Element {
    const outcomes = course.outcomes.length ? course.outcomes : ["لا توجد مخرجات مفصلة في الدليل."]
    const dates = course.dates.length ? course.dates : ["يحدد وفق خطة التنفيذ"]

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#073b3a]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
            <div className="max-h-[88vh] w-full max-w-4xl overflow-auto rounded-[32px] border border-[#d8e3e1] bg-white p-5 shadow-2xl">
                <div className="sticky top-0 z-10 mb-5 flex items-start justify-between gap-4 rounded-[24px] bg-white/95 pb-4 backdrop-blur">
                    <div>
                        <p className="m-0 text-[12px] font-black text-[#016564]">{course.domain}</p>
                        <h2 className="m-0 mt-1 text-2xl font-black leading-10 text-[#073b3a]">{course.title}</h2>
                    </div>
                    <button
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-[#d8e3e1] text-[#073b3a] transition hover:border-[#d0b284]"
                        type="button"
                        onClick={onClose}
                        aria-label="إغلاق"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                    <Metric label="المدة" value={course.durationDays ? `${course.durationDays} أيام` : "تحدد لاحقًا"} />
                    <Metric label="المقاعد" value={course.seats ? `${course.seats} مقعد` : "غير محدد"} />
                    <Metric label="اللغة" value={course.language || "غير محدد"} />
                    <Metric label="السعر" value={course.price ? `${course.price.toLocaleString("ar-SA")} ريال` : "غير محدد"} />
                    <Metric label="مكان التنفيذ" value={course.location || "غير محدد"} />
                    <Metric label="التواريخ" value={dates.join(" - ")} />
                    <Metric label="مصدر الدليل" value={`صفحة ${course.sourcePage}`} />
                    <Metric
                        label="رابط المجال"
                        value={
                            <a className="text-[#016564] underline" href={course.domainPdfUrl} target="_blank" rel="noreferrer">
                                فتح PDF
                            </a>
                        }
                    />
                </div>

                <div className="mt-5 grid gap-4">
                    <section className="rounded-[24px] border border-[#d8e3e1] bg-[#f8f9f9] p-4">
                        <h3 className="m-0 mb-2 flex items-center gap-2 text-lg font-black text-[#073b3a]">
                            <Target className="size-5 text-[#016564]" />
                            الهدف العام
                        </h3>
                        <p className="m-0 text-[14px] font-semibold leading-8 text-[#5f7774]">
                            {course.objective || "لم يرد هدف تفصيلي في البيانات المستخرجة من الدليل."}
                        </p>
                    </section>

                    <section className="rounded-[24px] border border-[#d8e3e1] bg-white p-4">
                        <h3 className="m-0 mb-3 flex items-center gap-2 text-lg font-black text-[#073b3a]">
                            <Award className="size-5 text-[#016564]" />
                            نواتج التعلم
                        </h3>
                        <div className="grid gap-2">
                            {outcomes.map((outcome) => (
                                <div key={outcome} className="flex items-start gap-2 rounded-[18px] bg-[#f8f9f9] px-4 py-3 text-[13px] font-semibold leading-7 text-[#5f7774]">
                                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-[#016564]" />
                                    <span>{outcome}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid gap-4 md:grid-cols-2">
                        <section className="rounded-[24px] border border-[#d8e3e1] bg-white p-4">
                            <h3 className="m-0 mb-2 flex items-center gap-2 text-lg font-black text-[#073b3a]">
                                <Users className="size-5 text-[#016564]" />
                                الفئة المستهدفة
                            </h3>
                            <p className="m-0 text-[14px] font-semibold leading-8 text-[#5f7774]">
                                {course.targetAudience || "غير محددة في الدليل."}
                            </p>
                        </section>
                        <section className="rounded-[24px] border border-[#d8e3e1] bg-white p-4">
                            <h3 className="m-0 mb-2 flex items-center gap-2 text-lg font-black text-[#073b3a]">
                                <ClipboardCheck className="size-5 text-[#016564]" />
                                المتطلبات السابقة
                            </h3>
                            <p className="m-0 text-[14px] font-semibold leading-8 text-[#5f7774]">
                                {course.prerequisites || "لا توجد متطلبات سابقة محددة."}
                            </p>
                        </section>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <Button className="bg-white text-[#073b3a] ring-1 ring-[#d8e3e1] hover:bg-white" onClick={onClose}>
                        إغلاق
                    </Button>
                    <Button onClick={onUseCourse}>اعتماد هذه الدورة للبرشور</Button>
                </div>
            </div>
        </div>
    )
}

function composeLearningNarrative(outcomes: string[], courseTitle: string): string {
    const cleaned = outcomes
        .map((outcome) => outcome.replace(/^[•\-\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 4)

    if (!cleaned.length) {
        return `بنهاية برنامج ${courseTitle} يتوقع أن يمتلك المشاركون فهمًا عمليًا لموضوع البرنامج، وقدرة أفضل على تطبيق المفاهيم والإجراءات المرتبطة به داخل بيئة العمل.`
    }

    if (cleaned.length === 1) {
        return `بنهاية البرنامج يتوقع أن يتمكن المشاركون من ${cleaned[0]}، بما يدعم جاهزيتهم المهنية ويعزز قدرتهم على نقل المعرفة إلى واقع العمل.`
    }

    const last = cleaned[cleaned.length - 1]
    const rest = cleaned.slice(0, -1).join("، ")
    return `بنهاية البرنامج يتوقع أن يكون المشاركون قادرين على ${rest}، إلى جانب ${last}. ويستهدف ذلك بناء معرفة تطبيقية قابلة للاستخدام في بيئة العمل، وتعزيز جودة القرار والإجراء لدى الفئة المستهدفة.`
}

function Brochure({
    course,
    request,
    totalPrice,
    templateId = "official",
}: {
    course: NaussCourse
    request: SmartRequest
    totalPrice: number | null
    templateId?: BrochureTemplateId
}): JSX.Element {
    const template = brochureTemplates[templateId]
    const outcomes = course.outcomes.length
        ? course.outcomes
        : ["رفع الجاهزية المهنية", "تحسين جودة الإجراءات", "توحيد الممارسات بين المشاركين"]
    const dates = course.dates.length ? course.dates.join(" - ") : "يحدد وفق خطة التنفيذ"
    const seats = course.seats ? `${course.seats} مقعد` : `${request.participants} مشارك مقترح`
    const price = course.price ? `${course.price.toLocaleString("ar-SA")} ريال للمتدرب` : "تحدد بعد الاعتماد"
    const objective =
        course.objective ||
        "تطوير قدرات المشاركين في المجال المختار وفق دليل البرامج التدريبية لوكالة التدريب بجامعة نايف العربية للعلوم الأمنية."
    const learningNarrative = composeLearningNarrative(outcomes, course.title)
    const audience = course.targetAudience || request.audience
    const prerequisites = course.prerequisites || "لا توجد متطلبات مسبقة محددة في الدليل."
    const infoItems = [
        { icon: MapPin, label: "مكان التنفيذ", value: course.location || request.executionCity },
        { icon: Users, label: "المقاعد المتاحة", value: seats },
        { icon: CalendarDays, label: "مدة البرنامج", value: course.durationDays ? `${course.durationDays} أيام` : "تحدد لاحقًا" },
        { icon: Languages, label: "لغة البرنامج", value: course.language || request.language },
        { icon: CalendarDays, label: "التاريخ", value: dates },
        { icon: Banknote, label: "التكلفة", value: price },
    ]

    return (
        <div
            className={cn(
                "mx-auto max-w-[820px] overflow-hidden rounded-[26px] shadow-[0_24px_70px_-35px_rgba(7,59,58,0.55)]",
                template.shell
            )}
            style={{ fontFamily: "'El Messiri Local', 'IBM Plex Sans Arabic', sans-serif" }}
        >
            <div className={cn("h-10", template.topBar)} />

            <div className={cn("flex items-center justify-between gap-4 px-8 py-5", template.header)}>
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl border border-[#d0b284]/45 bg-white/70 px-4 py-3">
                        <img className="h-14 w-40 object-contain" src={naussLogoUrl} alt="شعار جامعة نايف العربية للعلوم الأمنية" />
                    </div>
                    <div className={template.compact ? "hidden" : ""}>
                        <p className="m-0 text-[12px] font-black text-[#016564]">جامعة نايف العربية للعلوم الأمنية</p>
                        <p className="m-0 mt-1 text-[14px] font-black">وكالة التدريب</p>
                    </div>
                </div>
                <div className="text-left">
                    <p className="m-0 text-[11px] font-bold text-[#6f8582]">Training Program</p>
                    <p className="m-0 mt-1 text-[18px] font-black text-[#d0b284]">NAUSS</p>
                </div>
            </div>

            <div className="relative overflow-hidden px-8 pb-8 pt-8">
                <div className="absolute inset-0">
                    <img
                        className={cn("h-full w-full object-cover mix-blend-luminosity", template.compact ? "opacity-[0.08]" : "opacity-[0.16]")}
                        src="/nauss-campus-bg.jpeg"
                        alt=""
                        aria-hidden="true"
                    />
                    <div className={cn("absolute inset-0", template.bodyOverlay)} />
                    <div className="absolute -left-20 top-20 size-72 rounded-full border border-white/25" />
                    <div className="absolute bottom-16 right-10 size-44 rounded-full border border-[#d0b284]/40" />
                </div>

                <div className="relative">
                    <p className="m-0 text-center text-[18px] font-black text-white/90">البرنامج التدريبي</p>
                    <h3 className="mx-auto mt-3 max-w-[650px] text-center text-[28px] font-black leading-[1.6] text-white">
                        {course.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-[620px] text-center text-[13px] font-bold leading-7 text-white/75">
                        {course.domain}
                    </p>
                    <p className="mx-auto mt-1 max-w-[620px] text-center text-[11px] font-bold leading-6 text-white/55">
                        مصدر البيانات: دليل الدورة، صفحة {course.sourcePage}
                    </p>

                    <div className={cn("mx-auto mt-7 grid max-w-[620px] grid-cols-3 overflow-hidden rounded-[22px] border backdrop-blur", template.infoGrid)}>
                        {infoItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <div key={item.label} className="min-h-[112px] border-b border-l border-white/45 p-4 text-center last:border-l-0">
                                    <Icon className={cn("mx-auto size-8", template.accent)} strokeWidth={1.8} />
                                    <p className="m-0 mt-2 text-[12px] font-black text-white">{item.label}</p>
                                    <p className="m-0 mt-1 text-[12px] font-bold leading-6 text-white/85">{item.value}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className={cn("mt-8 grid gap-5", template.compact && "gap-4")}>
                        <section className={cn("rounded-[26px] p-5 backdrop-blur", template.section)}>
                            <div className="mb-3 flex items-center gap-3">
                                <Target className={cn("size-8", template.accent)} />
                                <h4 className="m-0 text-[18px] font-black">الهدف العام</h4>
                            </div>
                            <p className="m-0 text-[14px] font-semibold leading-9 text-white/90">{objective}</p>
                        </section>

                        <section className={cn("rounded-[26px] border border-white/55 p-5", template.section)}>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Award className={cn("size-8", template.accent)} />
                                    <h4 className="m-0 text-[18px] font-black">نواتج التعلم</h4>
                                </div>
                            </div>
                            <p className="m-0 text-[14px] font-semibold leading-9 text-white/92">{learningNarrative}</p>
                        </section>

                        {!template.compact && <div className="grid gap-4 md:grid-cols-2">
                            <section className="rounded-[22px] bg-white/10 p-4 ring-1 ring-white/15">
                                <div className="mb-2 flex items-center gap-2">
                                    <BookOpen className={cn("size-6", template.accent)} />
                                    <h4 className="m-0 text-[15px] font-black">الفئة المستهدفة</h4>
                                </div>
                                <p className="m-0 text-[13px] font-semibold leading-7 text-white/85">{audience}</p>
                            </section>
                            <section className="rounded-[22px] bg-white/10 p-4 ring-1 ring-white/15">
                                <div className="mb-2 flex items-center gap-2">
                                    <ClipboardCheck className={cn("size-6", template.accent)} />
                                    <h4 className="m-0 text-[15px] font-black">المتطلبات السابقة</h4>
                                </div>
                                <p className="m-0 text-[13px] font-semibold leading-7 text-white/85">{prerequisites}</p>
                            </section>
                        </div>}

                    </div>
                </div>
            </div>

            <div className={template.footer}>
                <img className="h-auto w-full object-cover" src="/brochure-footer.png" alt="بيانات التواصل والاعتمادات" />
            </div>
        </div>
    )
}

function Letter({
    course,
    request,
    totalPrice,
}: {
    course: NaussCourse
    request: SmartRequest
    totalPrice: number | null
}): JSX.Element {
    return (
        <div className="space-y-4 text-[14px] leading-8 text-[#5f7774]">
            <h3 className="m-0 text-2xl font-bold text-[#073b3a]">خطاب اعتماد وارتباط مالي</h3>
            <p className="m-0">سعادة صاحب الصلاحية في {request.agencyName}</p>
            <p className="m-0">السلام عليكم ورحمة الله وبركاته،</p>
            <p className="m-0">
                بناء على الاحتياج التدريبي المحدد، نوصي باعتماد برنامج <strong>{course.title}</strong>، وذلك
                لاستهداف {request.audience} بعدد تقريبي قدره {request.participants} مشاركًا.
            </p>
            <p className="m-0">
                تبلغ التكلفة التقديرية {totalPrice ? `${totalPrice.toLocaleString("ar-SA")} ريال` : "حسب المقاعد المعتمدة"}،
                ويقترح تنفيذ البرنامج في {course.location || request.executionCity}.
            </p>
            <p className="m-0">نأمل التكرم بالموافقة على اعتماد الطلب واستكمال إجراءات الارتباط المالي حسب الأنظمة المتبعة.</p>
            <p className="m-0">وتفضلوا بقبول فائق الاحترام والتقدير.</p>
        </div>
    )
}

function buildBrochure(course: NaussCourse, request: SmartRequest): string {
    return `بطاقة برنامج تدريبي

اسم البرنامج: ${course.title}
المجال: ${course.domain}
الجهة المستفيدة: ${request.agencyName}
الفئة المستهدفة: ${request.audience}
عدد المشاركين: ${request.participants}
المدة: ${course.durationDays ? `${course.durationDays} أيام` : "تحدد لاحقًا"}
لغة التنفيذ: ${course.language}
مقر التنفيذ: ${course.location || request.executionCity}`
}

function buildLetter(course: NaussCourse, request: SmartRequest, totalPrice: number | null): string {
    return `سعادة صاحب الصلاحية في ${request.agencyName}
السلام عليكم ورحمة الله وبركاته،

بناء على الاحتياج التدريبي المحدد، نوصي باعتماد برنامج ${course.title}، وذلك لاستهداف ${request.audience} بعدد تقريبي قدره ${request.participants} مشاركًا.

التكلفة التقديرية: ${totalPrice ? `${totalPrice.toLocaleString("ar-SA")} ريال` : "تحدد بعد اعتماد المقاعد"}.

نأمل التكرم بالموافقة على اعتماد الطلب واستكمال إجراءات الارتباط المالي حسب الأنظمة المتبعة.

وتفضلوا بقبول فائق الاحترام والتقدير.`
}
