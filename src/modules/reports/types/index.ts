export interface GlobalReportFilter {
  dateFrom: string
  dateTo: string
  branchName: string
  doctorName: string
  treatmentType: string
  status: string
}

export interface RevenueTrendItem {
  label: string // e.g. "Day 1", "Week 1", "Jan"
  revenue: number
  collections: number
  outstanding: number
}

export interface AppointmentTrendItem {
  label: string
  scheduled: number
  completed: number
  cancelled: number
  noshow: number
}

export interface PatientTrendItem {
  label: string
  newPatients: number
  returningPatients: number
}

export interface TreatmentStatsItem {
  name: string
  frequency: number
  revenue: number
  completionRate: number
}

export interface DoctorLeaderboardRow {
  doctorName: string
  patientsSeen: number
  revenueGenerated: number
  appointmentsCompleted: number
  treatmentCount: number
  rank: number
}

export interface BranchPerformanceRow {
  branchName: string
  revenue: number
  appointments: number
  collections: number
  activePatients: number
}

export interface AgingAnalysisRow {
  ageGroup: string // "0-30 Days", "31-60 Days", etc.
  amount: number
  percentage: number
}

export interface ReportsDashboardSummary {
  totalRevenue: number
  totalAppointments: number
  totalPatients: number
  activeTreatmentsCount: number
  collectionRate: number
  noShowRate: number
}

export interface InsightCardItem {
  id: string
  title: string
  description: string
  type: 'success' | 'warning' | 'info'
}
