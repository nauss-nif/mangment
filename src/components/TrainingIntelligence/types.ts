export type SectorId =
    | 'security-agencies'
    | 'ports-borders'
    | 'security-aviation'
    | 'forensics'
    | 'cybersecurity'
    | 'security-leadership'
    | 'risk-safety'

export type ProgramId =
    | 'threat-assessment'
    | 'border-risk'
    | 'aviation-security'
    | 'digital-forensics'
    | 'cyber-incident'
    | 'strategic-leadership'
    | 'crisis-command'
    | 'risk-governance'

export type RequestStatus =
    | 'طلب جديد'
    | 'قيد التحليل'
    | 'جاهز للمراجعة'
    | 'جاهز للإرسال'
    | 'تم الإرسال'
    | 'فرصة نشطة'
    | 'مغلق'

export interface TrainingProgram {
    id: ProgramId
    name: string
    summary: string
    targetAudience: string
    problem: string
    outcomes: string[]
    modules: string[]
    durationDays: number
    language: 'العربية' | 'العربية والإنجليزية'
    valueForAgency: string
    relatedProgramIds: ProgramId[]
    sectorIds: SectorId[]
    basePrice: number
}

export interface SectorUseCase {
    id: SectorId
    name: string
    description: string
    needs: string[]
    suitableProgramIds: ProgramId[]
    suggestedTracks: string[]
    trainingValue: string
}

export interface NeedsFormData {
    agencyName: string
    sectorId: SectorId
    targetAudience: string
    participants: number
    jobLevel: string
    trainingProblem: string
    objectives: string
    securityDomain: string
    preferredDuration: string
    language: string
    location: string
    notes: string
}

export interface ProgramRecommendation {
    program: TrainingProgram
    fitScore: number
    reason: string
    expectedOutcomes: string[]
    action: 'ترشيح مباشر' | 'تعديل البرنامج' | 'إنشاء برنامج جديد'
}

export interface NeedsAnalysis {
    summary: string
    gap: string
    recommendations: ProgramRecommendation[]
    proposedTrack: TrainingTrack
    executiveRecommendation: string
}

export interface TrainingTrack {
    name: string
    goal: string
    audience: string
    programIds: ProgramId[]
    order: string[]
    totalDays: number
    outcomes: string[]
    reasons: Record<ProgramId, string>
    externalSummary: string
}

export interface CostInput {
    programId: ProgramId
    days: number
    participants: number
    basePrice: number
    trainerCost: number
    hallCost: number
    hospitalityCost: number
    materialsCost: number
    transportCost: number
    accommodationCost: number
    internationalPartnerCost: number
    marginPercent: number
}

export interface CostResult {
    estimatedCost: number
    suggestedPrice: number
    marginValue: number
    lineItems: Array<{ label: string; value: number }>
    internalSummary: string
}

export interface AgencyRequest {
    id: string
    agencyName: string
    sectorId: SectorId
    requestDate: string
    status: RequestStatus
    analysis: string
    suggestedPrograms: ProgramId[]
    track: string
    cost: number
    proposal: string
    nextAction: string
}

export type GeneratedDocumentType = 'officialLetter' | 'proposal' | 'executiveSummary' | 'programCard' | 'email'
