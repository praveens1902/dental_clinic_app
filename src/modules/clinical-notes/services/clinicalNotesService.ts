import {
  HistoricalTreatment,
  PlannedTreatmentItem,
  ClinicalNotesSummary,
  ClinicalTimelineItem,
} from '../types'
import { examinationService } from '@/modules/examination/services/examinationService'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK HISTORICAL TREATMENTS ---
const INITIAL_MOCK_HISTORY: HistoricalTreatment[] = [
  {
    id: 'ht-1',
    patientId: 'p1',
    date: '2026-01-10T11:30:00Z',
    toothNumber: 'All',
    treatmentName: 'Scaling & Oral Prophylaxis',
    doctorName: 'Dr. Ananya Iyer',
    notes: 'Generalized scaling, polishing with fluoridated pumice. Instructed patient on flossing.',
    status: 'Completed',
  },
  {
    id: 'ht-2',
    patientId: 'p1',
    date: '2025-06-15T10:00:00Z',
    toothNumber: '36',
    treatmentName: 'Composite Cavity Filling',
    doctorName: 'Dr. Ananya Iyer',
    notes: 'Occlusal micro-cavitation. Restored with shade A2 composite. Occlusion check clear.',
    status: 'Completed',
  },
  {
    id: 'ht-3',
    patientId: 'p1',
    date: '2025-04-12T09:15:00Z',
    toothNumber: '48',
    treatmentName: 'Simple Tooth Extraction',
    doctorName: 'Dr. Ananya Iyer',
    notes: 'Symptomatic semi-impacted lower right third molar extraction. Atraumatic elevator luxury. Smooth socket healing.',
    status: 'Completed',
  },
]

// --- INITIAL MOCK PLANNED TREATMENTS ---
const INITIAL_MOCK_PLANS: PlannedTreatmentItem[] = [
  {
    id: 'pl-1',
    toothNumber: '14',
    treatmentName: 'Root Canal Treatment (RCT)',
    priority: 'Urgent',
    estimatedSessions: 2,
    targetDate: '2026-06-25',
    status: 'In Progress',
    estimatedCost: 6500,
    notes: 'Access opened on 2026-06-12. Canal working lengths determined.',
  },
  {
    id: 'pl-2',
    toothNumber: '14',
    treatmentName: 'Zirconia Crown Placement',
    priority: 'High',
    estimatedSessions: 1,
    targetDate: '2026-07-10',
    status: 'Planned',
    estimatedCost: 12000,
    notes: 'Post-RCT core buildup and tooth preparation.',
  },
  {
    id: 'pl-3',
    toothNumber: 'All',
    treatmentName: 'Deep Scaling and root planing',
    priority: 'Medium',
    estimatedSessions: 1,
    targetDate: '2026-08-01',
    status: 'Approved',
    estimatedCost: 2000,
    notes: 'Treat mild plaque stagnation near lower incisor linguals.',
  },
]

// --- INITIAL MOCK CLINICAL TIMELINE ---
const INITIAL_MOCK_TIMELINE: ClinicalTimelineItem[] = [
  {
    id: 'clt-1',
    patientId: 'p1',
    activity: 'Treatment Started: Root Canal Treatment on Tooth #14 (Access cavity opened)',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-06-12T14:40:00Z',
  },
  {
    id: 'clt-2',
    patientId: 'p1',
    activity: 'Treatment Planned: Crown placement on Tooth #14',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-06-11T10:35:00Z',
  },
  {
    id: 'clt-3',
    patientId: 'p1',
    activity: 'Initial Examination Completed: Severe pain on bicuspid #14 recorded.',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:45:00Z',
  },
]

// --- LOCAL STORAGE DATA SYNC ---
const getHistory = (): HistoricalTreatment[] => {
  const data = localStorage.getItem('sirona_clinical_history')
  return data ? JSON.parse(data) : INITIAL_MOCK_HISTORY
}

const saveHistory = (list: HistoricalTreatment[]) => {
  localStorage.setItem('sirona_clinical_history', JSON.stringify(list))
}

const getPlans = (): PlannedTreatmentItem[] => {
  const data = localStorage.getItem('sirona_clinical_plans')
  return data ? JSON.parse(data) : INITIAL_MOCK_PLANS
}

const savePlans = (list: PlannedTreatmentItem[]) => {
  localStorage.setItem('sirona_clinical_plans', JSON.stringify(list))
}

const getTimeline = (): ClinicalTimelineItem[] => {
  const data = localStorage.getItem('sirona_clinical_timeline')
  return data ? JSON.parse(data) : INITIAL_MOCK_TIMELINE
}

const saveTimeline = (list: ClinicalTimelineItem[]) => {
  localStorage.setItem('sirona_clinical_timeline', JSON.stringify(list))
}

// --- CLINICAL SERVICE ---
export const clinicalNotesService = {
  // Retrieve history & plans for patient p1
  getHistoryByPatientId: async (patientId: string): Promise<HistoricalTreatment[]> => {
    await delay(400)
    const list = getHistory()
    return list.filter((h) => h.patientId === patientId)
  },

  getPlansByPatientId: async (_patientId: string): Promise<PlannedTreatmentItem[]> => {
    await delay(400)
    const list = getPlans()
    return list // Mock simplified patient sync
  },

  // Save clinical notes sheet (submits today's treatments and updates plans)
  save: async (
    patientId: string,
    data: {
      todayTreatments: { toothNumber: string; treatmentName: string; materialsUsed: string; notes: string; duration: string }[]
      plannedTreatments: PlannedTreatmentItem[]
      clinicalSummaryNotes?: string
    },
    updatedBy: string = 'Dr. Ananya Iyer'
  ): Promise<boolean> => {
    await delay(800)
    const now = new Date().toISOString()

    // 1. Commit today's treatments into permanent Historical Treatment Database
    if (data.todayTreatments.length > 0) {
      const historyList = getHistory()
      const timelineList = getTimeline()

      data.todayTreatments.forEach((today) => {
        const newHist: HistoricalTreatment = {
          id: Math.random().toString(36).substring(2, 9),
          patientId,
          date: now,
          toothNumber: today.toothNumber,
          treatmentName: today.treatmentName,
          doctorName: updatedBy,
          notes: today.notes,
          status: 'Completed',
        }
        historyList.unshift(newHist)

        // Log to timeline
        const newTimelineEvent: ClinicalTimelineItem = {
          id: Math.random().toString(36).substring(2, 9),
          patientId,
          activity: `Treatment Completed: ${today.treatmentName} on Tooth #${today.toothNumber}`,
          performedBy: updatedBy,
          createdAt: now,
        }
        timelineList.unshift(newTimelineEvent)
      })

      saveHistory(historyList)
      saveTimeline(timelineList)
    }

    // 2. Commit future treatment plan states
    const plansList = getPlans()
    // Simple mock overwrite to simulate planning updates
    savePlans(data.plannedTreatments)

    // Log timeline event for new plans
    if (data.plannedTreatments.length > plansList.length) {
      const timelineList = getTimeline()
      const newPlan = data.plannedTreatments[data.plannedTreatments.length - 1]
      const newTimelineEvent: ClinicalTimelineItem = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        activity: `Treatment Planned: ${newPlan.treatmentName} on Tooth #${newPlan.toothNumber} (Priority: ${newPlan.priority})`,
        performedBy: updatedBy,
        createdAt: now,
      }
      timelineList.unshift(newTimelineEvent)
      saveTimeline(timelineList)
    }

    return true
  },

  // Fetch chronological clinical timeline items
  getTimelineByPatientId: async (patientId: string): Promise<ClinicalTimelineItem[]> => {
    await delay(300)
    const list = getTimeline()
    return list.filter((t) => t.patientId === patientId)
  },

  // Calculate clinical stats dynamically from examination module link!
  getSummary: async (patientId: string): Promise<ClinicalNotesSummary> => {
    await delay(500)
    const exam = await examinationService.getByPatientId(patientId)
    const plans = getPlans()

    const activeDiagnosesCount = exam?.diagnoses.length || 2 // fallback if no exam
    const affectedTeethCount = exam ? Object.values(exam.teeth).filter(t => t.condition !== 'Healthy').length : 1
    const pendingPlansCount = plans.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled').length

    return {
      activeDiagnosesCount,
      affectedTeethCount,
      pendingPlansCount,
      latestExamDate: exam ? exam.updatedAt : '2026-06-11T10:30:00Z',
      primaryDoctor: 'Dr. Ananya Iyer',
    }
  },
}

export default clinicalNotesService
