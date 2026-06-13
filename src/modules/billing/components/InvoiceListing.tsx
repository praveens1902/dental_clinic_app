import React, { useMemo } from 'react'
import { Invoice } from '../types'
import { Table, Column } from '@/components/ui/Table'
import { Calendar, FileText, IndianRupee, Printer, Eye, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface InvoiceListingProps {
  data: Invoice[]
  onView: (invoice: Invoice) => void
  onRecordPayment: (invoice: Invoice) => void
  onPrint: (invoice: Invoice) => void
}

export const InvoiceListing: React.FC<InvoiceListingProps> = ({
  data,
  onView,
  onRecordPayment,
  onPrint,
}) => {
  // Columns declaration
  const columns: Column<Invoice>[] = useMemo(() => [
    {
      header: 'Invoice Number',
      accessorKey: 'invoiceNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-extrabold text-primary flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{row.invoiceNumber}</span>
        </span>
      ),
    },
    {
      header: 'Patient Info',
      accessorKey: 'patientName',
      sortable: true,
      cell: (row) => (
        <div className="text-left py-0.5 select-none">
          <p className="font-black text-text-primary">{row.patientName}</p>
          <p className="text-[10px] font-bold text-text-secondary">ID: {row.patientId}</p>
        </div>
      ),
    },
    {
      header: 'Invoice Date',
      accessorKey: 'invoiceDate',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1 font-bold text-text-secondary/95 select-none">
          <Calendar className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
          <span>
            {new Date(row.invoiceDate).toLocaleDateString([], {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </span>
      ),
    },
    {
      header: 'Branch',
      accessorKey: 'branchName',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-text-secondary/90 select-none">
          {row.branchName.split(' - ')[0]}
        </span>
      ),
    },
    {
      header: 'Net Total',
      accessorKey: 'netAmount',
      sortable: true,
      cell: (row) => (
        <span className="font-black text-text-primary flex items-center gap-0.5">
          <IndianRupee className="w-3.5 h-3.5 text-text-secondary shrink-0" />
          <span>{row.netAmount.toLocaleString()}</span>
        </span>
      ),
    },
    {
      header: 'Amount Paid',
      accessorKey: 'amountPaid',
      sortable: true,
      cell: (row) => (
        <span className="font-bold text-success flex items-center gap-0.5">
          <IndianRupee className="w-3.5 h-3.5 text-success/50 shrink-0" />
          <span>{row.amountPaid.toLocaleString()}</span>
        </span>
      ),
    },
    {
      header: 'Balance',
      accessorKey: 'balanceAmount',
      sortable: true,
      cell: (row) => {
        const isOutstanding = row.balanceAmount > 0
        return (
          <span className={`font-black flex items-center gap-0.5 ${isOutstanding ? 'text-danger animate-pulse' : 'text-text-secondary/70'}`}>
            <IndianRupee className="w-3.5 h-3.5 shrink-0" />
            <span>{row.balanceAmount.toLocaleString()}</span>
          </span>
        )
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        let style = 'bg-primary-light text-primary border-primary/15'
        if (row.status === 'Paid') style = 'bg-success/10 text-success border-success/15'
        else if (row.status === 'Cancelled') style = 'bg-danger/10 text-danger border-danger/15'
        else if (row.status === 'Partially Paid') style = 'bg-warning/10 text-warning-dark border-warning/15'

        return (
          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full select-none ${style}`}>
            {row.status}
          </span>
        )
      },
    },
    {
      header: 'Actions Workflows',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end py-1">
          {/* Record Payment action */}
          {row.balanceAmount > 0 && row.status !== 'Cancelled' && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              leftIcon={<DollarSign className="w-3.5 h-3.5" />}
              onClick={() => onRecordPayment(row)}
              className="text-[10px] font-black text-success border-success/15 bg-success/5 hover:bg-success/15"
            >
              Collect
            </Button>
          )}

          {/* View Details */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onView(row)}
            className="text-text-secondary hover:text-primary p-2 h-auto"
            title="Inspect Invoice details"
          >
            <Eye className="w-4 h-4" />
          </Button>

          {/* Print trigger */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onPrint(row)}
            className="text-text-secondary hover:text-primary p-2 h-auto"
            title="Print Invoices copy"
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ], [onView, onRecordPayment, onPrint])

  // Dropdown options for filtering
  const filterOptions = [
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Generated', value: 'Generated' },
        { label: 'Partially Paid', value: 'Partially Paid' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
    },
    {
      key: 'branchName',
      label: 'Branches',
      options: [
        { label: 'Saket', value: 'Saket - New Delhi' },
        { label: 'Vasant Vihar', value: 'Vasant Vihar - New Delhi' },
        { label: 'Indiranagar', value: 'Indiranagar - Bengaluru' },
        { label: 'Koregaon Park', value: 'Koregaon Park - Pune' },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <Table<Invoice>
        data={data}
        columns={columns}
        searchKey="patientName"
        searchPlaceholder="Search by patient name..."
        filterOptions={filterOptions}
      />
    </div>
  )
}
export default InvoiceListing
