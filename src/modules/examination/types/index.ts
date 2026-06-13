export type ToothCondition =
  | 'Healthy'
  | 'Caries'
  | 'Decay'
  | 'Fracture'
  | 'Missing'
  | 'Filled'
  | 'Crown'
  | 'Bridge'
  | 'Implant'
  | 'Root Canal Treated'
  | 'Mobility'
  | 'Sensitivity'
  | 'Impacted'
  | 'Wear'
  | 'Stain'
  | 'Extraction Recommended'

export interface ToothSurfaces {
  mesial: boolean
  distal: boolean
  occlusal: boolean
  buccal: boolean
  lingual: boolean
}

export interface ToothState {
  toothNumber: number
  condition: ToothCondition
  surfaces: ToothSurfaces
  findings?: string
  diagnosis?: string
  recommendedTreatment?: string
  notes?: string
}

export interface ClinicalFindings {
  softTissue?: string
  gingival?: string
  periodontal?: string
  oralHygiene?: string
  occlusion?: string
  tmj?: string
}

export type DiagnosisSeverity = 'Mild' | 'Moderate' | 'Severe'

export interface DiagnosisItem {
  id: string
  diagnosisName: string
  category: string
  severity: DiagnosisSeverity
  notes?: string
}

export type RecommendationPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface RecommendationItem {
  id: string
  toothNumber: string // e.g., "14", "All", "16, 17"
  treatmentName: string
  priority: RecommendationPriority
  estimatedCost: number
  notes?: string
}

export type ClinicalStatusBadgeType =
  | 'Healthy'
  | 'Observation'
  | 'Requires Treatment'
  | 'Urgent'
  | 'Completed'

export type ExaminationStatus = 'Draft' | 'Completed'

export interface Examination {
  id: string
  patientId: string
  chiefComplaint: string
  teeth: Record<number, ToothState>
  findings: ClinicalFindings
  diagnoses: DiagnosisItem[]
  recommendations: RecommendationItem[]
  status: ExaminationStatus
  updatedAt: string
  updatedBy: string
}

export interface ExaminationTimelineItem {
  id: string
  patientId: string
  date: string
  doctorName: string
  summary: string
  chiefComplaint: string
  affectedTeethCount: number
}

export interface ExaminationSummary {
  totalAffectedTeeth: number
  diagnosesCount: number
  recommendedTreatmentsCount: number
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  clinicalStatus: ClinicalStatusBadgeType
}
