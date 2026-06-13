import React from 'react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts'
import { RevenueChartPoint } from '../types'

interface RevenueChartProps {
  data: RevenueChartPoint[]
  view: 'weekly' | 'monthly' | 'yearly'
  onViewChange: (view: 'weekly' | 'monthly' | 'yearly') => void
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  view,
  onViewChange,
}) => {
  // Format YAxis numeric values as Indian Currency formatter or shorthand (e.g. 10k, 2L)
  const formatYAxis = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`
    return `₹${val}`
  }

  // Format Tooltip values beautifully
  const formatTooltip = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium flex flex-col h-[400px]">
      
      {/* Chart Headers Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 mb-6">
        <div>
          <h3 className="text-base font-bold font-heading text-text-primary">Revenue Analytics</h3>
          <p className="text-[10px] font-semibold text-text-secondary">Comparing total treatment invoiced amounts vs receipts collected.</p>
        </div>
        
        {/* View toggles */}
        <div className="flex bg-background border border-border p-1 rounded-xl shrink-0">
          {(['weekly', 'monthly', 'yearly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                view === v
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="flex-1 w-full min-h-0 text-[10px] font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#156B4A" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#156B4A" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="period" 
              stroke="#6B7280" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={formatYAxis} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
              formatter={(value: any) => [formatTooltip(Number(value)), '']}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            />
            <Area 
              name="Invoiced Revenue" 
              type="monotone" 
              dataKey="revenue" 
              stroke="#156B4A" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Area 
              name="Receipt Collections" 
              type="monotone" 
              dataKey="collections" 
              stroke="#3B82F6" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorCollections)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
export default RevenueChart
