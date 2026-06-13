import { z } from 'zod'

export const medicineItemSchema = z.object({
  id: z.string(),
  medicineName: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage level is required (e.g. 500 mg, 1 Tablet)'),
  frequency: z.string().min(1, 'Dosage frequency is required (e.g. Once Daily, Twice Daily)'),
  duration: z.string().min(1, 'Duration is required (e.g. 5 Days, 14 Days)'),
  instructions: z.string().optional().or(z.literal('')),
})

export const followUpSchema = z.object({
  followUpDate: z.string().optional().or(z.literal('')),
  followUpTime: z.string().optional().or(z.literal('')),
  remarks: z.string().optional().or(z.literal('')),
})

export const prescriptionFormSchema = z.object({
  patientId: z.string().min(1, 'Patient reference is required'),
  prescriptionDate: z.string().min(1, 'Prescription date is required'),
  doctorName: z.string().min(1, 'Doctor name is required'),
  notes: z.string().optional().or(z.literal('')),
  additionalInstructions: z.string().optional().or(z.literal('')),
  medications: z.array(medicineItemSchema).min(1, 'At least one medication is required to build a prescription'),
  followUp: followUpSchema,
  status: z.enum(['Draft', 'Finalized'] as const),
})

export type PrescriptionFormSchemaType = z.infer<typeof prescriptionFormSchema>

export const INITIAL_PRESCRIPTION_TEMPLATES = [
  {
    category: 'Antibiotics Course',
    notes: 'Prescribed for systemic prophylactic infection prevention.',
    medications: [
      {
        medicineName: 'Amoxicillin 500mg',
        dosage: '1 Capsule',
        frequency: 'Three Times Daily',
        duration: '5 Days',
        instructions: 'Take after meals. Complete full course.',
      },
      {
        medicineName: 'Metronidazole 400mg',
        dosage: '1 Tablet',
        frequency: 'Three Times Daily',
        duration: '5 Days',
        instructions: 'Take after meals. Avoid alcohol.',
      },
    ],
  },
  {
    category: 'Pain Relief (Analgesics)',
    notes: 'For moderate postoperative discomfort management.',
    medications: [
      {
        medicineName: 'Ketorolac DT 10mg',
        dosage: '1 Tablet',
        frequency: 'As Needed',
        duration: '3 Days',
        instructions: 'Dissolve tablet in half glass water. Do not exceed 3 tablets/day.',
      },
      {
        medicineName: 'Paracetamol 650mg',
        dosage: '1 Tablet',
        frequency: 'Three Times Daily',
        duration: '3 Days',
        instructions: 'Take after meals.',
      },
    ],
  },
  {
    category: 'Anti-Inflammatory Care',
    notes: 'Prescribed to reduce localized facial or gingival swelling.',
    medications: [
      {
        medicineName: 'Serratiopeptidase 10mg',
        dosage: '1 Tablet',
        frequency: 'Twice Daily',
        duration: '5 Days',
        instructions: 'Take after breakfast and dinner.',
      },
      {
        medicineName: 'Ibuprofen 400mg',
        dosage: '1 Tablet',
        frequency: 'Three Times Daily',
        duration: '5 Days',
        instructions: 'Take with food/milk to avoid gastric irritation.',
      },
    ],
  },
  {
    category: 'Intra-Oral Mouthwash',
    notes: 'Topical antibacterial rinse protocol.',
    medications: [
      {
        medicineName: 'Chlorhexidine Gluconate 0.2% Mouthwash',
        dosage: '10 ml',
        frequency: 'Twice Daily',
        duration: '14 Days',
        instructions: 'Rinse mouth for 30 seconds after brushing, then spit out. Do not swallow.',
      },
    ],
  },
  {
    category: 'Post Extraction Protocol',
    notes: 'Standard therapeutic combination following complex wisdom extractions.',
    medications: [
      {
        medicineName: 'Amoxicillin + Clavulanate 625mg (Augmentin)',
        dosage: '1 Tablet',
        frequency: 'Twice Daily',
        duration: '5 Days',
        instructions: 'Take with meals.',
      },
      {
        medicineName: 'Aceclofenac 100mg + Paracetamol 325mg (Zerodol-P)',
        dosage: '1 Tablet',
        frequency: 'Twice Daily',
        duration: '3 Days',
        instructions: 'Take after meals for pain relief.',
      },
      {
        medicineName: 'Pantoprazole 40mg',
        dosage: '1 Tablet',
        frequency: 'Once Daily',
        duration: '5 Days',
        instructions: 'Take 30 minutes before breakfast (empty stomach).',
      },
    ],
  },
  {
    category: 'Root Canal Treatment (RCT) Routine',
    notes: 'Prescribed during active acute flareups to manage pulpitis swelling.',
    medications: [
      {
        medicineName: 'Amoxicillin 500mg',
        dosage: '1 Capsule',
        frequency: 'Three Times Daily',
        duration: '5 Days',
        instructions: 'Take after meals.',
      },
      {
        medicineName: 'Zerodol-SP (Aceclofenac + Serratiopeptidase + Paracetamol)',
        dosage: '1 Tablet',
        frequency: 'Twice Daily',
        duration: '5 Days',
        instructions: 'Excellent anti-inflammatory/pain reliever. Take after food.',
      },
    ],
  },
]

export const DRUG_DATABASE_SUGGESTIONS = [
  'Amoxicillin 500mg',
  'Metronidazole 400mg',
  'Ketorolac DT 10mg',
  'Paracetamol 650mg',
  'Ibuprofen 400mg',
  'Serratiopeptidase 10mg',
  'Chlorhexidine Gluconate 0.2% Mouthwash',
  'Augmentin 625mg (Amoxicillin + Clavulanic Acid)',
  'Zerodol-P (Aceclofenac + Paracetamol)',
  'Zerodol-SP (Aceclofenac + Serratiopeptidase + Paracetamol)',
  'Pantoprazole 40mg',
  'Ofloxacin 200mg + Ornidazole 500mg',
  'Clindamycin 300mg',
  'Chymoral Forte',
]

export const getEmptyPrescriptionForm = (patientId: string): PrescriptionFormSchemaType => ({
  patientId,
  prescriptionDate: new Date().toISOString().split('T')[0],
  doctorName: 'Dr. Ananya Iyer',
  notes: '',
  additionalInstructions: '',
  medications: [],
  followUp: {
    followUpDate: '',
    followUpTime: '',
    remarks: '',
  },
  status: 'Draft',
})
