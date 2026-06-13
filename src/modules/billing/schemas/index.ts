import { z } from 'zod'

export const invoiceStatusEnum = z.enum([
  'Draft',
  'Generated',
  'Partially Paid',
  'Paid',
  'Cancelled',
])

export const paymentModeEnum = z.enum([
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
])

export const invoiceItemSchema = z.object({
  id: z.string(),
  treatmentName: z.string().min(1, 'Treatment name is required'),
  toothNumber: z.string().min(1, 'Tooth number is required (use numbers or All)'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  amount: z.number().min(0),
})

export const paymentHistoryItemSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  paymentDate: z.string().min(1, 'Payment date is required'),
  amountPaid: z.number().min(1, 'Payment amount must be at least 1'),
  paymentMode: paymentModeEnum,
  referenceNumber: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  collectedBy: z.string().min(1, 'Collector name is required'),
})

export const invoiceFormSchema = z.object({
  patientId: z.string().min(1, 'Patient reference is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  branchName: z.string().min(1, 'Branch name is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one treatment billing item is required'),
  discount: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  tax: z.number().min(0, 'Tax cannot be negative').max(100, 'Tax cannot exceed 100%'),
  
  status: invoiceStatusEnum,
  dueDate: z.string().min(1, 'Due date is required'),
})

export type InvoiceFormSchemaType = z.infer<typeof invoiceFormSchema>

export const getEmptyInvoiceForm = (patientId = '', patientName = ''): InvoiceFormSchemaType => ({
  patientId,
  patientName,
  invoiceDate: new Date().toISOString().split('T')[0],
  branchName: 'Saket - New Delhi',
  items: [],
  discount: 0,
  tax: 18, // 18% standard GST default
  status: 'Generated',
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days due default
})
