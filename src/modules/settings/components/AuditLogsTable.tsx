import React, { useMemo, useState } from 'react'
import { Calendar, User, Eye } from 'lucide-react'
import { AuditLogRecord } from '../types'
import { Table, Column } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface AuditLogsTableProps {
  data: AuditLogRecord[]
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ data }) => {
  // Modal detail display state
  const [detailLog, setDetailLog] = useState<AuditLogRecord | null>(null)

  const columns: Column<AuditLogRecord>[] = useMemo(() => [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1.5 font-bold text-text-secondary select-none">
          <Calendar className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
          <span>{row.timestamp}</span>
        </span>
      ),
    },
    {
      header: 'Workspace Module',
      accessorKey: 'module',
      sortable: true,
      cell: (row) => {
        let style = 'bg-primary-light text-primary border-primary/10'
        if (row.module === 'Billing') style = 'bg-success/15 text-success border-success/15'
        else if (row.module === 'Settings') style = 'bg-indigo-50 text-indigo-600 border-indigo-100'
        else if (row.module === 'Patients') style = 'bg-warning/15 text-warning-dark border-warning/15'

        return (
          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full select-none ${style}`}>
            {row.module}
          </span>
        )
      },
    },
    {
      header: 'Operating User',
      accessorKey: 'user',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1.5 font-extrabold text-text-primary select-none">
          <User className="w-3.5 h-3.5 text-text-secondary/40 shrink-0" />
          <span>{row.user}</span>
        </span>
      ),
    },
    {
      header: 'Action audit details',
      accessorKey: 'action',
      cell: (row) => (
        <p className="text-xs text-text-primary/90 leading-relaxed font-semibold max-w-xs md:max-w-md truncate" title={row.action}>
          {row.action}
        </p>
      ),
    },
    {
      header: 'Details',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setDetailLog(row)}
            leftIcon={<Eye className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />}
            className="p-1.5 h-auto text-text-secondary hover:text-primary"
            title="Inspect audit detail block"
          />
        </div>
      ),
    },
  ], [])

  const filterOptions = [
    {
      key: 'module',
      label: 'Modules',
      options: [
        { label: 'Patients', value: 'Patients' },
        { label: 'Billing', value: 'Billing' },
        { label: 'Examination', value: 'Examination' },
        { label: 'Settings', value: 'Settings' },
      ],
    },
  ]

  return (
    <div className="space-y-4 animate-fadeIn">
      
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Clinics Audit Log ledger
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Chronological security ledger tracking system configurations, patient intakes, and payment settlements.
        </p>
      </div>

      <Table<AuditLogRecord>
        data={data}
        columns={columns}
        searchKey="action"
        searchPlaceholder="Search audit details..."
        filterOptions={filterOptions}
      />

      {/* Audit inspect popover details modal */}
      {detailLog && (
        <Modal
          isOpen={true}
          onClose={() => setDetailLog(null)}
          title={`Audit Event - #${detailLog.id}`}
        >
          <div className="space-y-4 text-left text-text-primary text-xs font-semibold leading-relaxed">
            
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3.5 select-none font-bold">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div>
                  <p className="text-[9px] text-text-secondary uppercase">Audited Module</p>
                  <span className="text-xs font-black text-primary uppercase">{detailLog.module}</span>
                </div>
                <span className="text-[9px] font-black text-text-secondary/60">
                  ID: {detailLog.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-text-secondary/70 uppercase">Operating User</span>
                  <p className="text-text-primary flex items-center gap-1.5 font-bold">
                    <User className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{detailLog.user}</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-text-secondary/70 uppercase">Audit Timestamp</span>
                  <p className="text-text-primary flex items-center gap-1.5 font-bold">
                    <ClockIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{detailLog.timestamp}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-text-secondary uppercase select-none">Action Description</span>
              <div className="bg-white border border-border/80 rounded-xl p-4 font-extrabold text-text-primary/95 text-xs bg-background/10">
                {detailLog.action}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/30">
              <Button type="button" variant="primary" size="sm" onClick={() => setDetailLog(null)} className="font-bold text-xs px-5">
                Close Inspector
              </Button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  )
}

// Internal clock indicator wrapper to prevent type discrepancies
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
export default AuditLogsTable
