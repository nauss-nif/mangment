import { sectorUseCases, trainingPrograms } from './data'
import { NeedsAnalysis, NeedsFormData, ProgramId, ProgramRecommendation, TrainingTrack } from './types'

const keywordMap: Array<{ words: string[]; programId: ProgramId }> = [
    { words: ['تهديد', 'تحليل', 'إنذار', 'معلومات'], programId: 'threat-assessment' },
    { words: ['منفذ', 'حدود', 'تفتيش', 'عبور'], programId: 'border-risk' },
    { words: ['طيران', 'جوي', 'سلامة', 'حادث'], programId: 'aviation-security' },
    { words: ['دليل', 'جنائي', 'تحقيق', 'رقمي'], programId: 'digital-forensics' },
    { words: ['سيبراني', 'حادث', 'اختراق', 'تصعيد'], programId: 'cyber-incident' },
    { words: ['قيادة', 'استراتيجية', 'حوكمة', 'مبادرة'], programId: 'strategic-leadership' },
    { words: ['أزمة', 'عمليات', 'استجابة', 'سيطرة'], programId: 'crisis-command' },
    { words: ['مخاطر', 'سلامة', 'ضوابط', 'التزام'], programId: 'risk-governance' },
]

export const mockAiService = {
    analyzeNeeds(form: NeedsFormData): NeedsAnalysis {
        const sector = sectorUseCases.find((item) => item.id === form.sectorId) || sectorUseCases[0]
        const text = `${form.trainingProblem} ${form.objectives} ${form.securityDomain} ${form.notes}`.toLowerCase()
        const scoredPrograms = trainingPrograms
            .map((program) => {
                const sectorMatch = program.sectorIds.includes(form.sectorId) ? 28 : 0
                const keywordScore = keywordMap
                    .filter((keyword) => keyword.programId === program.id)
                    .reduce(
                        (score, keyword) => score + keyword.words.filter((word) => text.includes(word)).length * 12,
                        0
                    )
                const audienceScore = text.includes(program.targetAudience.split('،')[0].toLowerCase()) ? 8 : 0
                const fitScore = Math.min(98, 48 + sectorMatch + keywordScore + audienceScore)
                const action: ProgramRecommendation['action'] =
                    fitScore >= 78 ? 'ترشيح مباشر' : fitScore >= 65 ? 'تعديل البرنامج' : 'إنشاء برنامج جديد'

                return {
                    program,
                    fitScore,
                    reason: `يرتبط البرنامج باحتياج ${sector.name} ويعالج جانبًا من: ${
                        form.trainingProblem || 'الفجوة التدريبية المحددة'
                    }.`,
                    expectedOutcomes: program.outcomes.slice(0, 3),
                    action,
                }
            })
            .sort((first, second) => second.fitScore - first.fitScore)
            .slice(0, 4)

        const topProgramIds = scoredPrograms.slice(0, 3).map((item) => item.program.id)
        const totalDays = scoredPrograms.slice(0, 3).reduce((sum, item) => sum + item.program.durationDays, 0)
        const track: TrainingTrack = {
            name: `مسار ${sector.name} لرفع الجاهزية`,
            goal: `معالجة الفجوة التدريبية لدى ${
                form.agencyName || 'الجهة المستفيدة'
            } عبر برامج مترابطة قابلة للتنفيذ.`,
            audience: form.targetAudience || 'الفئة المستهدفة المحددة في الطلب',
            programIds: topProgramIds,
            order: scoredPrograms.slice(0, 3).map((item, index) => `${index + 1}. ${item.program.name}`),
            totalDays,
            outcomes: Array.from(new Set(scoredPrograms.slice(0, 3).flatMap((item) => item.program.outcomes))).slice(
                0,
                6
            ),
            reasons: Object.fromEntries(
                scoredPrograms
                    .slice(0, 3)
                    .map((item) => [
                        item.program.id,
                        `اختير لأن درجة الملاءمة ${item.fitScore}% ولارتباطه المباشر بالمجال المطلوب.`,
                    ])
            ) as TrainingTrack['reasons'],
            externalSummary: `نقترح تنفيذ مسار تدريبي متخصص لمدة ${totalDays} يومًا يستهدف ${
                form.targetAudience || 'المشاركين'
            }، ويركز على ${form.objectives || 'رفع الجاهزية وتحسين الأداء'}.`,
        }

        return {
            summary: `تظهر بيانات ${form.agencyName || 'الجهة'} احتياجًا تدريبيًا في قطاع ${sector.name} يستهدف ${
                form.participants
            } مشاركًا من مستوى ${form.jobLevel}.`,
            gap: `الفجوة الأساسية تتمثل في الحاجة إلى تحويل المشكلة التدريبية إلى مهارات عملية وإجراءات موحدة قابلة للقياس في مجال ${form.securityDomain}.`,
            recommendations: scoredPrograms,
            proposedTrack: track,
            executiveRecommendation: `يوصى بالبدء بالبرنامج الأعلى ملاءمة ثم تنفيذ المسار المقترح على مرحلتين، مع قياس أثر مختصر قبل التنفيذ وبعده.`,
        }
    },
}
