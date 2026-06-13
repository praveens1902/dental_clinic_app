export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | ''

export type MedicalRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

export type AllergySeverity = 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening'

export interface Medication {
  id?: string
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  notes?: string
}

export interface Allergy {
  id?: string
  allergyName: string
  severity: AllergySeverity
  reaction: string
  notes?: string
}

export interface Surgery {
  id?: string
  surgeryName: string
  date: string
  hospital?: string
  notes?: string
}

export interface MedicalConditions {
  bloodPressure: boolean
  diabetes: boolean
  asthma: boolean
  cholesterol: boolean
  thyroidDisease: boolean
  heartDisease: boolean
  kidneyDisease: boolean
  liverDisease: boolean
  pregnancy: boolean
  medicineAllergies: boolean
}

export interface MedicalVitals {
  bpReading: string
  bloodSugarLevel: string
  height: string
  weight: string
  bmi: string
  bloodGroup: string
}

export interface MedicalHistory {
  id: string
  patientId: string
  conditions: MedicalConditions
  vitals: MedicalVitals
  medications: Medication[]
  allergies: Allergy[]
  surgeries: Surgery[]
  otherConditions: string
  updatedAt: string
  updatedBy: string
}

export interface MedicalHistoryTimelineItem {
  id: string
  patientId: string
  action: string
  description: string
  performedBy: string
  createdAt: string
}

export interface MedicalHistorySummary {
  activeConditionsCount: number
  medicationsCount: number
  allergiesCount: number
  surgeriesCount: number
  riskLevel: MedicalRiskLevel
  lastUpdated: string
  updatedBy: string
}
