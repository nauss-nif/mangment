import lmsData from "./lmsCourseCatalog.json"

export interface LmsCourse {
    id: string
    source: string
    programType: string
    domain: string
    title: string
    trainingId: string
    status: string
    isCancelled: boolean
    category: string
    startDate: string
    endDate: string
    durationDays: number | null
    schedule: string
    trainingHours: number | null
    deliveryLocationType: string
    room: string
    provider: string
    trainers: string
    coordinator: string
    venue: string
    hasLearningOutcomes: string
    needsTranslator: string
    translator: string
    certificate: string
    pricingType: string
    pricingSubtype: string
    seatLimit: number | null
    price: number | null
    keywords: string[]
}

export interface LmsCourseCatalogData {
    summary: {
        sourceFile: string
        totalRows: number
        recordsTouching2026: number
        uniqueRecords: number
        activeRecords: number
        cancelledRecords: number
        domains: string[]
    }
    courses: LmsCourse[]
}

export const lmsCourseCatalogData = lmsData as LmsCourseCatalogData
export const lmsCourseCatalog = lmsCourseCatalogData.courses
