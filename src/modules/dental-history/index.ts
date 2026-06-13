import { DentalHistoryTab } from './components/DentalHistoryTab'
export { DentalHistoryTab }
export { DentalHistorySkeleton } from './components/DentalHistorySkeleton'
export { PreviousTreatmentSection } from './components/PreviousTreatmentSection'
export { OralHygieneSection } from './components/OralHygieneSection'
export { HabitsRiskFactorsSection } from './components/HabitsRiskFactorsSection'
export { ComplaintHistorySection } from './components/ComplaintHistorySection'
export { SpecialtyHistorySection } from './components/SpecialtyHistorySection'
export { OralHealthScore } from './components/OralHealthScore'
export { DentalHistorySummaryCard } from './components/DentalHistorySummaryCard'
export { DentalTimelineViewer } from './components/DentalTimelineViewer'
export type {
  BrushingFrequency,
  BrushingMethod,
  FlossUsage,
  MouthwashUsage,
  SeverityLevel,
  PreviousTreatmentItem,
  OralHygieneAssessment,
  HabitItem,
  ComplaintItem,
  OrthodonticHistory,
  ImplantItem,
  DentureHistory,
  OralHealthScoreRating,
  DentalHistory,
  DentalHistoryTimelineItem,
  DentalHistorySummary,
} from './types'
export {
  dentalHistoryFormSchema,
  previousTreatmentItemSchema,
  oralHygieneSchema,
  habitItemSchema,
  complaintItemSchema,
  orthodonticHistorySchema,
  implantItemSchema,
  dentureHistorySchema,
  getEmptyDentalHistoryForm,
} from './schemas'
export type { DentalHistoryFormSchemaType } from './schemas'
export { dentalHistoryService } from './services/dentalHistoryService'
export default DentalHistoryTab
