import { naussCourseCatalog, NaussCourse } from './naussCourseCatalog'

export type NeedId =
    | 'cyber'
    | 'digital-forensics'
    | 'industrial-security'
    | 'border-security'
    | 'event-security'
    | 'financial-crimes'
    | 'ai'
    | 'organized-crime'
    | 'terrorism'
    | 'environment'
    | 'media'
    | 'training-design'

export interface NeedOption {
    id: NeedId
    label: string
    description: string
    keywords: string[]
    domains: string[]
}

export interface SmartRequest {
    agencyName: string
    domain: string
    needs: NeedId[]
    audience: string
    participants: number
    jobLevel: string
    language: string
    duration: 'قصيرة' | 'متوسطة' | 'ممتدة' | 'غير محدد'
    executionCity: string
    notes: string
}

export interface CourseRecommendation {
    course: NaussCourse
    score: number
    reasons: string[]
}

export interface RecommendationResult {
    summary: string
    gap: string
    recommendations: CourseRecommendation[]
    brochure: string
    approvalLetter: string
}

export const needOptions: NeedOption[] = [
    {
        id: 'cyber',
        label: 'الأمن السيبراني',
        description: 'استجابة للحوادث، حماية بيانات، جرائم سيبرانية.',
        keywords: ['سيبر', 'بيانات', 'اختراق', 'حادث', 'ويب', 'فدية'],
        domains: ['الأمن السيبراني', 'التحول الرقمي'],
    },
    {
        id: 'digital-forensics',
        label: 'الأدلة والتحقيق الرقمي',
        description: 'أدلة رقمية، هواتف، ساعات ذكية، تزييف عميق.',
        keywords: ['الأدلة', 'الادلة', 'تحقيق', 'رقمي', 'الهواتف', 'الساعات', 'التزييف', 'الصوتي'],
        domains: ['الأمن السيبراني', 'التدقيق والأدلة الجنائية'],
    },
    {
        id: 'industrial-security',
        label: 'أمن المنشآت',
        description: 'حراسات، غرف تحكم، مخاطر أمنية، تقارير.',
        keywords: ['المنش', 'الصناعي', 'حراس', 'مخاطر', 'التحكم', 'التقارير', 'حماية'],
        domains: ['الأمن الصناعي'],
    },
    {
        id: 'border-security',
        label: 'أمن الحدود والمنافذ',
        description: 'منافذ، حدود، تهريب، مراقبة، إجراءات ميدانية.',
        keywords: ['الحدود', 'المنافذ', 'تهريب', 'مراقبة', 'مسافرين'],
        domains: ['أمن الحدود'],
    },
    {
        id: 'event-security',
        label: 'أمن الفعاليات',
        description: 'تنظيم، حشود، سلامة، خطط أمنية للفعاليات.',
        keywords: ['الفعاليات', 'الحشود', 'الجماهير', 'تنظيم', 'السلامة'],
        domains: ['أمن الفعاليات'],
    },
    {
        id: 'financial-crimes',
        label: 'الجرائم المالية',
        description: 'غسل أموال، احتيال، تتبع مالي، مخاطر مالية.',
        keywords: ['المالية', 'الاقتصادية', 'غسل', 'أموال', 'احتيال', 'العملات'],
        domains: ['الجرائم المالية'],
    },
    {
        id: 'ai',
        label: 'الذكاء الاصطناعي',
        description: 'تقنيات ناشئة، تحليل ذكي، مخاطر الذكاء الاصطناعي.',
        keywords: ['الذكاء', 'الاصطناعي', 'التقنيات', 'الناشئة'],
        domains: ['الذكاء الاصطناعي'],
    },
    {
        id: 'organized-crime',
        label: 'الجريمة المنظمة',
        description: 'شبكات إجرامية، تهريب، اتجار، أنماط منظمة.',
        keywords: ['المنظمة', 'الاتجار', 'التهريب', 'الشبكات'],
        domains: ['الجريمة المنظمة'],
    },
    {
        id: 'terrorism',
        label: 'مكافحة الإرهاب',
        description: 'وقاية، تحليل تهديدات، مواجهة جرائم إرهابية.',
        keywords: ['الإرهاب', 'ارهاب', 'التطرف', 'تهديدات'],
        domains: ['الإرهابية'],
    },
    {
        id: 'environment',
        label: 'الأمن البيئي',
        description: 'مخالفات بيئية، رقابة، استجابة، حماية بيئة.',
        keywords: ['البيئي', 'البيئة', 'المخالفات', 'الحياة الفطرية'],
        domains: ['الأمن البيئي'],
    },
    {
        id: 'media',
        label: 'الإعلام والتواصل',
        description: 'اتصال مؤسسي، رسائل إعلامية، تواصل وقت الأزمات.',
        keywords: ['الإعلام', 'التواصل', 'الاتصال', 'الرسائل'],
        domains: ['الإعلام'],
    },
    {
        id: 'training-design',
        label: 'تطوير التدريب',
        description: 'تصميم حقائب، قياس أثر، إدارة برامج تدريبية.',
        keywords: ['التدريب', 'حقائب', 'الأثر', 'تصميم', 'مدربين'],
        domains: ['صناعة التدريب'],
    },
]

export const domains = Array.from(new Set(naussCourseCatalog.map((course) => course.domain)))

function normalize(text: string): string {
    return text
        .replace(/[أإآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .toLowerCase()
}

function durationFits(course: NaussCourse, duration: SmartRequest['duration']): boolean {
    if (!course.durationDays || duration === 'غير محدد') {
        return true
    }
    if (duration === 'قصيرة') {
        return course.durationDays <= 3
    }
    if (duration === 'متوسطة') {
        return course.durationDays >= 4 && course.durationDays <= 7
    }
    return course.durationDays > 7
}

export function recommendCourses(request: SmartRequest): RecommendationResult {
    const selectedNeeds = needOptions.filter((need) => request.needs.includes(need.id))
    const requestKeywords = selectedNeeds.flatMap((need) => need.keywords)
    const requestDomains = selectedNeeds.flatMap((need) => need.domains)
    const normalizedLanguage = normalize(request.language)

    const recommendations = naussCourseCatalog
        .map((course) => {
            const haystack = normalize(
                `${course.domain} ${course.title} ${course.objective} ${course.targetAudience} ${course.outcomes.join(
                    ' '
                )}`
            )
            const reasons: string[] = []
            let score = 20

            if (request.domain === course.domain) {
                score += 35
                reasons.push('يقع ضمن المجال الذي اختارته الجهة.')
            }

            const domainHintMatched = requestDomains.some((domain) =>
                normalize(course.domain).includes(normalize(domain))
            )
            if (domainHintMatched) {
                score += 18
                reasons.push('يتوافق مع نوع الاحتياج المحدد.')
            }

            const keywordMatches = requestKeywords.filter((keyword) => haystack.includes(normalize(keyword)))
            if (keywordMatches.length) {
                score += Math.min(30, keywordMatches.length * 7)
                reasons.push(
                    `يرتبط بكلمات احتياج واضحة مثل: ${Array.from(new Set(keywordMatches)).slice(0, 3).join('، ')}.`
                )
            }

            if (course.language && normalize(course.language).includes(normalizedLanguage)) {
                score += 8
                reasons.push('لغة التنفيذ تناسب تفضيل الجهة.')
            }

            if (durationFits(course, request.duration)) {
                score += 7
                reasons.push('مدة البرنامج مناسبة للتفضيل المختار.')
            }

            if (
                course.targetAudience &&
                normalize(course.targetAudience).includes(normalize(request.audience.split(' ')[0] || ''))
            ) {
                score += 5
            }

            return {
                course,
                score: Math.min(98, score),
                reasons: reasons.length ? reasons : ['ترشيح عام بناء على المجال والبيانات المتاحة في دليل الدورات.'],
            }
        })
        .sort((first, second) => second.score - first.score)
        .slice(0, 5)

    const top = recommendations[0].course
    const selectedNeedLabels = selectedNeeds.map((need) => need.label).join('، ') || 'احتياج تدريبي عام'

    return {
        summary: `احتياج الجهة يتركز في ${selectedNeedLabels} ضمن ${request.domain}. الفئة المستهدفة: ${request.audience}، وعدد المشاركين ${request.participants}.`,
        gap: `الفجوة المتوقعة هي الحاجة إلى برنامج رسمي من دليل وكالة التدريب يربط المجال المختار بمخرجات عملية قابلة للتنفيذ والاعتماد المالي.`,
        recommendations,
        brochure: buildBrochure(top, request),
        approvalLetter: buildApprovalLetter(top, request),
    }
}

export function buildBrochure(course: NaussCourse, request: SmartRequest): string {
    return `برشور برنامج تدريبي

اسم البرنامج: ${course.title}
المجال: ${course.domain}
الجهة المستفيدة: ${request.agencyName}
الفئة المستهدفة: ${request.audience}
عدد المشاركين المتوقع: ${request.participants}
المدة: ${course.durationDays ? `${course.durationDays} أيام` : 'تحدد حسب الخطة'}
لغة التنفيذ: ${course.language}
مقر التنفيذ: ${course.location || request.executionCity}
التكلفة للفرد: ${course.price ? `${course.price.toLocaleString('ar-SA')} ريال` : 'تحدد لاحقًا'}

الهدف العام:
${course.objective || 'تطوير قدرات المشاركين في المجال المختار وفق دليل البرامج التدريبية لوكالة التدريب.'}

المخرجات المتوقعة:
${(course.outcomes.length ? course.outcomes : ['رفع المعرفة التطبيقية', 'تحسين الجاهزية', 'توحيد الممارسات المهنية'])
    .map((outcome) => `- ${outcome}`)
    .join('\n')}

القيمة للجهة:
يساعد البرنامج الجهة على معالجة الاحتياج التدريبي المحدد من خلال محتوى متخصص، مدة واضحة، ومخرجات قابلة للقياس.`
}

export function buildApprovalLetter(course: NaussCourse, request: SmartRequest): string {
    const total = course.price ? course.price * request.participants : null

    return `سعادة صاحب الصلاحية في ${request.agencyName}
السلام عليكم ورحمة الله وبركاته،

بناءً على الاحتياج التدريبي المحدد من قبل الجهة في مجال ${request.domain}، نوصي بترشيح برنامج:
${course.title}

وذلك لاستهداف ${request.audience} بعدد تقريبي قدره ${
        request.participants
    } مشاركًا، وبما يتوافق مع احتياج الجهة في ${request.needs
        .map((needId) => needOptions.find((need) => need.id === needId)?.label)
        .filter(Boolean)
        .join('، ')}.

بيانات البرنامج:
- المدة: ${course.durationDays ? `${course.durationDays} أيام` : 'تحدد لاحقًا'}
- لغة التنفيذ: ${course.language}
- مقر التنفيذ: ${course.location || request.executionCity}
- التكلفة التقديرية للفرد: ${course.price ? `${course.price.toLocaleString('ar-SA')} ريال` : 'تحدد لاحقًا'}
- إجمالي الارتباط المالي التقديري: ${total ? `${total.toLocaleString('ar-SA')} ريال` : 'يحدد بعد اعتماد المقاعد'}

نأمل التكرم بالموافقة على اعتماد الطلب واستكمال إجراءات الارتباط المالي حسب الأنظمة المتبعة.

وتفضلوا بقبول فائق الاحترام والتقدير.`
}
