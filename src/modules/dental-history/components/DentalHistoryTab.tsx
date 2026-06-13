import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, RotateCcw, History, Activity, Stethoscope, FileEdit } from 'lucide-react'

import { dentalHistoryService, calculateOralHealthScore } from '../services/dentalHistoryService'
import { DentalHistory, DentalHistoryTimelineItem, DentalHistorySummary } from '../types'
import { dentalHistoryFormSchema, DentalHistoryFormSchemaType, getEmptyDentalHistoryForm } from '../schemas'

import { CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { InlineAlert } from '@/components/ui/InlineAlert'
import { useAlertStore } from '@/store/alertStore'

import { DentalHistorySkeleton } from './DentalHistorySkeleton'
import { PreviousTreatmentSection } from './PreviousTreatmentSection'
import { OralHygieneSection } from './OralHygieneSection'
import { HabitsRiskFactorsSection } from './HabitsRiskFactorsSection'
import { ComplaintHistorySection } from './ComplaintHistorySection'
import { SpecialtyHistorySection } from './SpecialtyHistorySection'
import { OralHealthScore } from './OralHealthScore'
import { DentalHistorySummaryCard } from './DentalHistorySummaryCard'
import { DentalTimelineViewer } from './DentalTimelineViewer'

interface DentalHistoryTabProps {
  patientId: string
}

export const DentalHistoryTab: React.FC<DentalHistoryTabProps> = ({ patientId }) => {
  const { addToast, showModalAlert } = useAlertStore()

  const [history, setHistory] = useState<DentalHistory | null>(null)
  const [timeline, setTimeline] = useState<DentalHistoryTimelineItem[]>([])
  const [summary, setSummary] = useState<DentalHistorySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  // Configure form methods
  const methods = useForm<DentalHistoryFormSchemaType>({
    resolver: zodResolver(dentalHistoryFormSchema),
    defaultValues: getEmptyDentalHistoryForm(patientId),
  })

  const { reset, handleSubmit, watch, formState: { isDirty } } = methods

  // Load patient data
  const loadData = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [h, t, s] = await Promise.all([
        dentalHistoryService.getByPatientId(patientId),
        dentalHistoryService.getTimelineByPatientId(patientId),
        dentalHistoryService.getSummary(patientId),
      ])

      setHistory(h)
      setTimeline(t)
      setSummary(s)

      if (h) {
        reset({
          patientId: h.patientId,
          treatments: h.treatments,
          oralHygiene: h.oralHygiene,
          habits: h.habits,
          complaints: h.complaints,
          orthodontic: h.orthodontic,
          implants: h.implants || [],
          dentures: h.dentures,
        })
      } else {
        reset(getEmptyDentalHistoryForm(patientId))
      }
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Loading Failed',
        message: 'Could not load secure dental history records.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [patientId])

  // Watch form fields to calculate Oral Health Score in real-time!
  const watchedValues = watch()
  
  // Real-time calculated score for visual representation
  const [liveScore, setLiveScore] = useState<number>(100)

  useEffect(() => {
    if (watchedValues && watchedValues.treatments) {
      const score = calculateOralHealthScore(watchedValues)
      setLiveScore(score)
    }
  }, [watchedValues])

  // Submit/Save Clinical Record
  const onSave = async (data: DentalHistoryFormSchemaType, isDraft = false) => {
    setIsSaving(true)
    try {
      const saved = await dentalHistoryService.save(
        patientId,
        {
          treatments: data.treatments,
          oralHygiene: data.oralHygiene,
          habits: data.habits,
          complaints: data.complaints,
          orthodontic: data.orthodontic,
          implants: data.implants,
          dentures: data.dentures,
        },
        isDraft ? 'Draft Synchronizer' : 'Dr. Ananya Iyer'
      )

      // Refresh timeline & summary
      const [t, s] = await Promise.all([
        dentalHistoryService.getTimelineByPatientId(patientId),
        dentalHistoryService.getSummary(patientId),
      ])

      setHistory(saved)
      setTimeline(t)
      setSummary(s)
      
      // Reset form to saved state to clear dirty flag
      reset(data)

      addToast({
        type: 'success',
        title: isDraft ? 'Draft Progress Saved' : 'Dental History Synchronized',
        message: isDraft 
          ? 'Your clinical draft progress was successfully cached.' 
          : 'Patient dental history record has been locked and recorded.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Operation Failed',
        message: 'Could not transmit dental records to clinical database.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle saving as Draft (bypasses partial validation warnings where possible)
  const handleSaveDraft = () => {
    const currentValues = methods.getValues()
    onSave(currentValues, true)
  }

  // Unsaved Warning Form Discard
  const handleReset = () => {
    showModalAlert({
      type: 'warning',
      title: 'Discard Unsaved Edits?',
      message: 'You have modified clinical values on the dental history sheet. Discarding will revert to the last synchronized checkpoint.',
      confirmLabel: 'Discard and Revert',
      cancelLabel: 'Keep Editing',
      onConfirm: () => {
        if (history) {
          reset({
            patientId: history.patientId,
            treatments: history.treatments,
            oralHygiene: history.oralHygiene,
            habits: history.habits,
            complaints: history.complaints,
            orthodontic: history.orthodontic,
            implants: history.implants || [],
            dentures: history.dentures,
          })
        } else {
          reset(getEmptyDentalHistoryForm(patientId))
        }
        addToast({
          type: 'info',
          title: 'Changes Discarded',
          message: 'Dental form fields reverted to clinical baseline.',
        })
      },
    })
  }

  if (isLoading) {
    return <DentalHistorySkeleton />
  }

  if (hasError) {
    return (
      <CardContainer className="text-center py-12 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-text-primary">Failed to Retrieve Dental Records</h3>
        <p className="text-xs text-text-secondary mt-2 mb-6 leading-relaxed">
          An authenticated database error prevented the secure extraction of the patient&apos;s dental history dossier.
        </p>
        <Button variant="primary" onClick={loadData}>
          Retry Connection
        </Button>
      </CardContainer>
    )
  }

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Alert bar */}
      {isDirty && (
        <InlineAlert
          type="warning"
          title="Unsaved Clinical Entries Detected"
          message="You have modified the patient's dental history. Save changes or drafts to seal the record before switching tabs."
        />
      )}

      {/* Real-time calculated Composite Score Indicator */}
      <OralHealthScore score={liveScore} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit((data) => onSave(data, false))} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Form: Stack of Sections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* previous treatments */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span>Previous Treatments Checklist</span>
              </h3>
              <PreviousTreatmentSection />
            </CardContainer>

            {/* oral hygiene */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-primary" />
                <span>Oral Hygiene Assessment</span>
              </h3>
              <OralHygieneSection />
            </CardContainer>

            {/* habits & risk factors */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-primary" />
                <span>Lifestyle Risk Factors</span>
              </h3>
              <HabitsRiskFactorsSection />
            </CardContainer>

            {/* complaints list */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span>Dental Complaint History</span>
              </h3>
              <ComplaintHistorySection />
            </CardContainer>

            {/* specialty (ortho, implant, dentures) */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-primary" />
                <span>Specialty Dental Records</span>
              </h3>
              <SpecialtyHistorySection />
            </CardContainer>

            {/* Bottom Floating Control Panel */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sticky bottom-4 bg-white/95 backdrop-blur-sm p-4 rounded-card border border-border shadow-premium z-10">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleReset}
                    className="w-full sm:w-auto font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
                  >
                    Reset Form
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2.5 ml-auto w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  isLoading={isSaving}
                  disabled={isSaving}
                  className="w-full sm:w-auto font-bold text-xs text-primary border border-primary/20 hover:bg-primary-light/10"
                >
                  Save Draft
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full sm:w-auto font-bold text-xs shadow-premium"
                >
                  Synchronize and Seal
                </Button>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Summary and Timeline */}
          <div className="space-y-6 sticky top-24">
            
            {/* Dental History Summary */}
            <CardContainer>
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 mb-4 flex items-center gap-1.5">
                <Stethoscope className="w-4.5 h-4.5 text-primary" />
                <span>Clinical Dental Summary</span>
              </h3>
              <DentalHistorySummaryCard
                summary={summary}
                history={history}
                isLoading={false}
              />
            </CardContainer>

            {/* Timeline Accordion Card */}
            <CardContainer>
              <button
                type="button"
                onClick={() => setShowTimeline((prev) => !prev)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <History className="w-4 h-4 text-primary" />
                  <span>Dossier Timeline ({timeline.length})</span>
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors">
                  {showTimeline ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {showTimeline && (
                <div className="mt-4 pt-4 border-t border-border/40 max-h-96 overflow-y-auto custom-scrollbar">
                  <DentalTimelineViewer timeline={timeline} />
                </div>
              )}
            </CardContainer>

          </div>

        </form>
      </FormProvider>
    </div>
  )
}
export default DentalHistoryTab
