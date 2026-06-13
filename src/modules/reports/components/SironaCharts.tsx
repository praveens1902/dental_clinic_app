import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import {
  RevenueTrendItem,
  AppointmentTrendItem,
  PatientTrendItem,
  TreatmentStatsItem,
  BranchPerformanceRow,
} from '../types'

// Tooltip custom styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-text-primary text-white text-[10px] font-semibold p-2.5 rounded-xl border border-border/40 shadow-modal text-left space-y-1">
        <p className="font-extrabold border-b border-white/20 pb-0.5 mb-1">{label}</p>
        {payload.map((item: any, idx: number) => (
          <p key={idx} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
            <span>{item.name}: </span>
            <span className="font-black">
              {item.name.toLowerCase().includes('revenue') || item.name.toLowerCase().includes('collection') || item.name.toLowerCase().includes('outstanding')
                ? `₹${item.value.toLocaleString()}`
                : item.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

// 1. Revenue & Collections Trend Chart
interface RevenueTrendChartProps {
  data: RevenueTrendItem[]
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          <Line name="Billed Revenue" type="monotone" dataKey="revenue" stroke="#005d52" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 3 }} />
          <Line name="Collected Cash" type="monotone" dataKey="collections" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
          <Line name="Outstanding Due" type="monotone" dataKey="outstanding" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 2. Appointment Trends Stacked Bar Chart
interface AppointmentStatusChartProps {
  data: AppointmentTrendItem[]
}

export const AppointmentStatusChart: React.FC<AppointmentStatusChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          <Bar name="Completed" dataKey="completed" fill="#10b981" stackId="status" radius={[0, 0, 0, 0]} />
          <Bar name="No Show" dataKey="noshow" fill="#f59e0b" stackId="status" />
          <Bar name="Cancelled" dataKey="cancelled" fill="#ef4444" stackId="status" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 3. Patient Growth Area Chart
interface PatientGrowthChartProps {
  data: PatientTrendItem[]
}

export const PatientGrowthChart: React.FC<PatientGrowthChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#005d52" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#005d52" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          <Area name="New Patients" type="monotone" dataKey="newPatients" stroke="#005d52" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2.5} />
          <Area name="Returning Patients" type="monotone" dataKey="returningPatients" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRet)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// 4. Treatment Distribution Pie Chart
interface TreatmentDistributionChartProps {
  data: TreatmentStatsItem[]
}

export const TreatmentDistributionChart: React.FC<TreatmentDistributionChartProps> = ({ data }) => {
  const COLORS = ['#005d52', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6']

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={45}
            fill="#8884d8"
            dataKey="frequency"
            nameKey="name"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', maxWidth: '180px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// 5. Branch Multi-Comparison Revenue Bar Chart
interface BranchRevenueChartProps {
  data: BranchPerformanceRow[]
}

export const BranchRevenueChart: React.FC<BranchRevenueChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="branchName" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickFormatter={(v) => v.split(' - ')[0]} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          <Bar name="Billed Revenue" dataKey="revenue" fill="#005d52" radius={[4, 4, 0, 0]} />
          <Bar name="Collected Cash" dataKey="collections" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
