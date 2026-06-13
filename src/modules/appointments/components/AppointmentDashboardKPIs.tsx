import React from 'react'
import { Calendar, CheckCircle2, XCircle, UserX, Clock } from 'lucide-react'
import { Appointment } from '../types'

interface AppointmentDashboardKPIsProps {
  appointments: Appointment[]
}

export const AppointmentDashboardKPIs: React.FC<AppointmentDashboardKPIsProps> = ({
  appointments,
}) => {
  const todayStr = new Date().toISOString().split('T')[0]

  const stats = React.useMemo(() => {
    const todayApts = appointments.filter((a) => a.appointmentDate === todayStr)
    const upcomingApts = appointments.filter((a) => new Date(a.appointmentDate).getTime() > new Date(todayStr).getTime())

    const totalToday = todayApts.length
    const completedToday = todayApts.filter((a) => a.status === 'Completed').length
    const cancelledToday = todayApts.filter((a) => a.status === 'Cancelled').length
    const noShowToday = todayApts.filter((a) => a.status === 'No Show').length
    const upcomingCount = upcomingApts.length

    return { totalToday, completedToday, cancelledToday, noShowToday, upcomingCount }
  }, [appointments, todayStr])

  const CARDS = [
    {
      label: "Today's Sessions",
      value: stats.totalToday,
      icon: <Calendar className="w-5 h-5 text-primary" />,
      bgClass: 'bg-primary/5 border-primary/10',
      textClass: 'text-primary',
    },
    {
      label: 'Upcoming Courses',
      value: stats.upcomingCount,
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      bgClass: 'bg-blue-50/50 border-blue-100',
      textClass: 'text-blue-600',
    },
    {
      label: 'Completed Today',
      value: stats.completedToday,
      icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      bgClass: 'bg-success/5 border-success/10',
      textClass: 'text-success',
    },
    {
      label: 'Cancelled Today',
      value: stats.cancelledToday,
      icon: <XCircle className="w-5 h-5 text-danger" />,
      bgClass: 'bg-danger/5 border-danger/10',
      textClass: 'text-danger',
    },
    {
      label: 'No Shows Today',
      value: stats.noShowToday,
      icon: <UserX className="w-5 h-5 text-warning-dark" />,
      bgClass: 'bg-warning/5 border-warning/10',
      textClass: 'text-warning-dark',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-premium transition-all hover:scale-[1.01] select-none ${card.bgClass}`}
        >
          <div className="p-2.5 bg-white rounded-full shadow-sm mb-2.5 shrink-0">
            {card.icon}
          </div>
          <span className="text-[10px] font-bold text-text-secondary uppercase">
            {card.label}
          </span>
          <p className={`text-2xl font-black mt-1 leading-none ${card.textClass}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
export default AppointmentDashboardKPIs
