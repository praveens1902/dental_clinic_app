import React from 'react'
import { DollarSign, CreditCard, TrendingUp, AlertTriangle, FileText, IndianRupee } from 'lucide-react'
import { BillingDashboardSummary } from '../types'

interface BillingDashboardKPIsProps {
  summary: BillingDashboardSummary | null
}

export const BillingDashboardKPIs: React.FC<BillingDashboardKPIsProps> = ({ summary }) => {
  if (!summary) return null

  const CARDS = [
    {
      label: 'Total Revenue',
      value: summary.totalRevenue,
      icon: <TrendingUp className="w-5 h-5 text-success" />,
      bgClass: 'bg-success/5 border-success/10',
      textClass: 'text-success',
      desc: 'All-time collections',
    },
    {
      label: 'Collected Today',
      value: summary.revenueToday,
      icon: <DollarSign className="w-5 h-5 text-primary" />,
      bgClass: 'bg-primary/5 border-primary/10',
      textClass: 'text-primary',
      desc: `${summary.paymentsTodayCount} payments cleared`,
    },
    {
      label: 'Revenue Month',
      value: summary.revenueMonth,
      icon: <CreditCard className="w-5 h-5 text-blue-500" />,
      bgClass: 'bg-blue-50/50 border-blue-100',
      textClass: 'text-blue-600',
      desc: 'Current month ledger',
    },
    {
      label: 'Outstanding Amount',
      value: summary.outstandingAmount,
      icon: <AlertTriangle className="w-5 h-5 text-warning-dark" />,
      bgClass: 'bg-warning/5 border-warning/15',
      textClass: 'text-warning-dark',
      desc: `${summary.outstandingRate}% total bills outstanding`,
    },
    {
      label: 'Pending Invoices',
      value: summary.pendingInvoicesCount,
      icon: <FileText className="w-5 h-5 text-indigo-500" />,
      bgClass: 'bg-indigo-50/50 border-indigo-100',
      textClass: 'text-indigo-600',
      desc: 'Active un-settled bills',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-premium transition-all hover:scale-[1.01] select-none ${card.bgClass}`}
        >
          <div className="p-2.5 bg-white rounded-full shadow-sm mb-2 shrink-0">
            {card.icon}
          </div>
          <span className="text-[9px] font-bold text-text-secondary uppercase">
            {card.label}
          </span>
          <p className="text-xl font-black mt-1 leading-none text-text-primary flex items-center justify-center gap-0.5">
            {card.label !== 'Pending Invoices' && <IndianRupee className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className={card.textClass}>{card.value.toLocaleString()}</span>
          </p>
          <span className="text-[9px] text-text-secondary/60 mt-1 font-semibold">
            {card.desc}
          </span>
        </div>
      ))}
    </div>
  )
}
export default BillingDashboardKPIs
