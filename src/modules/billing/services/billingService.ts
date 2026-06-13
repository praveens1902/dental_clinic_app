import { Invoice, InvoiceItem, PaymentHistoryItem, BillingDashboardSummary, InvoiceStatus, PaymentMode } from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '2026-06-11',
    patientId: 'p1',
    patientName: 'Aarav Mehta',
    branchName: 'Saket - New Delhi',
    items: [
      { id: 'item-1', treatmentName: 'Root Canal Treatment (RCT)', toothNumber: '14', quantity: 1, unitCost: 6500, amount: 6500 },
      { id: 'item-2', treatmentName: 'Zirconia Crown Placement', toothNumber: '14', quantity: 1, unitCost: 12000, amount: 12000 },
    ],
    totalAmount: 18500,
    discount: 10, // 10%
    tax: 18, // 18% standard GST
    netAmount: 19647, // 18500 - 1850 (discount) + 2997 (GST)
    amountPaid: 19647,
    balanceAmount: 0,
    status: 'Paid',
    dueDate: '2026-06-25',
    payments: [
      {
        id: 'p-pay-1',
        invoiceId: 'inv-1',
        paymentDate: '2026-06-11T11:00:00Z',
        amountPaid: 19647,
        paymentMode: 'Credit Card',
        referenceNumber: 'TXN-9018442',
        notes: 'Full payment settled via HDFC premium terminal.',
        collectedBy: 'Dr. Ananya Iyer',
      },
    ],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    invoiceDate: new Date().toISOString().split('T')[0], // Today
    patientId: 'p2',
    patientName: 'Isha Sharma',
    branchName: 'Vasant Vihar - New Delhi',
    items: [
      { id: 'item-3', treatmentName: 'Scaling & Oral Prophylaxis', toothNumber: 'All', quantity: 1, unitCost: 1500, amount: 1500 },
      { id: 'item-4', treatmentName: 'Gingival Suture Removal', toothNumber: '48', quantity: 1, unitCost: 500, amount: 500 },
    ],
    totalAmount: 2000,
    discount: 0,
    tax: 18,
    netAmount: 2360, // 2000 + 360 (GST)
    amountPaid: 1000,
    balanceAmount: 1360,
    status: 'Partially Paid',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payments: [
      {
        id: 'p-pay-2',
        invoiceId: 'inv-2',
        paymentDate: new Date().toISOString().split('T')[0] + 'T10:30:00Z',
        amountPaid: 1000,
        paymentMode: 'UPI',
        referenceNumber: 'UPI-98104721',
        notes: 'Partial advance collected via Google Pay terminal.',
        collectedBy: 'Front Desk Rahul',
      },
    ],
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    invoiceDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    patientId: 'p1',
    patientName: 'Aarav Mehta',
    branchName: 'Saket - New Delhi',
    items: [
      { id: 'item-5', treatmentName: 'Titanium Dental Implant', toothNumber: '36', quantity: 1, unitCost: 35000, amount: 35000 },
    ],
    totalAmount: 35000,
    discount: 5, // 5%
    tax: 18,
    netAmount: 39235, // 35000 - 1750 + 5985 (GST)
    amountPaid: 0,
    balanceAmount: 39235,
    status: 'Generated',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payments: [],
  },
]

// --- LOCAL STORAGE DATA SYNC ---
const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem('sirona_invoices')
  return data ? JSON.parse(data) : INITIAL_MOCK_INVOICES
}

const saveInvoices = (list: Invoice[]) => {
  localStorage.setItem('sirona_invoices', JSON.stringify(list))
}

// --- CALCULATION FORMULA ---
export const calculateTotals = (
  items: Omit<InvoiceItem, 'id' | 'amount'>[],
  discountPct: number,
  taxPct: number
) => {
  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0)
  
  const discountVal = (totalAmount * discountPct) / 100
  const subtotal = totalAmount - discountVal
  const taxVal = (subtotal * taxPct) / 100
  const netAmount = Math.round(subtotal + taxVal)

  return {
    totalAmount,
    netAmount,
  }
}

// --- REVENUE CALCULATION LOGIC ---
const calculateDashboardMetrics = (invoices: Invoice[]): BillingDashboardSummary => {
  const todayStr = new Date().toISOString().split('T')[0]
  const currentMonthStr = todayStr.substring(0, 7) // "2026-06"

  let totalRevenue = 0
  let revenueToday = 0
  let revenueMonth = 0
  let outstandingAmount = 0
  let pendingInvoicesCount = 0
  let paymentsTodayCount = 0

  let combinedNetTotal = 0
  let combinedPaidTotal = 0

  invoices.forEach((inv) => {
    outstandingAmount += inv.balanceAmount
    combinedNetTotal += inv.netAmount
    combinedPaidTotal += inv.amountPaid

    if (inv.status === 'Generated' || inv.status === 'Partially Paid') {
      pendingInvoicesCount++
    }

    inv.payments.forEach((p) => {
      totalRevenue += p.amountPaid
      const payDate = p.paymentDate.split('T')[0]
      const payMonth = p.paymentDate.substring(0, 7)

      if (payDate === todayStr) {
        revenueToday += p.amountPaid
        paymentsTodayCount++
      }

      if (payMonth === currentMonthStr) {
        revenueMonth += p.amountPaid
      }
    })
  })

  const collectionRate = combinedNetTotal > 0 ? Math.round((combinedPaidTotal / combinedNetTotal) * 100) : 100
  const outstandingRate = combinedNetTotal > 0 ? Math.round((outstandingAmount / combinedNetTotal) * 100) : 0

  return {
    totalRevenue,
    revenueToday,
    revenueMonth,
    outstandingAmount,
    pendingInvoicesCount,
    paymentsTodayCount,
    collectionRate,
    outstandingRate,
  }
}

// --- EXPORTED SERVICE ---
export const billingService = {
  // Fetch all invoices
  getAll: async (): Promise<Invoice[]> => {
    await delay(500)
    return getInvoices()
  },

  // Fetch invoice details by ID
  getById: async (id: string): Promise<Invoice | null> => {
    await delay(400)
    const list = getInvoices()
    const found = list.find((i) => i.id === id)
    return found || null
  },

  // Fetch patient invoices
  getByPatientId: async (patientId: string): Promise<Invoice[]> => {
    await delay(400)
    const list = getInvoices()
    return list.filter((i) => i.patientId === patientId)
  },

  // Create or Update invoice
  save: async (
    patientId: string,
    data: Omit<Invoice, 'id' | 'invoiceNumber' | 'totalAmount' | 'netAmount' | 'amountPaid' | 'balanceAmount' | 'payments' | 'patientId'>,
    _updatedBy: string = 'Dr. Ananya Iyer'
  ): Promise<Invoice> => {
    await delay(700)
    const list = getInvoices()
    
    // Auto calculate costs
    const { totalAmount, netAmount } = calculateTotals(data.items, data.discount, data.tax)
    const invoiceNumber = `INV-2026-0${list.length + 1}`

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substring(2, 9),
      invoiceNumber,
      patientId,
      ...data,
      totalAmount,
      netAmount,
      amountPaid: 0, // initially zero
      balanceAmount: netAmount,
      payments: [],
    }

    saveInvoices([newInvoice, ...list])
    return newInvoice
  },

  // Record a payment against an invoice ID
  recordPayment: async (
    invoiceId: string,
    payment: { amount: number; paymentMode: PaymentMode; referenceNumber?: string; notes?: string },
    collectedBy: string = 'Front Desk Rahul'
  ): Promise<Invoice | null> => {
    await delay(600)
    const list = getInvoices()
    const idx = list.findIndex((inv) => inv.id === invoiceId)
    if (idx === -1) return null

    const inv = list[idx]
    const amountPaid = inv.amountPaid + payment.amount
    const balanceAmount = Math.max(0, inv.netAmount - amountPaid)

    let status: InvoiceStatus = 'Partially Paid'
    if (balanceAmount === 0) {
      status = 'Paid'
    }

    const newPaymentLog: PaymentHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      invoiceId,
      paymentDate: new Date().toISOString(),
      amountPaid: payment.amount,
      paymentMode: payment.paymentMode,
      referenceNumber: payment.referenceNumber,
      notes: payment.notes,
      collectedBy,
    }

    const updatedInvoice: Invoice = {
      ...inv,
      amountPaid,
      balanceAmount,
      status,
      payments: [newPaymentLog, ...inv.payments],
    }

    list[idx] = updatedInvoice
    saveInvoices(list)

    return updatedInvoice
  },

  // Soft delete / cancel invoice
  cancelInvoice: async (id: string): Promise<boolean> => {
    await delay(500)
    const list = getInvoices()
    const idx = list.findIndex((inv) => inv.id === id)
    if (idx === -1) return false

    list[idx] = {
      ...list[idx],
      status: 'Cancelled',
      balanceAmount: 0, // cancelled bills have no pending balance due
    }
    saveInvoices(list)
    return true
  },

  // Fetch Dashboard summary analytics
  getDashboardSummary: async (): Promise<BillingDashboardSummary> => {
    await delay(500)
    const list = getInvoices()
    return calculateDashboardMetrics(list)
  },

  // Mock revenue chart data (daily/weekly/monthly trends)
  getRevenueChartData: (): { label: string; revenue: number; collections: number }[] => [
    { label: 'Indiranagar', revenue: 45000, collections: 45000 },
    { label: 'Saket', revenue: 95000, collections: 75000 },
    { label: 'Vasant Vihar', revenue: 65000, collections: 42000 },
    { label: 'Koregaon Park', revenue: 35000, collections: 30000 },
  ],
}

export default billingService
