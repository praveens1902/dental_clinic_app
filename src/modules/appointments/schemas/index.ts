import { z } from 'zod'

export const appointmentStatusEnum = z.enum([
  'Scheduled',
  'Checked In',
  'In Progress',
  'Completed',
  'Cancelled',
  'No Show',
])

export const appointmentFormSchema = z.object({
  // Existing Patient Linkage
  patientId: z.string().optional(),
  
  // Patient Details (Form can take them either from search, or new patient quick registration!)
  patientName: z.string().min(1, 'Patient Name is required'),
  mobileNumber: z.string().min(10, 'Mobile Number must be at least 10 digits'),
  age: z.string().optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other', ''] as const).optional(),

  // Appointment Slot Details
  appointmentDate: z.string().min(1, 'Please select an appointment date'),
  appointmentTime: z.string().min(1, 'Please select a time slot'),
  doctorName: z.string().min(1, 'Please choose a consulting dentist'),
  branchName: z.string().min(1, 'Please select clinic branch'),
  remarks: z.string().optional().or(z.literal('')),
  
  status: appointmentStatusEnum,
})

export type AppointmentFormSchemaType = z.infer<typeof appointmentFormSchema>

export const DOCTOR_OPTIONS = [
  'Dr. Ananya Iyer',
  'Dr. Vikram Seth',
  'Dr. Riya Sen',
  'Dr. Amit Sharma',
]

export const BRANCH_OPTIONS = [
  'Saket - New Delhi',
  'Vasant Vihar - New Delhi',
  'Indiranagar - Bengaluru',
  'Koregaon Park - Pune',
]

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
]

export const getEmptyAppointmentForm = (): AppointmentFormSchemaType => ({
  patientId: '',
  patientName: '',
  mobileNumber: '',
  age: '',
  gender: '',
  appointmentDate: new Date().toISOString().split('T')[0],
  appointmentTime: '09:00',
  doctorName: 'Dr. Ananya Iyer',
  branchName: 'Saket - New Delhi',
  remarks: '',
  status: 'Scheduled',
})
