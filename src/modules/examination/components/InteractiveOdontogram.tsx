import React, { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Info } from 'lucide-react'
import { Tooth } from './Tooth'
import { ToothState, ToothSurfaces } from '../types'
import {
  ADULT_TEETH_UPPER,
  ADULT_TEETH_LOWER,
  CHILD_TEETH_UPPER,
  CHILD_TEETH_LOWER,
  ExaminationFormSchemaType,
} from '../schemas'

interface InteractiveOdontogramProps {
  selectedToothNumber: number | null
  onToothSelect: (toothNumber: number) => void
}

export const InteractiveOdontogram: React.FC<InteractiveOdontogramProps> = ({
  selectedToothNumber,
  onToothSelect,
}) => {
  const { control, setValue } = useFormContext<ExaminationFormSchemaType>()
  const teethValues = useWatch({ control, name: 'teeth' })
  const teeth = teethValues ?? {}

  // Mode: 'adult' or 'child'
  const [viewMode, setViewMode] = useState<'adult' | 'child'>('adult')

  const handleSurfaceToggle = (toothNum: number, surface: keyof ToothSurfaces) => {
    const currentTooth: ToothState = teeth[toothNum.toString()]
    if (!currentTooth) return

    const updatedSurfaces = {
      ...currentTooth.surfaces,
      [surface]: !currentTooth.surfaces[surface],
    }

    // Set the value in react-hook-form
    setValue(`teeth.${toothNum}.surfaces` as any, updatedSurfaces, { shouldDirty: true })
    
    // Auto-select tooth as well
    onToothSelect(toothNum)
  }

  // Legend data helper
  const LEGEND_ITEMS = [
    { label: 'Caries/Decay', colorClass: 'bg-red-500' },
    { label: 'Filled', colorClass: 'bg-blue-500' },
    { label: 'Crown / Bridge', colorClass: 'bg-amber-500' },
    { label: 'Root Canal (RCT)', colorClass: 'bg-purple-500' },
    { label: 'Implant', colorClass: 'bg-teal-500' },
    { label: 'Fracture', colorClass: 'bg-yellow-500' },
    { label: 'Missing', colorClass: 'bg-gray-400' },
    { label: 'Extraction Rec.', colorClass: 'bg-red-800' },
  ]

  const upperTeeth = viewMode === 'adult' ? ADULT_TEETH_UPPER : CHILD_TEETH_UPPER
  const lowerTeeth = viewMode === 'adult' ? ADULT_TEETH_LOWER : CHILD_TEETH_LOWER

  return (
    <div className="space-y-6">
      {/* View Mode Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
            Interactive Dental Arch
          </p>
          <p className="text-xs text-text-secondary/70 mt-1">
            Click on any tooth to view details, modify surfaces, or apply clinical conditions.
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-background/50 p-1.5 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setViewMode('adult')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'adult'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Adult (Permanent)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('child')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'child'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Child (Deciduous)
          </button>
        </div>
      </div>

      {/* Dental Chart Matrix */}
      <div className="bg-background/20 border border-border/40 rounded-xl p-4 md:p-6 space-y-8 select-none">
        
        {/* UPPER JAW / MAXILLARY ARCH */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Maxillary Arch (Upper Jaw)
            </span>
            <span className="text-[9px] text-text-secondary/60 font-bold">
              Patient Right → Patient Left
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 overflow-x-auto py-2 scrollbar-none">
            {upperTeeth.map((num) => {
              const state = teeth[num.toString()] || {
                toothNumber: num,
                condition: 'Healthy',
                surfaces: { mesial: false, distal: false, occlusal: false, buccal: false, lingual: false },
              }
              return (
                <Tooth
                  key={num}
                  toothNumber={num}
                  state={state}
                  isSelected={selectedToothNumber === num}
                  onClick={onToothSelect}
                  onSurfaceClick={handleSurfaceToggle}
                />
              )
            })}
          </div>
        </div>

        {/* Dynamic horizontal separator */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-border/60" />
          </div>
          <span className="relative px-3.5 py-1 text-[10px] font-black text-text-secondary uppercase bg-white border border-border/80 rounded-full select-none">
            Occlusal Line
          </span>
        </div>

        {/* LOWER JAW / MANDIBULAR ARCH */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Mandibular Arch (Lower Jaw)
            </span>
            <span className="text-[9px] text-text-secondary/60 font-bold">
              Patient Right → Patient Left
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 overflow-x-auto py-2 scrollbar-none">
            {lowerTeeth.map((num) => {
              const state = teeth[num.toString()] || {
                toothNumber: num,
                condition: 'Healthy',
                surfaces: { mesial: false, distal: false, occlusal: false, buccal: false, lingual: false },
              }
              return (
                <Tooth
                  key={num}
                  toothNumber={num}
                  state={state}
                  isSelected={selectedToothNumber === num}
                  onClick={onToothSelect}
                  onSurfaceClick={handleSurfaceToggle}
                />
              )
            })}
          </div>
        </div>

      </div>

      {/* Interactive Legend Board */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-semibold text-text-secondary">
        <span className="flex items-center gap-1 font-bold text-primary mr-1">
          <Info className="w-3.5 h-3.5" />
          <span>Odontogram Legend:</span>
        </span>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${item.colorClass} shrink-0`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default InteractiveOdontogram
