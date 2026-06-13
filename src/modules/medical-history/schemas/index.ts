import { z } from 'zod'

export const medicationItemSchema = z.object({
  id: z.string().optional(),
  medicineName: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  notes: z.string().optional(),
})

export const allergyItemSchema = z.object({
  id: z.string().optional(),
  allergyName: z.string().min(1, 'Allergy name is required'),
  severity: z.enum(['Mild', 'Moderate', 'Severe', 'Life-Threatening'] as const, {
    errorMap: () => ({ message: 'Please select severity level' }),
  }),
  reaction: z.string().min(1, 'Reaction description is required'),
  notes: z.string().optional(),
})

export const surgeryItemSchema = z.object({
  id: z.string().optional(),
  surgeryName: z.string().min(1, 'Surgery name is required'),
  date: z.string().min(1, 'Surgery date is required'),
  hospital: z.string().optional(),
  notes: z.string().optional(),
})

export const conditionsSchema = z.object({
  bloodPressure: z.boolean(),
  diabetes: z.boolean(),
  asthma: z.boolean(),
  cholesterol: z.boolean(),
  thyroidDisease: z.boolean(),
  heartDisease: z.boolean(),
  kidneyDisease: z.boolean(),
  liverDisease: z.boolean(),
  pregnancy: z.boolean(),
  medicineAllergies: z.boolean(),
})

export const vitalsSchema = z.object({
  bpReading: z.string(),
  bloodSugarLevel: z.string(),
  height: z.string(),
  weight: z.string(),
  bmi: z.string(),
  bloodGroup: z.string(),
})

export const medicalHistoryFormSchema = z.object({
  conditions: conditionsSchema,
  vitals: vitalsSchema,
  medications: z.array(medicationItemSchema),
  allergies: z.array(allergyItemSchema),
  surgeries: z.array(surgeryItemSchema),
  otherConditions: z.string().optional(),
})

export type MedicalHistoryFormSchemaType = {
  conditions: z.infer<typeof conditionsSchema>
  vitals: z.infer<typeof vitalsSchema>
  medications: z.infer<typeof medicationItemSchema>[]
  allergies: z.infer<typeof allergyItemSchema>[]
  surgeries: z.infer<typeof surgeryItemSchema>[]
  otherConditions?: string
}

export const EMPTY_MEDICAL_HISTORY_FORM: MedicalHistoryFormSchemaType = {
  conditions: {
    bloodPressure: false,
    diabetes: false,
    asthma: false,
    cholesterol: false,
    thyroidDisease: false,
    heartDisease: false,
    kidneyDisease: false,
    liverDisease: false,
    pregnancy: false,
    medicineAllergies: false,
  },
  vitals: {
    bpReading: '',
    bloodSugarLevel: '',
    height: '',
    weight: '',
    bmi: '',
    bloodGroup: '',
  },
  medications: [],
  allergies: [],
  surgeries: [],
  otherConditions: '',
}
