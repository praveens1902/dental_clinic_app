import React, { useState } from 'react'
import { Trophy } from 'lucide-react'
import { DoctorLeaderboardRow } from '../types'

interface DoctorLeaderboardProps {
  data: DoctorLeaderboardRow[]
}

export const DoctorLeaderboard: React.FC<DoctorLeaderboardProps> = ({ data }) => {
  // Sort metric: 'revenue' | 'patients' | 'treatments'
  const [sortMetric, setSortMetric] = useState<'revenue' | 'patients' | 'treatments'>('revenue')

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortMetric === 'revenue') return b.revenueGenerated - a.revenueGenerated
      if (sortMetric === 'patients') return b.patientsSeen - a.patientsSeen
      return b.treatmentCount - a.treatmentCount
    })
  }, [data, sortMetric])

  return (
    <div className="bg-white border border-border/80 rounded-xl p-5 shadow-premium space-y-4 text-left select-none">
      
      {/* Header with toggle triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
          <Trophy className="w-4.5 h-4.5 text-warning-dark shrink-0" />
          <span>Dentist Performance Leaderboard</span>
        </h4>

        {/* Sort metric toggle switch */}
        <div className="flex bg-background/50 border border-border/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSortMetric('revenue')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
              sortMetric === 'revenue'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            By Revenue
          </button>
          <button
            type="button"
            onClick={() => setSortMetric('patients')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
              sortMetric === 'patients'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            By Patients
          </button>
          <button
            type="button"
            onClick={() => setSortMetric('treatments')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
              sortMetric === 'treatments'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            By Treatments
          </button>
        </div>
      </div>

      {/* Leaderboard Table rows */}
      <div className="space-y-3">
        {sortedData.map((doc, index) => {
          const rank = index + 1
          return (
            <div
              key={doc.doctorName}
              className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                rank === 1
                  ? 'bg-warning/5 border-warning/30 shadow-sm'
                  : 'bg-background/10 border-border/60 hover:border-border'
              }`}
            >
              <div className="flex items-center gap-3 text-left min-w-0">
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border select-none ${
                  rank === 1 ? 'bg-warning-light text-warning-dark border-warning/20 font-black' :
                  rank === 2 ? 'bg-gray-100 text-gray-600 border-gray-200' :
                  'bg-background text-text-secondary border-border/80'
                }`}>
                  <span className="text-xs">{rank}</span>
                </div>

                <div className="min-w-0">
                  <h5 className="text-xs font-black text-text-primary truncate">{doc.doctorName}</h5>
                  <p className="text-[10px] font-bold text-text-secondary mt-0.5">Clinic Practitioner</p>
                </div>
              </div>

              {/* Stats values */}
              <div className="flex items-center gap-3 sm:gap-6 justify-between sm:justify-end text-center shrink-0 text-xs font-semibold">
                <div className="px-2">
                  <span className="text-[9px] text-text-secondary font-bold uppercase block mb-0.5">Patients</span>
                  <span className="text-xs font-extrabold text-text-primary">{doc.patientsSeen}</span>
                </div>
                <div className="px-2">
                  <span className="text-[9px] text-text-secondary font-bold uppercase block mb-0.5">Appointments</span>
                  <span className="text-xs font-extrabold text-text-primary">{doc.appointmentsCompleted}</span>
                </div>
                <div className="px-2">
                  <span className="text-[9px] text-text-secondary font-bold uppercase block mb-0.5">Treatments</span>
                  <span className="text-xs font-extrabold text-text-primary">{doc.treatmentCount}</span>
                </div>
                <div className="px-3 py-1 bg-success/5 border border-success/15 rounded-lg text-right min-w-[90px]">
                  <span className="text-[8px] text-success font-black uppercase block mb-0.5">Revenue</span>
                  <span className="text-xs font-black text-success">₹{doc.revenueGenerated.toLocaleString()}</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
export default DoctorLeaderboard
