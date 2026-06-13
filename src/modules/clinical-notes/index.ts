import { ClinicalNotesTab } from './components/ClinicalNotesTab'
export { ClinicalNotesTab }
export { ClinicalNotesSkeleton } from './components/ClinicalNotesSkeleton'
export { TreatmentHistoryTable } from './components/TreatmentHistoryTable'
export { TreatmentDoneTodayManager } from './components/TreatmentDoneTodayManager'
export { TreatmentPlanningManager } from './components/TreatmentPlanningManager'
export { CostEstimationSection } from './components/CostEstimationSection'
export { FollowUpPlanner } from './components/FollowUpPlanner'
export { ClinicalTimelineViewer } from './components/ClinicalTimelineViewer'
export type {
  TreatmentStatus,
  TreatmentPriority,
  HistoricalTreatment,
  TodayTreatmentItem,
  PlannedTreatmentItem,
  FollowUpPlan,
  ClinicalNotesSummary,
  ClinicalTimelineItem,
  ClinicalNotesForm,
} from './types'
export {
  todayTreatmentItemSchema,
  plannedTreatmentItemSchema,
  followUpPlanSchema,
  clinicalNotesFormSchema,
  CLINICAL_TEMPLATES,
  getEmptyClinicalNotesForm,
} from './schemas'
export type { ClinicalNotesFormSchemaType } from './schemas'
export { clinicalNotesService } from './services/clinicalNotesService'
export default ClinicalNotesTab
