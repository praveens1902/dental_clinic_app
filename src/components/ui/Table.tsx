import React, { useState, useMemo } from 'react'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  Download,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react'
import { Button } from './Button'
import { useAlertStore } from '@/store/alertStore'

export interface Column<T> {
  header: string
  accessorKey: keyof T | string
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKey?: keyof T
  filterOptions?: {
    key: keyof T | string
    label: string
    options: { label: string; value: string }[]
  }[]
  bulkActions?: {
    label: string
    onClick: (selectedRows: T[]) => void
    icon?: React.ReactNode
    variant?: 'primary' | 'danger' | 'outline'
  }[]
  title?: string
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKey,
  filterOptions,
  bulkActions,
  title,
}: TableProps<T>) {
  const { addToast } = useAlertStore()

  // 1. Search State
  const [searchQuery, setSearchQuery] = useState('')
  
  // 2. Sort State
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  // 3. Filter States
  const [filters, setFilters] = useState<Record<string, string>>({})

  // 4. Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [String(col.accessorKey)]: true }), {})
  )
  const [colMenuOpen, setColMenuOpen] = useState(false)

  // 5. Selection States
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})

  // 6. Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Clear Selection helper
  const clearSelection = () => setSelectedIds({})

  // Handle Sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortKey(null)
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Filter Data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply Search
    if (searchQuery && searchKey) {
      result = result.filter((row) => {
        const val = row[searchKey]
        return String(val ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    // Apply Dropdown Filters
    Object.entries(filters).forEach(([key, val]) => {
      if (val) {
        result = result.filter((row) => String(row[key] ?? '') === val)
      }
    })

    // Apply Sorting
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal === undefined || bVal === undefined) return 0
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()
        if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1
        if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, searchQuery, searchKey, filters, sortKey, sortDirection])

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, currentPage, rowsPerPage])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  // Multi-Selection actions
  const selectedRows = useMemo(() => {
    return filteredData.filter((row, idx) => selectedIds[row.id ?? idx])
  }, [filteredData, selectedIds])

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((row, idx) => selectedIds[row.id ?? idx])

  const handleSelectAll = () => {
    const updated = { ...selectedIds }
    const allInPageSelected = paginatedData.every((row, idx) => selectedIds[row.id ?? idx])
    
    paginatedData.forEach((row, idx) => {
      const key = row.id ?? idx
      if (allInPageSelected) {
        delete updated[key]
      } else {
        updated[key] = true
      }
    })
    setSelectedIds(updated)
  }

  const handleSelectRow = (key: string | number) => {
    setSelectedIds((prev) => {
      const updated = { ...prev }
      if (updated[key]) {
        delete updated[key]
      } else {
        updated[key] = true
      }
      return updated
    })
  }

  // Column Visibility Handlers
  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Export Mock Trigger
  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Export Success',
      message: `Exported ${filteredData.length} entries to Excel/CSV format successfully!`,
    })
  }

  return (
    <div className="space-y-4">
      
      {/* 1. TABLE CONTROL TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-surface p-5 rounded-card border border-border/80 shadow-premium">
        
        {/* Left Side: Title & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {title && <h3 className="text-lg font-bold font-heading text-text-primary mr-2 shrink-0">{title}</h3>}
          {searchKey && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary placeholder:text-text-secondary/50"
              />
            </div>
          )}
        </div>

        {/* Right Side: Filters, Columns Visibility & Export */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          
          {/* Dropdown Filters */}
          {filterOptions?.map((f) => (
            <select
              key={String(f.key)}
              value={filters[String(f.key)] ?? ''}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, [String(f.key)]: e.target.value }))
                setCurrentPage(1)
              }}
              className="px-3 py-2 bg-background border border-border/80 text-text-primary text-xs font-semibold rounded-xl focus:outline-none focus:border-primary"
            >
              <option value="">All {f.label}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Columns Visibility Toggle dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              onClick={() => setColMenuOpen(!colMenuOpen)}
              onBlur={() => setTimeout(() => setColMenuOpen(false), 200)}
              className="text-xs font-semibold"
            >
              Columns
            </Button>
            {colMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-modal z-40 py-1.5 px-1">
                <div className="px-2.5 py-1 border-b border-border mb-1.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase">Toggle Columns</span>
                </div>
                {columns.map((col) => {
                  const keyStr = String(col.accessorKey)
                  const isVis = visibleColumns[keyStr] !== false
                  return (
                    <button
                      key={keyStr}
                      onClick={() => toggleColumnVisibility(keyStr)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-background rounded-lg text-left text-xs text-text-primary font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={isVis}
                        readOnly
                        className="rounded border-border text-primary accent-primary w-3.5 h-3.5"
                      />
                      <span>{col.header}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExport}
            className="text-xs font-semibold"
          >
            Export
          </Button>
        </div>
      </div>

      {/* 2. BULK ACTION TOOLBAR */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between bg-primary-light border border-primary/20 rounded-xl px-5 py-3 animate-fadeIn">
          <span className="text-xs font-bold text-primary">
            {selectedRows.length} items selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions?.map((act, index) => {
              const Icon = act.icon
              return (
                <Button
                  key={index}
                  variant={act.variant ?? 'outline'}
                  size="sm"
                  leftIcon={Icon}
                  onClick={() => {
                    act.onClick(selectedRows)
                    clearSelection()
                  }}
                  className="text-xs font-bold"
                >
                  {act.label}
                </Button>
              )
            }) ?? (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  addToast({
                    type: 'error',
                    title: 'Bulk Deletion Simulator',
                    message: `Deleted ${selectedRows.length} items successfully (mock action)`,
                  })
                  clearSelection()
                }}
                className="text-xs font-bold"
              >
                Delete Selected
              </Button>
            )}
            <button
              onClick={clearSelection}
              className="text-xs font-bold text-text-secondary hover:text-text-primary underline ml-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 3. SCROLLABLE CONTAINER FOR THE TABLE */}
      <div className="bg-surface rounded-card border border-border/80 shadow-premium overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-background/50">
                {/* Checkbox column for selection */}
                <th className="p-4 w-12 text-center align-middle">
                  <button
                    onClick={handleSelectAll}
                    className="text-text-secondary hover:text-primary transition-colors focus:outline-none"
                    aria-label="Select all"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4.5 h-4.5 text-primary" />
                    ) : (
                      <Square className="w-4.5 h-4.5" />
                    )}
                  </button>
                </th>
                
                {/* Dynamically generated headers */}
                {columns.map((col) => {
                  const keyStr = String(col.accessorKey)
                  const isVis = visibleColumns[keyStr] !== false
                  if (!isVis) return null

                  return (
                    <th
                      key={keyStr}
                      onClick={() => col.sortable && handleSort(keyStr)}
                      className={`p-4 text-xs font-bold text-text-secondary select-none tracking-wider uppercase ${
                        col.sortable ? 'cursor-pointer hover:bg-background/80 hover:text-text-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-text-secondary/50">
                            {sortKey === keyStr ? (
                              sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <ChevronsUpDown className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-12 text-center text-text-secondary/60 font-semibold text-sm">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => {
                  const rowId = row.id ?? rowIdx
                  const isSelected = !!selectedIds[rowId]

                  return (
                    <tr
                      key={rowId}
                      className={`border-b border-border/40 hover:bg-background/20 transition-colors last:border-b-0 ${
                        isSelected ? 'bg-primary-light/10' : ''
                      }`}
                    >
                      {/* Checkbox column for selection */}
                      <td className="p-4 w-12 text-center align-middle">
                        <button
                          onClick={() => handleSelectRow(rowId)}
                          className="text-text-secondary hover:text-primary transition-colors focus:outline-none"
                          aria-label={`Select row`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4.5 h-4.5 text-primary" />
                          ) : (
                            <Square className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </td>

                      {/* Columns */}
                      {columns.map((col) => {
                        const keyStr = String(col.accessorKey)
                        const isVis = visibleColumns[keyStr] !== false
                        if (!isVis) return null

                        const val = row[col.accessorKey]
                        return (
                          <td key={keyStr} className="p-4 text-sm font-medium text-text-primary align-middle">
                            {col.cell ? col.cell(row) : (val !== undefined && val !== null ? String(val) : '—')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border/85 bg-background/20 gap-4">
            
            {/* Left Page Size selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary font-semibold">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-2.5 py-1.5 bg-background border border-border text-text-primary text-xs font-semibold rounded-lg focus:outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-xs text-text-secondary font-semibold ml-2">
                Showing {Math.min(filteredData.length, (currentPage - 1) * rowsPerPage + 1)} - {Math.min(filteredData.length, currentPage * rowsPerPage)} of {filteredData.length} records
              </span>
            </div>

            {/* Right Pagination Buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {/* Responsive Numeric Buttons */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                // simple page calculation around current page
                let p = idx + 1
                if (currentPage > 3 && totalPages > 5) {
                  p = currentPage - 3 + idx
                  if (p + (4 - idx) > totalPages) {
                    p = totalPages - 4 + idx
                  }
                }
                
                return (
                  <Button
                    key={p}
                    variant={currentPage === p ? 'primary' : 'outline'}
                    size="xs"
                    onClick={() => setCurrentPage(p)}
                    className="w-8 h-8 flex items-center justify-center p-0 font-bold"
                  >
                    {p}
                  </Button>
                )
              })}

              <Button
                variant="outline"
                size="xs"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}