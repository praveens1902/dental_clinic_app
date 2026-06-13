import {
  Examination,
  ExaminationTimelineItem,
  ExaminationSummary,
  ClinicalStatusBadgeType,
} from '../types'
import { getEmptyExaminationForm } from '../schemas'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK EXAMINATIONS ---
const INITIAL_MOCK_EXAMINATIONS: Examination[] = [
  {
    id: 'ex-1',
    patientId: 'p1',
    chiefComplaint: 'Severe tooth pain in the upper left back tooth on biting, sensitive to cold.',
    teeth: {
      // We only override the teeth that are not healthy to keep mock file size reasonable,
      // but in memory/localStorage we always fill all 32 + child teeth.
      // Below we initialize tooth #14 with Caries/Decay
      14: {
        toothNumber: 14,
        condition: 'Caries',
        surfaces: { mesial: true, distal: false, occlusal: true, buccal: false, lingual: false },
        findings: 'Deep cavitated dental caries involving mesio-occlusal surfaces.',
        diagnosis: 'Symptomatic Irreversible Pulpitis, Tooth #14',
        recommendedTreatment: 'Root Canal Treatment (RCT) + Crown',
        notes: 'Advised immediate intervention to relieve pain.',
      },
      // Tooth #18 is missing
      18: {
        toothNumber: 18,
        condition: 'Missing',
        surfaces: { mesial: false, distal: false, occlusal: false, buccal: false, lingual: false },
        findings: 'Congenitally missing or extracted previously.',
        diagnosis: 'Partial Edentulism',
        recommendedTreatment: 'Observation',
        notes: 'Asymptomatic.',
      },
    },
    findings: {
      softTissue: 'No ulcerations or lesions detected on buccal mucosa, palate, or tongue.',
      gingival: 'Mild generalized marginal gingivitis with bleeding on probing near lower anteriors.',
      periodontal: 'No deep pockets detected. Generalized pocket depths within 2-3mm limits.',
      oralHygiene: 'Fair. Moderate plaque accumulation noted on the lingual surfaces of lower incisors.',
      occlusion: 'Class I Angle bilateral molar relationship. Normal overbite and overjet.',
      tmj: 'Normal range of jaw movement. No joint clicking, crepitus, or muscular tenderness observed.',
    },
    diagnoses: [
      {
        id: 'diag-1',
        diagnosisName: 'Symptomatic Irreversible Pulpitis (#14)',
        category: 'Endodontics',
        severity: 'Severe',
        notes: 'Associated with deep dentinal caries on MO surfaces.',
      },
      {
        id: 'diag-2',
        diagnosisName: 'Mild Generalized Gingivitis',
        category: 'Periodontics',
        severity: 'Mild',
        notes: 'Requires scaling and hygiene instruction reinforcement.',
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        toothNumber: '14',
        treatmentName: 'Root Canal Treatment (RCT)',
        priority: 'Urgent',
        estimatedCost: 6500,
        notes: 'Rotary RCT under local anesthesia.',
      },
      {
        id: 'rec-2',
        toothNumber: '14',
        treatmentName: 'Zirconia Crown Placement',
        priority: 'High',
        estimatedCost: 12000,
        notes: 'Following successful obturation and core buildup.',
      },
      {
        id: 'rec-3',
        toothNumber: 'All',
        treatmentName: 'Scaling & Oral Prophylaxis',
        priority: 'Medium',
        estimatedCost: 1500,
        notes: 'Reinforce brushing and flossing frequency.',
      },
    ],
    status: 'Draft',
    updatedAt: '2026-06-12T14:45:00Z',
    updatedBy: 'Dr. Ananya Iyer',
  },
]

// --- INITIAL MOCK TIMELINE ---
const INITIAL_MOCK_TIMELINE: ExaminationTimelineItem[] = [
  {
    id: 'ext-1',
    patientId: 'p1',
    date: '2026-01-10T11:00:00Z',
    doctorName: 'Dr. Ananya Iyer',
    summary: 'Routine dental examination and scaling completed. Teeth are stable, oral hygiene is good.',
    chiefComplaint: 'Routine check-up and teeth cleaning.',
    affectedTeethCount: 0,
  },
  {
    id: 'ext-2',
    patientId: 'p1',
    date: '2025-06-15T09:30:00Z',
    doctorName: 'Dr. Ananya Iyer',
    summary: 'Composite filling done on tooth #36. Restored occlusal anatomy. Patient asymptomatic.',
    chiefComplaint: 'Food lodgement in lower left molar.',
    affectedTeethCount: 1,
  },
]

// --- LOCAL STORAGE DATA SYNC ---
const getExaminations = (): Examination[] => {
  const data = localStorage.getItem('sirona_examinations')
  if (!data) {
    // Inject full 32 teeth skeleton into mock draft to ensure no empty gaps
    const base = INITIAL_MOCK_EXAMINATIONS[0]
    const fullForm = getEmptyExaminationForm('p1')
    
    // Merge the custom mock states over the empty structure
    const mergedTeeth = { ...fullForm.teeth }
    Object.keys(base.teeth).forEach((numStr) => {
      const num = parseInt(numStr)
      mergedTeeth[num] = {
        ...mergedTeeth[num],
        ...base.teeth[num],
      }
    })

    const completeExam: Examination = {
      ...base,
      teeth: mergedTeeth,
    }
    localStorage.setItem('sirona_examinations', JSON.stringify([completeExam]))
    return [completeExam]
  }
  return JSON.parse(data)
}

const saveExaminations = (list: Examination[]) => {
  localStorage.setItem('sirona_examinations', JSON.stringify(list))
}

const getTimeline = (): ExaminationTimelineItem[] => {
  const data = localStorage.getItem('sirona_examination_timeline')
  return data ? JSON.parse(data) : INITIAL_MOCK_TIMELINE
}

const saveTimeline = (list: ExaminationTimelineItem[]) => {
  localStorage.setItem('sirona_examination_timeline', JSON.stringify(list))
}

// --- SCORE & METRIC BUILDER ---
const calculateMetrics = (exam: Examination): ExaminationSummary => {
  // Count affected teeth (where condition is not Healthy)
  const affectedTeeth = Object.values(exam.teeth).filter(t => t.condition !== 'Healthy')
  const totalAffectedTeeth = affectedTeeth.length

  const diagnosesCount = exam.diagnoses.length
  const recommendedTreatmentsCount = exam.recommendations.length

  // Calculate clinical risk and status
  let clinicalStatus: ClinicalStatusBadgeType = 'Healthy'
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low'

  const hasUrgentRec = exam.recommendations.some(r => r.priority === 'Urgent')
  const hasHighRec = exam.recommendations.some(r => r.priority === 'High')
  const hasSevereDiag = exam.diagnoses.some(d => d.severity === 'Severe')

  if (hasUrgentRec || hasSevereDiag) {
    clinicalStatus = 'Urgent'
    riskLevel = 'Critical'
  } else if (hasHighRec || totalAffectedTeeth >= 3) {
    clinicalStatus = 'Requires Treatment'
    riskLevel = 'High'
  } else if (totalAffectedTeeth > 0 || exam.recommendations.length > 0) {
    clinicalStatus = 'Observation'
    riskLevel = 'Medium'
  }

  if (exam.status === 'Completed' && totalAffectedTeeth === 0) {
    clinicalStatus = 'Completed'
    riskLevel = 'Low'
  }

  return {
    totalAffectedTeeth,
    diagnosesCount,
    recommendedTreatmentsCount,
    riskLevel,
    clinicalStatus,
  }
}

// --- EXPORTED CLINICAL SERVICE ---
export const examinationService = {
  // Retrieve examination for patient
  getByPatientId: async (patientId: string): Promise<Examination | null> => {
    await delay(600)
    const list = getExaminations()
    const found = list.find((e) => e.patientId === patientId)
    return found || null
  },

  // Save/Update examination (handles drafts vs finalized records)
  save: async (
    patientId: string,
    data: Omit<Examination, 'id' | 'patientId' | 'updatedAt' | 'updatedBy'>,
    updatedBy: string = 'Active Practitioner'
  ): Promise<Examination> => {
    await delay(800)
    const list = getExaminations()
    const idx = list.findIndex((e) => e.patientId === patientId)
    const now = new Date().toISOString()

    if (idx >= 0) {
      // Update existing
      const existing = list[idx]
      const updated: Examination = {
        ...existing,
        ...data,
        updatedAt: now,
        updatedBy,
      }
      list[idx] = updated
      saveExaminations(list)

      // If finalized/Completed, log a permanent event to history timeline
      if (data.status === 'Completed' && existing.status !== 'Completed') {
        const timeline = getTimeline()
        const affectedTeethCount = Object.values(data.teeth).filter(t => t.condition !== 'Healthy').length
        const newTimelineEvent: ExaminationTimelineItem = {
          id: Math.random().toString(36).substring(2, 9),
          patientId,
          date: now,
          doctorName: updatedBy,
          summary: `Examination finalized. Diagnosed ${data.diagnoses.length} conditions, proposed ${data.recommendations.length} treatments.`,
          chiefComplaint: data.chiefComplaint,
          affectedTeethCount,
        }
        saveTimeline([newTimelineEvent, ...timeline])
      }

      return updated
    } else {
      // Create new
      const newExam: Examination = {
        id: Math.random().toString(36).substring(2, 9),
        patientId,
        ...data,
        updatedAt: now,
        updatedBy,
      }
      saveExaminations([...list, newExam])

      if (data.status === 'Completed') {
        const timeline = getTimeline()
        const affectedTeethCount = Object.values(data.teeth).filter(t => t.condition !== 'Healthy').length
        const newTimelineEvent: ExaminationTimelineItem = {
          id: Math.random().toString(36).substring(2, 9),
          patientId,
          date: now,
          doctorName: updatedBy,
          summary: `Initial clinical examination finalized.`,
          chiefComplaint: data.chiefComplaint,
          affectedTeethCount,
        }
        saveTimeline([newTimelineEvent, ...timeline])
      }

      return newExam
    }
  },

  // Fetch chronological examination logs
  getTimelineByPatientId: async (patientId: string): Promise<ExaminationTimelineItem[]> => {
    await delay(400)
    const list = getTimeline()
    return list
      .filter((t) => t.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  // Calculate dashboard summary statistics
  getSummary: async (patientId: string): Promise<ExaminationSummary | null> => {
    await delay(500)
    const exam = await examinationService.getByPatientId(patientId)
    if (!exam) return null
    return calculateMetrics(exam)
  },

  // Quick diagnosis autocomplete templates
  getDiagnosisSuggestions: (): string[] => [
    'Symptomatic Irreversible Pulpitis',
    'Reversible Pulpitis',
    'Deep Dentinal Caries',
    'Enamel Caries / Incipient Caries',
    'Chronic Generalized Periodontitis',
    'Localized Periodontitis',
    'Impacted Mandibular Third Molar',
    'Severe Attrition',
    'Incisal Fracture due to Trauma',
    'Gingival Recession Class I',
    'Apical Periodontitis',
    'Periapical Abscess without Sinus',
  ],

  // Diagnostic Category choices
  getDiagnosisCategories: (): string[] => [
    'Endodontics',
    'Restorative Dentistry',
    'Periodontics',
    'Oral Surgery',
    'Prosthodontics',
    'Orthodontics',
    'Oral Medicine & Diagnosis',
  ],

  // Treatment suggestion checklist
  getTreatmentSuggestions: (): string[] => [
    'Scaling & Oral Prophylaxis',
    'Root Canal Treatment (RCT)',
    'Composite Restorational Filling',
    'Glass Ionomer Cement (GIC) Restorative',
    'Zirconia Crown Placement',
    'PFM Crown Placement',
    'Simple Extraction',
    'Surgical Impacted Tooth Extraction',
    'Dental Implant Placement',
    'Bridge (3-Unit Porcelain)',
    'Fiber Post & Core Buildup',
    'Direct Pulp Capping',
    'Invisalign / Clear Aligners',
    'Night Guard Splint Fabrication',
  ],

  // Chief complaints templates
  getChiefComplaintTemplates: (): string[] => [
    'Sharp, throbbing pain in back tooth that worsens at night.',
    'Intense sensitivity to hot and cold foods/beverages.',
    'Bleeding from gums during daily brushing and flossing.',
    'A loose or mobile tooth that causes discomfort on chewing.',
    'A chipped/broken front tooth due to accidental biting.',
    'Persistent bad breath and metallic taste in the mouth.',
    'Clicking sound and mild stiffness in the jaw joint.',
    'Missing teeth; would like to discuss crowns or implants.',
    'Routine dental screening, scan, and general teeth scale/cleaning.',
  ],
}

export default examinationService
