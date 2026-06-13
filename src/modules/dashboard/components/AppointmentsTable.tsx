import React from 'react'
import { TodayAppointment } from '../types'

interface AppointmentsTableProps {
  appointments: TodayAppointment[]
  onStatusClick?: (id: string, currentStatus: string) => void
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onStatusClick,
}) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      Completed: 'bg-success/10 text-success border border-success/20',
      Scheduled: 'bg-info/10 text-info border border-info/20',
      'Checked In': 'bg-primary-light text-primary border border-primary/20',
      Cancelled: 'bg-danger/10 text-danger border border-danger/20',
    }[status] || 'bg-background text-text-secondary border border-border'

    return (
      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${styles}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="bg-white border border-border/80 rounded-card shadow-premium overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="px-5 py-4.5 border-b border-border/80 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-heading text-text-primary">Today&apos;s Appointments Queue</h3>
          <p className="text-[10px] font-semibold text-text-secondary">Instant status check of patient arrival states in active dental chairs.</p>
        </div>
      </div>

      {/* Overflow Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-border/60 bg-background/30 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              <th className="p-4 pl-5">Time Slot</th>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Anatomical Procedure</th>
              <th className="p-4">Assigned Dentist</th>
              <th className="p-4 pr-5 text-right">Chair Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-xs font-semibold text-text-secondary/50">
                  No appointments logged for today.
                </td>
              </tr>
            ) : (
              appointments.map((app) => (
                <tr 
                  key={app.id} 
                  className="border-b border-border/40 hover:bg-background/10 transition-colors last:border-0"
                >
                  <td className="p-4 pl-5 text-xs font-bold text-primary">{app.time}</td>
                  <td className="p-4 text-xs font-bold text-text-primary">{app.patientName}</td>
                  <td className="p-4 text-xs font-semibold text-text-secondary">{app.procedure}</td>
                  <td className="p-4 text-xs font-semibold text-text-primary/95">{app.doctorName}</td>
                  <td className="p-4 pr-5 text-right align-middle">
                    <button
                      onClick={() => onStatusClick && onStatusClick(app.id, app.status)}
                      disabled={!onStatusClick}
                      className={`${onStatusClick ? 'cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform' : ''} focus:outline-none`}
                    >
                      {getStatusBadge(app.status)}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
export default AppointmentsTable
