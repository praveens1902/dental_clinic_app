import { ExaminationTab } from './components/ExaminationTab'
export { ExaminationTab }
export { ExaminationSkeleton } from './components/ExaminationSkeleton'
export { InteractiveOdontogram } from './components/InteractiveOdontogram'
export { Tooth } from './components/Tooth'
export { ToothDetailsDrawer } from './components/ToothDetailsDrawer'
export { ChiefComplaintSection } from './components/ChiefComplaintSection'
export { ClinicalFindingsSection } from './components/ClinicalFindingsSection'
export { DiagnosisManager } from './components/DiagnosisManager'
export { TreatmentRecommendationManager } from './components/TreatmentRecommendationManager'
export type {
  ToothCondition,
  ToothSurfaces,
  ToothState,
  ClinicalFindings,
  DiagnosisSeverity,
  DiagnosisItem,
  RecommendationPriority,
  RecommendationItem,
  ClinicalStatusBadgeType,
  ExaminationStatus,
  Examination,
  ExaminationTimelineItem,
  ExaminationSummary,
} from './types'
export {
  toothConditionEnum,
  toothSurfacesSchema,
  toothStateSchema,
  clinicalFindingsSchema,
  diagnosisItemSchema,
  recommendationItemSchema,
  examinationFormSchema,
  ADULT_TEETH_UPPER,
  ADULT_TEETH_LOWER,
  CHILD_TEETH_UPPER,
  CHILD_TEETH_LOWER,
  ALL_TEETH_NUMBERS,
  getEmptyToothState,
  getEmptyExaminationForm,
} from './schemas'
export type { ExaminationFormSchemaType } from './schemas'
export { examinationService } from './services/examinationService'
export default ExaminationTab
