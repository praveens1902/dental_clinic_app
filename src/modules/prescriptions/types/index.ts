export interface MedicineItem {
  id: string
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface FollowUpPlan {
  followUpDate?: string
  followUpTime?: string
  remarks?: string
  status?: 'Pending' | 'Scheduled' | 'Completed'
}

export interface Prescription {
  id: string
  patientId: string
  prescriptionDate: string
  doctorName: string
  medications: MedicineItem[]
  notes?: string
  additionalInstructions?: string
  followUp?: FollowUpPlan
  status: 'Draft' | 'Finalized'
  updatedAt: string
}

export interface PrescriptionTimelineItem {
  id: string
  patientId: string
  activity: string
  performedBy: string
  createdAt: string
}

export interface PrescriptionSummary {
  activePrescriptionsCount: number
  followUpDate: string | null
  treatingDoctor: string
  lastPrescriptionDate: string | null
}
