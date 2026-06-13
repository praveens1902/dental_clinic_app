import {
  Appointment,
  ReminderHistoryItem,
  DoctorSchedule,
  AppointmentAnalytics,
  AppointmentStatus,
  ReminderChannel,
} from '../types'
import { patientService } from '@/modules/patients/services/patientService'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'p1',
    patientName: 'Aarav Mehta',
    mobileNumber: '9810234567',
    doctorName: 'Dr. Ananya Iyer',
    appointmentDate: new Date().toISOString().split('T')[0], // Today
    appointmentTime: '10:00',
    status: 'Scheduled',
    branchName: 'Saket - New Delhi',
    remarks: 'Root Canal Treatment (RCT) Follow-up session.',
  },
  {
    id: 'apt-2',
    patientId: 'p2',
    patientName: 'Isha Sharma',
    mobileNumber: '9910543210',
    doctorName: 'Dr. Vikram Seth',
    appointmentDate: new Date().toISOString().split('T')[0], // Today
    appointmentTime: '11:30',
    status: 'Checked In',
    branchName: 'Vasant Vihar - New Delhi',
    remarks: 'Orthodontic braces adjustments.',
  },
  {
    id: 'apt-3',
    patientId: 'p1',
    patientName: 'Aarav Mehta',
    mobileNumber: '9810234567',
    doctorName: 'Dr. Ananya Iyer',
    appointmentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    appointmentTime: '14:00',
    status: 'Completed',
    branchName: 'Saket - New Delhi',
    remarks: 'Initial oral examination and bicuspid cavity scaling.',
  },
  {
    id: 'apt-4',
    patientId: 'p2',
    patientName: 'Isha Sharma',
    mobileNumber: '9910543210',
    doctorName: 'Dr. Riya Sen',
    appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    appointmentTime: '16:00',
    status: 'Scheduled',
    branchName: 'Indiranagar - Bengaluru',
    remarks: 'Consultation for zirconia crown prosthetic.',
  },
]

const INITIAL_MOCK_REMINDERS: ReminderHistoryItem[] = [
  {
    id: 'rem-1',
    appointmentId: 'apt-1',
    channel: 'WhatsApp',
    date: new Date().toISOString().split('T')[0] + ' 09:00',
    status: 'Delivered',
    recipientName: 'Aarav Mehta',
  },
  {
    id: 'rem-2',
    appointmentId: 'apt-2',
    channel: 'SMS',
    date: new Date().toISOString().split('T')[0] + ' 09:15',
    status: 'Sent',
    recipientName: 'Isha Sharma',
  },
  {
    id: 'rem-3',
    appointmentId: 'apt-3',
    channel: 'Email',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 08:30',
    status: 'Delivered',
    recipientName: 'Aarav Mehta',
  },
]

const INITIAL_MOCK_SCHEDULES: DoctorSchedule[] = [
  {
    doctorName: 'Dr. Ananya Iyer',
    availableSlots: ['09:00', '10:30', '11:00', '14:00', '15:00', '16:00', '17:00'],
    bookedSlots: ['10:00', '11:30'],
    blockedSlots: ['12:00', '12:30'], // lunch block
  },
  {
    doctorName: 'Dr. Vikram Seth',
    availableSlots: ['09:00', '10:00', '10:30', '14:30', '15:30', '16:30', '17:30'],
    bookedSlots: ['11:30'],
    blockedSlots: ['12:00', '12:30'],
  },
]

// --- LOCAL STORAGE DATA SYNC ---
const getAppointments = (): Appointment[] => {
  const data = localStorage.getItem('sirona_appointments')
  return data ? JSON.parse(data) : INITIAL_MOCK_APPOINTMENTS
}

const saveAppointments = (list: Appointment[]) => {
  localStorage.setItem('sirona_appointments', JSON.stringify(list))
}

const getReminders = (): ReminderHistoryItem[] => {
  const data = localStorage.getItem('sirona_appointment_reminders')
  return data ? JSON.parse(data) : INITIAL_MOCK_REMINDERS
}

const saveReminders = (list: ReminderHistoryItem[]) => {
  localStorage.setItem('sirona_appointment_reminders', JSON.stringify(list))
}

// --- APPOINTMENTS CLINICAL SERVICE ---
export const appointmentService = {
  // Fetch all appointments
  getAll: async (): Promise<Appointment[]> => {
    await delay(500)
    return getAppointments()
  },

  // Fetch appointment by ID
  getById: async (id: string): Promise<Appointment | null> => {
    await delay(400)
    const list = getAppointments()
    const found = list.find((a) => a.id === id)
    return found || null
  },

  // Fetch appointments for patient profile tab
  getByPatientId: async (patientId: string): Promise<Appointment[]> => {
    await delay(400)
    const list = getAppointments()
    return list.filter((a) => a.patientId === patientId)
  },

  // Create or Update appointment
  save: async (
    data: Omit<Appointment, 'id'> & { id?: string },
    isNewPatientQuickReg = false
  ): Promise<Appointment> => {
    await delay(700)
    const list = getAppointments()
    let patientId = data.patientId
    
    // Quick New Patient Registration integration:
    // If it's a new patient, automatically create a patient record first!
    if (isNewPatientQuickReg && !patientId) {
      const newPat = await patientService.createPatient({
        patientName: data.patientName,
        mobileNumber: data.mobileNumber,
        gender: (data.gender as 'Male' | 'Female' | 'Other') || 'Female',
        dateOfBirth: new Date(Date.now() - (parseInt(data.age || '30') * 365.25 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // approximate DOB
        branchId: 'b1', // Saket branch default
        branchName: 'Sirona Elite - New Delhi',
        status: 'Active',
        email: '',
        occupation: '',
        address: '',
        referralSource: 'Walk-In Registration',
        emergencyContactName: '',
        emergencyContactNumber: '',
        relationship: '',
      })
      patientId = newPat.id
    }

    if (data.id) {
      // Update existing
      const idx = list.findIndex((a) => a.id === data.id)
      if (idx >= 0) {
        const updated: Appointment = {
          ...list[idx],
          ...data,
          patientId,
        }
        list[idx] = updated
        saveAppointments(list)
        return updated
      }
    }

    // Create new
    const newApt: Appointment = {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
      patientId,
    }
    saveAppointments([newApt, ...list])
    return newApt
  },

  // Delete/Cancel appointment
  delete: async (id: string): Promise<boolean> => {
    await delay(500)
    const list = getAppointments()
    const filtered = list.filter((a) => a.id !== id)
    saveAppointments(filtered)
    return true
  },

  // Status timeline generator for details page
  getTimeline: async (appointmentId: string): Promise<{ status: AppointmentStatus; date: string; notes: string }[]> => {
    await delay(300)
    const apt = await appointmentService.getById(appointmentId)
    if (!apt) return []

    const timeline: { status: AppointmentStatus; date: string; notes: string }[] = [
      { status: 'Scheduled', date: apt.appointmentDate + ' 09:00', notes: 'Appointment booked.' },
    ]

    if (apt.status === 'Checked In' || apt.status === 'In Progress' || apt.status === 'Completed') {
      timeline.push({ status: 'Checked In', date: apt.appointmentDate + ' ' + apt.appointmentTime, notes: 'Patient checked in at front desk.' })
    }
    if (apt.status === 'In Progress' || apt.status === 'Completed') {
      timeline.push({ status: 'In Progress', date: apt.appointmentDate + ' ' + apt.appointmentTime, notes: 'Treatment started in chair.' })
    }
    if (apt.status === 'Completed') {
      timeline.push({ status: 'Completed', date: apt.appointmentDate + ' 10:45', notes: 'Treatment finished successfully.' })
    }
    if (apt.status === 'Cancelled') {
      timeline.push({ status: 'Cancelled', date: apt.appointmentDate + ' 10:00', notes: 'Appointment cancelled.' })
    }
    if (apt.status === 'No Show') {
      timeline.push({ status: 'No Show', date: apt.appointmentDate + ' 11:00', notes: 'Patient did not arrive within grace slot.' })
    }

    return timeline.reverse() // Newest first
  },

  // Reminders triggers
  getRemindersByAppointmentId: async (appointmentId: string): Promise<ReminderHistoryItem[]> => {
    await delay(300)
    const list = getReminders()
    return list.filter((r) => r.appointmentId === appointmentId)
  },

  sendReminder: async (
    appointmentId: string,
    channel: ReminderChannel,
    recipientName: string
  ): Promise<ReminderHistoryItem> => {
    await delay(600)
    const list = getReminders()
    
    const newRem: ReminderHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      appointmentId,
      channel,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Delivered',
      recipientName,
    }

    saveReminders([newRem, ...list])
    return newRem
  },

  // Fetch doctors schedules
  getSchedules: async (): Promise<DoctorSchedule[]> => {
    await delay(400)
    return INITIAL_MOCK_SCHEDULES
  },

  // Calculate appointment analytics widgets
  getAnalytics: async (): Promise<AppointmentAnalytics> => {
    await delay(500)
    const list = getAppointments()
    
    const byStatus: Record<AppointmentStatus, number> = {
      Scheduled: list.filter((a) => a.status === 'Scheduled').length,
      'Checked In': list.filter((a) => a.status === 'Checked In').length,
      'In Progress': list.filter((a) => a.status === 'In Progress').length,
      Completed: list.filter((a) => a.status === 'Completed').length,
      Cancelled: list.filter((a) => a.status === 'Cancelled').length,
      'No Show': list.filter((a) => a.status === 'No Show').length,
    }

    const total = list.length
    const cancelled = byStatus.Cancelled
    const noshow = byStatus['No Show']

    return {
      totalAppointments: total,
      byStatus,
      doctorUtilization: {
        'Dr. Ananya Iyer': 85,
        'Dr. Vikram Seth': 70,
        'Dr. Riya Sen': 55,
        'Dr. Amit Sharma': 40,
      },
      cancellationRate: total > 0 ? Math.round((cancelled / total) * 100) : 0,
      noShowRate: total > 0 ? Math.round((noshow / total) * 100) : 0,
    }
  },
}

export default appointmentService
