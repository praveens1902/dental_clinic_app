import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Save,
  RotateCcw,
  History,
  Activity,
  Calendar,
  Stethoscope,
  ClipboardList,
  HeartPulse,
} from 'lucide-react'

import { clinicalNotesService } from '../services/clinicalNotesService'
import { HistoricalTreatment, ClinicalTimelineItem, ClinicalNotesSummary } from '../types'
import {
  clinicalNotesFormSchema,
  ClinicalNotesFormSchemaType,
  getEmptyClinicalNotesForm,
} from '../schemas'

import { CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { InlineAlert } from '@/components/ui/InlineAlert'
import { Textarea } from '@/components/ui/Textarea'
import { useAlertStore } from '@/store/alertStore'

import { ClinicalNotesSkeleton } from './ClinicalNotesSkeleton'
import { TreatmentHistoryTable } from './TreatmentHistoryTable'
import { TreatmentDoneTodayManager } from './TreatmentDoneTodayManager'
import { TreatmentPlanningManager } from './TreatmentPlanningManager'
import { CostEstimationSection } from './CostEstimationSection'
import { FollowUpPlanner } from './FollowUpPlanner'
import { ClinicalTimelineViewer } from './ClinicalTimelineViewer'

interface ClinicalNotesTabProps {
  patientId: string
}

export const ClinicalNotesTab: React.FC<ClinicalNotesTabProps> = ({ patientId }) => {
  const { addToast, showModalAlert } = useAlertStore()

  const [history, setHistory] = useState<HistoricalTreatment[]>([])
  const [timeline, setTimeline] = useState<ClinicalTimelineItem[]>([])
  const [summary, setSummary] = useState<ClinicalNotesSummary | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  // Configure Form methods
  const methods = useForm<ClinicalNotesFormSchemaType>({
    resolver: zodResolver(clinicalNotesFormSchema),
    defaultValues: getEmptyClinicalNotesForm(patientId),
  })

  const { reset, handleSubmit, register, formState: { isDirty } } = methods

  // Load clinical database profile
  const loadClinicalData = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [h, p, t, s] = await Promise.all([
        clinicalNotesService.getHistoryByPatientId(patientId),
        clinicalNotesService.getPlansByPatientId(patientId),
        clinicalNotesService.getTimelineByPatientId(patientId),
        clinicalNotesService.getSummary(patientId),
      ])

      setHistory(h)
      setTimeline(t)
      setSummary(s)

      reset({
        patientId,
        todayTreatments: [], // Initial state is empty for today's entry
        plannedTreatments: p, // Load ongoing future plans
        followUp: {
          followUpDate: '',
          followUpTime: '',
          remarks: '',
        },
        clinicalSummaryNotes: '',
      })
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Connection Offline',
        message: 'Could not retrieve patient clinical history ledger.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClinicalData()
  }, [patientId])

  // Save clinical sheets (saves today's procedures and updates plans)
  const onSave = async (data: ClinicalNotesFormSchemaType, isDraft = false) => {
    setIsSaving(true)
    try {
      await clinicalNotesService.save(
        patientId,
        {
          todayTreatments: data.todayTreatments.map(t => ({
            toothNumber: t.toothNumber,
            treatmentName: t.treatmentName,
            materialsUsed: t.materialsUsed || '',
            notes: t.notes,
            duration: t.duration,
          })),
          plannedTreatments: data.plannedTreatments,
          clinicalSummaryNotes: data.clinicalSummaryNotes,
        },
        'Dr. Ananya Iyer'
      )

      // Refresh listings, timeline & counts
      const [h, p, t, s] = await Promise.all([
        clinicalNotesService.getHistoryByPatientId(patientId),
        clinicalNotesService.getPlansByPatientId(patientId),
        clinicalNotesService.getTimelineByPatientId(patientId),
        clinicalNotesService.getSummary(patientId),
      ])

      setHistory(h)
      setTimeline(t)
      setSummary(s)

      // Clear today's treatments once locked into historical table
      reset({
        patientId,
        todayTreatments: [],
        plannedTreatments: p,
        followUp: {
          followUpDate: '',
          followUpTime: '',
          remarks: '',
        },
        clinicalSummaryNotes: '',
      })

      addToast({
        type: 'success',
        title: isDraft ? 'Draft Cached Successfully' : 'Clinical Records Locked',
        message: isDraft 
          ? 'Procedures draft successfully synced with clinical nodes.'
          : 'Patient treatment courses updated and timeline events sealed.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Operation Failed',
        message: 'Could not transmit clinical notes to patient database.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = () => {
    const currentValues = methods.getValues()
    onSave(currentValues, true)
  }

  const handleResetForm = () => {
    showModalAlert({
      type: 'warning',
      title: 'Discard Clinical Notes?',
      message: 'You have entered unsaved clinical entries. Discarding will clear active textareas and revert planned values.',
      confirmLabel: 'Discard and Revert',
      cancelLabel: 'Keep Editing',
      onConfirm: async () => {
        setIsLoading(true)
        try {
          const p = await clinicalNotesService.getPlansByPatientId(patientId)
          reset({
            patientId,
            todayTreatments: [],
            plannedTreatments: p,
            followUp: {
              followUpDate: '',
              followUpTime: '',
              remarks: '',
            },
            clinicalSummaryNotes: '',
          })
          addToast({
            type: 'info',
            title: 'Form Reset',
            message: 'Clinical notes fields cleared.',
          })
        } catch (err) {
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      },
    })
  }

  const handleValidationFailed = (errorsList: any) => {
    let message = 'Please correct the highlighted errors before saving clinical notes.'
    if (errorsList.clinicalSummaryNotes?.message) {
      message = errorsList.clinicalSummaryNotes.message
    }
    
    addToast({
      type: 'error',
      title: 'Input Validation Warning',
      message,
    })
  }

  if (isLoading) {
    return <ClinicalNotesSkeleton />
  }

  if (hasError) {
    return (
      <CardContainer className="text-center py-12 max-w-lg mx-auto animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-text-primary">Clinical Module Offline</h3>
        <p className="text-xs text-text-secondary mt-2 mb-6 leading-relaxed">
          The Sirona notes and planning engine could not establish a connection to clinical database records.
        </p>
        <Button variant="primary" onClick={loadClinicalData}>
          Reconnect Ledger
        </Button>
      </CardContainer>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Dynamic Summary Cards Deck */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Active Diagnoses</span>
            <p className="text-2xl font-black text-danger flex items-center gap-1.5 leading-none">
              <HeartPulse className="w-5 h-5 shrink-0" />
              <span>{summary.activeDiagnosesCount}</span>
            </p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Affected Teeth</span>
            <p className="text-2xl font-black text-primary flex items-center gap-1.5 leading-none">
              <Stethoscope className="w-5 h-5 shrink-0 animate-pulse" />
              <span>{summary.affectedTeethCount}</span>
            </p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Pending Plan Items</span>
            <p className="text-2xl font-black text-teal-500 flex items-center gap-1.5 leading-none">
              <ClipboardList className="w-5 h-5 shrink-0" />
              <span>{summary.pendingPlansCount}</span>
            </p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-left space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Latest Examination</span>
            <p className="text-xs font-black text-text-primary leading-tight mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-text-secondary" />
              <span>
                {summary.latestExamDate
                  ? new Date(summary.latestExamDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'No screenings yet'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Unsaved warning bar */}
      {isDirty && (
        <InlineAlert
          type="warning"
          title="Unsaved Clinical Entries"
          message="You have added procedures today or modified future treatment plans. Don't forget to synchronize before navigating."
        />
      )}

      {/* Main Grid Wrapper */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            (data) => onSave(data, false),
            (errs) => handleValidationFailed(errs)
          )}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
          
          {/* Main workspace Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Historical Procedures Table */}
            <CardContainer className="space-y-4">
              <TreatmentHistoryTable data={history} />
            </CardContainer>

            {/* Today's Treatment Manager */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Stethoscope className="w-4.5 h-4.5 text-primary" />
                <span>Recorded Treatment Done Today</span>
              </h3>
              <TreatmentDoneTodayManager />
            </CardContainer>

            {/* Future Treatment Planner Manager */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <ClipboardList className="w-4.5 h-4.5 text-primary" />
                <span>Clinician Future Treatment Plan</span>
              </h3>
              <TreatmentPlanningManager />
            </CardContainer>

            {/* Cost Projections Section */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-primary" />
                <span>Financial Cost Projections Sheet</span>
              </h3>
              <CostEstimationSection />
            </CardContainer>

            {/* Follow-Up Planner */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-primary" />
                <span>Propose Follow-Up Appointment</span>
              </h3>
              <FollowUpPlanner />
            </CardContainer>

            {/* General notes */}
            <CardContainer className="space-y-4 text-left">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-primary" />
                <span>Clinical Notes &amp; Summary Block</span>
              </h3>
              <Textarea
                placeholder="Enter general dental summary notes covering today's visit or clinical remarks..."
                rows={4}
                {...register('clinicalSummaryNotes')}
              />
            </CardContainer>

            {/* Action panel */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-card border border-border shadow-premium sticky bottom-4 z-10">
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
                  Save Draft Notes
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full sm:w-auto font-bold text-xs shadow-premium"
                >
                  Commit and Sync Ledger
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column: Clinical history Timeline */}
          <div className="space-y-6 sticky top-24">
            
            {/* Timeline Accordion */}
            <CardContainer>
              <button
                type="button"
                onClick={() => setShowTimeline((prev) => !prev)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <History className="w-4 h-4 text-primary animate-pulse" />
                  <span>Clinical Log Timeline ({timeline.length})</span>
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors">
                  {showTimeline ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {showTimeline && (
                <div className="mt-4 pt-4 border-t border-border/40 max-h-96 overflow-y-auto custom-scrollbar">
                  <ClinicalTimelineViewer timeline={timeline} />
                </div>
              )}
            </CardContainer>

          </div>

        </form>
      </FormProvider>

    </div>
  )
}
export default ClinicalNotesTab
