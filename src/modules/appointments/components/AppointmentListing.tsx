import React, { useMemo } from 'react'
import { Appointment, AppointmentStatus } from '../types'
import { Table, Column } from '@/components/ui/Table'
import { User, Phone, Bell, XCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AppointmentListingProps {
  data: Appointment[]
  onStatusChange: (id: string, status: AppointmentStatus) => void
  onSendReminder: (id: string, patientName: string) => void
  onViewDetails: (id: string) => void
}

export const AppointmentListing: React.FC<AppointmentListingProps> = ({
  data,
  onStatusChange,
  onSendReminder,
  onViewDetails,
}) => {
  // Columns declaration
  const columns: Column<Appointment>[] = useMemo(() => [
    {
      header: 'Patient Info',
      accessorKey: 'patientName',
      sortable: true,
      cell: (row) => (
        <div className="text-left py-1">
          <p className="font-extrabold text-text-primary">{row.patientName}</p>
          <p className="text-[10px] text-text-secondary flex items-center gap-1 font-semibold mt-0.5">
            <Phone className="w-3 h-3 text-text-secondary/60 shrink-0" />
            <span>{row.mobileNumber}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'Consulting Doctor',
      accessorKey: 'doctorName',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1 font-semibold text-text-secondary">
          <User className="w-3.5 h-3.5 text-text-secondary/40 shrink-0" />
          <span>{row.doctorName}</span>
        </span>
      ),
    },
    {
      header: 'Schedule Slot',
      accessorKey: 'appointmentDate',
      sortable: true,
      cell: (row) => (
        <span className="flex flex-col text-left font-bold text-text-secondary/95">
          <span>{new Date(row.appointmentDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
          <span className="text-[10px] text-primary font-black mt-0.5">@{row.appointmentTime}</span>
        </span>
      ),
    },
    {
      header: 'Clinic Branch',
      accessorKey: 'branchName',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-text-secondary/90">
          {row.branchName.split(' - ')[0]}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        let style = 'bg-primary-light text-primary border-primary/15'
        if (row.status === 'Completed') style = 'bg-success/10 text-success border-success/15'
        else if (row.status === 'Cancelled') style = 'bg-danger/10 text-danger border-danger/15'
        else if (row.status === 'Checked In') style = 'bg-blue-50 text-blue-700 border-blue-100'
        else if (row.status === 'In Progress') style = 'bg-warning/10 text-warning-dark border-warning/15'
        else if (row.status === 'No Show') style = 'bg-gray-100 text-gray-700 border-gray-200'

        return (
          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full ${style}`}>
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
          {/* Check-In Action */}
          {row.status === 'Scheduled' && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => onStatusChange(row.id, 'Checked In')}
              className="text-[10px] font-black text-primary border-primary/10 bg-primary-light/5 hover:bg-primary-light/20"
            >
              Check-In
            </Button>
          )}

          {/* Complete Action */}
          {(row.status === 'Checked In' || row.status === 'In Progress' || row.status === 'Scheduled') && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => onStatusChange(row.id, 'Completed')}
              className="text-[10px] font-black text-success border-success/10 bg-success/5 hover:bg-success/10"
            >
              Complete
            </Button>
          )}

          {/* Cancel Action */}
          {(row.status === 'Scheduled' || row.status === 'Checked In') && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onStatusChange(row.id, 'Cancelled')}
              className="text-[10px] font-bold text-text-secondary hover:text-danger p-2 h-auto"
              title="Cancel Appointment"
            >
              <XCircle className="w-3.5 h-3.5" />
            </Button>
          )}

          {/* Send Reminder Action */}
          {(row.status === 'Scheduled') && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onSendReminder(row.id, row.patientName)}
              className="text-[10px] font-bold text-text-secondary hover:text-primary p-2 h-auto"
              title="Send WhatsApp/SMS Reminder"
            >
              <Bell className="w-3.5 h-3.5 animate-pulse" />
            </Button>
          )}

          {/* Inspect / View Details Page */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onViewDetails(row.id)}
            className="text-[10px] font-bold text-text-secondary hover:text-primary p-2 h-auto"
            title="Inspect Details"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ], [onStatusChange, onSendReminder, onViewDetails])

  const filterOptions = [
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { label: 'Scheduled', value: 'Scheduled' },
        { label: 'Checked In', value: 'Checked In' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'No Show', value: 'No Show' },
      ],
    },
    {
      key: 'doctorName',
      label: 'Doctors',
      options: [
        { label: 'Dr. Ananya Iyer', value: 'Dr. Ananya Iyer' },
        { label: 'Dr. Vikram Seth', value: 'Dr. Vikram Seth' },
        { label: 'Dr. Riya Sen', value: 'Dr. Riya Sen' },
        { label: 'Dr. Amit Sharma', value: 'Dr. Amit Sharma' },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <Table<Appointment>
        data={data}
        columns={columns}
        searchKey="patientName"
        searchPlaceholder="Search patients name..."
        filterOptions={filterOptions}
      />
    </div>
  )
}
export default AppointmentListing
