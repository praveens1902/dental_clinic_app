import {
  ReportsDashboardSummary,
  RevenueTrendItem,
  AppointmentTrendItem,
  PatientTrendItem,
  TreatmentStatsItem,
  DoctorLeaderboardRow,
  BranchPerformanceRow,
  AgingAnalysisRow,
  InsightCardItem,
} from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- MOCK RAW DATA ---
const REVENUE_TREND_MONTHLY: RevenueTrendItem[] = [
  { label: 'Jan', revenue: 120000, collections: 110000, outstanding: 10000 },
  { label: 'Feb', revenue: 145000, collections: 135000, outstanding: 10000 },
  { label: 'Mar', revenue: 160000, collections: 140000, outstanding: 20000 },
  { label: 'Apr', revenue: 185000, collections: 165000, outstanding: 20000 },
  { label: 'May', revenue: 210000, collections: 195000, outstanding: 15000 },
  { label: 'Jun', revenue: 250000, collections: 215000, outstanding: 35000 },
]

const APPOINTMENT_TREND_MONTHLY: AppointmentTrendItem[] = [
  { label: 'Jan', scheduled: 85, completed: 78, cancelled: 5, noshow: 2 },
  { label: 'Feb', scheduled: 98, completed: 88, cancelled: 6, noshow: 4 },
  { label: 'Mar', scheduled: 110, completed: 102, cancelled: 5, noshow: 3 },
  { label: 'Apr', scheduled: 125, completed: 114, cancelled: 7, noshow: 4 },
  { label: 'May', scheduled: 140, completed: 128, cancelled: 8, noshow: 4 },
  { label: 'Jun', scheduled: 165, completed: 145, cancelled: 12, noshow: 8 },
]

const PATIENT_TREND_MONTHLY: PatientTrendItem[] = [
  { label: 'Jan', newPatients: 24, returningPatients: 54 },
  { label: 'Feb', newPatients: 30, returningPatients: 58 },
  { label: 'Mar', newPatients: 35, returningPatients: 67 },
  { label: 'Apr', newPatients: 42, returningPatients: 72 },
  { label: 'May', newPatients: 48, returningPatients: 80 },
  { label: 'Jun', newPatients: 55, returningPatients: 90 },
]

const TREATMENT_STATS: TreatmentStatsItem[] = [
  { name: 'Root Canal Treatment (RCT)', frequency: 45, revenue: 292500, completionRate: 92 },
  { name: 'Zirconia Crown Placement', frequency: 32, revenue: 384000, completionRate: 100 },
  { name: 'Scaling & Prophylaxis', frequency: 65, revenue: 97500, completionRate: 98 },
  { name: 'Simple Extraction', frequency: 28, revenue: 42000, completionRate: 100 },
  { name: 'Titanium Dental Implant', frequency: 12, revenue: 420000, completionRate: 75 },
]

const DOCTORS_LEADERBOARD: DoctorLeaderboardRow[] = [
  { doctorName: 'Dr. Ananya Iyer', patientsSeen: 180, revenueGenerated: 320000, appointmentsCompleted: 162, treatmentCount: 120, rank: 1 },
  { doctorName: 'Dr. Vikram Seth', patientsSeen: 142, revenueGenerated: 240000, appointmentsCompleted: 128, treatmentCount: 95, rank: 2 },
  { doctorName: 'Dr. Riya Sen', patientsSeen: 110, revenueGenerated: 165000, appointmentsCompleted: 98, treatmentCount: 78, rank: 3 },
  { doctorName: 'Dr. Amit Sharma', patientsSeen: 85, revenueGenerated: 110000, appointmentsCompleted: 74, treatmentCount: 52, rank: 4 },
]

const BRANCH_PERFORMANCE: BranchPerformanceRow[] = [
  { branchName: 'Saket - New Delhi', revenue: 450000, appointments: 280, collections: 415000, activePatients: 420 },
  { branchName: 'Vasant Vihar - New Delhi', revenue: 320000, appointments: 198, collections: 295000, activePatients: 310 },
  { branchName: 'Indiranagar - Bengaluru', revenue: 280000, appointments: 162, collections: 260000, activePatients: 240 },
  { branchName: 'Koregaon Park - Pune', revenue: 190000, appointments: 114, collections: 175000, activePatients: 180 },
]

const AGING_ANALYSIS: AgingAnalysisRow[] = [
  { ageGroup: '0-30 Days', amount: 45000, percentage: 56 },
  { ageGroup: '31-60 Days', amount: 22000, percentage: 28 },
  { ageGroup: '61-90 Days', amount: 10000, percentage: 12 },
  { ageGroup: '90+ Days', amount: 3000, percentage: 4 },
]

const MOCK_INSIGHTS: InsightCardItem[] = [
  { id: 'in-1', title: 'Revenue Growth', description: 'Gross cash collections increased by 18% month-over-month due to high-value implant placements.', type: 'success' },
  { id: 'in-2', title: 'No-Show Optimization', description: 'No-show rates dropped by 7.2% following the launch of automated WhatsApp reminders on booking slots.', type: 'success' },
  { id: 'in-3', title: 'Top Performing Branch', description: 'The Saket - New Delhi branch continues to rank as the top performer, accounting for 36.3% of total network revenue.', type: 'info' },
  { id: 'in-4', title: 'Outstanding Aging Alert', description: 'Debtor aging analysis shows ₹13,000 outstanding beyond 60 days. Immediate payment reminders are recommended.', type: 'warning' },
]

// --- REPORTS CLINICAL SERVICE ---
export const reportsService = {
  // Fetch Dashboard Summary KPIs
  getSummary: async (): Promise<ReportsDashboardSummary> => {
    await delay(500)
    return {
      totalRevenue: 1240000,
      totalAppointments: 754,
      totalPatients: 1150,
      activeTreatmentsCount: 371,
      collectionRate: 88,
      noShowRate: 4,
    }
  },

  // Fetch Revenue charts
  getRevenueReport: async (): Promise<RevenueTrendItem[]> => {
    await delay(400)
    return REVENUE_TREND_MONTHLY
  },

  // Fetch Appointment status & trends
  getAppointmentReport: async (): Promise<AppointmentTrendItem[]> => {
    await delay(400)
    return APPOINTMENT_TREND_MONTHLY
  },

  // Fetch Patient registration stats
  getPatientReport: async (): Promise<PatientTrendItem[]> => {
    await delay(400)
    return PATIENT_TREND_MONTHLY
  },

  // Fetch Treatments breakdowns
  getTreatmentReport: async (): Promise<TreatmentStatsItem[]> => {
    await delay(400)
    return TREATMENT_STATS
  },

  // Fetch Doctor Performance leaderboards
  getDoctorLeaderboard: async (): Promise<DoctorLeaderboardRow[]> => {
    await delay(400)
    return DOCTORS_LEADERBOARD
  },

  // Fetch Branch Performance Comparisons
  getBranchPerformance: async (): Promise<BranchPerformanceRow[]> => {
    await delay(400)
    return BRANCH_PERFORMANCE
  },

  // Fetch Aging analysis
  getCollectionAging: async (): Promise<AgingAnalysisRow[]> => {
    await delay(300)
    return AGING_ANALYSIS
  },

  // Fetch Insights cards
  getInsights: async (): Promise<InsightCardItem[]> => {
    await delay(300)
    return MOCK_INSIGHTS
  },
}

export default reportsService
