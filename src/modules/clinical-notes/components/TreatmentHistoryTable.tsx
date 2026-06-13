import React, { useMemo } from 'react'
import { HistoricalTreatment } from '../types'
import { Table, Column } from '@/components/ui/Table'
import { Calendar, User, FileText } from 'lucide-react'

interface TreatmentHistoryTableProps {
  data: HistoricalTreatment[]
}

export const TreatmentHistoryTable: React.FC<TreatmentHistoryTableProps> = ({ data }) => {
  // Columns declaration
  const columns: Column<HistoricalTreatment>[] = useMemo(() => [
    {
      header: 'Date',
      accessorKey: 'date',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1.5 font-bold text-text-secondary/95">
          <Calendar className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
          <span>
            {new Date(row.date).toLocaleDateString([], {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </span>
      ),
    },
    {
      header: 'Tooth',
      accessorKey: 'toothNumber',
      sortable: true,
      cell: (row) => (
        <span className="inline-flex text-[10px] font-black text-primary bg-primary-light border border-primary/10 px-2 py-0.5 rounded-full uppercase">
          {row.toothNumber === 'All' ? 'Full Arch' : `#${row.toothNumber}`}
        </span>
      ),
    },
    {
      header: 'Treatment Name',
      accessorKey: 'treatmentName',
      sortable: true,
      cell: (row) => <span className="font-extrabold text-text-primary">{row.treatmentName}</span>,
    },
    {
      header: 'Treating Doctor',
      accessorKey: 'doctorName',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1 font-semibold text-text-secondary/90">
          <User className="w-3.5 h-3.5 text-text-secondary/40 shrink-0" />
          <span>{row.doctorName}</span>
        </span>
      ),
    },
    {
      header: 'Clinical Notes',
      accessorKey: 'notes',
      cell: (row) => (
        <div className="flex items-start gap-1 max-w-xs md:max-w-md">
          <FileText className="w-3.5 h-3.5 text-text-secondary/40 shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary/80 font-medium leading-normal line-clamp-2" title={row.notes}>
            {row.notes}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        let badgeStyle = 'bg-primary-light text-primary border-primary/15'
        if (row.status === 'Completed') {
          badgeStyle = 'bg-success/10 text-success border-success/15'
        } else if (row.status === 'Cancelled') {
          badgeStyle = 'bg-danger/10 text-danger border-danger/15'
        } else if (row.status === 'In Progress') {
          badgeStyle = 'bg-warning/10 text-warning-dark border-warning/15'
        }
        return (
          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full ${badgeStyle}`}>
            {row.status}
          </span>
        )
      },
    },
  ], [])

  // Dropdown filter options for Table component
  const filterOptions = [
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { label: 'Completed', value: 'Completed' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Planned', value: 'Planned' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
    },
  ]

  return (
    <div className="space-y-3.5">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Previous Treatment History
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Historical dental procedures recorded on file. Reuses the standard table architecture with sorting and status filters.
        </p>
      </div>

      <Table<HistoricalTreatment>
        data={data}
        columns={columns}
        searchKey="treatmentName"
        searchPlaceholder="Search treatment name..."
        filterOptions={filterOptions}
      />
    </div>
  )
}
export default TreatmentHistoryTable
