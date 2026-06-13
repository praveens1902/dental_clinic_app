import React, { useState, useEffect } from 'react'
import { Calendar, List, PlusCircle, BarChart3, Clock } from 'lucide-react'
import { appointmentService } from '../services/appointmentService'
import { Appointment, DoctorSchedule, AppointmentAnalytics, AppointmentStatus } from '../types'
import { AppointmentFormSchemaType } from '../schemas'
import { useAlertStore } from '@/store/alertStore'

import { PageHeader, ContentContainer, CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { AppointmentSkeleton } from '../components/AppointmentSkeleton'

import { AppointmentDashboardKPIs } from '../components/AppointmentDashboardKPIs'
import { AppointmentListing } from '../components/AppointmentListing'
import { CalendarView } from '../components/CalendarView'
import { CreateAppointmentForm } from '../components/CreateAppointmentForm'
import { AppointmentDetailsPage } from '../components/AppointmentDetailsPage'
import { AnalyticsWidgets } from '../components/AnalyticsWidgets'

export const AppointmentsPage: React.FC = () => {
  const { addToast } = useAlertStore()

  // 1. Data States
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [analytics, setAnalytics] = useState<AppointmentAnalytics | null>(null)
  
  // 2. View States
  const [activeSubTab, setActiveSubTab] = useState<'kpis' | 'list' | 'calendar' | 'create'>('kpis')
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 3. Pre-populated variables for booking slot clicks
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(undefined)
  const [prefilledTime, setPrefilledTime] = useState<string | undefined>(undefined)
  const [prefilledDoctor, setPrefilledDoctor] = useState<string | undefined>(undefined)

  const loadData = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [apts, schs, alyts] = await Promise.all([
        appointmentService.getAll(),
        appointmentService.getSchedules(),
        appointmentService.getAnalytics(),
      ])
      setAppointments(apts)
      setSchedules(schs)
      setAnalytics(alyts)
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Connection Offline',
        message: 'Could not fetch clinic scheduling database.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 4. Action Handlers
  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      const apt = appointments.find((a) => a.id === id)
      if (!apt) return

      await appointmentService.save({
        ...apt,
        status,
      })

      addToast({
        type: 'success',
        title: 'Booking Status Updated',
        message: `Successfully set status to "${status}" for ${apt.patientName}.`,
      })

      // Refresh state
      await loadData()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Operation Failed',
        message: 'Could not update scheduling status.',
      })
    }
  }

  const handleSendReminder = async (id: string, patientName: string) => {
    try {
      await appointmentService.sendReminder(id, 'WhatsApp', patientName)
      
      addToast({
        type: 'success',
        title: 'WhatsApp Reminder Dispatched',
        message: `Transmitted appointment slot template to ${patientName}.`,
      })

      await loadData()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Dispatch Blocked',
        message: 'Could not trigger automated reminder channels.',
      })
    }
  }

  const handleCreateAppointment = async (formData: AppointmentFormSchemaType, isNewPatientReg: boolean) => {
    try {
      await appointmentService.save({
        patientId: formData.patientId,
        patientName: formData.patientName,
        mobileNumber: formData.mobileNumber,
        doctorName: formData.doctorName,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        status: formData.status,
        branchName: formData.branchName,
        remarks: formData.remarks,
        age: formData.age,
        gender: formData.gender,
      }, isNewPatientReg)

      addToast({
        type: 'success',
        title: 'Appointment Confirmed',
        message: isNewPatientReg 
          ? `Created patient folder and booked slot for ${formData.patientName}.`
          : `Booked consulting slot successfully for ${formData.patientName}.`,
      })

      // Reset prefills
      setPrefilledDate(undefined)
      setPrefilledTime(undefined)
      setPrefilledDoctor(undefined)

      // Refresh listings and switch to list tab
      await loadData()
      setActiveSubTab('list')
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Booking Rejected',
        message: 'Slot conflict or connection error occurred.',
      })
    }
  }

  const handleSelectSlotCreate = (date: string, time?: string, doctor?: string) => {
    setPrefilledDate(date)
    setPrefilledTime(time)
    setPrefilledDoctor(doctor)
    setActiveSubTab('create')
  }

  if (isLoading) {
    return (
      <ContentContainer>
        <AppointmentSkeleton />
      </ContentContainer>
    )
  }

  if (hasError) {
    return (
      <ContentContainer className="py-8">
        <CardContainer className="text-center max-w-lg mx-auto py-8">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-primary mb-2">Scheduling Module Unreachable</h3>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            The appointments scheduler, month/week matrices, and clinician assignment parameters are currently offline.
          </p>
          <Button variant="primary" onClick={loadData}>Reconnect Calendar</Button>
        </CardContainer>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. MAIN PAGE HEADER */}
      <PageHeader
        title="Appointments &amp; Scheduling"
        subtitle="Manage client bookings, day/week calendars, doctor allocations, and automated notifications."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Calendar className="w-4 h-4" />}
              onClick={() => setActiveSubTab('calendar')}
              className="bg-white border border-border/80 font-bold"
            >
              Interactive Calendar
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => {
                setPrefilledDate(undefined)
                setPrefilledTime(undefined)
                setPrefilledDoctor(undefined)
                setActiveSubTab('create')
              }}
              className="font-bold shadow-premium"
            >
              Book Appointment
            </Button>
          </div>
        }
      />

      {/* 2. TABBED NAV DECK */}
      <div className="flex bg-white border border-border p-1.5 rounded-card overflow-x-auto custom-scrollbar gap-1 select-none shrink-0">
        {[
          { id: 'kpis', label: 'Dashboard & KPIs', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          { id: 'list', label: 'Appointment List', icon: <List className="w-3.5 h-3.5" /> },
          { id: 'calendar', label: 'Workstation Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'create', label: 'Book Appointment', icon: <PlusCircle className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isSelected = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow shadow-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. SUB VIEW WORKSPACE PANEL */}
      <div className="animate-fadeIn min-h-[350px]">
        {/* VIEW 1: KPI Summary Dashboard */}
        {activeSubTab === 'kpis' && (
          <div className="space-y-6">
            <AppointmentDashboardKPIs appointments={appointments} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-start">
              <div className="lg:col-span-2">
                <CardContainer className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                      Active Slot Schedules Today
                    </h3>
                    <span className="text-[10px] font-black text-primary bg-primary-light px-2.5 py-0.5 rounded-full uppercase">
                      Today Only
                    </span>
                  </div>
                  
                  <AppointmentListing
                    data={appointments.filter(
                      (a) => a.appointmentDate === new Date().toISOString().split('T')[0]
                    )}
                    onStatusChange={handleStatusChange}
                    onSendReminder={handleSendReminder}
                    onViewDetails={(id) => setSelectedAppointmentId(id)}
                  />
                </CardContainer>
              </div>

              <div>
                <AnalyticsWidgets analytics={analytics} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: List of all appointments */}
        {activeSubTab === 'list' && (
          <CardContainer className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                All Appointment Logs
              </h3>
            </div>
            
            <AppointmentListing
              data={appointments}
              onStatusChange={handleStatusChange}
              onSendReminder={handleSendReminder}
              onViewDetails={(id) => setSelectedAppointmentId(id)}
            />
          </CardContainer>
        )}

        {/* VIEW 3: Interactive Day/Week/Month Calendar */}
        {activeSubTab === 'calendar' && (
          <CardContainer className="space-y-4">
            <CalendarView
              appointments={appointments}
              schedules={schedules}
              onClickCreateSlot={handleSelectSlotCreate}
              onViewAppointment={(id) => setSelectedAppointmentId(id)}
            />
          </CardContainer>
        )}

        {/* VIEW 4: Book/Create Appointment Form */}
        {activeSubTab === 'create' && (
          <CardContainer className="p-6 md:p-8">
            <CreateAppointmentForm
              onSuccess={handleCreateAppointment}
              initialDate={prefilledDate}
              initialTime={prefilledTime}
              initialDoctor={prefilledDoctor}
              onCancel={() => setActiveSubTab('kpis')}
            />
          </CardContainer>
        )}
      </div>

      {/* Selected Appointment Details slides drawer */}
      <AppointmentDetailsPage
        appointmentId={selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
        onStatusChange={handleStatusChange}
        onSendReminderCompleted={loadData}
      />

    </ContentContainer>
  )
}
export default AppointmentsPage
