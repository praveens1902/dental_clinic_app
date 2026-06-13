import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Save,
  RotateCcw,
  History,
  Pill,
  Calendar,
  User,
  Heart,
  FileSpreadsheet,
} from 'lucide-react'

import { prescriptionService } from '../services/prescriptionService'
import { Prescription, PrescriptionTimelineItem, PrescriptionSummary } from '../types'
import {
  prescriptionFormSchema,
  PrescriptionFormSchemaType,
  getEmptyPrescriptionForm,
} from '../schemas'

import { CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { InlineAlert } from '@/components/ui/InlineAlert'
import { Textarea } from '@/components/ui/Textarea'
import { useAlertStore } from '@/store/alertStore'

import { PrescriptionSkeleton } from './PrescriptionSkeleton'
import { MedicationManager } from './MedicationManager'
import { FollowUpPlanner } from './FollowUpPlanner'
import { PrescriptionHistory } from './PrescriptionHistory'
import { PrescriptionPdfPreview } from './PrescriptionPdfPreview'
import { PrescriptionTimeline } from './PrescriptionTimeline'

interface PrescriptionTabProps {
  patientId: string
}

export const PrescriptionTab: React.FC<PrescriptionTabProps> = ({ patientId }) => {
  const { addToast, showModalAlert } = useAlertStore()

  const [history, setHistory] = useState<Prescription[]>([])
  const [timeline, setTimeline] = useState<PrescriptionTimelineItem[]>([])
  const [summary, setSummary] = useState<PrescriptionSummary | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  // Configure Form methods
  const methods = useForm<PrescriptionFormSchemaType>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: getEmptyPrescriptionForm(patientId),
  })

  const { reset, handleSubmit, watch, register, formState: { isDirty } } = methods

  // Load patient clinical profile
  const loadClinicalProfile = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [h, t, s] = await Promise.all([
        prescriptionService.getByPatientId(patientId),
        prescriptionService.getTimelineByPatientId(patientId),
        prescriptionService.getSummary(patientId),
      ])

      setHistory(h)
      setTimeline(t)
      setSummary(s)

      reset(getEmptyPrescriptionForm(patientId))
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Clinical Connection Lost',
        message: 'Could not fetch patient digital prescriptions index.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClinicalProfile()
  }, [patientId])

  // Watch Form inputs to render a completely dynamic live PDF preview!
  const watchedValues = watch()

  const livePreviewData = React.useMemo<Prescription | null>(() => {
    if (!watchedValues) return null
    return {
      id: 'live-preview',
      patientId,
      prescriptionDate: watchedValues.prescriptionDate || '',
      doctorName: watchedValues.doctorName || '',
      medications: watchedValues.medications || [],
      notes: watchedValues.notes,
      additionalInstructions: watchedValues.additionalInstructions,
      followUp: watchedValues.followUp,
      status: 'Draft',
      updatedAt: '',
    }
  }, [watchedValues, patientId])

  // Save/Finalize Prescription Sheets
  const onSave = async (data: PrescriptionFormSchemaType, isDraft = false) => {
    setIsSaving(true)
    try {
      await prescriptionService.save(
        patientId,
        {
          prescriptionDate: data.prescriptionDate,
          doctorName: data.doctorName,
          medications: data.medications,
          notes: data.notes,
          additionalInstructions: data.additionalInstructions,
          followUp: data.followUp,
          status: isDraft ? 'Draft' : 'Finalized',
        },
        'Dr. Ananya Iyer'
      )

      // Refresh listings
      const [h, t, s] = await Promise.all([
        prescriptionService.getByPatientId(patientId),
        prescriptionService.getTimelineByPatientId(patientId),
        prescriptionService.getSummary(patientId),
      ])

      setHistory(h)
      setTimeline(t)
      setSummary(s)

      // Re-initialize blank form once finalized
      reset(getEmptyPrescriptionForm(patientId))

      addToast({
        type: 'success',
        title: isDraft ? 'Rx Draft Synchronized' : 'Prescription Sealed & Sealed',
        message: isDraft
          ? 'Digital prescription draft has been cached.'
          : 'Prescription locked and updated in patient permanent ledger.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Transmission Blocked',
        message: 'Clinical attachment was rejected by database node.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = () => {
    const currentValues = methods.getValues()
    onSave(currentValues, true)
  }

  // Interactive PDF actions
  const handlePdfDownload = () => {
    addToast({
      type: 'success',
      title: 'Digital Print Completed',
      message: 'Compiled official prescription PDF file successfully.',
    })
  }

  const handleReprintPdf = async (pres: Prescription) => {
    await prescriptionService.logPrint(patientId, pres.id, 'Dr. Ananya Iyer')
    
    // Refresh timeline
    const t = await prescriptionService.getTimelineByPatientId(patientId)
    setTimeline(t)

    addToast({
      type: 'success',
      title: 'Reprint Summary Generated',
      message: 'Re-packaged medical copying file. Directing to print nodes.',
    })

    window.print()
  }

  const handleInspectPrescription = (pres: Prescription) => {
    reset({
      patientId,
      prescriptionDate: pres.prescriptionDate,
      doctorName: pres.doctorName,
      notes: pres.notes || '',
      additionalInstructions: pres.additionalInstructions || '',
      medications: pres.medications,
      followUp: pres.followUp || { followUpDate: '', followUpTime: '', remarks: '' },
      status: pres.status,
    })
    addToast({
      type: 'info',
      title: 'Dossier Loaded',
      message: 'Loaded historical parameters directly into active preview workspace.',
    })
  }

  const handleResetForm = () => {
    showModalAlert({
      type: 'warning',
      title: 'Discard active Rx notes?',
      message: 'You have drafted medications on the active prescription sheet. Discarding will clear medications and restore blank defaults.',
      confirmLabel: 'Discard and Revert',
      cancelLabel: 'Keep Editing',
      onConfirm: () => {
        reset(getEmptyPrescriptionForm(patientId))
        addToast({
          type: 'info',
          title: 'Prescription Form Cleared',
          message: 'Active Rx notepad cleared.',
        })
      },
    })
  }

  const handleValidationFailed = () => {
    addToast({
      type: 'error',
      title: 'Verification Incomplete',
      message: 'Please add at least one medication before finalizing a clinical prescription.',
    })
  }

  if (isLoading) {
    return <PrescriptionSkeleton />
  }

  if (hasError) {
    return (
      <CardContainer className="text-center py-12 max-w-lg mx-auto animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
          <Pill className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-text-primary">Clinical Script Offline</h3>
        <p className="text-xs text-text-secondary mt-2 mb-6 leading-relaxed">
          The Sirona prescription dispatch ledger could not load secure records. Check network node clearances.
        </p>
        <Button variant="primary" onClick={loadClinicalProfile}>
          Retry Connection
        </Button>
      </CardContainer>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. SUMMARY STAT DECK */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Active Prescriptions</span>
            <p className="text-2xl font-black text-primary flex items-center gap-1.5 leading-none">
              <Pill className="w-5 h-5 text-primary shrink-0" />
              <span>{summary.activePrescriptionsCount}</span>
            </p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Last Prescription</span>
            <p className="text-xs font-black text-text-primary mt-1.5 leading-tight flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-text-secondary shrink-0" />
              <span>
                {summary.lastPrescriptionDate
                  ? new Date(summary.lastPrescriptionDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'First consult'}
              </span>
            </p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Treating Doctor</span>
            <p className="text-xs font-black text-text-primary mt-1.5 leading-tight flex items-center gap-1.5 truncate">
              <User className="w-4 h-4 text-text-secondary shrink-0" />
              <span>{summary.treatingDoctor}</span>
            </p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Upcoming Follow-Up</span>
            <p className="text-xs font-black text-primary mt-1.5 leading-tight flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary shrink-0 animate-pulse" />
              <span>
                {summary.followUpDate
                  ? new Date(summary.followUpDate).toLocaleDateString([], { day: '2-digit', month: 'short' })
                  : 'Symptom monitoring'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Unsaved alert bar */}
      {isDirty && (
        <InlineAlert
          type="warning"
          title="Unsaved Prescription Notepad"
          message="You have added medications or modified remarks. Commit and lock before switching tabs."
        />
      )}

      {/* 2. MAIN LAYOUT GRID */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            (data) => onSave(data, false),
            () => handleValidationFailed()
          )}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
          
          {/* Main workspace inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Previous history list */}
            <CardContainer className="space-y-4">
              <PrescriptionHistory
                data={history}
                onView={handleInspectPrescription}
                onReprint={handleReprintPdf}
              />
            </CardContainer>

            {/* Medications Manager */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Pill className="w-4.5 h-4.5 text-primary" />
                <span>Medication Manager Console</span>
              </h3>
              <MedicationManager />
            </CardContainer>

            {/* Follow-Up Planner */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-primary" />
                <span>Session Follow-Up Planner</span>
              </h3>
              <FollowUpPlanner />
            </CardContainer>

            {/* General annotations */}
            <CardContainer className="space-y-4 text-left">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4.5 h-4.5 text-primary" />
                <span>Special Instructions &amp; Diagnostic Notes</span>
              </h3>
              <Textarea
                placeholder="Enter general prescription notes, diagnostic findings, or instructions..."
                rows={3}
                {...register('notes')}
              />
              <Textarea
                placeholder="Enter additional dietary or postoperative warnings (e.g. eat soft cold foods)..."
                rows={3}
                {...register('additionalInstructions')}
              />
            </CardContainer>

            {/* Bottom action panel */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-card border border-border shadow-premium z-10 sticky bottom-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleResetForm}
                    className="w-full sm:w-auto font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
                  >
                    Reset Form
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2.5 ml-auto w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  isLoading={isSaving}
                  disabled={isSaving}
                  className="w-full sm:w-auto font-bold text-xs text-primary border border-primary/20 hover:bg-primary-light/10"
                >
                  Save Draft Copy
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full sm:w-auto font-bold text-xs shadow-premium"
                >
                  Finalize and Seal Rx
                </Button>
              </div>
            </div>

          </div>

          {/* Right sidebar: Live PDF preview and Activity timeline */}
          <div className="space-y-6 sticky top-24">
            
            {/* Live Letterhead Preview */}
            <CardContainer className="p-4 bg-background/10">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 mb-4 flex items-center gap-1.5 select-none">
                <Heart className="w-4.5 h-4.5 text-primary" />
                <span>Live Letterhead preview</span>
              </h4>
              <PrescriptionPdfPreview
                prescription={livePreviewData}
                onDownload={handlePdfDownload}
                onPrint={() => window.print()}
              />
            </CardContainer>

            {/* Timeline logs */}
            <CardContainer>
              <button
                type="button"
                onClick={() => setShowTimeline((prev) => !prev)}
                className="flex items-center justify-between w-full text-left focus:outline-none"
              >
                <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <History className="w-4 h-4 text-primary animate-pulse" />
                  <span>Clinical timelines ({timeline.length})</span>
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors cursor-pointer">
                  {showTimeline ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {showTimeline && (
                <div className="mt-4 pt-4 border-t border-border/40 max-h-96 overflow-y-auto custom-scrollbar">
                  <PrescriptionTimeline timeline={timeline} />
                </div>
              )}
            </CardContainer>

          </div>

        </form>
      </FormProvider>

    </div>
  )
}
export default PrescriptionTab
