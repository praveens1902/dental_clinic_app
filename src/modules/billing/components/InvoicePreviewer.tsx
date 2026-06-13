import React from 'react'
import { Printer, Download, Heart, IndianRupee, CreditCard } from 'lucide-react'
import { Invoice } from '../types'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'

interface InvoicePreviewerProps {
  invoice: Invoice | null
  onClose: () => void
  onDownload: (invoice: Invoice) => void
  onPrint: (invoice: Invoice) => void
}

export const InvoicePreviewer: React.FC<InvoicePreviewerProps> = ({
  invoice,
  onClose,
  onDownload,
  onPrint,
}) => {
  if (!invoice) return null

  // Calculate items sum
  const subtotal = invoice.totalAmount
  const discountVal = (subtotal * invoice.discount) / 100
  const afterDiscount = subtotal - discountVal
  const taxVal = (afterDiscount * invoice.tax) / 100

  const drawerFooter = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
      >
        Close
      </Button>
      <Button
        type="button"
        variant="outline"
        leftIcon={<Printer className="w-4 h-4" />}
        onClick={() => onPrint(invoice)}
        className="font-bold text-xs bg-white border border-border/80 text-text-primary"
      >
        Print Bill
      </Button>
      <Button
        type="button"
        variant="primary"
        leftIcon={<Download className="w-4 h-4" />}
        onClick={() => onDownload(invoice)}
        className="font-bold text-xs shadow-premium"
      >
        Download Invoice PDF
      </Button>
    </>
  )

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title={`Invoice - ${invoice.invoiceNumber}`}
      size="md"
      footer={drawerFooter}
    >
      <div className="space-y-6 text-left text-text-primary font-medium text-xs leading-normal select-none">
        
        {/* OFFICIAL CLINIC INVOICE SHEET CONTAINER */}
        <div className="bg-white border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-premium relative">
          
          {/* 1. CLINIC HEADER */}
          <div className="flex items-start justify-between border-b-2 border-primary/20 pb-4">
            <div className="space-y-1">
              <h3 className="text-base font-heading font-black text-primary flex items-center gap-1.5 uppercase tracking-wide leading-none">
                <Heart className="w-5 h-5 text-primary shrink-0" fill="#005d52" />
                <span>Sirona Dental Clinics</span>
              </h3>
              <p className="text-[9px] text-text-secondary/80 font-bold leading-tight">
                Regd ID: SDC-9102-M • Premium Dental Care &amp; Implantology Center<br />
                Metro Corporate Plaza, Saket, New Delhi • +91 11 4056 9901
              </p>
            </div>
            
            <div className="text-right space-y-1 shrink-0">
              <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full ${
                invoice.status === 'Paid' ? 'bg-success/15 text-success border-success/15' :
                invoice.status === 'Cancelled' ? 'bg-danger/15 text-danger border-danger/15' :
                invoice.status === 'Partially Paid' ? 'bg-warning/15 text-warning-dark border-warning/15' :
                'bg-primary-light text-primary border-primary/10'
              }`}>
                {invoice.status}
              </span>
              <p className="text-[9px] text-text-secondary/60 font-bold block mt-1">Invoice Receipt</p>
            </div>
          </div>

          {/* 2. INVOICE AND PATIENT METADATA BLOCK */}
          <div className="grid grid-cols-2 gap-4 bg-background/25 border border-border/50 rounded-xl p-4 text-[10px] font-bold text-text-secondary uppercase select-none">
            <div className="space-y-1">
              <span>Billed Patient</span>
              <p className="text-xs font-black text-text-primary leading-none mt-0.5 truncate">{invoice.patientName}</p>
              <p className="text-[9px] font-bold text-text-secondary/70 leading-none">ID: {invoice.patientId}</p>
            </div>
            <div className="space-y-1">
              <span>Invoice Details</span>
              <p className="text-[10px] font-black text-primary leading-none mt-0.5">Bill No: {invoice.invoiceNumber}</p>
              <p className="text-[9px] font-bold text-text-secondary/70 leading-none mt-0.5">Date: {invoice.invoiceDate}</p>
              <p className="text-[9px] font-bold text-text-secondary/70 leading-none mt-0.5">Due: {invoice.dueDate}</p>
            </div>
          </div>

          {/* 3. CHARGES TABLE */}
          <div className="space-y-2">
            <h5 className="text-[9px] font-black text-text-secondary uppercase tracking-wider select-none">
              Itemized Treatment Charges
            </h5>

            <div className="border border-border/80 rounded-xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-background/40 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="p-3 pl-4">Treatment Description</th>
                    <th className="p-3">Tooth</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Cost</th>
                    <th className="p-3 pr-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-border/40 last:border-b-0 font-semibold text-text-primary">
                      <td className="p-3 pl-4 font-black">{item.treatmentName}</td>
                      <td className="p-3">
                        <span className="text-[9px] font-black text-primary bg-primary-light px-2 py-0.5 rounded-full uppercase leading-none">
                          {item.toothNumber === 'All' ? 'Full Arch' : `#${item.toothNumber}`}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right font-bold">₹{item.unitCost.toLocaleString()}</td>
                      <td className="p-3 pr-4 text-right font-black flex items-center justify-end gap-0.5 mt-0.5">
                        <IndianRupee className="w-3 h-3 text-text-secondary" />
                        <span>{(item.quantity * item.unitCost).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. FINANCIAL CALCULATIONS BREAKDOWN */}
          <div className="flex justify-end pt-1">
            <div className="w-64 space-y-2 border-t border-border/30 pt-3 text-xs">
              
              <div className="flex justify-between text-text-secondary font-bold">
                <span>Subtotal Sum</span>
                <span className="flex items-center gap-0.5 text-text-primary font-bold">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{subtotal.toLocaleString()}</span>
                </span>
              </div>

              {invoice.discount > 0 && (
                <div className="flex justify-between text-text-secondary font-bold">
                  <span>Discount ({invoice.discount}%)</span>
                  <span className="flex items-center gap-0.5 text-danger font-black">
                    <span>-</span>
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{discountVal.toLocaleString()}</span>
                  </span>
                </div>
              )}

              <div className="flex justify-between text-text-secondary font-bold">
                <span>Tax Charged ({invoice.tax}% GST)</span>
                <span className="flex items-center gap-0.5 text-text-primary">
                  <span>+</span>
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{taxVal.toLocaleString()}</span>
                </span>
              </div>

              <div className="flex justify-between text-sm border-t border-dashed border-border/60 pt-2 font-black text-text-primary">
                <span>Grand Net Amount</span>
                <span className="flex items-center gap-0.5 text-primary text-base">
                  <IndianRupee className="w-4 h-4" />
                  <span>{invoice.netAmount.toLocaleString()}</span>
                </span>
              </div>

              <div className="flex justify-between text-text-secondary font-bold">
                <span>Total Amount Paid</span>
                <span className="flex items-center gap-0.5 text-success font-black">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{invoice.amountPaid.toLocaleString()}</span>
                </span>
              </div>

              <div className="flex justify-between text-xs border-t border-border/30 pt-1.5 font-bold text-text-secondary">
                <span>Outstanding Balance</span>
                <span className={`flex items-center gap-0.5 font-black ${invoice.balanceAmount > 0 ? 'text-danger' : 'text-text-secondary/70'}`}>
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{invoice.balanceAmount.toLocaleString()}</span>
                </span>
              </div>

            </div>
          </div>

          {/* 5. PAYMENT TRANSACTIONS RECEIPTS LOGS */}
          {invoice.payments.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-border/40 select-none">
              <h5 className="text-[9px] font-black text-text-secondary uppercase tracking-wider block">
                Transactions Receipt History
              </h5>
              
              <div className="space-y-2">
                {invoice.payments.map((p) => (
                  <div key={p.id} className="bg-background/20 border border-border/50 rounded-xl p-3 flex items-center justify-between text-xs font-semibold">
                    <div className="text-left space-y-0.5 min-w-0">
                      <p className="font-extrabold text-text-primary flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary shrink-0" />
                        <span>Settle via {p.paymentMode}</span>
                        {p.referenceNumber && (
                          <span className="text-[10px] text-text-secondary/60">({p.referenceNumber})</span>
                        )}
                      </p>
                      <p className="text-[9px] text-text-secondary leading-normal">
                        Received on {new Date(p.paymentDate).toLocaleDateString([], { day: '2-digit', month: 'short' })} • Handled by {p.collectedBy}
                      </p>
                    </div>

                    <p className="font-black text-success flex items-center gap-0.5 shrink-0 pl-4">
                      <IndianRupee className="w-3.5 h-3.5 text-success/50" />
                      <span>{p.amountPaid.toLocaleString()}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. DOUBLE SIGNATURES BLOCKS */}
          <div className="flex justify-between items-end pt-6 border-t-2 border-primary/20 select-none">
            <div className="text-left text-[9px] font-bold text-text-secondary/60">
              <p>SDC Authorized Billing ledger copy.</p>
              <p>Reference: {invoice.id || '9102'}</p>
            </div>
            
            <div className="flex gap-10">
              <div className="text-center w-28 space-y-1">
                <div className="h-10 flex items-center justify-center text-[10px] font-black text-primary font-heading select-none italic border-b border-border/80">
                  Accounts Desk
                </div>
                <p className="text-[8px] font-black text-text-secondary uppercase">Authorized Agent</p>
              </div>

              <div className="text-center w-28 space-y-1">
                <div className="h-10 flex items-center justify-center text-[10px] font-black text-primary font-heading select-none italic border-b border-border/80">
                  Aarav Mehta
                </div>
                <p className="text-[8px] font-black text-text-secondary uppercase">Patient Signature</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </Drawer>
  )
}
export default InvoicePreviewer
