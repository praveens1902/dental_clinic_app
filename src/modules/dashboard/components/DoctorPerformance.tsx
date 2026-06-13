import React from 'react'
import { Award, Users } from 'lucide-react'
import { DoctorPerformance as DocType } from '../types'

interface DoctorPerformanceProps {
  doctors: DocType[]
}

export const DoctorPerformance: React.FC<DoctorPerformanceProps> = ({ doctors }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Sort doctors by revenue generated to form a true leaderboard ranking
  const sortedDoctors = [...doctors].sort((a, b) => b.revenueGenerated - a.revenueGenerated)

  return (
    <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-5">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-base font-bold font-heading text-text-primary">Clinch Leaderboard</h3>
          <p className="text-[10px] font-semibold text-text-secondary">Comparing dentist volume seen and procedure receipts.</p>
        </div>
        <div className="p-1.5 bg-primary/10 rounded-xl text-primary shrink-0">
          <Award className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="space-y-4">
        {sortedDoctors.map((doc, index) => {
          const rank = index + 1
          const rankColorClass = {
            1: 'bg-warning/10 text-warning border-warning/20',
            2: 'bg-text-secondary/15 text-text-secondary border-border',
            3: 'bg-primary-light text-primary border-primary/20',
          }[rank] || 'bg-background text-text-secondary border-border/60'

          return (
            <div 
              key={doc.id} 
              className="flex items-center justify-between gap-3 p-3 bg-background/25 border border-border/30 rounded-xl hover:border-primary/10 transition-colors"
            >
              {/* Left Rank and Identity profile card */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-6 h-6 rounded-lg border text-[10px] font-bold flex items-center justify-center shrink-0 ${rankColorClass}`}>
                  #{rank}
                </span>
                <img 
                  src={doc.avatar} 
                  alt={doc.doctorName} 
                  className="w-10 h-10 rounded-full border border-border shrink-0 bg-white" 
                />
                <div className="min-w-0 text-left">
                  <h4 className="text-xs font-bold text-text-primary truncate">{doc.doctorName}</h4>
                  <p className="text-[9px] font-semibold text-text-secondary truncate mt-0.5">{doc.specialization}</p>
                </div>
              </div>

              {/* Right Performance Metrics block */}
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-primary">{formatCurrency(doc.revenueGenerated)}</p>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-secondary mt-1 justify-end">
                  <div className="flex items-center gap-0.5">
                    <Users className="w-3 h-3 text-text-secondary/60" />
                    <span>{doc.patientsSeen}</span>
                  </div>
                  <span>•</span>
                  <span>{doc.appointmentCount} appts</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
export default DoctorPerformance
