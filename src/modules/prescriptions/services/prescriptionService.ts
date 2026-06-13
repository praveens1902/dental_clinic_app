import {
  Prescription,
  PrescriptionTimelineItem,
  PrescriptionSummary,
} from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'pr-1',
    patientId: 'p1',
    prescriptionDate: '2026-05-10',
    doctorName: 'Dr. Ananya Iyer',
    medications: [
      {
        id: 'm-1',
        medicineName: 'Amoxicillin 500mg',
        dosage: '1 Capsule',
        frequency: 'Three Times Daily',
        duration: '5 Days',
        instructions: 'Take after meals. Complete full course.',
      },
      {
        id: 'm-2',
        medicineName: 'Metronidazole 400mg',
        dosage: '1 Tablet',
        frequency: 'Three Times Daily',
        duration: '5 Days',
        instructions: 'Take after meals. Avoid alcohol.',
      },
    ],
    notes: 'Post-extraction therapeutic antibacterial coverage.',
    additionalInstructions: 'Rinse with warm salt water after 24 hours. Eat soft food.',
    followUp: {
      followUpDate: '2026-05-15',
      followUpTime: '11:00',
      remarks: 'Scheduled for socket evaluation and suture removal.',
      status: 'Completed',
    },
    status: 'Finalized',
    updatedAt: '2026-05-10T10:45:00Z',
  },
  {
    id: 'pr-2',
    patientId: 'p1',
    prescriptionDate: '2026-01-10',
    doctorName: 'Dr. Ananya Iyer',
    medications: [
      {
        id: 'm-3',
        medicineName: 'Ketorolac DT 10mg',
        dosage: '1 Tablet',
        frequency: 'As Needed',
        duration: '3 Days',
        instructions: 'Dissolve tablet in half glass water.',
      },
    ],
    notes: 'Analgesics for postoperative scaling soreness.',
    additionalInstructions: 'Avoid very hot or cold beverages for 24 hours.',
    status: 'Finalized',
    updatedAt: '2026-01-10T11:45:00Z',
  },
]

const INITIAL_MOCK_TIMELINE: PrescriptionTimelineItem[] = [
  {
    id: 'prt-1',
    patientId: 'p1',
    activity: 'Prescription Printed: Post-extraction Amoxicillin course packet',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:50:00Z',
  },
  {
    id: 'prt-2',
    patientId: 'p1',
    activity: 'Prescription Created: Amoxicillin and Metronidazole course mapped',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:45:00Z',
  },
  {
    id: 'prt-3',
    patientId: 'p1',
    activity: 'Follow-Up Added: Suture check scheduled for 2026-05-15',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:46:00Z',
  },
]

// --- LOCAL STORAGE DATA SYNC ---
const getPrescriptions = (): Prescription[] => {
  const data = localStorage.getItem('sirona_prescriptions')
  return data ? JSON.parse(data) : INITIAL_MOCK_PRESCRIPTIONS
}

const savePrescriptions = (list: Prescription[]) => {
  localStorage.setItem('sirona_prescriptions', JSON.stringify(list))
}

const getTimeline = (): PrescriptionTimelineItem[] => {
  const data = localStorage.getItem('sirona_prescription_timeline')
  return data ? JSON.parse(data) : INITIAL_MOCK_TIMELINE
}

const saveTimeline = (list: PrescriptionTimelineItem[]) => {
  localStorage.setItem('sirona_prescription_timeline', JSON.stringify(list))
}

// --- PRESCRIPTION CLINICAL SERVICE ---
export const prescriptionService = {
  // Fetch prescription list for patient
  getByPatientId: async (patientId: string): Promise<Prescription[]> => {
    await delay(400)
    const list = getPrescriptions()
    return list.filter((p) => p.patientId === patientId)
  },

  // Save/Finalize a prescription
  save: async (
    patientId: string,
    data: Omit<Prescription, 'id' | 'patientId' | 'updatedAt'>,
    updatedBy: string = 'Dr. Ananya Iyer'
  ): Promise<Prescription> => {
    await delay(700)
    const list = getPrescriptions()
    const now = new Date().toISOString()

    const newPrescription: Prescription = {
      id: Math.random().toString(36).substring(2, 9),
      patientId,
      ...data,
      updatedAt: now,
    }

    // Unshift to list (newest first)
    savePrescriptions([newPrescription, ...list])

    // Log to Timeline
    const timeline = getTimeline()
    const newTimelineEvent: PrescriptionTimelineItem = {
      id: Math.random().toString(36).substring(2, 9),
      patientId,
      activity: data.status === 'Finalized' 
        ? `Prescription Finalized: Issued ${data.medications.length} medicines`
        : `Prescription Draft Saved: ${data.medications.length} medicines cached`,
      performedBy: updatedBy,
      createdAt: now,
    }
    
    const secondTimelineEvent: PrescriptionTimelineItem[] = []
    if (data.followUp && data.followUp.followUpDate) {
      secondTimelineEvent.push({
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        activity: `Follow-Up Scheduled: Recurrence visit planned on ${data.followUp.followUpDate}`,
        performedBy: updatedBy,
        createdAt: now,
      })
    }

    saveTimeline([...secondTimelineEvent, newTimelineEvent, ...timeline])

    return newPrescription
  },

  // Delete a prescription draft
  delete: async (id: string): Promise<boolean> => {
    await delay(500)
    const list = getPrescriptions()
    const filtered = list.filter((p) => p.id !== id)
    savePrescriptions(filtered)
    return true
  },

  // Log print timelines
  logPrint: async (patientId: string, prescriptionName: string, performedBy: string = 'Dr. Ananya Iyer') => {
    const timeline = getTimeline()
    const newEntry: PrescriptionTimelineItem = {
      id: Math.random().toString(36).substring(2, 9),
      patientId,
      activity: `Prescription Printed: Saved copy of ${prescriptionName}`,
      performedBy,
      createdAt: new Date().toISOString(),
    }
    saveTimeline([newEntry, ...timeline])
  },

  // Fetch chronological timeline entries
  getTimelineByPatientId: async (patientId: string): Promise<PrescriptionTimelineItem[]> => {
    await delay(300)
    const timeline = getTimeline()
    return timeline
      .filter((t) => t.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // Calculate prescription metrics
  getSummary: async (patientId: string): Promise<PrescriptionSummary> => {
    await delay(400)
    const list = await prescriptionService.getByPatientId(patientId)
    const finalized = list.filter((p) => p.status === 'Finalized')

    const lastPres = finalized.length > 0 ? finalized[0] : null
    const followUp = lastPres?.followUp?.followUpDate ? lastPres.followUp.followUpDate : null

    return {
      activePrescriptionsCount: finalized.length,
      followUpDate: followUp,
      treatingDoctor: lastPres ? lastPres.doctorName : 'Dr. Ananya Iyer',
      lastPrescriptionDate: lastPres ? lastPres.prescriptionDate : null,
    }
  },
}

export default prescriptionService
