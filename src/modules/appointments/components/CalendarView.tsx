import React, { useState } from 'react'
import { Clock, ChevronLeft, ChevronRight, User, PlusCircle } from 'lucide-react'
import { Appointment, DoctorSchedule } from '../types'
import { Button } from '@/components/ui/Button'
import { DOCTOR_OPTIONS, TIME_SLOTS } from '../schemas'

interface CalendarViewProps {
  appointments: Appointment[]
  schedules: DoctorSchedule[]
  onClickCreateSlot: (date: string, time?: string, doctor?: string) => void
  onViewAppointment: (id: string) => void
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  schedules,
  onClickCreateSlot,
  onViewAppointment,
}) => {
  // Navigation / View states
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [activeView, setActiveView] = useState<'day' | 'week' | 'month'>('week')
  const [selectedDoctor, setSelectedDoctor] = useState<string>('Dr. Ananya Iyer')

  // Date manipulation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const handleNextDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  // Get start of active week
  const weekDays = React.useMemo(() => {
    const start = new Date(selectedDate)
    const day = start.getDay() // 0 is Sunday, 1 is Monday, etc.
    const diff = start.getDate() - day + (day === 0 ? -6 : 1) // adjust to Monday
    start.setDate(diff)

    const list = []
    for (let i = 0; i < 7; i++) {
      const current = new Date(start)
      current.setDate(start.getDate() + i)
      list.push(current.toISOString().split('T')[0])
    }
    return list
  }, [selectedDate])

  // Get days in selected month
  const monthDays = React.useMemo(() => {
    const d = new Date(selectedDate)
    const y = d.getFullYear()
    const m = d.getMonth()
    const firstDay = new Date(y, m, 1).getDay()
    const daysCount = new Date(y, m + 1, 0).getDate()

    const list = []
    // Pad previous month slots
    const prevMonthDaysCount = new Date(y, m, 0).getDate()
    const padCount = firstDay === 0 ? 6 : firstDay - 1 // align to Monday
    for (let i = padCount - 1; i >= 0; i--) {
      const padDate = new Date(y, m - 1, prevMonthDaysCount - i)
      list.push({ dateStr: padDate.toISOString().split('T')[0], isCurrentMonth: false })
    }

    // Current month slots
    for (let i = 1; i <= daysCount; i++) {
      const current = new Date(y, m, i)
      list.push({ dateStr: current.toISOString().split('T')[0], isCurrentMonth: true })
    }

    // Pad next month slots
    const remainingSlots = 42 - list.length // 6 weeks table
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(y, m + 1, i)
      list.push({ dateStr: nextDate.toISOString().split('T')[0], isCurrentMonth: false })
    }

    return list
  }, [selectedDate])

  // Get doctor's schedule mappings for today
  const doctorActiveSchedule = React.useMemo(() => {
    return schedules.find((s) => s.doctorName === selectedDoctor) || {
      doctorName: selectedDoctor,
      availableSlots: TIME_SLOTS,
      bookedSlots: [],
      blockedSlots: ['12:00', '12:30'],
    }
  }, [schedules, selectedDoctor])

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. View Controllers & Nav Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-border/40 pb-4">
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handlePrevDay}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="p-2 h-8 bg-white border border-border/80"
          />
          <span className="text-sm font-black text-text-primary px-2 select-none shrink-0 min-w-36 text-center">
            {new Date(selectedDate).toLocaleDateString([], {
              weekday: activeView === 'day' ? 'short' : undefined,
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleNextDay}
            leftIcon={<ChevronRight className="w-4 h-4" />}
            className="p-2 h-8 bg-white border border-border/80"
          />
        </div>

        {/* View Selection switch */}
        <div className="flex items-center gap-2.5 bg-background/40 border border-border/60 p-1 rounded-xl self-start sm:self-auto select-none">
          {['day', 'week', 'month'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveView(v as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                activeView === v
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Availability schedule selector */}
      <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl p-3.5 select-none text-xs font-bold text-text-secondary">
        <User className="w-4.5 h-4.5 text-primary shrink-0" />
        <span className="shrink-0">Clinic Doctor Schedule:</span>
        <div className="w-48 shrink-0">
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-2 py-1 bg-white border border-border/80 rounded-lg text-xs font-semibold text-text-primary focus:outline-none"
          >
            {DOCTOR_OPTIONS.map((doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. CALENDAR VIEWS PANELS */}
      <div className="bg-white border border-border/80 rounded-xl p-4 shadow-premium select-none overflow-x-auto custom-scrollbar">
        
        {/* VIEW A: Day Schedule view */}
        {activeView === 'day' && (
          <div className="space-y-2.5 min-w-[400px]">
            {TIME_SLOTS.map((slot) => {
              const booking = appointments.find(
                (a) => a.appointmentDate === selectedDate && a.appointmentTime === slot && a.doctorName === selectedDoctor
              )
              const isBlocked = doctorActiveSchedule.blockedSlots.includes(slot)

              return (
                <div
                  key={slot}
                  className={`border rounded-xl p-3 flex items-center justify-between gap-4 transition-all duration-200 ${
                    booking
                      ? 'bg-primary-light/10 border-primary/20 shadow-sm'
                      : isBlocked
                      ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                      : 'bg-background/25 border-border/50 hover:border-border'
                  }`}
                >
                  <span className="text-xs font-black text-text-secondary/80 w-12 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
                    <span>{slot}</span>
                  </span>

                  {booking ? (
                    <div className="flex-1 flex justify-between items-center pl-4 border-l border-primary/30">
                      <div className="text-left">
                        <p className="font-extrabold text-xs text-text-primary">{booking.patientName}</p>
                        <p className="text-[10px] font-bold text-text-secondary/80 mt-0.5">{booking.remarks || 'Consultation'}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => onViewAppointment(booking.id)}
                        className="text-[9px] font-black h-7 bg-white border border-border/80 text-text-secondary"
                      >
                        Inspect
                      </Button>
                    </div>
                  ) : isBlocked ? (
                    <span className="flex-1 pl-4 text-left text-xs italic font-semibold border-l border-gray-200 select-none">
                      Blocked Hour (Lunch / Rest break)
                    </span>
                  ) : (
                    <div className="flex-1 flex justify-between items-center pl-4 border-l border-border/40 select-none">
                      <span className="text-[10px] text-text-secondary/65 font-bold">
                        Slot available for clinic booking
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                        onClick={() => onClickCreateSlot(selectedDate, slot, selectedDoctor)}
                        className="text-[10px] font-black text-primary hover:bg-primary-light/15 py-1 px-2.5 h-auto border-transparent"
                      >
                        Book
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* VIEW B: Week Matrix view */}
        {activeView === 'week' && (
          <div className="min-w-[700px]">
            <div className="grid grid-cols-8 gap-2 bg-background/30 rounded-xl p-2.5 text-center font-bold text-xs uppercase tracking-wider text-text-secondary/80 mb-3 border border-border/50 select-none">
              <div className="p-1 pl-2 text-left">Hour</div>
              {weekDays.map((day) => {
                const dateObj = new Date(day)
                const isSelected = day === selectedDate
                return (
                  <div key={day} className={`p-1 rounded-lg ${isSelected ? 'text-primary font-black bg-primary-light' : ''}`}>
                    <p className="text-[10px]">{dateObj.toLocaleDateString([], { weekday: 'short' })}</p>
                    <p className="text-xs">{dateObj.getDate()}</p>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2">
              {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((slot) => (
                <div key={slot} className="grid grid-cols-8 gap-2 items-center">
                  {/* Time label */}
                  <div className="text-[10px] font-bold text-text-secondary/70 flex items-center gap-1 select-none pr-2">
                    <Clock className="w-3.5 h-3.5 text-text-secondary/40 shrink-0" />
                    <span>{slot}</span>
                  </div>

                  {/* Days cells */}
                  {weekDays.map((day) => {
                    const booking = appointments.find(
                      (a) => a.appointmentDate === day && a.appointmentTime.substring(0,2) === slot.substring(0,2) && a.doctorName === selectedDoctor
                    )

                    return (
                      <div key={day} className="h-12 flex flex-col justify-center">
                        {booking ? (
                          <div
                            onClick={() => onViewAppointment(booking.id)}
                            className="bg-primary-light border border-primary/20 p-1.5 rounded-xl cursor-pointer hover:shadow-premium transition-all text-center h-full flex flex-col justify-center relative overflow-hidden select-none"
                            title={`${booking.patientName} (${booking.status})`}
                          >
                            <p className="text-[9px] font-black text-text-primary truncate">{booking.patientName.split(' ')[0]}</p>
                            <span className="text-[7px] font-black bg-white border border-primary/10 text-primary uppercase px-1 py-0.5 rounded mt-0.5 truncate block mx-auto">
                              {booking.status}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onClickCreateSlot(day, slot, selectedDoctor)}
                            className="border border-dashed border-border hover:border-primary/50 hover:bg-primary-light/5 rounded-xl h-full w-full flex items-center justify-center text-[10px] font-semibold text-text-secondary/30 hover:text-primary transition-all cursor-pointer"
                          >
                            +
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW C: Month Calendar view */}
        {activeView === 'month' && (
          <div className="min-w-[600px]">
            {/* Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2 border-b border-border pb-1 select-none">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((dayCell, idx) => {
                const dayDateObj = new Date(dayCell.dateStr)
                const isSelected = dayCell.dateStr === selectedDate
                const isToday = dayCell.dateStr === new Date().toISOString().split('T')[0]
                
                // Count bookings on this day for the selected doctor
                const dayBookings = appointments.filter(
                  (a) => a.appointmentDate === dayCell.dateStr && a.doctorName === selectedDoctor
                )

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDate(dayCell.dateStr)
                    }}
                    className={`h-16 border rounded-xl p-1.5 flex flex-col justify-between cursor-pointer hover:border-primary transition-all ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-primary-light/5'
                        : isToday
                        ? 'border-indigo-400 bg-indigo-50/10'
                        : dayCell.isCurrentMonth
                        ? 'border-border/60 bg-white'
                        : 'border-border/30 bg-background/10 opacity-40'
                    }`}
                  >
                    {/* Day number */}
                    <span className={`text-[9px] font-black leading-none ${
                      isToday ? 'text-indigo-600' : 'text-text-secondary/80'
                    }`}>
                      {dayDateObj.getDate()}
                    </span>

                    {/* Bookings dots or mini badge */}
                    {dayBookings.length > 0 && (
                      <div className="space-y-0.5">
                        <span className="text-[7px] font-black text-primary bg-primary-light border border-primary/10 px-1 py-0.5 rounded truncate block text-center uppercase select-none leading-none">
                          {dayBookings.length} Booked
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
export default CalendarView
