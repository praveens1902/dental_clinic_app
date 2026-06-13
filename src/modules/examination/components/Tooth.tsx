import React from 'react'
import { ToothState, ToothCondition, ToothSurfaces } from '../types'

interface ToothProps {
  toothNumber: number
  state: ToothState
  isSelected?: boolean
  onClick?: (toothNumber: number) => void
  onSurfaceClick?: (toothNumber: number, surface: keyof ToothSurfaces) => void
  readOnly?: boolean
}

export const Tooth: React.FC<ToothProps> = ({
  toothNumber,
  state,
  isSelected = false,
  onClick,
  onSurfaceClick,
  readOnly = false,
}) => {
  const { condition, surfaces } = state

  // Condition Color styling helpers
  const getConditionColor = (cond: ToothCondition): string => {
    switch (cond) {
      case 'Caries':
      case 'Decay':
        return '#ef4444' // red
      case 'Filled':
        return '#3b82f6' // blue
      case 'Fracture':
        return '#f59e0b' // amber
      case 'Extraction Recommended':
        return '#dc2626' // dark red
      case 'Root Canal Treated':
        return '#8b5cf6' // purple
      case 'Implant':
        return '#14b8a6' // teal
      case 'Crown':
        return '#f59e0b' // gold/amber
      case 'Bridge':
        return '#6366f1' // indigo
      case 'Missing':
        return '#9ca3af' // gray
      default:
        return 'transparent'
    }
  };

  const conditionColor = getConditionColor(condition)

  // Determine surface-specific color or fill
  const getSurfaceFill = (surfaceKey: keyof ToothSurfaces): string => {
    if (surfaces[surfaceKey]) {
      // If surface is specifically flagged, use condition color (or red by default if Healthy but flagged)
      return conditionColor !== 'transparent' ? conditionColor : '#ef4444'
    }
    
    // Default backgrounds depending on condition of the entire tooth
    if (condition === 'Filled') return '#3b82f630' // light blue tint
    if (condition === 'Implant') return '#14b8a615' // light teal tint
    if (condition === 'Crown') return '#f59e0b20' // light gold tint
    
    return '#ffffff'
  }

  // Handle clicking the overall tooth
  const handleToothClick = () => {
    // If clicking a surface polygon, prevent propagating to tooth click if desired,
    // but standard odontogram selects the tooth first to open details drawer.
    if (onClick) {
      onClick(toothNumber)
    }
  }

  const handlePolygonClick = (e: React.MouseEvent, surface: keyof ToothSurfaces) => {
    if (readOnly) return
    if (onSurfaceClick) {
      e.stopPropagation()
      onSurfaceClick(toothNumber, surface)
    } else if (onClick) {
      onClick(toothNumber)
    }
  }

  // Render extra visual marks overlay on top of tooth (e.g. cross-out for Missing, screw for Implant)
  const renderOverlayMarks = () => {
    if (condition === 'Missing') {
      return (
        <line
          x1="2" y1="2" x2="38" y2="38"
          stroke="#4b5563"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="pointer-events-none"
        />
      )
    }
    if (condition === 'Extraction Recommended') {
      return (
        <g className="pointer-events-none">
          <line x1="2" y1="38" x2="38" y2="2" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <line x1="2" y1="2" x2="38" y2="38" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    }
    if (condition === 'Implant') {
      return (
        <g className="pointer-events-none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" fill="none">
          {/* Threaded Screw Representation */}
          <line x1="20" y1="12" x2="20" y2="28" />
          <line x1="16" y1="16" x2="24" y2="16" />
          <line x1="16" y1="20" x2="24" y2="20" />
          <line x1="17" y1="24" x2="23" y2="24" />
        </g>
      )
    }
    if (condition === 'Root Canal Treated') {
      return (
        <g className="pointer-events-none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round">
          {/* Vertical canal lines */}
          <line x1="17" y1="6" x2="17" y2="34" strokeDasharray="2,2" />
          <line x1="23" y1="6" x2="23" y2="34" strokeDasharray="2,2" />
        </g>
      )
    }
    if (condition === 'Crown') {
      return (
        <rect
          x="1" y="1" width="38" height="38"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          rx="4"
          className="pointer-events-none"
        />
      )
    }
    return null
  }

  // Border formatting depending on state
  let toothBorderClass = 'border-border/60 bg-white hover:shadow-premium'
  if (isSelected) {
    toothBorderClass = 'border-primary ring-2 ring-primary/20 bg-primary-light/5'
  } else if (condition !== 'Healthy') {
    if (condition === 'Caries' || condition === 'Decay') toothBorderClass = 'border-danger/40 bg-danger/5'
    else if (condition === 'Filled') toothBorderClass = 'border-blue-300 bg-blue-50/20'
    else if (condition === 'Crown' || condition === 'Bridge') toothBorderClass = 'border-amber-300 bg-amber-50/20'
  }

  return (
    <div
      onClick={handleToothClick}
      className={`flex flex-col items-center p-2.5 rounded-xl border cursor-pointer transition-all ${toothBorderClass} select-none`}
    >
      {/* Tooth Number Label */}
      <span className={`text-[10px] font-black leading-none mb-1.5 ${
        isSelected ? 'text-primary' : condition !== 'Healthy' ? 'text-text-primary' : 'text-text-secondary/70'
      }`}>
        {toothNumber}
      </span>

      {/* Surface Polygons SVG Container (40x40 viewport) */}
      <div className="relative w-10 h-10 select-none">
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Surface: Buccal (Top trapezoid) */}
          <polygon
            points="0,0 40,0 30,10 10,10"
            fill={getSurfaceFill('buccal')}
            stroke="#9ca3af"
            strokeWidth="0.75"
            onClick={(e) => handlePolygonClick(e, 'buccal')}
            className="cursor-pointer hover:fill-primary-light/40 transition-colors"
          />

          {/* Surface: Distal (Right trapezoid) */}
          <polygon
            points="40,0 40,40 30,30 30,10"
            fill={getSurfaceFill('distal')}
            stroke="#9ca3af"
            strokeWidth="0.75"
            onClick={(e) => handlePolygonClick(e, 'distal')}
            className="cursor-pointer hover:fill-primary-light/40 transition-colors"
          />

          {/* Surface: Lingual (Bottom trapezoid) */}
          <polygon
            points="0,40 40,40 30,30 10,30"
            fill={getSurfaceFill('lingual')}
            stroke="#9ca3af"
            strokeWidth="0.75"
            onClick={(e) => handlePolygonClick(e, 'lingual')}
            className="cursor-pointer hover:fill-primary-light/40 transition-colors"
          />

          {/* Surface: Mesial (Left trapezoid) */}
          <polygon
            points="0,0 0,40 10,30 10,10"
            fill={getSurfaceFill('mesial')}
            stroke="#9ca3af"
            strokeWidth="0.75"
            onClick={(e) => handlePolygonClick(e, 'mesial')}
            className="cursor-pointer hover:fill-primary-light/40 transition-colors"
          />

          {/* Surface: Occlusal (Center square) */}
          <polygon
            points="10,10 30,10 30,30 10,30"
            fill={getSurfaceFill('occlusal')}
            stroke="#9ca3af"
            strokeWidth="0.75"
            onClick={(e) => handlePolygonClick(e, 'occlusal')}
            className="cursor-pointer hover:fill-primary-light/40 transition-colors"
          />

          {/* Extra Condition Visual Overlays (e.g., Cross-out, screw, post) */}
          {renderOverlayMarks()}
        </svg>
      </div>

      {/* Conditonal Dot Indicator at base */}
      {condition !== 'Healthy' && (
        <span
          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
          style={{
            backgroundColor:
              condition === 'Caries' || condition === 'Decay' ? '#ef4444' :
              condition === 'Filled' ? '#3b82f6' :
              condition === 'Implant' ? '#14b8a6' :
              condition === 'Crown' || condition === 'Bridge' ? '#f59e0b' : '#6b7280'
          }}
        />
      )}
    </div>
  )
}
export default Tooth
