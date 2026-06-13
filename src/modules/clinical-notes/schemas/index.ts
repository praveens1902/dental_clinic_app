import { z } from 'zod'

export const todayTreatmentItemSchema = z.object({
  id: z.string(),
  toothNumber: z.string().min(1, 'Tooth number/reference is required'),
  treatmentName: z.string().min(1, 'Treatment name is required'),
  materialsUsed: z.string().optional().or(z.literal('')),
  notes: z.string().min(1, 'Treatment notes are required for procedures completed today'),
  duration: z.string().min(1, 'Estimated duration is required (e.g. 30 mins)'),
})

export const plannedTreatmentItemSchema = z.object({
  id: z.string(),
  toothNumber: z.string().min(1, 'Tooth number/reference is required'),
  treatmentName: z.string().min(1, 'Planned treatment name is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent'] as const),
  estimatedSessions: z.number().min(1, 'Must plan at least 1 session'),
  targetDate: z.string().min(1, 'Target date is required'),
  status: z.enum(['Planned', 'Approved', 'In Progress', 'Completed', 'Cancelled'] as const),
  estimatedCost: z.number().min(0, 'Estimated cost cannot be negative'),
  notes: z.string().optional().or(z.literal('')),
})

export const followUpPlanSchema = z.object({
  followUpDate: z.string().optional().or(z.literal('')),
  followUpTime: z.string().optional().or(z.literal('')),
  remarks: z.string().optional().or(z.literal('')),
})

export const clinicalNotesFormSchema = z.object({
  patientId: z.string().min(1, 'Patient reference is required'),
  todayTreatments: z.array(todayTreatmentItemSchema),
  plannedTreatments: z.array(plannedTreatmentItemSchema),
  followUp: followUpPlanSchema,
  clinicalSummaryNotes: z.string().optional().or(z.literal('')),
}).refine((data) => {
  // If today's treatments array is populated, we require notes to be non-empty. This is already handled by todayTreatmentItemSchema.notes min(1).
  // But let's require at least one action: either today's treatments, a future treatment plan, or a general note!
  return data.todayTreatments.length > 0 || data.plannedTreatments.length > 0 || (data.clinicalSummaryNotes && data.clinicalSummaryNotes.trim() !== '')
}, {
  message: "At least one clinical entry (treatment today, planned future treatment, or clinical summary note) is required.",
  path: ["clinicalSummaryNotes"]
})

export type ClinicalNotesFormSchemaType = z.infer<typeof clinicalNotesFormSchema>

export const CLINICAL_TEMPLATES = [
  {
    name: 'Scaling & Polishing',
    materials: 'Ultrasonic scaler, fluoride prophylaxis paste, polishing cup',
    notes: 'Generalized scaling and root planing completed. Removed subgingival calculus near lower anteriors. Applied topical fluoride varnish. Patient advised on flossing technique.',
    duration: '30 mins',
  },
  {
    name: 'Composite Cavity Filling',
    materials: 'Composite resin (A2 shade), bonding agent, etching gel, matrix band',
    notes: 'Administered local infiltration anesthesia (2% Lignocaine). Excised dental caries. Cleaned cavity preparation and etched enamel/dentin. Applied bond and light-cured. Incremental composite packing, occlusion adjustments, and polish complete.',
    duration: '45 mins',
  },
  {
    name: 'Root Canal Therapy (RCT)',
    materials: 'Sodium hypochlorite irrigant, RC Prep, Gutta-percha points, AH Plus sealer, Cavit temp',
    notes: 'Infiltration anesthesia complete. Excavated access cavity. Located canals, determined working lengths. Biomechanical preparation completed with rotary files. Canals thoroughly irrigated, dried, obturated with Gutta-percha and sealer. Placed temporary Cavit seal. Scheduled for permanent crown.',
    duration: '60 mins',
  },
  {
    name: 'Simple Tooth Extraction',
    materials: 'Surgical gauze, suture thread (optional), local anesthetic',
    notes: 'Administered local blocks. Elevated gingival attachment. Successfully extracted tooth atraumatically using forceps. Curetted socket, verified hemostasis. Placed sterile pressure gauze. Post-extraction warnings and care instruction sheet issued to patient.',
    duration: '30 mins',
  },
  {
    name: 'Crown Preparation & Impression',
    materials: 'Alginate impression powder, polyvinyl siloxane (PVS) heavy/light body, temporary cement',
    notes: 'Prepared tooth abutment for full zirconia crown coverage. Refined shoulder margins. Captured dual-arch rubber-base PVS impressions. Fabricated and cemented acrylic temporary crown with Temp-Bond. Transmitted files to laboratory.',
    duration: '45 mins',
  },
  {
    name: 'Surgical Implant Placement',
    materials: 'Titanium dental implant fixture, sterile physiological saline, cover screw',
    notes: 'Prepared sterile surgical field. Raised mucoperiosteal flap. Prepared osteotomy site sequentially under cool irrigation. Threaded titanium implant fixture successfully securing 35 Ncm primary stability. Placed cover screw, approximated margins with sutures. Radiograph confirms position.',
    duration: '90 mins',
  },
]

export const getEmptyClinicalNotesForm = (patientId: string): ClinicalNotesFormSchemaType => ({
  patientId,
  todayTreatments: [],
  plannedTreatments: [],
  followUp: {
    followUpDate: '',
    followUpTime: '',
    remarks: '',
  },
  clinicalSummaryNotes: '',
})
