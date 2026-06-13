import React, { useState, useEffect } from 'react'
import { Check, CreditCard, FileText, IndianRupee } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Invoice, PaymentMode } from '../types'
import { useAlertStore } from '@/store/alertStore'

interface PaymentManagementProps {
  invoice: Invoice | null
  onClose: () => void
  onSuccess: (invoiceId: string, payment: { amount: number; paymentMode: PaymentMode; referenceNumber?: string; notes?: string }) => Promise<void>
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({
  invoice,
  onClose,
  onSuccess,
}) => {
  const { addToast } = useAlertStore()

  // Local collection states
  const [amount, setAmount] = useState('')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto pre-fill the full remaining outstanding balance
  useEffect(() => {
    if (invoice) {
      setAmount(String(invoice.balanceAmount))
      setReference('')
      setNotes('')
      setPaymentMode('UPI')
      setLocalError('')
    }
  }, [invoice])

  if (!invoice) return null

  const handleFullPaymentTrigger = () => {
    setAmount(String(invoice.balanceAmount))
    setLocalError('')
  }

  const handleCollectPaymentSubmit = async () => {
    const collectAmt = parseFloat(amount) || 0
    
    if (collectAmt <= 0) {
      setLocalError('Payment collection amount must be greater than zero.')
      return
    }

    if (collectAmt > invoice.balanceAmount) {
      setLocalError(`Collection exceeds remaining balance of ₹${invoice.balanceAmount.toLocaleString()}.`)
      return
    }

    setLocalError('')
    setIsSubmitting(true)
    
    try {
      await onSuccess(invoice.id, {
        amount: collectAmt,
        paymentMode,
        referenceNumber: reference.trim() || undefined,
        notes: notes.trim() || undefined,
      })

      // Reset
      onClose()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Collection Blocked',
        message: 'Could not record transaction entry.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const drawerFooter = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        isLoading={isSubmitting}
        disabled={isSubmitting || !amount}
        leftIcon={<Check className="w-4 h-4" />}
        onClick={handleCollectPaymentSubmit}
        className="font-bold text-xs shadow-premium"
      >
        Collect &amp; Issue Receipt
      </Button>
    </>
  )

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title={`Record Payment - ${invoice.invoiceNumber}`}
      size="md"
      footer={drawerFooter}
    >
      <div className="space-y-6 text-left text-text-primary">
        
        {/* 1. Bill summary stats */}
        <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-3.5 select-none text-xs font-semibold">
          <div className="flex items-start justify-between border-b border-border/40 pb-2">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">Patient Folder Link</p>
              <h4 className="text-sm font-black text-text-primary leading-none">
                {invoice.patientName}
              </h4>
            </div>
            <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
              invoice.status === 'Paid' ? 'bg-success/15 text-success border-success/15' :
              invoice.status === 'Cancelled' ? 'bg-danger/15 text-danger border-danger/15' :
              'bg-warning/15 text-warning-dark border-warning/15'
            }`}>
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-white border border-border/50 rounded-xl p-2.5">
              <span className="text-[9px] text-text-secondary uppercase font-bold">Bill Net Total</span>
              <p className="text-sm font-black text-text-primary mt-1 flex items-center justify-center gap-0.5 leading-none">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{invoice.netAmount.toLocaleString()}</span>
              </p>
            </div>
            <div className="bg-white border border-border/50 rounded-xl p-2.5">
              <span className="text-[9px] text-text-secondary uppercase font-bold">Already Paid</span>
              <p className="text-sm font-black text-success mt-1 flex items-center justify-center gap-0.5 leading-none">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>{invoice.amountPaid.toLocaleString()}</span>
              </p>
            </div>
            <div className="bg-white border border-border/50 rounded-xl p-2.5">
              <span className="text-[9px] text-text-secondary uppercase font-bold">Balance Due</span>
              <p className="text-sm font-black text-danger mt-1 flex items-center justify-center gap-0.5 leading-none">
                <IndianRupee className="w-3.5 h-3.5 animate-pulse" />
                <span>{invoice.balanceAmount.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Collection Inputs */}
        <div className="space-y-4">
          {localError && (
            <span className="text-xs font-semibold text-danger block animate-fadeIn">
              {localError}
            </span>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-text-primary uppercase tracking-wide">
              <span>Collection Amount (INR)</span>
              <button
                type="button"
                onClick={handleFullPaymentTrigger}
                className="text-[10px] font-black text-primary bg-primary-light hover:bg-primary/15 border-transparent px-2.5 py-1 rounded-lg transition-colors cursor-pointer capitalize"
              >
                Auto-fill Full Balance
              </button>
            </div>
            <Input
              placeholder="e.g. 5000"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setLocalError('')
              }}
              leftIcon={<IndianRupee className="w-4 h-4 text-text-secondary" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Payment Channel / Mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              options={[
                { value: 'UPI', label: 'UPI (GPay / PhonePe)' },
                { value: 'Cash', label: 'Cash Collection' },
                { value: 'Credit Card', label: 'Credit Card swipe' },
                { value: 'Debit Card', label: 'Debit Card swipe' },
                { value: 'Bank Transfer', label: 'Bank Transfer' },
              ]}
            />

            <Input
              label="Reference / Transaction ID"
              placeholder="e.g. TXN-9102484..."
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              leftIcon={<CreditCard className="w-3.5 h-3.5 text-text-secondary" />}
            />
          </div>

          <Input
            label="Transaction notes"
            placeholder="e.g. Collected partial advance at desk..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            leftIcon={<FileText className="w-3.5 h-3.5 text-text-secondary" />}
          />
        </div>

      </div>
    </Drawer>
  )
}
export default PaymentManagement
