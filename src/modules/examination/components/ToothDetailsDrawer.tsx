import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Check, RotateCcw, Info } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { ToothState, ToothCondition, ToothSurfaces } from '../types'
import { ExaminationFormSchemaType } from '../schemas'

interface ToothDetailsDrawerProps {
  toothNumber: number | null
  onClose: () => void
}

// Clinically correct tooth name resolver
export const getToothName = (num: number): string => {
  const isAdult = num < 50
  const quadrant =
    num >= 11 && num <= 18 ? 'Upper Right Permanent' :
    num >= 21 && num <= 28 ? 'Upper Left Permanent' :
    num >= 31 && num <= 38 ? 'Lower Left Permanent' :
    num >= 41 && num <= 48 ? 'Lower Right Permanent' :
    num >= 51 && num <= 55 ? 'Upper Right Deciduous' :
    num >= 61 && num <= 65 ? 'Upper Left Deciduous' :
    num >= 71 && num <= 75 ? 'Lower Left Deciduous' : 'Lower Right Deciduous'

  const toothTypeIdx = num % 10
  let toothName = 'Unknown'

  if (isAdult) {
    toothName =
      toothTypeIdx === 1 ? 'Central Incisor' :
      toothTypeIdx === 2 ? 'Lateral Incisor' :
      toothTypeIdx === 3 ? 'Canine' :
      toothTypeIdx === 4 ? 'First Premolar' :
      toothTypeIdx === 5 ? 'Second Premolar' :
      toothTypeIdx === 6 ? 'First Molar' :
      toothTypeIdx === 7 ? 'Second Molar' : 'Third Molar (Wisdom)'
  } else {
    // Deciduous / child teeth do not have premolars
    toothName =
      toothTypeIdx === 1 ? 'Central Incisor' :
      toothTypeIdx === 2 ? 'Lateral Incisor' :
      toothTypeIdx === 3 ? 'Canine' :
      toothTypeIdx === 4 ? 'First Molar' : 'Second Molar'
  }

  return `${quadrant} ${toothName} (#${num})`
}

export const ToothDetailsDrawer: React.FC<ToothDetailsDrawerProps> = ({
  toothNumber,
  onClose,
}) => {
  const { getValues, setValue } = useFormContext<ExaminationFormSchemaType>()
  
  // Local sandboxed tooth state
  const [localState, setLocalState] = useState<ToothState | null>(null)

  // Load from parent form context when tooth number changes
  useEffect(() => {
    if (toothNumber === null) {
      setLocalState(null)
      return
    }

    const parentState = getValues(`teeth.${toothNumber}` as any) as ToothState
    if (parentState) {
      setLocalState(JSON.parse(JSON.stringify(parentState))) // Deep clone
    } else {
      setLocalState({
        toothNumber,
        condition: 'Healthy',
        surfaces: { mesial: false, distal: false, occlusal: false, buccal: false, lingual: false },
        findings: '',
        diagnosis: '',
        recommendedTreatment: '',
        notes: '',
      })
    }
  }, [toothNumber, getValues])

  if (toothNumber === null || !localState) return null

  const handleConditionChange = (cond: ToothCondition) => {
    setLocalState((prev) => {
      if (!prev) return null
      
      // If setting to Healthy, clear surface flags too as safety default
      const surfaces = cond === 'Healthy' 
        ? { mesial: false, distal: false, occlusal: false, buccal: false, lingual: false } 
        : prev.surfaces

      return {
        ...prev,
        condition: cond,
        surfaces,
      }
    })
  }

  const handleSurfaceToggle = (surface: keyof ToothSurfaces) => {
    setLocalState((prev) => {
      if (!prev) return null
      return {
        ...prev,
        surfaces: {
          ...prev.surfaces,
          [surface]: !prev.surfaces[surface],
        },
      }
    })
  }

  const handleFieldChange = (field: 'findings' | 'diagnosis' | 'recommendedTreatment' | 'notes', val: string) => {
    setLocalState((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [field]: val,
      }
    })
  }

  const handleReset = () => {
    const parentState = getValues(`teeth.${toothNumber}` as any) as ToothState
    if (parentState) {
      setLocalState(JSON.parse(JSON.stringify(parentState)))
    }
  }

  const handleSave = () => {
    // Commit the local sandbox changes back to parent React Hook Form
    setValue(`teeth.${toothNumber}` as any, localState, { shouldDirty: true, shouldValidate: true })
    
    // Proactively suggest treatment or diagnosis to main managers if they are set on the tooth!
    if (localState.diagnosis && localState.diagnosis.trim()) {
      const currentDiagnoses = getValues('diagnoses') || []
      const alreadyExists = currentDiagnoses.some(d => d.diagnosisName.toLowerCase() === localState.diagnosis?.toLowerCase())
      if (!alreadyExists) {
        setValue('diagnoses', [
          ...currentDiagnoses,
          {
            id: Math.random().toString(36).substring(2, 9),
            diagnosisName: localState.diagnosis.trim(),
            category: 'Endodontics', // default fallback
            severity: 'Mild',
            notes: `Recorded on Tooth #${toothNumber}`,
          }
        ], { shouldDirty: true })
      }
    }

    if (localState.recommendedTreatment && localState.recommendedTreatment.trim()) {
      const currentRecs = getValues('recommendations') || []
      const alreadyExists = currentRecs.some(r => r.treatmentName.toLowerCase() === localState.recommendedTreatment?.toLowerCase() && r.toothNumber === toothNumber.toString())
      if (!alreadyExists) {
        setValue('recommendations', [
          ...currentRecs,
          {
            id: Math.random().toString(36).substring(2, 9),
            toothNumber: toothNumber.toString(),
            treatmentName: localState.recommendedTreatment.trim(),
            priority: 'Medium',
            estimatedCost: 3500, // default fallback
            notes: 'Generated from Tooth Drawer details',
          }
        ], { shouldDirty: true })
      }
    }

    onClose()
  }

  const ALL_CONDITIONS: { value: ToothCondition; label: string }[] = [
    { value: 'Healthy', label: 'Healthy (Unremarkable)' },
    { value: 'Caries', label: 'Caries (Incipient)' },
    { value: 'Decay', label: 'Dental Decay (Cavity)' },
    { value: 'Fracture', label: 'Fractured/Chipped' },
    { value: 'Missing', label: 'Missing / Extracted' },
    { value: 'Filled', label: 'Restored Filling' },
    { value: 'Crown', label: 'Crown Placement' },
    { value: 'Bridge', label: 'Bridge Anchor' },
    { value: 'Implant', label: 'Dental Implant' },
    { value: 'Root Canal Treated', label: 'Root Canal Treated (RCT)' },
    { value: 'Mobility', label: 'Tooth Mobility' },
    { value: 'Sensitivity', label: 'Dentin Sensitivity' },
    { value: 'Impacted', label: 'Impacted Molar' },
    { value: 'Wear', label: 'Tooth Wear (Attrition/Abfraction)' },
    { value: 'Stain', label: 'Stained/Discolored' },
    { value: 'Extraction Recommended', label: 'Extraction Recommended' },
  ]

  const SURFACE_LABELS: { key: keyof ToothSurfaces; label: string; desc: string }[] = [
    { key: 'buccal', label: 'Buccal / Labial', desc: 'Outer cheek/lip-facing surface' },
    { key: 'mesial', label: 'Mesial', desc: 'Front-facing side surface (towards midline)' },
    { key: 'occlusal', label: 'Occlusal / Incisal', desc: 'Biting/chewing surface' },
    { key: 'distal', label: 'Distal', desc: 'Back-facing side surface (away from midline)' },
    { key: 'lingual', label: 'Lingual / Palatal', desc: 'Inner tongue-facing surface' },
  ]

  const drawerTitle = getToothName(toothNumber)

  const footerActions = (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<RotateCcw className="w-4 h-4" />}
        onClick={handleReset}
        className="font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
      >
        Reset Tooth
      </Button>
      <Button
        type="button"
        variant="primary"
        size="sm"
        leftIcon={<Check className="w-4 h-4" />}
        onClick={handleSave}
        className="font-bold text-xs shadow-premium"
      >
        Save Tooth
      </Button>
    </>
  )

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title={drawerTitle}
      size="md"
      footer={footerActions}
    >
      <div className="space-y-6">
        
        {/* 1. Condition Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
            Clinical Tooth Condition
          </label>
          <Select
            placeholder="Select condition..."
            value={localState.condition}
            onChange={(e) => handleConditionChange(e.target.value as ToothCondition)}
            options={ALL_CONDITIONS}
          />
        </div>

        {/* 2. Surface Clicker */}
        {localState.condition !== 'Healthy' && localState.condition !== 'Missing' && (
          <div className="space-y-3.5 bg-background/30 p-4 border border-border/60 rounded-xl">
            <div>
              <label className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Affected Surfaces
              </label>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Select which specific surfaces of the tooth show this condition.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {SURFACE_LABELS.map((surf) => (
                <div
                  key={surf.key}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${
                    localState.surfaces[surf.key]
                      ? 'bg-primary-light/10 border-primary/20'
                      : 'bg-white/80 border-border/60 hover:border-border'
                  }`}
                  onClick={() => handleSurfaceToggle(surf.key)}
                >
                  <Checkbox
                    label={
                      <div>
                        <p className="text-xs font-bold text-text-primary">{surf.label}</p>
                        <p className="text-[10px] text-text-secondary/70 font-semibold">{surf.desc}</p>
                      </div>
                    }
                    checked={localState.surfaces[surf.key]}
                    onChange={() => {}} // Click is handled by wrapper div for comfortable tap-targets
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Clinical Logs */}
        <div className="space-y-4">
          <Input
            label="Specific Findings"
            placeholder="e.g. Tooth shows localized decay in distal groove"
            value={localState.findings || ''}
            onChange={(e) => handleFieldChange('findings', e.target.value)}
          />

          <Input
            label="Local Diagnosis"
            placeholder="e.g. Reversible Pulpitis #14"
            value={localState.diagnosis || ''}
            onChange={(e) => handleFieldChange('diagnosis', e.target.value)}
            helperText="Providing a diagnosis here will automatically prompt adding it to the general Diagnosis list upon save."
          />

          <Input
            label="Recommended Treatment"
            placeholder="e.g. Composite Restoration Filling"
            value={localState.recommendedTreatment || ''}
            onChange={(e) => handleFieldChange('recommendedTreatment', e.target.value)}
            helperText="Providing a treatment proposal will prompt adding it to the general Recommendations list upon save."
          />

          <Input
            label="Internal Notes"
            placeholder="e.g. Discussed treatment risks and alternative options with patient"
            value={localState.notes || ''}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
          />
        </div>

        {/* Guidance Alert */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-start gap-2 text-[10px] text-text-secondary leading-normal">
          <Info className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-primary mb-0.5">Clinical Autocomplete suggestions:</p>
            <p className="font-medium">You can select affected surfaces directly on the odontogram by clicking on the respective trapezoid sections without opening the drawer!</p>
          </div>
        </div>

      </div>
    </Drawer>
  )
}
export default ToothDetailsDrawer
