export type TreatmentStatus =
  | 'Planned'
  | 'Approved'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'

export type TreatmentPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface HistoricalTreatment {
  id: string
  patientId: string
  date: string
  toothNumber: string
  treatmentName: string
  doctorName: string
  notes: string
  status: TreatmentStatus
}

export interface TodayTreatmentItem {
  id: string
  toothNumber: string
  treatmentName: string
  materialsUsed: string
  notes: string
  duration: string
}

export interface PlannedTreatmentItem {
  id: string
  toothNumber: string
  treatmentName: string
  priority: TreatmentPriority
  estimatedSessions: number
  targetDate: string
  status: TreatmentStatus
  estimatedCost: number
  notes?: string
}

export interface FollowUpPlan {
  followUpDate: string
  followUpTime: string
  remarks: string
}

export interface ClinicalNotesSummary {
  activeDiagnosesCount: number
  affectedTeethCount: number
  pendingPlansCount: number
  latestExamDate: string | null
  primaryDoctor: string
}

export interface ClinicalTimelineItem {
  id: string
  patientId: string
  activity: string
  performedBy: string
  createdAt: string
}

export interface ClinicalNotesForm {
  patientId: string
  todayTreatments: TodayTreatmentItem[]
  plannedTreatments: PlannedTreatmentItem[]
  followUp: FollowUpPlan
  clinicalSummaryNotes?: string
}
