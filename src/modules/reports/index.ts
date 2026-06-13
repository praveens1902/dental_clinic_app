import { ReportsPage } from './pages/ReportsPage'
export { ReportsPage }
export { ReportsSkeleton } from './components/ReportsSkeleton'
export { GlobalFiltersSystem } from './components/GlobalFiltersSystem'
export {
  RevenueTrendChart,
  AppointmentStatusChart,
  PatientGrowthChart,
  TreatmentDistributionChart,
  BranchRevenueChart,
} from './components/SironaCharts'
export { DoctorLeaderboard } from './components/DoctorLeaderboard'
export { BranchComparison } from './components/BranchComparison'
export { CollectionAging } from './components/CollectionAging'
export { InsightsCenter } from './components/InsightsCenter'
export type {
  GlobalReportFilter,
  RevenueTrendItem,
  AppointmentTrendItem,
  PatientTrendItem,
  TreatmentStatsItem,
  DoctorLeaderboardRow,
  BranchPerformanceRow,
  AgingAnalysisRow,
  ReportsDashboardSummary,
  InsightCardItem,
} from './types'
export {
  globalFilterSchema,
  getEmptyGlobalFilter,
} from './schemas'
export type { GlobalFilterSchemaType } from './schemas'
export { reportsService } from './services/reportsService'
export default ReportsPage
