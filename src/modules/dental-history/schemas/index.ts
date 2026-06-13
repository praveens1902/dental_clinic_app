import { z } from 'zod'

// Tooth number validation regex or rule: standard universal system (1-32) or FDI system (11-48, 51-85). Let's be lenient but validate that if provided, it's non-empty and formatted appropriately.
const toothNumberRegex = /^(?:[1-9]|[1-2][0-9]|3[0-2]|1[1-8]|2[1-8]|3[1-8]|4[1-8])(?:,\s*(?:[1-9]|[1-2][0-9]|3[0-2]|1[1-8]|2[1-8]|3[1-8]|4[1-8]))*$/

export const previousTreatmentItemSchema = z.object({
  id: z.string(),
  treatmentName: z.string(),
  hasTreatment: z.boolean(),
  treatmentDate: z.string().optional().or(z.literal('')),
  toothNumber: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.hasTreatment) {
    if (data.toothNumber && data.toothNumber.trim() !== '') {
      return toothNumberRegex.test(data.toothNumber.trim())
    }
  }
  return true
}, {
  message: "Invalid tooth number(s). Use Universal (1-32) or FDI notation (11-48) separated by commas.",
  path: ["toothNumber"]
})

export const oralHygieneSchema = z.object({
  brushingFrequency: z.enum(['Once Daily', 'Twice Daily', 'More Than Twice', ''] as const, {
    errorMap: () => ({ message: 'Please select brushing frequency' }),
  }),
  brushingMethod: z.enum(['Manual Brush', 'Electric Brush', ''] as const, {
    errorMap: () => ({ message: 'Please select brushing method' }),
  }),
  flossUsage: z.enum(['Daily', 'Occasionally', 'Never', ''] as const, {
    errorMap: () => ({ message: 'Please select floss usage' }),
  }),
  mouthwashUsage: z.enum(['Daily', 'Occasionally', 'Never', ''] as const, {
    errorMap: () => ({ message: 'Please select mouthwash usage' }),
  }),
})

export const habitItemSchema = z.object({
  id: z.string(),
  habitName: z.string(),
  hasHabit: z.boolean(),
  frequency: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.hasHabit) {
    return data.frequency && data.frequency.trim().length > 0
  }
  return true
}, {
  message: "Frequency is required when habit is marked Yes",
  path: ["frequency"]
})

export const complaintItemSchema = z.object({
  id: z.string(),
  complaintName: z.string(),
  hasComplaint: z.boolean(),
  severity: z.enum(['Mild', 'Moderate', 'Severe', ''] as const),
  duration: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export const orthodonticHistorySchema = z.object({
  previousBraces: z.boolean(),
  currentBraces: z.boolean(),
  retainers: z.boolean(),
  notes: z.string().optional().or(z.literal('')),
})

export const implantItemSchema = z.object({
  id: z.string(),
  location: z.string().min(1, 'Location/Tooth number is required'),
  date: z.string().min(1, 'Date is required'),
  implantType: z.string().min(1, 'Implant brand/type is required'),
  notes: z.string().optional().or(z.literal('')),
})

export const dentureHistorySchema = z.object({
  upperDenture: z.boolean(),
  lowerDenture: z.boolean(),
  partialDenture: z.boolean(),
  fullDenture: z.boolean(),
  dateOfPlacement: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export const dentalHistoryFormSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  treatments: z.array(previousTreatmentItemSchema),
  oralHygiene: oralHygieneSchema,
  habits: z.array(habitItemSchema),
  complaints: z.array(complaintItemSchema),
  orthodontic: orthodonticHistorySchema,
  implants: z.array(implantItemSchema),
  dentures: dentureHistorySchema,
})

export type DentalHistoryFormSchemaType = z.infer<typeof dentalHistoryFormSchema>

export const INITIAL_TREATMENT_ITEMS = [
  'Root Canal Treatment (RCT)',
  'Crown',
  'Extraction',
  'Bridge',
  'Braces / Orthodontics',
  'Scaling / Cleaning',
  'Dentures',
  'Implant',
]

export const INITIAL_HABIT_ITEMS = [
  'Smoking',
  'Tobacco Chewing',
  'Alcohol Consumption',
  'Teeth Grinding (Bruxism)',
  'Nail Biting',
  'Thumb Sucking',
  'Mouth Breathing',
  'Jaw Clenching',
]

export const INITIAL_COMPLAINT_ITEMS = [
  'Previous Pain',
  'Sensitivity',
  'Bleeding Gums',
  'Bad Breath',
  'Loose Teeth',
  'Difficulty Chewing',
  'Jaw Pain',
  'Clicking Jaw',
]

export const getEmptyDentalHistoryForm = (patientId: string): DentalHistoryFormSchemaType => ({
  patientId,
  treatments: INITIAL_TREATMENT_ITEMS.map((t, idx) => ({
    id: `tr-${idx}`,
    treatmentName: t,
    hasTreatment: false,
    treatmentDate: '',
    toothNumber: '',
    notes: '',
  })),
  oralHygiene: {
    brushingFrequency: '',
    brushingMethod: '',
    flossUsage: '',
    mouthwashUsage: '',
  },
  habits: INITIAL_HABIT_ITEMS.map((h, idx) => ({
    id: `hb-${idx}`,
    habitName: h,
    hasHabit: false,
    frequency: '',
    notes: '',
  })),
  complaints: INITIAL_COMPLAINT_ITEMS.map((c, idx) => ({
    id: `cp-${idx}`,
    complaintName: c,
    hasComplaint: false,
    severity: '',
    duration: '',
    notes: '',
  })),
  orthodontic: {
    previousBraces: false,
    currentBraces: false,
    retainers: false,
    notes: '',
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
})
