import React from 'react'
import { Printer, Download, Pill, Heart, Award } from 'lucide-react'
import { Prescription } from '../types'
import { Button } from '@/components/ui/Button'

interface PrescriptionPdfPreviewProps {
  prescription: Prescription | null
  patientName?: string
  patientAge?: string | number
  patientGender?: string
  onDownload?: () => void
  onPrint?: () => void
}

export const PrescriptionPdfPreview: React.FC<PrescriptionPdfPreviewProps> = ({
  prescription,
  patientName = 'Simulated Patient',
  patientAge = '32',
  patientGender = 'Female',
  onDownload,
  onPrint,
}) => {
  if (!prescription || prescription.medications.length === 0) {
    return (
      <div className="bg-background/25 border-2 border-dashed border-border/80 rounded-xl p-8 text-center space-y-3 select-none h-full flex flex-col justify-center items-center">
        <Pill className="w-12 h-12 text-text-secondary/40 shrink-0 animate-pulse" />
        <h4 className="text-xs font-bold text-text-secondary/85 uppercase">No Active Medications</h4>
        <p className="text-[10px] text-text-secondary/60 max-w-xs leading-normal">
          Add medications using the manager or quick-add templates to compile a printable Rx letterhead.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      {/* Action triggers */}
      <div className="flex items-center gap-2.5 justify-end bg-background/30 p-2.5 border border-border/60 rounded-xl shrink-0">
        <Button
          type="button"
          variant="outline"
          size="xs"
          leftIcon={<Printer className="w-3.5 h-3.5" />}
          onClick={onPrint || (() => window.print())}
          className="font-bold text-[10px] bg-white border-border/80 hover:bg-background text-text-primary"
        >
          Print Rx
        </Button>
        <Button
          type="button"
          variant="primary"
          size="xs"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={onDownload}
          className="font-bold text-[10px] shadow-sm"
        >
          Download PDF
        </Button>
      </div>

      {/* Official printable Clinical letterhead container */}
      <div className="bg-white border border-border rounded-xl shadow-premium p-6 md:p-8 max-w-xl mx-auto space-y-6 text-left relative text-text-primary font-medium text-xs leading-normal selection:bg-primary-light">
        
        {/* 1. CLINIC LETTERHEAD HEADER */}
        <div className="flex items-start justify-between border-b-2 border-primary/20 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-black text-primary flex items-center gap-1.5 uppercase tracking-wide leading-none">
              <Heart className="w-5 h-5 text-primary shrink-0 animate-pulse" fill="#005d52" />
              <span>Sirona Dental Clinics</span>
            </h3>
            <p className="text-[9px] text-text-secondary/80 font-bold leading-tight">
              Regd ID: SDC-9102-M • Premium Dental Care &amp; Implantology Center<br />
              Metro Corporate Plaza, Saket, New Delhi • +91 11 4056 9901
            </p>
          </div>
          <div className="text-right space-y-0.5 shrink-0 select-none">
            <span className="inline-flex text-[10px] font-black text-primary bg-primary-light px-3 py-1 rounded-full uppercase border border-primary/10">
              Prescription
            </span>
          </div>
        </div>

        {/* 2. PATIENT METADATA BLOCK */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-background/25 border border-border/50 rounded-xl p-4 text-[10px] font-bold text-text-secondary uppercase select-none">
          <div className="space-y-0.5">
            <span>Patient Name</span>
            <p className="text-xs font-black text-text-primary truncate">{patientName}</p>
          </div>
          <div className="space-y-0.5">
            <span>Age / Gender</span>
            <p className="text-xs font-black text-text-primary">{patientAge} • {patientGender}</p>
          </div>
          <div className="space-y-0.5">
            <span>Prescription Date</span>
            <p className="text-xs font-black text-text-primary">{prescription.prescriptionDate}</p>
          </div>
          <div className="space-y-0.5">
            <span>Consulting Doctor</span>
            <p className="text-xs font-black text-primary">{prescription.doctorName}</p>
          </div>
        </div>

        {/* 3. RX SYMBOL AND MEDICATIONS LIST */}
        <div className="space-y-3 flex-1">
          <h4 className="text-2xl font-black font-heading text-primary select-none italic leading-none">
            R<span className="text-sm font-semibold select-none lowercase">x</span>
          </h4>

          {/* Medications list */}
          <div className="border border-border/80 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-background/40 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                  <th className="p-3 pl-4">Medicine &amp; Dosage</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 pr-4">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medications.map((med, idx) => (
                  <tr key={med.id || idx} className="border-b border-border/40 last:border-b-0 font-semibold text-text-primary">
                    <td className="p-3 pl-4">
                      <p className="font-extrabold text-text-primary">{med.medicineName}</p>
                      <p className="text-[10px] text-text-secondary/70 font-semibold">{med.dosage}</p>
                    </td>
                    <td className="p-3 text-[11px] font-bold text-text-primary">{med.frequency}</td>
                    <td className="p-3 text-[11px] font-bold text-text-primary">{med.duration}</td>
                    <td className="p-3 pr-4 text-[10px] text-text-secondary leading-normal italic">
                      {med.instructions || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. OTHER INSTRUCTIONS & REMARKS */}
        {(prescription.notes || prescription.additionalInstructions) && (
          <div className="space-y-2 pt-2 border-t border-border/40">
            <h5 className="text-[9px] font-bold text-text-secondary uppercase tracking-wider select-none">
              Special Clinical Instructions / Remarks
            </h5>
            <div className="space-y-1.5 text-xs text-text-primary/90 font-medium leading-relaxed bg-background/15 rounded-xl p-3.5">
              {prescription.notes && (
                <p className="font-semibold italic">&ldquo;{prescription.notes}&rdquo;</p>
              )}
              {prescription.additionalInstructions && (
                <p className="text-[11px] font-bold text-text-secondary/80 border-t border-border/30 pt-1.5 mt-1.5">
                  General Care: {prescription.additionalInstructions}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 5. FOLLOW UP milstone */}
        {prescription.followUp && prescription.followUp.followUpDate && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-text-secondary select-none">
            <span className="flex items-center gap-1.5 font-bold">
              <Award className="w-4 h-4 text-primary shrink-0 animate-bounce" />
              <span>Proposed Follow-Up Evaluation:</span>
            </span>
            <div className="text-left sm:text-right">
              <p className="font-black text-primary">
                {new Date(prescription.followUp.followUpDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                {prescription.followUp.followUpTime && ` @ ${prescription.followUp.followUpTime}`}
              </p>
              {prescription.followUp.remarks && (
                <p className="text-[10px] text-text-secondary/70 leading-normal italic mt-0.5">
                  &ldquo;{prescription.followUp.remarks}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* 6. SIGNATURE BLOCK */}
        <div className="flex justify-between items-end pt-6 border-t-2 border-primary/20 select-none">
          <div className="text-left text-[9px] font-bold text-text-secondary/60">
            <p>Generated securely on Sirona Clinical Cloud node.</p>
            <p>Verification Code: Rx-{prescription.id || '9102'}</p>
          </div>
          
          <div className="text-center w-40 space-y-1">
            <div className="h-10 flex items-center justify-center text-xs font-black text-primary font-heading select-none italic border-b border-border/80">
              Dr. Ananya Iyer
            </div>
            <p className="text-[9px] font-black text-text-secondary uppercase">Authorized Signatory</p>
            <p className="text-[8px] text-text-secondary/60">Reg. No: MCD-11082-A</p>
          </div>
        </div>

      </div>

    </div>
  )
}
export default PrescriptionPdfPreview
