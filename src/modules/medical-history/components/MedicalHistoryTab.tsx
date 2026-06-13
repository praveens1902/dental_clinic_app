import React, { useState, useEffect } from 'react'
import {
  Save,
  RotateCcw,
  History,
  Heart,
  Activity
} from 'lucide-react'

import { medicalHistoryService } from '../services/medicalHistoryService'
import {
  MedicalHistory,
  MedicalHistoryTimelineItem,
  MedicalHistorySummary,
  MedicalConditions,
  MedicalVitals,
  Medication,
  Allergy,
  Surgery,
} from '../types'

import { CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { InlineAlert } from '@/components/ui/InlineAlert'
import { useAlertStore } from '@/store/alertStore'

import { MedicalHistorySkeleton } from './MedicalHistorySkeleton'
import { MedicalConditionsSection } from './MedicalConditionsSection'
import { MedicalVitalsSection } from './MedicalVitalsSection'
import { MedicationManager } from './MedicationManager'
import { AllergyManager } from './AllergyManager'
import { SurgeryManager } from './SurgeryManager'
import { MedicalTimelineViewer } from './MedicalTimelineViewer'
import { MedicalHistorySummaryCard } from './MedicalHistorySummaryCard'

interface MedicalHistoryTabProps {
  patientId: string
}

export const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ patientId }) => {
  const { addToast, showModalAlert } = useAlertStore()

  const [history, setHistory] = useState<MedicalHistory | null>(null)
  const [timeline, setTimeline] = useState<MedicalHistoryTimelineItem[]>([])
  const [summary, setSummary] = useState<MedicalHistorySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  const [conditions, setConditions] = useState<MedicalConditions>({
    bloodPressure: false,
    diabetes: false,
    asthma: false,
    cholesterol: false,
    thyroidDisease: false,
    heartDisease: false,
    kidneyDisease: false,
    liverDisease: false,
    pregnancy: false,
    medicineAllergies: false,
  })
  const [vitals, setVitals] = useState<MedicalVitals>({
    bpReading: '',
    bloodSugarLevel: '',
    height: '',
    weight: '',
    bmi: '',
    bloodGroup: '',
  })
  const [medications, setMedications] = useState<Medication[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [surgeries, setSurgeries] = useState<Surgery[]>([])
  const [otherConditions, setOtherConditions] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setHasError(false)
      try {
        const [h, t, s] = await Promise.all([
          medicalHistoryService.getByPatientId(patientId),
          medicalHistoryService.getTimelineByPatientId(patientId),
          medicalHistoryService.getSummary(patientId),
        ])

        setHistory(h)
        setTimeline(t)
        setSummary(s)

        if (h) {
          setConditions(h.conditions)
          setVitals(h.vitals)
          setMedications(h.medications || [])
          setAllergies(h.allergies || [])
          setSurgeries(h.surgeries || [])
          setOtherConditions(h.otherConditions || '')
        }
        setIsDirty(false)
      } catch (err) {
        setHasError(true)
        addToast({
          type: 'error',
          title: 'Loading Failed',
          message: 'Could not load medical history records.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [patientId, addToast])

  // BMI Auto-calculation
  useEffect(() => {
    const h = parseFloat(vitals.height)
    const w = parseFloat(vitals.weight)
    if (h && w && h > 0 && w > 0) {
      const bmi = w / ((h / 100) * (h / 100))
      setVitals((prev) => ({ ...prev, bmi: bmi.toFixed(1) }))
    }
  }, [vitals.height, vitals.weight])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload: Omit<MedicalHistory, 'id' | 'patientId' | 'updatedAt' | 'updatedBy'> = {
        conditions,
        vitals,
        medications,
        allergies,
        surgeries,
        otherConditions: otherConditions || '',
      }

      const saved = await medicalHistoryService.save(patientId, payload)

      // Refresh timeline and summary
      const [t, s] = await Promise.all([
        medicalHistoryService.getTimelineByPatientId(patientId),
        medicalHistoryService.getSummary(patientId),
      ])

      setHistory(saved)
      setTimeline(t)
      setSummary(s)
      setIsDirty(false)

      addToast({
        type: 'success',
        title: 'Medical History Saved',
        message: 'Patient medical records updated successfully.',
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save medical history records.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    showModalAlert({
      type: 'warning',
      title: 'Unsaved Changes',
      message: 'You have unsaved changes in the medical history form. Are you sure you want to discard them?',
      confirmLabel: 'Discard Changes',
      cancelLabel: 'Stay & Edit',
      onConfirm: () => {
        if (history) {
          setConditions(history.conditions)
          setVitals(history.vitals)
          setMedications(history.medications || [])
          setAllergies(history.allergies || [])
          setSurgeries(history.surgeries || [])
          setOtherConditions(history.otherConditions || '')
        } else {
          setConditions({
            bloodPressure: false,
            diabetes: false,
            asthma: false,
            cholesterol: false,
            thyroidDisease: false,
            heartDisease: false,
            kidneyDisease: false,
            liverDisease: false,
            pregnancy: false,
            medicineAllergies: false,
          })
          setVitals({
            bpReading: '',
            bloodSugarLevel: '',
            height: '',
            weight: '',
            bmi: '',
            bloodGroup: '',
          })
          setMedications([])
          setAllergies([])
          setSurgeries([])
          setOtherConditions('')
        }
        setIsDirty(false)
      },
    })
  }

  if (isLoading) {
    return <MedicalHistorySkeleton />
  }

  if (hasError) {
    return (
      <CardContainer className="text-center py-12 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-text-primary">Failed to Load Medical History</h3>
        <p className="text-xs text-text-secondary mt-2 mb-6">
          An error occurred while retrieving the patient&apos;s medical records.
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </CardContainer>
    )
  }

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Warning */}
      {isDirty && (
        <InlineAlert
          type="warning"
          title="Unsaved Changes"
          message="You have unsaved changes to the medical history. Don't forget to save before navigating away."
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">

          {/* Conditions */}
          <CardContainer>
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5 mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <span>Medical Conditions</span>
            </h3>
            <MedicalConditionsSection
              conditions={conditions}
              onChange={(c) => { setConditions(c); setIsDirty(true) }}
            />
          </CardContainer>

          {/* Vitals */}
          <CardContainer>
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              <span>Vital Information</span>
            </h3>
            <MedicalVitalsSection
              vitals={vitals}
              onChange={(v) => { setVitals(v); setIsDirty(true) }}
            />
          </CardContainer>

          {/* Medications */}
          <CardContainer>
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 mb-4">
              Current Medications
            </h3>
            <MedicationManager
              medications={medications}
              onChange={(m) => { setMedications(m); setIsDirty(true) }}
            />
          </CardContainer>

          {/* Allergies */}
          <CardContainer>
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 mb-4">
              Allergies
            </h3>
            <AllergyManager
              allergies={allergies}
              onChange={(a) => { setAllergies(a); setIsDirty(true) }}
            />
          </CardContainer>

          {/* Surgeries */}
          <CardContainer>
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 mb-4">
              Previous Surgeries
            </h3>
            <SurgeryManager
              surgeries={surgeries}
              onChange={(s) => { setSurgeries(s); setIsDirty(true) }}
            />
          </CardContainer>

          {/* Other Conditions */}
          <CardContainer>
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 mb-4">
              Other Medical Conditions
            </h3>
            <Textarea
              label="Additional Notes"
              placeholder="Enter any other medical conditions, concerns, or notes not covered above..."
              rows={4}
              value={otherConditions}
              onChange={(e) => { setOtherConditions(e.target.value); setIsDirty(true) }}
            />
          </CardContainer>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sticky bottom-0 bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border/60 shadow-premium">
            <div className="flex items-center gap-2 ml-auto">
              {isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                isLoading={isSaving}
                disabled={!isDirty || isSaving}
                leftIcon={<Save className="w-4 h-4" />}
                onClick={handleSave}
              >
                Save Medical History
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar: Summary + Timeline */}
        <div className="space-y-6">
          {/* Summary Card */}
          <CardContainer>
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 mb-4 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-primary" />
              <span>Medical Summary</span>
            </h3>
            <MedicalHistorySummaryCard
              summary={summary}
              history={history}
              isLoading={false}
            />
          </CardContainer>

          {/* Timeline Toggle */}
          <CardContainer>
            <button
              type="button"
              onClick={() => setShowTimeline((prev) => !prev)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                <History className="w-4 h-4 text-primary" />
                <span>Timeline ({timeline.length})</span>
              </h3>
              <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                {showTimeline ? 'Hide' : 'Show'}
              </span>
            </button>

            {showTimeline && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <MedicalTimelineViewer timeline={timeline} />
              </div>
            )}
          </CardContainer>
        </div>
      </div>
    </div>
  )
}
