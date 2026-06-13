import React from 'react'
import { Sparkles, HeartPulse, ShieldCheck } from 'lucide-react'
import { getScoreRating } from '../services/dentalHistoryService'

interface OralHealthScoreProps {
  score: number
}

export const OralHealthScore: React.FC<OralHealthScoreProps> = ({ score }) => {
  const rating = getScoreRating(score)

  // Configure coloring based on rating
  let colorClass = 'text-primary'
  let bgClass = 'bg-primary-light/40'
  let progressColorClass = 'bg-primary'
  let desc = 'The patient has good overall oral health.'
  let Icon = ShieldCheck

  if (rating === 'Excellent') {
    colorClass = 'text-success'
    bgClass = 'bg-success/10 border border-success/20'
    progressColorClass = 'bg-success'
    desc = 'Outstanding oral condition. Keep up the flawless routine.'
    Icon = Sparkles
  } else if (rating === 'Good') {
    colorClass = 'text-primary'
    bgClass = 'bg-primary-light/30 border border-primary/10'
    progressColorClass = 'bg-primary'
    desc = 'Solid routine with minor areas of observation.'
    Icon = ShieldCheck
  } else if (rating === 'Fair') {
    colorClass = 'text-warning-dark'
    bgClass = 'bg-warning/10 border border-warning/20'
    progressColorClass = 'bg-warning'
    desc = 'Observation recommended. Dental habits or complaints require inspection.'
    Icon = HeartPulse
  } else if (rating === 'Poor') {
    colorClass = 'text-danger'
    bgClass = 'bg-danger/5 border border-danger/20'
    progressColorClass = 'bg-danger animate-pulse'
    desc = 'Urgent corrective treatment and improved clinical hygiene required.'
    Icon = HeartPulse
  }

  return (
    <div className={`p-5 rounded-card flex flex-col md:flex-row items-center gap-5 justify-between shadow-premium transition-all ${bgClass}`}>
      <div className="flex items-center gap-4 text-left">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
          rating === 'Excellent' ? 'bg-success/10 text-success' :
          rating === 'Good' ? 'bg-primary-light text-primary' :
          rating === 'Fair' ? 'bg-warning/10 text-warning-dark' : 'bg-danger/10 text-danger'
        }`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-text-secondary uppercase">Composite Oral Health Score</p>
          <h4 className={`text-lg font-heading font-black flex items-center gap-2 ${colorClass}`}>
            <span>{rating}</span>
            <span className="text-sm font-semibold text-text-secondary/75">({score}/100)</span>
          </h4>
          <p className="text-xs text-text-secondary/80 font-medium">{desc}</p>
        </div>
      </div>

      <div className="w-full md:w-64 space-y-1.5 shrink-0">
        <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase">
          <span>Oral Quality Index</span>
          <span>{score}%</span>
        </div>
        <div className="w-full bg-border/40 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColorClass}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
export default OralHealthScore
