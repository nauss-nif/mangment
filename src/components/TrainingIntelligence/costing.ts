import { CostInput, CostResult } from './types'

export function calculateTrainingCost(input: CostInput): CostResult {
    const lineItems = [
        { label: 'السعر الأساسي للبرنامج', value: input.basePrice },
        { label: 'تكلفة المدرب', value: input.trainerCost * input.days },
        { label: 'القاعة', value: input.hallCost * input.days },
        { label: 'الضيافة', value: input.hospitalityCost * input.participants * input.days },
        { label: 'المواد التدريبية', value: input.materialsCost * input.participants },
        { label: 'التنقل', value: input.transportCost },
        { label: 'السكن', value: input.accommodationCost * input.days },
        { label: 'الشريك الدولي', value: input.internationalPartnerCost },
    ]
    const estimatedCost = lineItems.reduce((sum, item) => sum + item.value, 0)
    const marginValue = Math.round(estimatedCost * (input.marginPercent / 100))
    const suggestedPrice = estimatedCost + marginValue

    return {
        estimatedCost,
        suggestedPrice,
        marginValue,
        lineItems,
        internalSummary: `التكلفة التقديرية ${formatCurrency(estimatedCost)}، والهامش ${formatCurrency(
            marginValue
        )} بنسبة ${input.marginPercent}%. السعر المقترح للعرض ${formatCurrency(suggestedPrice)}.`,
    }
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
    }).format(value)
}
