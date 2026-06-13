export interface Patient {
  id: string
  patientId: string // e.g. PAT-CP-101
  patientName: string
  dateOfBirth: string // YYYY-MM-DD
  age: number
  gender: 'Male' | 'Female' | 'Other'
  mobileNumber: string
  email: string
  occupation: string
  address: string
  referralSource: string
  branchId: string
  branchName: string
  emergencyContactName: string
  emergencyContactNumber: string
  relationship: string
  createdAt: string
  updatedAt: string
  lastVisitDate?: string
  nextAppointmentDate?: string
  status: 'Active' | 'Inactive' | 'In Treatment'
}

export interface PatientDocument {
  id: string
  patientId: string
  documentType: string // e.g. "Aadhar Card", "X-Ray", "Consent Form"
  fileName: string
  fileUrl: string
  uploadedAt: string
}

export interface PatientActivity {
  id: string
  patientId: string
  activityType: string
  description: string
  performedBy: string
  createdAt: string
}
