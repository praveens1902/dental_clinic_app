export interface DashboardSummary {
  totalAppointments: number
  patientsSeenToday: number
  todaysRevenue: number
  upcomingAppointments: number
  activeTreatments: number
  collectionRate: number // percentage
  trends: {
    totalAppointments: string // e.g. "+10% vs yesterday"
    patientsSeenToday: string
    todaysRevenue: string
    activeTreatments: string
    collectionRate: string
  }
}

export interface RevenueChartPoint {
  period: string
  revenue: number
  collections: number
}

export interface BranchSummary {
  id: string
  branchName: string
  branchCode: string
  revenue: number
  appointments: number
  collections: number
  activePatients: number
}

export interface DoctorPerformance {
  id: string
  doctorName: string
  patientsSeen: number
  revenueGenerated: number
  appointmentCount: number
  avatar: string
  specialization: string
}

export interface DashboardActivity {
  id: string
  user: string
  action: string
  timestamp: string
  type: 'clinical' | 'patient' | 'appointment' | 'prescription' | 'billing' | 'system'
}

export interface TodayAppointment {
  id: string
  time: string
  patientName: string
  procedure: string
  doctorName: string
  status: 'Scheduled' | 'Checked In' | 'Completed' | 'Cancelled'
}
