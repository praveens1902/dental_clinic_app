import React, { useState, useEffect } from 'react'
import { FileText, PlusCircle, BarChart3, DollarSign } from 'lucide-react'
import { billingService } from '../services/billingService'
import { Invoice, BillingDashboardSummary, PaymentMode } from '../types'
import { InvoiceFormSchemaType } from '../schemas'
import { useAlertStore } from '@/store/alertStore'

import { PageHeader, ContentContainer, CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { BillingSkeleton } from '../components/BillingSkeleton'

import { BillingDashboardKPIs } from '../components/BillingDashboardKPIs'
import { InvoiceListing } from '../components/InvoiceListing'
import { CreateInvoiceForm } from '../components/CreateInvoiceForm'
import { PaymentManagement } from '../components/PaymentManagement'
import { InvoicePreviewer } from '../components/InvoicePreviewer'
import { RevenueAnalytics } from '../components/RevenueAnalytics'

export const BillingPage: React.FC = () => {
  const { addToast } = useAlertStore()

  // 1. Data States
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [summary, setSummary] = useState<BillingDashboardSummary | null>(null)
  
  // 2. Tab Navigation View state
  const [activeSubTab, setActiveSubTab] = useState<'kpis' | 'list' | 'create'>('kpis')
  
  // 3. Modals Overlay States
  const [paymentTargetInvoice, setPaymentTargetInvoice] = useState<Invoice | null>(null)
  const [previewTargetInvoice, setPreviewTargetInvoice] = useState<Invoice | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [invs, sum] = await Promise.all([
        billingService.getAll(),
        billingService.getDashboardSummary(),
      ])
      setInvoices(invs)
      setSummary(sum)
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Connection Offline',
        message: 'Could not fetch clinic billing ledger database.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 4. Action Handlers
  const handleCollectPayment = async (
    invoiceId: string,
    payment: { amount: number; paymentMode: PaymentMode; referenceNumber?: string; notes?: string }
  ) => {
    try {
      await billingService.recordPayment(invoiceId, payment, 'Dr. Ananya Iyer')
      addToast({
        type: 'success',
        title: 'Payment Recorded',
        message: `Successfully registered payment of ₹${payment.amount.toLocaleString()}.`,
      })
      await loadData()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Transaction Rejected',
        message: 'Failed to register the payment on clinical ledger.',
      })
    }
  }

  const handleCreateInvoice = async (formData: InvoiceFormSchemaType) => {
    try {
      await billingService.save(formData.patientId, {
        patientName: formData.patientName,
        invoiceDate: formData.invoiceDate,
        branchName: formData.branchName,
        items: formData.items,
        discount: formData.discount,
        tax: formData.tax,
        status: formData.status,
        dueDate: formData.dueDate,
      }, 'Dr. Ananya Iyer')

      addToast({
        type: 'success',
        title: 'Invoice Issued',
        message: `Successfully issued new invoice for ${formData.patientName}.`,
      })

      await loadData()
      setActiveSubTab('list')
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Invoice Creation Failed',
        message: 'Failed to issue new invoice record.',
      })
    }
  }

  const handleDownloadInvoicePdf = (inv: Invoice) => {
    addToast({
      type: 'success',
      title: 'Invoice Export Completed',
      message: `Downloaded premium PDF invoice for ${inv.invoiceNumber}.`,
    })
  }

  const handlePrintInvoice = (inv: Invoice) => {
    addToast({
      type: 'info',
      title: 'Directing to Print Node...',
      message: `Spooled invoice copy ${inv.invoiceNumber} to local clinic printer.`,
    })
    window.print()
  }

  if (isLoading) {
    return (
      <ContentContainer>
        <BillingSkeleton />
      </ContentContainer>
    )
  }

  if (hasError) {
    return (
      <ContentContainer className="py-8">
        <CardContainer className="text-center max-w-lg mx-auto py-8">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
            <DollarSign className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-primary mb-2">Ledger Offline</h3>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            The invoices ledger, collections portal, and payment tracking modules are currently unreachable.
          </p>
          <Button variant="primary" onClick={loadData}>Reconnect Ledger</Button>
        </CardContainer>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Billing &amp; Financial Ledger"
        subtitle="Settle treatment charges, issue tax invoices, collect payments, and track uncollected outstanding dues."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setActiveSubTab('create')}
              className="font-bold shadow-premium"
            >
              Generate Invoice
            </Button>
          </div>
        }
      />

      {/* 2. TABBED DECK NAVIGATION */}
      <div className="flex bg-white border border-border p-1.5 rounded-card overflow-x-auto custom-scrollbar gap-1 select-none shrink-0">
        {[
          { id: 'kpis', label: 'Financial Dashboard', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'list', label: 'Invoices Archive', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'create', label: 'Generate Invoice', icon: <PlusCircle className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isSelected = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow shadow-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. SUB TABBED WORKSPACE CONTENT */}
      <div className="animate-fadeIn min-h-[350px]">
        
        {/* VIEW A: Dashboard KPIs & Analytics widgets */}
        {activeSubTab === 'kpis' && (
          <div className="space-y-6">
            <BillingDashboardKPIs summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-start">
              
              <div className="lg:col-span-2">
                <CardContainer className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                      Pending Outstanding Invoices
                    </h3>
                    <span className="text-[10px] font-black text-danger bg-danger/5 border border-danger/10 px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                      Action Required
                    </span>
                  </div>
                  
                  <InvoiceListing
                    data={invoices.filter((i) => i.balanceAmount > 0 && i.status !== 'Cancelled')}
                    onView={(inv) => setPreviewTargetInvoice(inv)}
                    onRecordPayment={(inv) => setPaymentTargetInvoice(inv)}
                    onPrint={handlePrintInvoice}
                  />
                </CardContainer>
              </div>

              <div>
                <RevenueAnalytics summary={summary} />
              </div>

            </div>
          </div>
        )}

        {/* VIEW B: Invoices Archive list */}
        {activeSubTab === 'list' && (
          <CardContainer className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                Invoice Ledger Database
              </h3>
            </div>
            
            <InvoiceListing
              data={invoices}
              onView={(inv) => setPreviewTargetInvoice(inv)}
              onRecordPayment={(inv) => setPaymentTargetInvoice(inv)}
              onPrint={handlePrintInvoice}
            />
          </CardContainer>
        )}

        {/* VIEW C: Create Invoice Form */}
        {activeSubTab === 'create' && (
          <CardContainer className="p-6 md:p-8">
            <CreateInvoiceForm
              onSuccess={handleCreateInvoice}
              onCancel={() => setActiveSubTab('kpis')}
            />
          </CardContainer>
        )}

      </div>

      {/* OVERLAY 1: Payment Management Collect overlay drawer */}
      <PaymentManagement
        invoice={paymentTargetInvoice}
        onClose={() => setPaymentTargetInvoice(null)}
        onSuccess={handleCollectPayment}
      />

      {/* OVERLAY 2: Detailed PDF Letterhead Previewer drawer */}
      <InvoicePreviewer
        invoice={previewTargetInvoice}
        onClose={() => setPreviewTargetInvoice(null)}
        onDownload={handleDownloadInvoicePdf}
        onPrint={handlePrintInvoice}
      />

    </ContentContainer>
  )
}
export default BillingPage
