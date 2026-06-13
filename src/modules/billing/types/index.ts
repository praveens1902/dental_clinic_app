export type InvoiceStatus =
  | 'Draft'
  | 'Generated'
  | 'Partially Paid'
  | 'Paid'
  | 'Cancelled'

export type PaymentMode =
  | 'Cash'
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Bank Transfer'

export interface InvoiceItem {
  id: string
  treatmentName: string
  toothNumber: string
  quantity: number
  unitCost: number
  amount: number
}

export interface PaymentHistoryItem {
  id: string
  invoiceId: string
  paymentDate: string
  amountPaid: number
  paymentMode: PaymentMode
  referenceNumber?: string
  notes?: string
  collectedBy: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  patientId: string
  patientName: string
  branchName: string
  items: InvoiceItem[]
  totalAmount: number
  discount: number // percentage, e.g. 10 for 10%
  tax: number // percentage, e.g. 18 for 18% (GST)
  netAmount: number
  amountPaid: number
  balanceAmount: number
  status: InvoiceStatus
  payments: PaymentHistoryItem[]
  dueDate: string
}

export interface BillingDashboardSummary {
  totalRevenue: number
  revenueToday: number
  revenueMonth: number
  outstandingAmount: number
  pendingInvoicesCount: number
  paymentsTodayCount: number
  collectionRate: number
  outstandingRate: number
}
