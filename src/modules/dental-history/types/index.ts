export type BrushingFrequency = 'Once Daily' | 'Twice Daily' | 'More Than Twice' | ''
export type BrushingMethod = 'Manual Brush' | 'Electric Brush' | ''
export type FlossUsage = 'Daily' | 'Occasionally' | 'Never' | ''
export type MouthwashUsage = 'Daily' | 'Occasionally' | 'Never' | ''

export type SeverityLevel = 'Mild' | 'Moderate' | 'Severe' | ''

export interface PreviousTreatmentItem {
  id: string
  treatmentName: string
  hasTreatment: boolean
  treatmentDate?: string
  toothNumber?: string
  notes?: string
}

export interface OralHygieneAssessment {
  brushingFrequency: BrushingFrequency
  brushingMethod: BrushingMethod
  flossUsage: FlossUsage
  mouthwashUsage: MouthwashUsage
}

export interface HabitItem {
  id: string
  habitName: string
  hasHabit: boolean
  frequency?: string
  notes?: string
}

export interface ComplaintItem {
  id: string
  complaintName: string
  hasComplaint: boolean
  severity: SeverityLevel
  duration?: string
  notes?: string
}

export interface OrthodonticHistory {
  previousBraces: boolean
  currentBraces: boolean
  retainers: boolean
  notes?: string
}

export interface ImplantItem {
  id: string
  location: string
  date: string
  implantType: string
  notes?: string
}

export interface DentureHistory {
  upperDenture: boolean
  lowerDenture: boolean
  partialDenture: boolean
  fullDenture: boolean
  dateOfPlacement?: string
  notes?: string
}

export type OralHealthScoreRating = 'Excellent' | 'Good' | 'Fair' | 'Poor'

export interface DentalHistory {
  id: string
  patientId: string
  treatments: PreviousTreatmentItem[]
  oralHygiene: OralHygieneAssessment
  habits: HabitItem[]
  complaints: ComplaintItem[]
  orthodontic: OrthodonticHistory
  implants: ImplantItem[]
  dentures: DentureHistory
  oralHealthScore: number // 0 to 100
  updatedAt: string
  updatedBy: string
}

export interface DentalHistoryTimelineItem {
  id: string
  patientId: string
  action: string
  description: string
  performedBy: string
  createdAt: string
}

export interface DentalHistorySummary {
  previousTreatmentsCount: number
  oralHygieneRating: string
  riskFactorsCount: number
  complaintsCount: number
  overallOralHealthScore: number
  overallOralHealthRating: OralHealthScoreRating
  lastUpdated: string
  updatedBy: string
}
