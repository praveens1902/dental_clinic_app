export type AppointmentStatus =
  | 'Scheduled'
  | 'Checked In'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'No Show'

export type ReminderChannel = 'WhatsApp' | 'SMS' | 'Email'

export type ReminderStatus = 'Pending' | 'Sent' | 'Delivered' | 'Failed'

export interface Appointment {
  id: string
  patientId?: string
  patientName: string
  mobileNumber: string
  doctorName: string
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  branchName: string
  remarks?: string
  age?: string
  gender?: string
}

export interface ReminderHistoryItem {
  id: string
  appointmentId: string
  channel: ReminderChannel
  date: string
  status: ReminderStatus
  recipientName: string
}

export interface DoctorSchedule {
  doctorName: string
  availableSlots: string[]
  bookedSlots: string[]
  blockedSlots: string[]
}

export interface AppointmentAnalytics {
  totalAppointments: number
  byStatus: Record<AppointmentStatus, number>
  doctorUtilization: Record<string, number> // doctor -> percentage
  cancellationRate: number
  noShowRate: number
}
