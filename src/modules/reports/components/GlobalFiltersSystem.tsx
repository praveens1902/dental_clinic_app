import React, { useState } from 'react'
import { Filter, Calendar, SlidersHorizontal, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react'
import { GlobalFilterSchemaType, getEmptyGlobalFilter } from '../schemas'
import { DOCTOR_OPTIONS, BRANCH_OPTIONS } from '@/modules/appointments/schemas'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlertStore } from '@/store/alertStore'

interface GlobalFiltersSystemProps {
  filters: GlobalFilterSchemaType
  onFilterChange: (filters: GlobalFilterSchemaType) => void
  onExport: (format: 'pdf' | 'excel' | 'csv') => void
  activeReportName: string
}

export const GlobalFiltersSystem: React.FC<GlobalFiltersSystemProps> = ({
  filters,
  onFilterChange,
  onExport,
  activeReportName: _activeReportName,
}) => {
  const { addToast } = useAlertStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleFieldChange = (field: keyof GlobalFilterSchemaType, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  const handleResetFilters = () => {
    onFilterChange(getEmptyGlobalFilter())
    addToast({
      type: 'info',
      title: 'Filters Reset',
      message: 'Restored clinical analytical parameters to 30-day baseline.',
    })
  }

  const exportFormats = [
    { label: 'PDF Report', format: 'pdf' as const, icon: <FileSpreadsheet className="w-3.5 h-3.5 text-danger" /> },
    { label: 'Excel Sheet', format: 'excel' as const, icon: <FileSpreadsheet className="w-3.5 h-3.5 text-success" /> },
    { label: 'CSV Ledger', format: 'csv' as const, icon: <FileSpreadsheet className="w-3.5 h-3.5 text-primary" /> },
  ]

  return (
    <div className="bg-white border border-border/80 rounded-xl p-4 shadow-premium space-y-4 select-none">
      
      {/* Header bar with expand toggle and export center */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Toggle trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-black text-text-primary uppercase tracking-wider focus:outline-none text-left cursor-pointer"
        >
          <Filter className="w-4 h-4 text-primary shrink-0" />
          <span>Report Analytics Filters</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
        </button>

        {/* EXPORT CENTER */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <span className="text-[10px] font-black text-text-secondary uppercase mr-1 hidden md:block">
            Export Center:
          </span>
          {exportFormats.map((f) => (
            <Button
              key={f.format}
              type="button"
              variant="outline"
              size="xs"
              leftIcon={f.icon}
              onClick={() => onExport(f.format)}
              className="text-[10px] font-black bg-white border border-border/80 text-text-primary py-1.5 px-3 h-auto"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Expandable filters area */}
      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-border/40 animate-fadeIn text-left">
          
          <Input
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFieldChange('dateFrom', e.target.value)}
            leftIcon={<Calendar className="w-3.5 h-3.5 text-text-secondary" />}
          />

          <Input
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFieldChange('dateTo', e.target.value)}
            leftIcon={<Calendar className="w-3.5 h-3.5 text-text-secondary" />}
          />

          <Select
            label="Clinic Branch"
            value={filters.branchName}
            onChange={(e) => handleFieldChange('branchName', e.target.value)}
            options={[
              { value: 'All', label: 'All Branches' },
              ...BRANCH_OPTIONS.map((b) => ({ value: b, label: b.split(' - ')[0] })),
            ]}
          />

          <Select
            label="Treating Doctor"
            value={filters.doctorName}
            onChange={(e) => handleFieldChange('doctorName', e.target.value)}
            options={[
              { value: 'All', label: 'All Doctors' },
              ...DOCTOR_OPTIONS.map((d) => ({ value: d, label: d })),
            ]}
          />

          <Select
            label="Treatment Category"
            value={filters.treatmentType}
            onChange={(e) => handleFieldChange('treatmentType', e.target.value)}
            options={[
              { value: 'All', label: 'All Treatments' },
              { value: 'RCT', label: 'Root Canal (RCT)' },
              { value: 'Crown', label: 'Zirconia Crown' },
              { value: 'Scaling', label: 'Scaling & Cleanup' },
              { value: 'Extraction', label: 'Simple Extraction' },
              { value: 'Implant', label: 'Dental Implant' },
            ]}
          />

          <div className="flex items-end gap-2.5">
            <div className="flex-1">
              <Select
                label="Billing / Appt Status"
                value={filters.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Cancelled', label: 'Cancelled' },
                  { value: 'Paid', label: 'Fully Paid' },
                  { value: 'Partially Paid', label: 'Partially Paid' },
                  { value: 'Generated', label: 'Issued Invoices' },
                ]}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleResetFilters}
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5 text-text-secondary" />}
              className="bg-white border border-border/80 text-text-secondary hover:text-text-primary px-3 h-10 shrink-0 font-bold"
            >
              Reset
            </Button>
          </div>

        </div>
      )}
    </div>
  )
}
export default GlobalFiltersSystem
