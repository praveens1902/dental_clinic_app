import {
  MedicalHistory,
  MedicalHistoryTimelineItem,
  MedicalHistorySummary,
  MedicalRiskLevel,
} from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_HISTORIES: MedicalHistory[] = [
  {
    id: 'mh-1',
    patientId: 'p1',
    conditions: {
      bloodPressure: true,
      diabetes: false,
      asthma: false,
      cholesterol: true,
      thyroidDisease: false,
      heartDisease: false,
      kidneyDisease: false,
      liverDisease: false,
      pregnancy: false,
      medicineAllergies: true,
    },
    vitals: {
      bpReading: '135/88',
      bloodSugarLevel: '95',
      height: '178',
      weight: '82',
      bmi: '25.9',
      bloodGroup: 'B+',
    },
    medications: [
      {
        id: 'med-1',
        medicineName: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: 'Ongoing',
        notes: 'Take in the morning before breakfast',
      },
      {
        id: 'med-2',
        medicineName: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at night',
        duration: 'Ongoing',
        notes: 'Monitor liver enzymes every 3 months',
      },
    ],
    allergies: [
      {
        id: 'all-1',
        allergyName: 'Penicillin',
        severity: 'Severe',
        reaction: 'Rash, difficulty breathing, swelling',
        notes: 'Avoid all penicillin-derived antibiotics',
      },
    ],
    surgeries: [
      {
        id: 'sur-1',
        surgeryName: 'Appendectomy',
        date: '2015-08-12',
        hospital: 'Max Super Speciality Hospital',
        notes: 'Laparoscopic procedure, uneventful recovery',
      },
    ],
    otherConditions: 'Occasional migraines triggered by stress. No other significant medical history.',
    updatedAt: '2026-06-11T10:30:00Z',
    updatedBy: 'Dr. Ananya Iyer',
  },
  {
    id: 'mh-2',
    patientId: 'p2',
    conditions: {
      bloodPressure: false,
      diabetes: false,
      asthma: true,
      cholesterol: false,
      thyroidDisease: false,
      heartDisease: false,
      kidneyDisease: false,
      liverDisease: false,
      pregnancy: false,
      medicineAllergies: false,
    },
    vitals: {
      bpReading: '118/76',
      bloodSugarLevel: '88',
      height: '165',
      weight: '58',
      bmi: '21.3',
      bloodGroup: 'O+',
    },
    medications: [
      {
        id: 'med-3',
        medicineName: 'Salbutamol Inhaler',
        dosage: '100mcg',
        frequency: 'As needed',
        duration: 'Ongoing',
        notes: 'Use during asthma attacks',
      },
    ],
    allergies: [],
    surgeries: [],
    otherConditions: '',
    updatedAt: '2026-06-11T11:15:00Z',
    updatedBy: 'Dr. Ananya Iyer',
  },
]

const INITIAL_MOCK_TIMELINE: MedicalHistoryTimelineItem[] = [
  {
    id: 'mt-1',
    patientId: 'p1',
    action: 'Medical History Created',
    description: 'Initial medical history record established during first visit.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:30:00Z',
  },
  {
    id: 'mt-2',
    patientId: 'p1',
    action: 'Condition Updated',
    description: 'Blood Pressure and Cholesterol conditions marked as positive.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:35:00Z',
  },
  {
    id: 'mt-3',
    patientId: 'p1',
    action: 'Allergy Added',
    description: 'Penicillin allergy recorded with Severe classification.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:40:00Z',
  },
  {
    id: 'mt-4',
    patientId: 'p1',
    action: 'Medication Updated',
    description: 'Amlodipine and Atorvastatin added to current medications.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:45:00Z',
  },
  {
    id: 'mt-5',
    patientId: 'p2',
    action: 'Medical History Created',
    description: 'Initial medical history record established.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-15T11:15:00Z',
  },
  {
    id: 'mt-6',
    patientId: 'p2',
    action: 'Condition Updated',
    description: 'Asthma condition marked as positive.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-15T11:20:00Z',
  },
  {
    id: 'mt-7',
    patientId: 'p2',
    action: 'Medication Added',
    description: 'Salbutamol Inhaler added to current medications.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-15T11:25:00Z',
  },
]

// --- LOCAL STORAGE HELPERS ---
const getHistories = (): MedicalHistory[] => {
  const data = localStorage.getItem('sirona_medical_histories')
  return data ? JSON.parse(data) : INITIAL_MOCK_HISTORIES
}

const saveHistories = (list: MedicalHistory[]) => {
  localStorage.setItem('sirona_medical_histories', JSON.stringify(list))
}

const getTimeline = (): MedicalHistoryTimelineItem[] => {
  const data = localStorage.getItem('sirona_medical_timeline')
  return data ? JSON.parse(data) : INITIAL_MOCK_TIMELINE
}

const saveTimeline = (list: MedicalHistoryTimelineItem[]) => {
  localStorage.setItem('sirona_medical_timeline', JSON.stringify(list))
}

// --- RISK LEVEL CALCULATOR ---
const calculateRiskLevel = (history: MedicalHistory): MedicalRiskLevel => {
  const { conditions } = history
  let riskScore = 0

  if (conditions.heartDisease) riskScore += 4
  if (conditions.kidneyDisease) riskScore += 4
  if (conditions.liverDisease) riskScore += 3
  if (conditions.pregnancy) riskScore += 3
  if (conditions.diabetes) riskScore += 3
  if (conditions.bloodPressure) riskScore += 2
  if (conditions.asthma) riskScore += 2
  if (conditions.thyroidDisease) riskScore += 2
  if (conditions.cholesterol) riskScore += 1
  if (conditions.medicineAllergies) riskScore += 1

  if (history.surgeries.length > 0) riskScore += 1
  if (history.medications.length > 2) riskScore += 1

  if (riskScore >= 7) return 'Critical'
  if (riskScore >= 4) return 'High'
  if (riskScore >= 2) return 'Medium'
  return 'Low'
}

// --- BMI CALCULATOR ---
const calculateBMI = (heightCm: string, weightKg: string): string => {
  const h = parseFloat(heightCm)
  const w = parseFloat(weightKg)
  if (!h || !w || h <= 0 || w <= 0) return ''
  const bmi = w / ((h / 100) * (h / 100))
  return bmi.toFixed(1)
}

// --- SERVICE EXPORTS ---
export const medicalHistoryService = {
  // Get medical history by patient ID
  getByPatientId: async (patientId: string): Promise<MedicalHistory | null> => {
    await delay(600)
    const list = getHistories()
    const found = list.find((h) => h.patientId === patientId)
    return found || null
  },

  // Create or Update medical history
  save: async (
    patientId: string,
    data: Omit<MedicalHistory, 'id' | 'patientId' | 'updatedAt' | 'updatedBy'>,
    updatedBy: string = 'Active Staff Member'
  ): Promise<MedicalHistory> => {
    await delay(700)
    const list = getHistories()
    const idx = list.findIndex((h) => h.patientId === patientId)

    // Calculate BMI if height and weight provided
    const vitals = { ...data.vitals }
    if (vitals.height && vitals.weight) {
      vitals.bmi = calculateBMI(vitals.height, vitals.weight)
    }

    const now = new Date().toISOString()

    if (idx >= 0) {
      // Update existing
      const updated: MedicalHistory = {
        ...list[idx],
        ...data,
        vitals,
        updatedAt: now,
        updatedBy,
      }
      list[idx] = updated
      saveHistories(list)

      // Add timeline entry
      const timeline = getTimeline()
      const newEntry: MedicalHistoryTimelineItem = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        action: 'Medical History Updated',
        description: 'Medical history record was updated with new information.',
        performedBy: updatedBy,
        createdAt: now,
      }
      saveTimeline([newEntry, ...timeline])

      return updated
    } else {
      // Create new
      const newHistory: MedicalHistory = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        ...data,
        vitals,
        updatedAt: now,
        updatedBy,
      }
      saveHistories([...list, newHistory])

      // Add timeline entry
      const timeline = getTimeline()
      const newEntry: MedicalHistoryTimelineItem = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        action: 'Medical History Created',
        description: 'Initial medical history record established.',
        performedBy: updatedBy,
        createdAt: now,
      }
      saveTimeline([newEntry, ...timeline])

      return newHistory
    }
  },

  // Get timeline for patient
  getTimelineByPatientId: async (patientId: string): Promise<MedicalHistoryTimelineItem[]> => {
    await delay(400)
    const timeline = getTimeline()
    return timeline
      .filter((t) => t.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // Get summary for patient
  getSummary: async (patientId: string): Promise<MedicalHistorySummary | null> => {
    await delay(500)
    const history = await medicalHistoryService.getByPatientId(patientId)
    if (!history) return null

    const activeConditionsCount = Object.values(history.conditions).filter(Boolean).length

    return {
      activeConditionsCount,
      medicationsCount: history.medications.length,
      allergiesCount: history.allergies.length,
      surgeriesCount: history.surgeries.length,
      riskLevel: calculateRiskLevel(history),
      lastUpdated: history.updatedAt,
      updatedBy: history.updatedBy,
    }
  },

  // Delete medical history (soft delete)
  delete: async (patientId: string): Promise<boolean> => {
    await delay(500)
    const list = getHistories()
    const updated = list.filter((h) => h.patientId !== patientId)
    saveHistories(updated)
    return true
  },

  // Helper: get condition label mapping
  getConditionLabels: (): Record<string, string> => ({
    bloodPressure: 'Blood Pressure',
    diabetes: 'Diabetes',
    asthma: 'Asthma',
    cholesterol: 'Cholesterol',
    thyroidDisease: 'Thyroid Disease',
    heartDisease: 'Heart Disease',
    kidneyDisease: 'Kidney Disease',
    liverDisease: 'Liver Disease',
    pregnancy: 'Pregnancy',
    medicineAllergies: 'Medicine Allergies',
  }),
}

export default medicalHistoryService
