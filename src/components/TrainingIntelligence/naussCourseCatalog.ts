import courses from './naussCourseCatalog.json'

export interface NaussCourse {
    id: string
    domain: string
    domainPdfUrl: string
    title: string
    durationDays: number | null
    seats: number | null
    language: string
    price: number | null
    location: string
    dates: string[]
    objective: string
    outcomes: string[]
    targetAudience: string
    prerequisites: string
    sourcePage: number
}

export const naussCourseCatalog = courses as NaussCourse[]
