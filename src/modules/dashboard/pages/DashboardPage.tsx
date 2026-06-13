import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  Clock,
  LayoutGrid
} from 'lucide-react'
import { format } from 'date-fns'

// Core imports
import { dashboardService } from '../services/dashboardService'
import { 
  DashboardSummary, 
  RevenueChartPoint, 
  BranchSummary, 
  DoctorPerformance as DocType, 
  DashboardActivity, 
  TodayAppointment 
} from '../types'

import { KPICard } from '../components/KPICard'
import { RevenueChart } from '../components/RevenueChart'
import { AppointmentsTable } from '../components/AppointmentsTable'
import { BranchPerformance } from '../components/BranchPerformance'
import { DoctorPerformance } from '../components/DoctorPerformance'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { QuickActions } from '../components/QuickActions'

// Phase 01 Layout Blocks & fallbacks
import { PageHeader, ContentContainer } from '@/components/layout/LayoutComponents'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { useAlertStore } from '@/store/alertStore'

export const DashboardPage: React.FC = () => {
  const { activeBranch } = useUIStore()
  const { user } = useAuthStore()
  const { addToast } = useAlertStore()

  // 1. Sandbox Control States (Loading, Empty, Error simulations)
  const [sandboxState, setSandboxState] = useState<'active' | 'loading' | 'empty' | 'error'>('active')
  const [selectedChartView, setSelectedChartView] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')

  // 2. Data Bindings
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [chartData, setChartData] = useState<RevenueChartPoint[]>([])
  const [appointments, setAppointments] = useState<TodayAppointment[]>([])
  const [branches, setBranches] = useState<BranchSummary[]>([])
  const [doctors, setDoctors] = useState<DocType[]>([])
  const [activities, setActivities] = useState<DashboardActivity[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Fetch all dashboard data
  useEffect(() => {
    const fetchAllData = async () => {
      if (sandboxState === 'loading') {
        setIsLoading(true)
        return
      }
      if (sandboxState === 'empty') {
        setIsLoading(false)
        setSummary(null)
        setChartData([])
        setAppointments([])
        setBranches([])
        setDoctors([])
        setActivities([])
        return
      }
      if (sandboxState === 'error') {
        setIsLoading(false)
        setHasError(true)
        return
      }

      setIsLoading(true)
      setHasError(false)
      try {
        // Parallel fetching
        const [sum, chart, appts, brn, doc, act] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getRevenueData(selectedChartView),
          dashboardService.getTodayAppointments(),
          dashboardService.getBranchPerformance(),
          dashboardService.getDoctorPerformance(),
          dashboardService.getActivities()
        ])

        setSummary(sum)
        setChartData(chart)
        setAppointments(appts)
        setBranches(brn)
        setDoctors(doc)
        setActivities(act)
      } catch (err) {
        setHasError(true)
        addToast({
          type: 'error',
          title: 'Retrieval Failure',
          message: 'An error occurred fetching dashboard analytics.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [sandboxState, selectedChartView, addToast])

  // Handles individual appointment status click triggers
  const handleAppointmentStatusClick = (id: string, currentStatus: string) => {
    // Cyclic status update simulation
    const statusCycle: Record<string, 'Scheduled' | 'Checked In' | 'Completed' | 'Cancelled'> = {
      Scheduled: 'Checked In',
      'Checked In': 'Completed',
      Completed: 'Cancelled',
      Cancelled: 'Scheduled',
    }
    const nextStatus = statusCycle[currentStatus] || 'Scheduled'

    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: nextStatus } : app))
    )

    addToast({
      type: 'success',
      title: 'Chair Status Rotated',
      message: `Appointment state transitioned to: ${nextStatus}`,
    })
  }

  // --- RENDERING FALLBACK MATRIX ---
  
  // A. Loading State (Page Shimmer Skeleton)
  if (sandboxState === 'loading' || isLoading) {
    return (
      <ContentContainer className="space-y-6">
        {/* State toggles row */}
        {renderSandboxControls()}
        <PageSkeleton />
      </ContentContainer>
    )
  }

  // B. Forced Application Error State
  if (sandboxState === 'error' || hasError) {
    return (
      <ContentContainer className="space-y-6 py-6">
        {renderSandboxControls()}
        <ErrorState 
          type="general" 
          title="Clinical Database Offline"
          description="The active node partition could not establish an TLS connection to Sirona's database server. Retrying may fix."
          onRetry={() => setSandboxState('active')}
        />
      </ContentContainer>
    )
  }

  // C. Forced Empty State
  if (sandboxState === 'empty' || !summary) {
    return (
      <ContentContainer className="space-y-6 py-6">
        {renderSandboxControls()}
        <EmptyState
          title="No Operational Metrics Logged"
          description="This clinic branch has no logged dental appointments, treatments, or checkout billing receipts registered on this date."
          actionLabel="Book First Appointment"
          onAction={() => {
            setSandboxState('active')
            addToast({
              type: 'info',
              title: 'Sandbox Activated',
              message: 'Restored mock data models.',
            })
          }}
        />
      </ContentContainer>
    )
  }

  // D. Fully Active Operational Board rendering
  return (
    <ContentContainer className="space-y-6">
      
      {/* Sandbox state switcher */}
      {renderSandboxControls()}

      {/* Dynamic Main Greeting PageHeader */}
      <PageHeader
        title={`Welcome back, ${user?.name.split(' ')[0] || 'Doctor'}`}
        subtitle={`Operational summary and chair pipelines for Sirona ${activeBranch.name}.`}
        actions={
          <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold bg-white border border-border/80 px-3.5 py-2.5 rounded-xl shadow-sm">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{format(new Date(), 'EEEE, MMMM dd, yyyy')}</span>
          </div>
        }
      />

      {/* KPI Cards section (Horizontal scrolling grid helper on Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4.5 overflow-x-auto pb-1 sm:pb-0 scroll-smooth">
        <KPICard 
          title="Total Active Patients" 
          value={1482} 
          trend={summary.trends.totalAppointments} 
          icon={<Users className="w-5 h-5 text-primary" />} 
          color="bg-primary-light"
          trendType="positive"
        />
        <KPICard 
          title="Today&apos;s Appointments" 
          value={summary.totalAppointments} 
          trend={summary.trends.patientsSeenToday} 
          icon={<Calendar className="w-5 h-5 text-info" />} 
          color="bg-info/10"
          trendType="positive"
        />
        <KPICard 
          title="Gross Invoiced Revenue" 
          value={`₹${summary.todaysRevenue.toLocaleString('en-IN')}`} 
          trend={summary.trends.todaysRevenue} 
          icon={<CreditCard className="w-5 h-5 text-success" />} 
          color="bg-success/10"
          trendType="positive"
        />
        <KPICard 
          title="Active Treatments Done" 
          value={summary.activeTreatments} 
          trend={summary.trends.activeTreatments} 
          icon={<Activity className="w-5 h-5 text-warning" />} 
          color="bg-warning/10"
          trendType="positive"
        />
        <KPICard 
          title="Billings Collection Rate" 
          value={`${summary.collectionRate}%`} 
          trend={summary.trends.collectionRate} 
          icon={<TrendingUp className="w-5 h-5 text-primary" />} 
          color="bg-primary-light"
          trendType="positive"
        />
      </div>

      {/* Analytics Chart Row (Area AreaChart & Quick triggers) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue interactive chart */}
        <div className="lg:col-span-2">
          <RevenueChart 
            data={chartData} 
            view={selectedChartView} 
            onViewChange={setSelectedChartView} 
          />
        </div>

        {/* Quick Action button blocks */}
        <div>
          <QuickActions />
        </div>

      </div>

      {/* Secondary Row: Appointments Table + Timeline Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's appointments schedule list */}
        <div className="lg:col-span-2">
          <AppointmentsTable 
            appointments={appointments} 
            onStatusClick={handleAppointmentStatusClick} 
          />
        </div>

        {/* Dynamic Activity Audit logs feed */}
        <div>
          <ActivityTimeline activities={activities} />
        </div>

      </div>

      {/* Tertiary Row: Multi-Branch & Doctor Performance leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BranchPerformance branches={branches} />
        <DoctorPerformance doctors={doctors} />
      </div>

    </ContentContainer>
  )

  // Sandbox Toolbar helper
  function renderSandboxControls() {
    return (
      <div className="bg-primary-light/40 border border-primary/10 rounded-2xl px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn mb-1">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary shrink-0 animate-spin" />
          <span className="text-xs font-bold text-primary">SaaS Prototyping Controls</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Active Dashboard', state: 'active' },
            { label: 'Loading Shimmer', state: 'loading' },
            { label: 'Empty State Block', state: 'empty' },
            { label: 'DB Crash State', state: 'error' },
          ].map((item) => (
            <button
              key={item.state}
              onClick={() => {
                setSandboxState(item.state as any)
                setHasError(item.state === 'error')
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                sandboxState === item.state
                  ? 'bg-primary text-white border-transparent shadow'
                  : 'bg-white border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    )
  }
}
export default DashboardPage
