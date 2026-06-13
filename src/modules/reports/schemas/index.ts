import { z } from 'zod'

export const globalFilterSchema = z.object({
  dateFrom: z.string().min(1, 'Start Date is required'),
  dateTo: z.string().min(1, 'End Date is required'),
  branchName: z.string().default('All'),
  doctorName: z.string().default('All'),
  treatmentType: z.string().default('All'),
  status: z.string().default('All'),
})

export type GlobalFilterSchemaType = z.infer<typeof globalFilterSchema>

export const getEmptyGlobalFilter = (): GlobalFilterSchemaType => ({
  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago default
  dateTo: new Date().toISOString().split('T')[0], // Today
  branchName: 'All',
  doctorName: 'All',
  treatmentType: 'All',
  status: 'All',
})
