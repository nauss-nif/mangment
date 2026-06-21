import { formatCurrency } from './costing'
import { trainingPrograms } from './data'
import { CostResult, GeneratedDocumentType, NeedsAnalysis, NeedsFormData, ProgramId, TrainingTrack } from './types'

export function generateDocument(
    type: GeneratedDocumentType,
    form: NeedsFormData,
    analysis: NeedsAnalysis,
    selectedProgramIds: ProgramId[],
    track: TrainingTrack,
    cost: CostResult
): string {
    const programNames = selectedProgramIds
        .map((id) => trainingPrograms.find((program) => program.id === id)?.name)
        .filter(Boolean)
        .join('، ')

    const agencyName = form.agencyName || 'الجهة المستفيدة'

    if (type === 'officialLetter') {
        return `سعادة ممثل ${agencyName} المحترم،

السلام عليكم ورحمة الله وبركاته،

إشارة إلى طلبكم المتعلق بتطوير القدرات التدريبية في مجال ${form.securityDomain}، يسر وكالة التدريب بجامعة نايف العربية للعلوم الأمنية أن تقدم تصورًا أوليًا لمعالجة الاحتياج التدريبي المحدد.

يوضح التحليل أن الفجوة التدريبية تتمثل في: ${analysis.gap}

وبناءً على ذلك، تقترح الوكالة تنفيذ البرامج التالية: ${programNames}. ويستهدف المسار ${track.audience} لمدة إجمالية قدرها ${track.totalDays} يومًا تدريبيًا.

وتفضلوا بقبول فائق الاحترام والتقدير.`
    }

    if (type === 'proposal') {
        return `عرض تدريبي مختصر

الجهة: ${agencyName}
الاحتياج: ${analysis.summary}
المسار المقترح: ${track.name}
البرامج: ${programNames}
المدة الإجمالية: ${track.totalDays} يومًا
التكلفة المقترحة: ${formatCurrency(cost.suggestedPrice)}

القيمة المتوقعة:
${track.outcomes.map((outcome) => `- ${outcome}`).join('\n')}`
    }

    if (type === 'executiveSummary') {
        return `ملخص تنفيذي

تحتاج ${agencyName} إلى تدخل تدريبي مركز في قطاع ${form.securityDomain}. يقترح محرك التحليل تنفيذ ${
            track.name
        } لمعالجة الفجوة وتحقيق مخرجات عملية قابلة للقياس.

التوصية التنفيذية: ${analysis.executiveRecommendation}
السعر المقترح: ${formatCurrency(cost.suggestedPrice)}.`
    }

    if (type === 'programCard') {
        const program = trainingPrograms.find((item) => item.id === selectedProgramIds[0]) || trainingPrograms[0]
        return `بطاقة برنامج

اسم البرنامج: ${program.name}
الفئة المستهدفة: ${program.targetAudience}
المدة: ${program.durationDays} أيام
لغة التنفيذ: ${program.language}
المشكلة التي يعالجها: ${program.problem}
القيمة للجهة: ${program.valueForAgency}
المخرجات: ${program.outcomes.join('، ')}.`
    }

    return `الموضوع: عرض تدريبي مقترح من وكالة التدريب

سعادة ممثل ${agencyName} المحترم،

نرفق لكم تصورًا مختصرًا لمعالجة الاحتياج التدريبي في مجال ${form.securityDomain}، ويتضمن ${track.name} والبرامج المقترحة: ${programNames}.

يسعدنا التنسيق معكم لتحديد الموعد المناسب واستكمال المتطلبات التنفيذية.

مع خالص التحية.`
}
