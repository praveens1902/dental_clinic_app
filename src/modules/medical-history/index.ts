export { MedicalHistoryTab } from './components/MedicalHistoryTab'
export { MedicalRiskIndicator, calculateRiskFromHistory } from './components/MedicalRiskIndicator'
export { MedicationManager } from './components/MedicationManager'
export { AllergyManager } from './components/AllergyManager'
export { SurgeryManager } from './components/SurgeryManager'
export { MedicalTimelineViewer } from './components/MedicalTimelineViewer'
export { MedicalHistorySummaryCard } from './components/MedicalHistorySummaryCard'
export { MedicalConditionsSection } from './components/MedicalConditionsSection'
export { MedicalVitalsSection } from './components/MedicalVitalsSection'
export { MedicalHistorySkeleton } from './components/MedicalHistorySkeleton'
export type {
  BloodGroup,
  MedicalRiskLevel,
  AllergySeverity,
  Medication,
  Allergy,
  Surgery,
  MedicalConditions,
  MedicalVitals,
  MedicalHistory,
  MedicalHistoryTimelineItem,
  MedicalHistorySummary,
} from './types'
export {
  medicalHistoryFormSchema,
  medicationItemSchema,
  allergyItemSchema,
  surgeryItemSchema,
  EMPTY_MEDICAL_HISTORY_FORM,
} from './schemas'
export type { MedicalHistoryFormSchemaType } from './schemas'
export { medicalHistoryService } from './services/medicalHistoryService'
