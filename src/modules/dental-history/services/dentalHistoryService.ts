import {
  DentalHistory,
  DentalHistoryTimelineItem,
  DentalHistorySummary,
  OralHealthScoreRating,
} from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_HISTORIES: DentalHistory[] = [
  {
    id: 'dh-1',
    patientId: 'p1',
    treatments: [
      { id: 'tr-0', treatmentName: 'Root Canal Treatment (RCT)', hasTreatment: true, treatmentDate: '2025-03-15', toothNumber: '14', notes: 'Completed with ceramic crown placement' },
      { id: 'tr-1', treatmentName: 'Crown', hasTreatment: true, treatmentDate: '2025-03-22', toothNumber: '14', notes: 'High-aesthetic zirconia crown' },
      { id: 'tr-2', treatmentName: 'Extraction', hasTreatment: false, treatmentDate: '', toothNumber: '', notes: '' },
      { id: 'tr-3', treatmentName: 'Bridge', hasTreatment: false, treatmentDate: '', toothNumber: '', notes: '' },
      { id: 'tr-4', treatmentName: 'Braces / Orthodontics', hasTreatment: false, treatmentDate: '', toothNumber: '', notes: '' },
      { id: 'tr-5', treatmentName: 'Scaling / Cleaning', hasTreatment: true, treatmentDate: '2026-01-10', toothNumber: '', notes: 'Routine oral prophylaxis done' },
      { id: 'tr-6', treatmentName: 'Dentures', hasTreatment: false, treatmentDate: '', toothNumber: '', notes: '' },
      { id: 'tr-7', treatmentName: 'Implant', hasTreatment: false, treatmentDate: '', toothNumber: '', notes: '' },
    ],
    oralHygiene: {
      brushingFrequency: 'Twice Daily',
      brushingMethod: 'Electric Brush',
      flossUsage: 'Occasionally',
      mouthwashUsage: 'Daily',
    },
    habits: [
      { id: 'hb-0', habitName: 'Smoking', hasHabit: false, frequency: '', notes: '' },
      { id: 'hb-1', habitName: 'Tobacco Chewing', hasHabit: false, frequency: '', notes: '' },
      { id: 'hb-2', habitName: 'Alcohol Consumption', hasHabit: true, frequency: 'Socially, 1-2 times/week', notes: 'Moderate intake' },
      { id: 'hb-3', habitName: 'Teeth Grinding (Bruxism)', hasHabit: true, frequency: 'Nightly', notes: 'Slight attrition visible on lower anteriors' },
      { id: 'hb-4', habitName: 'Nail Biting', hasHabit: false, frequency: '', notes: '' },
      { id: 'hb-5', habitName: 'Thumb Sucking', hasHabit: false, frequency: '', notes: '' },
      { id: 'hb-6', habitName: 'Mouth Breathing', hasHabit: false, frequency: '', notes: '' },
      { id: 'hb-7', habitName: 'Jaw Clenching', hasHabit: false, frequency: '', notes: '' },
    ],
    complaints: [
      { id: 'cp-0', complaintName: 'Previous Pain', hasComplaint: false, severity: '', duration: '', notes: '' },
      { id: 'cp-1', complaintName: 'Sensitivity', hasComplaint: true, severity: 'Moderate', duration: 'Last 2 weeks', notes: 'To cold beverages' },
      { id: 'cp-2', complaintName: 'Bleeding Gums', hasComplaint: true, severity: 'Mild', duration: 'Occasionally during brushing', notes: 'Near lower molars' },
      { id: 'cp-3', complaintName: 'Bad Breath', hasComplaint: false, severity: '', duration: '', notes: '' },
      { id: 'cp-4', complaintName: 'Loose Teeth', hasComplaint: false, severity: '', duration: '', notes: '' },
      { id: 'cp-5', complaintName: 'Difficulty Chewing', hasComplaint: false, severity: '', duration: '', notes: '' },
      { id: 'cp-6', complaintName: 'Jaw Pain', hasComplaint: false, severity: '', duration: '', notes: '' },
      { id: 'cp-7', complaintName: 'Clicking Jaw', hasComplaint: false, severity: '', duration: '', notes: '' },
    ],
    orthodontic: {
      previousBraces: false,
      currentBraces: false,
      retainers: false,
      notes: 'No ortho treatment history.',
    },
    implants: [],
    dentures: {
      upperDenture: false,
      lowerDenture: false,
      partialDenture: false,
      fullDenture: false,
      dateOfPlacement: '',
      notes: '',
    },
    oralHealthScore: 78,
    updatedAt: '2026-06-11T10:30:00Z',
    updatedBy: 'Dr. Ananya Iyer',
  },
]

const INITIAL_MOCK_TIMELINE: DentalHistoryTimelineItem[] = [
  {
    id: 'dt-1',
    patientId: 'p1',
    action: 'Dental History Created',
    description: 'Initial dental history profiling established during first visit.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:30:00Z',
  },
  {
    id: 'dt-2',
    patientId: 'p1',
    action: 'Previous Treatment Updated',
    description: 'Recorded Root Canal Treatment and Crown placement on tooth #14.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:35:00Z',
  },
  {
    id: 'dt-3',
    patientId: 'p1',
    action: 'Bruxism Habit Logged',
    description: 'Identified grinding habit; nighttime grinding noted.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:42:00Z',
  },
  {
    id: 'dt-4',
    patientId: 'p1',
    action: 'Scaling Recorded',
    description: 'Scaling and polishing history logged.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-06-11T10:30:00Z',
  },
]

// --- LOCAL STORAGE HELPERS ---
const getHistories = (): DentalHistory[] => {
  const data = localStorage.getItem('sirona_dental_histories')
  return data ? JSON.parse(data) : INITIAL_MOCK_HISTORIES
}

const saveHistories = (list: DentalHistory[]) => {
  localStorage.setItem('sirona_dental_histories', JSON.stringify(list))
}

const getTimeline = (): DentalHistoryTimelineItem[] => {
  const data = localStorage.getItem('sirona_dental_timeline')
  return data ? JSON.parse(data) : INITIAL_MOCK_TIMELINE
}

const saveTimeline = (list: DentalHistoryTimelineItem[]) => {
  localStorage.setItem('sirona_dental_timeline', JSON.stringify(list))
}

// --- SCORE CALCULATOR ---
export const calculateOralHealthScore = (history: Omit<DentalHistory, 'id' | 'patientId' | 'updatedAt' | 'updatedBy' | 'oralHealthScore'>): number => {
  let score = 100

  // Oral Hygiene Assessment
  const oh = history.oralHygiene
  if (oh.brushingFrequency === 'Once Daily') score -= 10
  else if (oh.brushingFrequency === '') score -= 15

  if (oh.flossUsage === 'Occasionally') score -= 5
  else if (oh.flossUsage === 'Never') score -= 12
  else if (oh.flossUsage === '') score -= 8

  if (oh.mouthwashUsage === 'Occasionally') score -= 3
  else if (oh.mouthwashUsage === 'Never') score -= 8
  else if (oh.mouthwashUsage === '') score -= 5

  if (oh.brushingMethod === '') score -= 4

  // Habits
  history.habits.forEach((h) => {
    if (h.hasHabit) {
      if (h.habitName === 'Smoking') score -= 18
      else if (h.habitName === 'Tobacco Chewing') score -= 20
      else if (h.habitName === 'Teeth Grinding (Bruxism)') score -= 10
      else if (h.habitName === 'Alcohol Consumption') score -= 5
      else score -= 4
    }
  })

  // Complaints
  history.complaints.forEach((c) => {
    if (c.hasComplaint) {
      const modifier = c.severity === 'Severe' ? 1.5 : c.severity === 'Moderate' ? 1.2 : 1.0
      if (c.complaintName === 'Loose Teeth') score -= Math.round(18 * modifier)
      else if (c.complaintName === 'Difficulty Chewing') score -= Math.round(15 * modifier)
      else if (c.complaintName === 'Bleeding Gums') score -= Math.round(12 * modifier)
      else if (c.complaintName === 'Previous Pain' || c.complaintName === 'Jaw Pain') score -= Math.round(10 * modifier)
      else score -= Math.round(5 * modifier)
    }
  })

  return Math.max(10, Math.min(100, score))
}

export const getScoreRating = (score: number): OralHealthScoreRating => {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Poor'
}

// --- SERVICE EXPORTS ---
export const dentalHistoryService = {
  // Get dental history by patient ID
  getByPatientId: async (patientId: string): Promise<DentalHistory | null> => {
    await delay(600)
    const list = getHistories()
    const found = list.find((h) => h.patientId === patientId)
    return found || null
  },

  // Create or Update dental history
  save: async (
    patientId: string,
    data: Omit<DentalHistory, 'id' | 'patientId' | 'updatedAt' | 'updatedBy' | 'oralHealthScore'>,
    updatedBy: string = 'Active Staff Member'
  ): Promise<DentalHistory> => {
    await delay(700)
    const list = getHistories()
    const idx = list.findIndex((h) => h.patientId === patientId)

    const oralHealthScore = calculateOralHealthScore(data)
    const now = new Date().toISOString()

    // Create changes description for timeline
    let actionType = 'Dental History Updated'
    let changeDesc = 'Dental history record was updated with new clinical information.'

    if (idx === -1) {
      actionType = 'Dental History Created'
      changeDesc = 'Initial dental history record established.'
    } else {
      // Basic detection of specific events for rich timeline
      const prev = list[idx]
      const newActiveImplants = data.implants.length > prev.implants.length
      const activeTreatmentsCount = data.treatments.filter(t => t.hasTreatment).length
      const prevTreatmentsCount = prev.treatments.filter(t => t.hasTreatment).length
      const newExtraction = data.treatments.find(t => t.treatmentName === 'Extraction' && t.hasTreatment) && 
                            !prev.treatments.find(t => t.treatmentName === 'Extraction' && t.hasTreatment)
      const smokerChanged = data.habits.find(h => h.habitName === 'Smoking' && h.hasHabit) !== 
                            prev.habits.find(h => h.habitName === 'Smoking' && h.hasHabit)

      if (newActiveImplants) {
        actionType = 'Implant Added'
        changeDesc = `New dental implant entry recorded in history.`
      } else if (newExtraction) {
        actionType = 'Extraction Recorded'
        changeDesc = `History of tooth extraction registered.`
      } else if (smokerChanged) {
        actionType = 'Smoking Status Changed'
        const isSmoker = data.habits.find(h => h.habitName === 'Smoking')?.hasHabit
        changeDesc = `Smoking habit status changed to: ${isSmoker ? 'Active' : 'Non-smoker'}.`
      } else if (activeTreatmentsCount > prevTreatmentsCount) {
        actionType = 'Dental History Updated'
        changeDesc = `Previous treatments checklist updated (recorded ${activeTreatmentsCount} treatments).`
      }
    }

    if (idx >= 0) {
      const updated: DentalHistory = {
        ...list[idx],
        ...data,
        oralHealthScore,
        updatedAt: now,
        updatedBy,
      }
      list[idx] = updated
      saveHistories(list)

      // Add timeline entry
      const timeline = getTimeline()
      const newEntry: DentalHistoryTimelineItem = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        action: actionType,
        description: changeDesc,
        performedBy: updatedBy,
        createdAt: now,
      }
      saveTimeline([newEntry, ...timeline])

      return updated
    } else {
      const newHistory: DentalHistory = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        ...data,
        oralHealthScore,
        updatedAt: now,
        updatedBy,
      }
      saveHistories([...list, newHistory])

      // Add timeline entry
      const timeline = getTimeline()
      const newEntry: DentalHistoryTimelineItem = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        action: 'Dental History Created',
        description: 'Initial dental history record established.',
        performedBy: updatedBy,
        createdAt: now,
      }
      saveTimeline([newEntry, ...timeline])

      return newHistory
    }
  },

  // Get timeline for patient
  getTimelineByPatientId: async (patientId: string): Promise<DentalHistoryTimelineItem[]> => {
    await delay(400)
    const timeline = getTimeline()
    return timeline
      .filter((t) => t.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // Get summary for patient
  getSummary: async (patientId: string): Promise<DentalHistorySummary | null> => {
    await delay(500)
    const history = await dentalHistoryService.getByPatientId(patientId)
    if (!history) return null

    const previousTreatmentsCount = history.treatments.filter(t => t.hasTreatment).length
    const riskFactorsCount = history.habits.filter(h => h.hasHabit).length
    const complaintsCount = history.complaints.filter(c => c.hasComplaint).length
    const rating = getScoreRating(history.oralHealthScore)

    // Formulate a simple hygiene score summary
    const oh = history.oralHygiene
    let hygieneRating = 'Good'
    if (oh.brushingFrequency === 'Once Daily' || oh.flossUsage === 'Never') {
      hygieneRating = 'Fair'
    }
    if (oh.brushingFrequency === '' && oh.flossUsage === 'Never') {
      hygieneRating = 'Poor'
    }
    if (oh.brushingFrequency === 'Twice Daily' && oh.flossUsage === 'Daily') {
      hygieneRating = 'Excellent'
    }

    return {
      previousTreatmentsCount,
      oralHygieneRating: hygieneRating,
      riskFactorsCount,
      complaintsCount,
      overallOralHealthScore: history.oralHealthScore,
      overallOralHealthRating: rating,
      lastUpdated: history.updatedAt,
      updatedBy: history.updatedBy,
    }
  },

  // Delete dental history (soft delete)
  delete: async (patientId: string): Promise<boolean> => {
    await delay(500)
    const list = getHistories()
    const updated = list.filter((h) => h.patientId !== patientId)
    saveHistories(updated)
    return true
  },
}

export default dentalHistoryService
