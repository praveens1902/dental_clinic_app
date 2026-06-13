import { z } from 'zod'

export const investigationFileSchema = z.object({
  id: z.string(),
  patientId: z.string().min(1, 'Patient reference is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file location url'),
  fileType: z.enum(['Photo', 'Radiology', 'Scan'] as const),
  category: z.string().min(1, 'Category is required'),
  uploadedAt: z.string(),
  uploadedBy: z.string(),
  fileSize: z.string(),
  notes: z.string().optional().or(z.literal('')),
})

export type InvestigationFileSchemaType = z.infer<typeof investigationFileSchema>

export const INITIAL_PHOTO_CATEGORIES = [
  'Front View',
  'Upper Arch',
  'Lower Arch',
  'Left View',
  'Right View',
  'Occlusal View',
  'Other',
] as const

export const INITIAL_RADIOLOGY_TYPES = [
  'Chairside X-Ray',
  'Full Mouth X-Ray',
  'OPG',
  'CBCT',
] as const

export const INITIAL_SCAN_TYPES = [
  'STL File',
  'Scan Image',
  'Scan Report',
] as const
