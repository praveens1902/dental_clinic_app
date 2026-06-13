import { 
  DashboardSummary, 
  RevenueChartPoint, 
  BranchSummary, 
  DoctorPerformance, 
  DashboardActivity, 
  TodayAppointment 
} from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_SUMMARY: DashboardSummary = {
  totalAppointments: 48,
  patientsSeenToday: 14,
  todaysRevenue: 45800,
  upcomingAppointments: 18,
  activeTreatments: 34,
  collectionRate: 92.4,
  trends: {
    totalAppointments: '+12% vs last week',
    patientsSeenToday: '+4 vs yesterday',
    todaysRevenue: '+8% vs average',
    activeTreatments: '+15% active root canals',
    collectionRate: '+2.4% trend rate',
  }
}

const MOCK_WEEKLY_REVENUE: RevenueChartPoint[] = [
  { period: 'Mon', revenue: 24000, collections: 22000 },
  { period: 'Tue', revenue: 32000, collections: 28000 },
  { period: 'Wed', revenue: 28000, collections: 27000 },
  { period: 'Thu', revenue: 45800, collections: 41000 },
  { period: 'Fri', revenue: 38000, collections: 35000 },
  { period: 'Sat', revenue: 42000, collections: 39000 },
  { period: 'Sun', revenue: 12000, collections: 12000 },
]

const MOCK_MONTHLY_REVENUE: RevenueChartPoint[] = [
  { period: 'Jan', revenue: 240000, collections: 210000 },
  { period: 'Feb', revenue: 310000, collections: 290000 },
  { period: 'Mar', revenue: 280000, collections: 270000 },
  { period: 'Apr', revenue: 420000, collections: 390000 },
  { period: 'May', revenue: 390000, collections: 360000 },
  { period: 'Jun', revenue: 482900, collections: 446100 },
]

const MOCK_YEARLY_REVENUE: RevenueChartPoint[] = [
  { period: '2021', revenue: 1800000, collections: 1650000 },
  { period: '2022', revenue: 2400000, collections: 2200000 },
  { period: '2023', revenue: 3200000, collections: 3000000 },
  { period: '2024', revenue: 4100000, collections: 3800000 },
  { period: '2025', revenue: 5200000, collections: 4900000 },
]

const MOCK_BRANCHES: BranchSummary[] = [
  {
    id: 'b1',
    branchName: 'Sirona Elite - New Delhi',
    branchCode: 'DEL-CP-01',
    revenue: 482900,
    appointments: 48,
    collections: 446100,
    activePatients: 642,
  },
  {
    id: 'b2',
    branchName: 'Sirona Prime - Gurugram',
    branchCode: 'GUR-DLF-02',
    revenue: 385000,
    appointments: 36,
    collections: 354000,
    activePatients: 485,
  },
  {
    id: 'b3',
    branchName: 'Sirona Care - Noida',
    branchCode: 'NOI-SEC-03',
    revenue: 298000,
    appointments: 28,
    collections: 268000,
    activePatients: 355,
  },
]

const MOCK_DOCTORS: DoctorPerformance[] = [
  {
    id: 'd1',
    doctorName: 'Dr. Ananya Iyer',
    specialization: 'Endodontist (Root Canals)',
    patientsSeen: 114,
    revenueGenerated: 215000,
    appointmentCount: 128,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ananya',
  },
  {
    id: 'd2',
    doctorName: 'Dr. Vivek Sirona',
    specialization: 'Implantologist & Surgeon',
    patientsSeen: 84,
    revenueGenerated: 185000,
    appointmentCount: 96,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=vivek',
  },
  {
    id: 'd3',
    doctorName: 'Dr. Rohit Mehra',
    specialization: 'Orthodontist (Braces)',
    patientsSeen: 95,
    revenueGenerated: 145000,
    appointmentCount: 112,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rohit',
  },
  {
    id: 'd4',
    doctorName: 'Dr. Sarah Connor',
    specialization: 'Pediatric Dentist',
    patientsSeen: 74,
    revenueGenerated: 92000,
    appointmentCount: 88,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah',
  },
]

const MOCK_ACTIVITIES: DashboardActivity[] = [
  { id: 'act1', user: 'Dr. Ananya Iyer', action: 'completed teeth scaling for Kabir Malhotra', timestamp: '10 mins ago', type: 'clinical' },
  { id: 'act2', user: 'Receptionist Rahul Sharma', action: 'registered new patient profile Aanya Gupta', timestamp: '30 mins ago', type: 'patient' },
  { id: 'act3', user: 'Accountant Meera Patel', action: 'collected ₹1,200 UPI for invoice CP-9018', timestamp: '45 mins ago', type: 'billing' },
  { id: 'act4', user: 'Dr. Vivek Sirona', action: 'finalized implant treatment plan for John Miller', timestamp: '1 hour ago', type: 'clinical' },
  { id: 'act5', user: 'System Bot', action: 'dispatched bulk SMS reminders to 14 checked-in queues', timestamp: '2 hours ago', type: 'system' },
]

const MOCK_TODAYS_APPOINTMENTS: TodayAppointment[] = [
  { id: 'app1', time: '10:00 AM', patientName: 'Kabir Malhotra', procedure: 'Teeth Scaling & Clean', doctorName: 'Dr. Ananya Iyer', status: 'Completed' },
  { id: 'app2', time: '11:30 AM', patientName: 'Riya Sen', procedure: 'Root Canal Therapy', doctorName: 'Dr. Ananya Iyer', status: 'Checked In' },
  { id: 'app3', time: '01:00 PM', patientName: 'John Miller', procedure: 'Implant Placement consultation', doctorName: 'Dr. Vivek Sirona', status: 'Scheduled' },
  { id: 'app4', time: '02:30 PM', patientName: 'Aanya Gupta', procedure: 'Orthodontic Braces check', doctorName: 'Dr. Rohit Mehra', status: 'Scheduled' },
  { id: 'app5', time: '04:00 PM', patientName: 'Vikram Singh', procedure: 'Crown Fitting & Scaling', doctorName: 'Dr. Sarah Connor', status: 'Cancelled' },
]

export const dashboardService = {
  // 1. Fetch KPI cards summaries
  getSummary: async (): Promise<DashboardSummary> => {
    await delay(800)
    return MOCK_SUMMARY
  },

  // 2. Fetch chart data based on selected view (weekly, monthly, yearly)
  getRevenueData: async (view: 'weekly' | 'monthly' | 'yearly'): Promise<RevenueChartPoint[]> => {
    await delay(700)
    if (view === 'weekly') return MOCK_WEEKLY_REVENUE
    if (view === 'monthly') return MOCK_MONTHLY_REVENUE
    return MOCK_YEARLY_REVENUE
  },

  // 3. Fetch list of Today's appointments
  getTodayAppointments: async (): Promise<TodayAppointment[]> => {
    await delay(600)
    return MOCK_TODAYS_APPOINTMENTS
  },

  // 4. Fetch Multi-branch performance metrics
  getBranchPerformance: async (): Promise<BranchSummary[]> => {
    await delay(900)
    return MOCK_BRANCHES
  },

  // 5. Fetch doctor leaderboard statistics
  getDoctorPerformance: async (): Promise<DoctorPerformance[]> => {
    await delay(800)
    return MOCK_DOCTORS
  },

  // 6. Fetch activities timeline feed
  getActivities: async (): Promise<DashboardActivity[]> => {
    await delay(600)
    return MOCK_ACTIVITIES
  },
}
export default dashboardService
