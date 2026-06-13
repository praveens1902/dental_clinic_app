import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Save,
  RotateCcw,
  History,
  Activity,
  Printer,
  Calendar,
  HeartPulse,
  PlusCircle,
  FileSpreadsheet,
  Stethoscope,
} from 'lucide-react'

import { examinationService } from '../services/examinationService'
import { Examination, ExaminationTimelineItem, ExaminationSummary, ClinicalStatusBadgeType } from '../types'
import {
  examinationFormSchema,
  ExaminationFormSchemaType,
  getEmptyExaminationForm,
} from '../schemas'

import { CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { InlineAlert } from '@/components/ui/InlineAlert'
import { useAlertStore } from '@/store/alertStore'

import { ExaminationSkeleton } from './ExaminationSkeleton'
import { InteractiveOdontogram } from './InteractiveOdontogram'
import { ChiefComplaintSection } from './ChiefComplaintSection'
import { ClinicalFindingsSection } from './ClinicalFindingsSection'
import { DiagnosisManager } from './DiagnosisManager'
import { TreatmentRecommendationManager } from './TreatmentRecommendationManager'
import { ToothDetailsDrawer } from './ToothDetailsDrawer'

interface ExaminationTabProps {
  patientId: string
}

export const ExaminationTab: React.FC<ExaminationTabProps> = ({ patientId }) => {
  const { addToast, showModalAlert } = useAlertStore()

  const [activeExam, setActiveExam] = useState<Examination | null>(null)
  const [timeline, setTimeline] = useState<ExaminationTimelineItem[]>([])
  
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Configure Form
  const methods = useForm<ExaminationFormSchemaType>({
    resolver: zodResolver(examinationFormSchema),
    defaultValues: getEmptyExaminationForm(patientId),
  })

  const { reset, handleSubmit, watch, getValues, formState: { isDirty } } = methods

  // Load patient clinical profile
  const loadProfileExam = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [ex, t] = await Promise.all([
        examinationService.getByPatientId(patientId),
        examinationService.getTimelineByPatientId(patientId),
      ])

      setActiveExam(ex)
      setTimeline(t)

      if (ex) {
        reset({
          patientId: ex.patientId,
          chiefComplaint: ex.chiefComplaint,
          teeth: ex.teeth,
          findings: ex.findings,
          diagnoses: ex.diagnoses,
          recommendations: ex.recommendations,
          status: ex.status,
        })
      } else {
        reset(getEmptyExaminationForm(patientId))
      }
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Clinical Sync Failure',
        message: 'Could not fetch active patient examination charts.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfileExam()
  }, [patientId])

  // Real-time local metrics calculation to display on sidebar as the dentist is working!
  const watchedValues = watch()
  
  const localMetrics = React.useMemo<ExaminationSummary>(() => {
    const teeth = watchedValues?.teeth ?? {}
    const diagnoses = watchedValues?.diagnoses ?? []
    const recommendations = watchedValues?.recommendations ?? []

    const affectedTeethCount = Object.values(teeth).filter(
      (t: any) => t && t.condition !== 'Healthy'
    ).length

    const diagCount = diagnoses.length
    const recCount = recommendations.length

    // Compute status/risk dynamically
    let status: ClinicalStatusBadgeType = 'Healthy'
    let risk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low'

    const hasUrgent = recommendations.some((r: any) => r && r.priority === 'Urgent')
    const hasHigh = recommendations.some((r: any) => r && r.priority === 'High')
    const hasSevere = diagnoses.some((d: any) => d && d.severity === 'Severe')

    if (hasUrgent || hasSevere) {
      status = 'Urgent'
      risk = 'Critical'
    } else if (hasHigh || affectedTeethCount >= 3) {
      status = 'Requires Treatment'
      risk = 'High'
    } else if (affectedTeethCount > 0 || recCount > 0) {
      status = 'Observation'
      risk = 'Medium'
    }

    return {
      totalAffectedTeeth: affectedTeethCount,
      diagnosesCount: diagCount,
      recommendedTreatmentsCount: recCount,
      riskLevel: risk,
      clinicalStatus: status,
    }
  }, [watchedValues])

  // Save changes handler (draft or finalized seal)
  const handleSave = async (data: ExaminationFormSchemaType, status: 'Draft' | 'Completed') => {
    setIsSaving(true)
    try {
      const saved = await examinationService.save(
        patientId,
        {
          chiefComplaint: data.chiefComplaint,
          teeth: data.teeth,
          findings: data.findings,
          diagnoses: data.diagnoses,
          recommendations: data.recommendations,
          status,
        },
        'Dr. Ananya Iyer'
      )

      const [t] = await Promise.all([
        examinationService.getTimelineByPatientId(patientId),
      ])

      setActiveExam(saved)
      setTimeline(t)
      
      // Update form defaults to clear dirtiness
      reset({
        ...data,
        status,
      })

      addToast({
        type: 'success',
        title: status === 'Completed' ? 'Examination Locked & Finalized' : 'Draft Progress Saved',
        message: status === 'Completed'
          ? 'Clinical findings are permanently sealed in patient timeline.'
          : 'Your examination progress draft has been successfully stored.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Clinical Record Failed',
        message: 'Could not transmit examination details to secure database.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Quick Command Triggers
  const handleCreatePrescription = () => {
    addToast({
      type: 'success',
      title: 'Prescription Sync',
      message: 'Linked clinical recommendations into the digital prescription notepad.',
    })
  }

  const handleCreateTreatmentPlan = () => {
    addToast({
      type: 'success',
      title: 'Treatment Planner Activated',
      message: 'Generated structural treatment phase schedule from recommendations.',
    })
  }

  const handleBookFollowUp = () => {
    addToast({
      type: 'info',
      title: 'Calendar Opened',
      message: 'Initiated follow-up scheduling panel with patient assignment pre-flight.',
    })
  }

  const handlePrintSummary = () => {
    showModalAlert({
      type: 'info',
      title: 'Generate Print Summary?',
      message: 'This will compile clinical findings, affected dental quadrants, and proposed treatments into an aesthetic PDF print summary.',
      confirmLabel: 'Trigger System Print',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        window.print()
      },
    })
  }

  const handleResetForm = () => {
    showModalAlert({
      type: 'warning',
      title: 'Discard Changes?',
      message: 'This will permanently revert all clinical entries back to the last synced checkpoint.',
      confirmLabel: 'Discard and Revert',
      cancelLabel: 'Keep Editing',
      onConfirm: () => {
        if (activeExam) {
          reset({
            patientId: activeExam.patientId,
            chiefComplaint: activeExam.chiefComplaint,
            teeth: activeExam.teeth,
            findings: activeExam.findings,
            diagnoses: activeExam.diagnoses,
            recommendations: activeExam.recommendations,
            status: activeExam.status,
          })
        } else {
          reset(getEmptyExaminationForm(patientId))
        }
        addToast({
          type: 'info',
          title: 'Changes Discarded',
          message: 'Examination fields returned to clinic baseline.',
        })
      },
    })
  }

  // Handle errors showing up during sealing attempts
  const handleValidationFailed = (errorsList: any) => {
    let message = 'Please correct the highlighted form errors before locking.'
    if (errorsList.findings?.message) {
      message = errorsList.findings.message
    }
    
    addToast({
      type: 'error',
      title: 'Verification Incomplete',
      message,
    })
  }

  if (isLoading) {
    return <ExaminationSkeleton />
  }

  if (hasError) {
    return (
      <CardContainer className="text-center py-12 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-text-primary">Clinical Module Disconnected</h3>
        <p className="text-xs text-text-secondary mt-2 mb-6 leading-relaxed">
          The odontogram chart engine cannot fetch the secure clinical patient profile. Check internet connectivity and try again.
        </p>
        <Button variant="primary" onClick={loadProfileExam}>
          Reconnect Engine
        </Button>
      </CardContainer>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Unsaved Alert Bar */}
      {isDirty && (
        <InlineAlert
          type="warning"
          title="Clinical Changes Pending Save"
          message="You have modified the active patient's dental chart. Seal or cache as draft to prevent data loss."
        />
      )}

      {/* 2. Standard Form Provider wrapper */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            (data) => handleSave(data, 'Completed'),
            (errs) => handleValidationFailed(errs)
          )}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
          {/* Main workspace section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chief Complaint */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <HeartPulse className="w-4.5 h-4.5 text-primary" />
                <span>Chief Complaint Registration</span>
              </h3>
              <ChiefComplaintSection />
            </CardContainer>

            {/* Interactive Odontogram Chart Board */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Stethoscope className="w-4.5 h-4.5 text-primary" />
                <span>Interactive Anatomical Odontogram</span>
              </h3>
              <InteractiveOdontogram
                selectedToothNumber={selectedTooth}
                onToothSelect={(num) => setSelectedTooth(num)}
              />
            </CardContainer>

            {/* Clinical General Findings */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-primary" />
                <span>General Soft/Hard Tissue Findings</span>
              </h3>
              <ClinicalFindingsSection />
            </CardContainer>

            {/* Diagnosis Checklist Manager */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-primary" />
                <span>Clinical Diagnosis Manager</span>
              </h3>
              <DiagnosisManager />
            </CardContainer>

            {/* Treatment Recommendation Manager */}
            <CardContainer className="space-y-6">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4.5 h-4.5 text-primary" />
                <span>Proposed Treatment recommendations</span>
              </h3>
              <TreatmentRecommendationManager />
            </CardContainer>

            {/* Interactive Floating Actions Drawer Footer bar */}
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
                    Reset Changes
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2.5 ml-auto w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSave(getValues(), 'Draft')}
                  isLoading={isSaving}
                  disabled={isSaving}
                  className="w-full sm:w-auto font-bold text-xs text-primary border border-primary/20 hover:bg-primary-light/10"
                >
                  Save Draft Progress
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full sm:w-auto font-bold text-xs shadow-premium"
                >
                  Finalize and Lock
                </Button>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 sticky top-24">
            
            {/* Current Active Status Indicator */}
            <CardContainer className="space-y-4">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5">
                <HeartPulse className="w-4.5 h-4.5 text-primary" />
                <span>Dental Health Index</span>
              </h3>
              
              {/* Risk Banner */}
              <div className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center space-y-2 ${
                localMetrics.clinicalStatus === 'Urgent' ? 'bg-danger/5 border-danger/20 text-danger' :
                localMetrics.clinicalStatus === 'Requires Treatment' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                localMetrics.clinicalStatus === 'Observation' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                'bg-success/5 border-success/20 text-success'
              }`}>
                <span className="text-[10px] font-extrabold uppercase text-text-secondary">Clinical Care Level</span>
                <span className="text-lg font-black tracking-wide uppercase">{localMetrics.clinicalStatus}</span>
                <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                  localMetrics.riskLevel === 'Critical' ? 'bg-danger text-white' :
                  localMetrics.riskLevel === 'High' ? 'bg-orange-600 text-white' :
                  localMetrics.riskLevel === 'Medium' ? 'bg-blue-600 text-white' : 'bg-success text-white'
                }`}>
                  {localMetrics.riskLevel} Risk Profile
                </span>
              </div>

              {/* Counts metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-background/20 border border-border/60 rounded-xl p-2.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase">Affected</span>
                  <p className="text-lg font-black text-text-primary leading-tight">{localMetrics.totalAffectedTeeth}</p>
                </div>
                <div className="bg-background/20 border border-border/60 rounded-xl p-2.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase">Diagnoses</span>
                  <p className="text-lg font-black text-text-primary leading-tight">{localMetrics.diagnosesCount}</p>
                </div>
                <div className="bg-background/20 border border-border/60 rounded-xl p-2.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase">Proposals</span>
                  <p className="text-lg font-black text-text-primary leading-tight">{localMetrics.recommendedTreatmentsCount}</p>
                </div>
              </div>
            </CardContainer>

            {/* Quick Actions Panel */}
            <CardContainer className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-primary" />
                <span>Interactive Workflows</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                  onClick={handleCreatePrescription}
                  className="font-bold text-xs bg-white text-text-primary border-border/80 hover:bg-background justify-start"
                >
                  Create Patient Prescription
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  leftIcon={<Stethoscope className="w-4 h-4" />}
                  onClick={handleCreateTreatmentPlan}
                  className="font-bold text-xs bg-white text-text-primary border-border/80 hover:bg-background justify-start"
                >
                  Create Treatment Plan
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  onClick={handleBookFollowUp}
                  className="font-bold text-xs bg-white text-text-primary border-border/80 hover:bg-background justify-start"
                >
                  Book Follow-Up session
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  leftIcon={<Printer className="w-4 h-4" />}
                  onClick={handlePrintSummary}
                  className="font-bold text-xs bg-white text-text-primary border-border/80 hover:bg-background justify-start"
                >
                  Print Clinical Summary
                </Button>
              </div>
            </CardContainer>

            {/* Examination logs Timeline */}
            <CardContainer>
              <button
                type="button"
                onClick={() => setShowTimeline((prev) => !prev)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <History className="w-4 h-4 text-primary" />
                  <span>Clinical Exam Logs ({timeline.length})</span>
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors">
                  {showTimeline ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {showTimeline && (
                <div className="mt-4 pt-4 border-t border-border/40 max-h-96 overflow-y-auto custom-scrollbar space-y-4">
                  {timeline.length === 0 ? (
                    <div className="text-center py-6 text-xs text-text-secondary/50 font-bold">
                      No previous clinical dental records on file.
                    </div>
                  ) : (
                    <div className="relative pl-4 border-l border-border/80 space-y-5 pt-1 ml-2">
                      {timeline.map((item) => (
                        <div key={item.id} className="relative text-left">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
                          <div className="text-xs font-semibold text-text-primary">
                            <p className="font-bold text-text-primary">{item.summary}</p>
                            <p className="text-[9px] text-text-secondary/80 mt-1">
                              Chief Complaint: &ldquo;{item.chiefComplaint}&rdquo;
                            </p>
                            <span className="text-[9px] text-text-secondary/60 block mt-1.5 font-bold">
                              {new Date(item.date).toLocaleDateString([], {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                              {' • By '}{item.doctorName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContainer>

          </div>

        </form>
      </FormProvider>

      {/* Selected Tooth Details slide-over drawer */}
      <ToothDetailsDrawer
        toothNumber={selectedTooth}
        onClose={() => setSelectedTooth(null)}
      />

    </div>
  )
}
export default ExaminationTab
