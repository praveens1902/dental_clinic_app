import { Patient, PatientDocument, PatientActivity } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const INITIAL_MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    patientId: 'PAT-CP-101',
    patientName: 'Kabir Malhotra',
    dateOfBirth: '1992-04-15',
    age: 34,
    gender: 'Male',
    mobileNumber: '9876543210',
    email: 'kabir.malhotra@gmail.com',
    occupation: 'Software Engineer',
    address: 'Sector 45, Gurugram, Haryana',
    referralSource: 'Practo',
    branchId: 'b1',
    branchName: 'Sirona Elite - New Delhi',
    emergencyContactName: 'Raman Malhotra',
    emergencyContactNumber: '9812345678',
    relationship: 'Father',
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-06-11T10:00:00Z',
    lastVisitDate: '2026-06-01',
    nextAppointmentDate: '2026-06-18',
    status: 'In Treatment',
  },
  {
    id: 'p2',
    patientId: 'PAT-CP-102',
    patientName: 'Riya Sen',
    dateOfBirth: '1998-09-22',
    age: 28,
    gender: 'Female',
    mobileNumber: '8765432109',
    email: 'riya.sen@yahoo.com',
    occupation: 'Content Creator',
    address: 'DLF Phase 3, Gurugram, Haryana',
    referralSource: 'Instagram',
    branchId: 'b2',
    branchName: 'Sirona Prime - Gurugram',
    emergencyContactName: 'Aarti Sen',
    emergencyContactNumber: '8712345678',
    relationship: 'Mother',
    createdAt: '2026-05-15T11:30:00Z',
    updatedAt: '2026-06-11T11:30:00Z',
    lastVisitDate: '2026-06-08',
    nextAppointmentDate: '2026-06-15',
    status: 'Active',
  },
  {
    id: 'p3',
    patientId: 'PAT-CP-103',
    patientName: 'John Miller',
    dateOfBirth: '1981-12-05',
    age: 45,
    gender: 'Male',
    mobileNumber: '7654321098',
    email: 'john.miller@gmail.com',
    occupation: 'Financial Consultant',
    address: 'Vasant Vihar, New Delhi',
    referralSource: 'Doctor Referral',
    branchId: 'b1',
    branchName: 'Sirona Elite - New Delhi',
    emergencyContactName: 'Sarah Miller',
    emergencyContactNumber: '7612345678',
    relationship: 'Wife',
    createdAt: '2026-05-20T09:00:00Z',
    updatedAt: '2026-06-11T09:00:00Z',
    lastVisitDate: '2026-05-15',
    nextAppointmentDate: '2026-06-25',
    status: 'Active',
  },
  {
    id: 'p4',
    patientId: 'PAT-CP-104',
    patientName: 'Aanya Gupta',
    dateOfBirth: '2004-01-30',
    age: 22,
    gender: 'Female',
    mobileNumber: '9543210987',
    email: 'aanya.gupta@student.du.ac.in',
    occupation: 'Student',
    address: 'Noida Sector 62, Uttar Pradesh',
    referralSource: 'Google Search',
    branchId: 'b3',
    branchName: 'Sirona Care - Noida',
    emergencyContactName: 'Amit Gupta',
    emergencyContactNumber: '9512345678',
    relationship: 'Father',
    createdAt: '2026-06-11T10:15:00Z',
    updatedAt: '2026-06-11T10:15:00Z',
    lastVisitDate: '2026-06-11',
    nextAppointmentDate: '2026-06-20',
    status: 'In Treatment',
  },
  {
    id: 'p5',
    patientId: 'PAT-CP-105',
    patientName: 'Vikram Singh',
    dateOfBirth: '1968-07-18',
    age: 58,
    gender: 'Male',
    mobileNumber: '9432109876',
    email: 'vikram.singh68@outlook.com',
    occupation: 'Retired Colonel',
    address: 'Dwarka Sector 12, Delhi',
    referralSource: 'Practo',
    branchId: 'b1',
    branchName: 'Sirona Elite - New Delhi',
    emergencyContactName: 'Inder Singh',
    emergencyContactNumber: '9412345678',
    relationship: 'Son',
    createdAt: '2026-04-30T10:00:00Z',
    updatedAt: '2026-06-11T10:00:00Z',
    lastVisitDate: '2026-04-30',
    nextAppointmentDate: undefined,
    status: 'Inactive',
  },
]

const INITIAL_MOCK_DOCUMENTS: PatientDocument[] = [
  { id: 'doc1', patientId: 'p1', documentType: 'Aadhar Card', fileName: 'aadhar_card_kabir.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: '2026-05-10T10:15:00Z' },
  { id: 'doc2', patientId: 'p1', documentType: 'Dental X-Ray (OPG)', fileName: 'opg_scan_kabir.png', fileUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop', uploadedAt: '2026-06-01T11:00:00Z' },
  { id: 'doc3', patientId: 'p2', documentType: 'Root Canal Consent', fileName: 'consent_form_riya.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: '2026-06-08T12:00:00Z' },
]

const INITIAL_MOCK_ACTIVITIES: PatientActivity[] = [
  { id: 'act1', patientId: 'p1', activityType: 'Patient Registered', description: 'Patient profile established by receptionist Rahul Sharma.', performedBy: 'Rahul Sharma', createdAt: '2026-05-10T10:00:00Z' },
  { id: 'act2', patientId: 'p1', activityType: 'Appointment Created', description: 'Scheduled scaling consultation with Dr. Ananya Iyer.', performedBy: 'Rahul Sharma', createdAt: '2026-05-10T10:10:00Z' },
  { id: 'act3', patientId: 'p1', activityType: 'Examination Completed', description: 'Tooth scaling and initial diagnostic mapping finalized.', performedBy: 'Dr. Ananya Iyer', createdAt: '2026-06-01T10:45:00Z' },
]

// Fetch state from LocalStorage or fallback to mock
const getPatients = (): Patient[] => {
  const data = localStorage.getItem('sirona_patients')
  return data ? JSON.parse(data) : INITIAL_MOCK_PATIENTS
}

const savePatients = (list: Patient[]) => {
  localStorage.setItem('sirona_patients', JSON.stringify(list))
}

const getDocuments = (): PatientDocument[] => {
  const data = localStorage.getItem('sirona_patient_docs')
  return data ? JSON.parse(data) : INITIAL_MOCK_DOCUMENTS
}

const saveDocuments = (list: PatientDocument[]) => {
  localStorage.setItem('sirona_patient_docs', JSON.stringify(list))
}

const getActivities = (): PatientActivity[] => {
  const data = localStorage.getItem('sirona_patient_acts')
  return data ? JSON.parse(data) : INITIAL_MOCK_ACTIVITIES
}

const saveActivities = (list: PatientActivity[]) => {
  localStorage.setItem('sirona_patient_acts', JSON.stringify(list))
}

export const patientService = {
  // 1. Get Patients List
  getPatients: async (): Promise<Patient[]> => {
    await delay(600)
    return getPatients()
  },

  // 2. Get Single Patient Details
  getPatientById: async (id: string): Promise<Patient> => {
    await delay(500)
    const list = getPatients()
    const p = list.find((item) => item.id === id)
    if (!p) throw new Error('Patient not found')
    return p
  },

  // 3. Create Patient
  createPatient: async (data: Omit<Patient, 'id' | 'patientId' | 'createdAt' | 'updatedAt' | 'age'>): Promise<Patient> => {
    await delay(700)
    const list = getPatients()
    
    // Auto-calculate age
    const dob = new Date(data.dateOfBirth)
    const age = new Date().getFullYear() - dob.getFullYear()
    
    const id = Math.random().toString(36).substring(2, 9)
    const patientId = `PAT-CP-${Math.floor(100 + Math.random() * 900)}`
    
    const newPatient: Patient = {
      ...data,
      id,
      patientId,
      age,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [newPatient, ...list]
    savePatients(updated)

    // Append initial activity timeline
    const acts = getActivities()
    const newAct: PatientActivity = {
      id: Math.random().toString(36).substring(2, 9),
      patientId: id,
      activityType: 'Patient Registered',
      description: `Patient profile established by active session user.`,
      performedBy: 'Active Staff Member',
      createdAt: new Date().toISOString(),
    }
    saveActivities([newAct, ...acts])

    return newPatient
  },

  // 4. Update Patient Profile
  updatePatient: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    await delay(600)
    const list = getPatients()
    const idx = list.findIndex((item) => item.id === id)
    if (idx === -1) throw new Error('Patient not found')

    const existing = list[idx]
    
    // Auto-recalculate age if DOB changed
    let age = existing.age
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth)
      age = new Date().getFullYear() - dob.getFullYear()
    }

    const updatedPatient: Patient = {
      ...existing,
      ...data,
      age,
      updatedAt: new Date().toISOString(),
    }

    list[idx] = updatedPatient
    savePatients(list)

    // Append update log activity
    const acts = getActivities()
    const newAct: PatientActivity = {
      id: Math.random().toString(36).substring(2, 9),
      patientId: id,
      activityType: 'Profile Updated',
      description: `Demographics parameters modified securely.`,
      performedBy: 'Active Staff Member',
      createdAt: new Date().toISOString(),
    }
    saveActivities([newAct, ...acts])

    return updatedPatient
  },

  // 5. Delete Patient (Soft Delete)
  deletePatient: async (id: string): Promise<boolean> => {
    await delay(500)
    const list = getPatients()
    const updated = list.filter((item) => item.id !== id)
    savePatients(updated)
    return true
  },

  // 6. Get Patient Document Manager attachments
  getDocumentsByPatientId: async (patientId: string): Promise<PatientDocument[]> => {
    await delay(400)
    const docs = getDocuments()
    return docs.filter((d) => d.patientId === patientId)
  },

  // 7. Simulated Document Upload (JPG, PNG, PDF)
  uploadDocument: async (patientId: string, documentType: string, fileName: string): Promise<PatientDocument> => {
    await delay(800)
    const docs = getDocuments()
    
    const isPdf = fileName.toLowerCase().endsWith('.pdf')
    const fileUrl = isPdf 
      ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      : 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop'

    const newDoc: PatientDocument = {
      id: Math.random().toString(36).substring(2, 9),
      patientId,
      documentType,
      fileName,
      fileUrl,
      uploadedAt: new Date().toISOString(),
    }

    saveDocuments([newDoc, ...docs])
    return newDoc
  },

  // 8. Delete document from patient vault
  deleteDocument: async (id: string): Promise<boolean> => {
    await delay(400)
    const docs = getDocuments()
    const updated = docs.filter((d) => d.id !== id)
    saveDocuments(updated)
    return true
  },

  // 9. Get Patient Specific Activity Timeline journey
  getActivitiesByPatientId: async (patientId: string): Promise<PatientActivity[]> => {
    await delay(400)
    const acts = getActivities()
    return acts.filter((a) => a.patientId === patientId)
  },
}
export default patientService
