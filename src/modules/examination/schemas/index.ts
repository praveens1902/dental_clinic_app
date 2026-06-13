import { z } from 'zod'

export const toothConditionEnum = z.enum([
  'Healthy',
  'Caries',
  'Decay',
  'Fracture',
  'Missing',
  'Filled',
  'Crown',
  'Bridge',
  'Implant',
  'Root Canal Treated',
  'Mobility',
  'Sensitivity',
  'Impacted',
  'Wear',
  'Stain',
  'Extraction Recommended',
] as const)

export const toothSurfacesSchema = z.object({
  mesial: z.boolean(),
  distal: z.boolean(),
  occlusal: z.boolean(),
  buccal: z.boolean(),
  lingual: z.boolean(),
})

export const toothStateSchema = z.object({
  toothNumber: z.number(),
  condition: toothConditionEnum,
  surfaces: toothSurfacesSchema,
  findings: z.string().optional().or(z.literal('')),
  diagnosis: z.string().optional().or(z.literal('')),
  recommendedTreatment: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export const clinicalFindingsSchema = z.object({
  softTissue: z.string().optional().or(z.literal('')),
  gingival: z.string().optional().or(z.literal('')),
  periodontal: z.string().optional().or(z.literal('')),
  oralHygiene: z.string().optional().or(z.literal('')),
  occlusion: z.string().optional().or(z.literal('')),
  tmj: z.string().optional().or(z.literal('')),
})

export const diagnosisItemSchema = z.object({
  id: z.string(),
  diagnosisName: z.string().min(1, 'Diagnosis name is required'),
  category: z.string().min(1, 'Category is required'),
  severity: z.enum(['Mild', 'Moderate', 'Severe'] as const),
  notes: z.string().optional().or(z.literal('')),
})

export const recommendationItemSchema = z.object({
  id: z.string(),
  toothNumber: z.string().min(1, 'Tooth number is required (e.g. 14, 21, All)'),
  treatmentName: z.string().min(1, 'Treatment is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent'] as const),
  estimatedCost: z.number().min(0, 'Estimated cost cannot be negative'),
  notes: z.string().optional().or(z.literal('')),
})

export const examinationFormSchema = z.object({
  patientId: z.string().min(1, 'Patient reference is required'),
  chiefComplaint: z.string().min(1, 'Chief Complaint is required'),
  teeth: z.record(z.string(), toothStateSchema), // key is tooth number as string, value is state
  findings: clinicalFindingsSchema,
  diagnoses: z.array(diagnosisItemSchema),
  recommendations: z.array(recommendationItemSchema),
  status: z.enum(['Draft', 'Completed'] as const),
}).refine((data) => {
  // REQUIRE: At least one clinical finding or tooth condition modification or diagnosis
  const hasModifiedTeeth = Object.values(data.teeth).some(t => t.condition !== 'Healthy')
  const hasAnyFindingsText = Object.values(data.findings).some(f => f && f.trim() !== '')
  const hasDiagnoses = data.diagnoses.length > 0
  return hasModifiedTeeth || hasAnyFindingsText || hasDiagnoses
}, {
  message: "At least one clinical finding, affected tooth condition, or diagnosis is required to save an examination.",
  path: ["findings"] // path to show the error
})

export type ExaminationFormSchemaType = z.infer<typeof examinationFormSchema>

// List of teeth numbers
export const ADULT_TEETH_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
export const ADULT_TEETH_LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

export const CHILD_TEETH_UPPER = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65]
export const CHILD_TEETH_LOWER = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]

export const ALL_TEETH_NUMBERS = [
  ...ADULT_TEETH_UPPER,
  ...ADULT_TEETH_LOWER,
  ...CHILD_TEETH_UPPER,
  ...CHILD_TEETH_LOWER,
]

export const getEmptyToothState = (num: number): z.infer<typeof toothStateSchema> => ({
  toothNumber: num,
  condition: 'Healthy',
  surfaces: {
    mesial: false,
    distal: false,
    occlusal: false,
    buccal: false,
    lingual: false,
  },
  findings: '',
  diagnosis: '',
  recommendedTreatment: '',
  notes: '',
})

export const getEmptyExaminationForm = (patientId: string): ExaminationFormSchemaType => {
  const teethRecords: Record<string, z.infer<typeof toothStateSchema>> = {}
  ALL_TEETH_NUMBERS.forEach((num) => {
    teethRecords[num.toString()] = getEmptyToothState(num)
  })

  return {
    patientId,
    chiefComplaint: '',
    teeth: teethRecords,
    findings: {
      softTissue: '',
      gingival: '',
      periodontal: '',
      oralHygiene: '',
      occlusion: '',
      tmj: '',
    },
    diagnoses: [],
    recommendations: [],
    status: 'Draft',
  }
}
