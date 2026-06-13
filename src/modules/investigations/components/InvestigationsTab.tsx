import React, { useState, useEffect } from 'react'
import {
  Camera,
  FolderOpen,
  History,
  FileImage,
  Database,
  Search,
  Filter,
  Eye,
} from 'lucide-react'

import { investigationService } from '../services/investigationService'
import { InvestigationFile, InvestigationTimelineItem, InvestigationSummary, InvestigationFileType } from '../types'
import { useAlertStore } from '@/store/alertStore'

import { InvestigationSkeleton } from './InvestigationSkeleton'
import { FileUploadManager } from './FileUploadManager'
import { PhotoGallery } from './PhotoGallery'
import { RadiologyRecordsList } from './RadiologyRecordsList'
import { IntraOralScansList } from './IntraOralScansList'
import { FilePreviewDrawer } from './FilePreviewDrawer'
import { InvestigationTimeline } from './InvestigationTimeline'
import { CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface InvestigationsTabProps {
  patientId: string
}

export const InvestigationsTab: React.FC<InvestigationsTabProps> = ({ patientId }) => {
  const { addToast, showModalAlert } = useAlertStore()

  const [files, setFiles] = useState<InvestigationFile[]>([])
  const [timeline, setTimeline] = useState<InvestigationTimelineItem[]>([])
  const [summary, setSummary] = useState<InvestigationSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Drawer / Overlay States
  const [previewFile, setPreviewFile] = useState<InvestigationFile | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)

  // Search and filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | InvestigationFileType>('All')
  const [clinicianFilter, setClinicianFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  // Load clinical investigation records
  const loadData = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [f, t, s] = await Promise.all([
        investigationService.getByPatientId(patientId),
        investigationService.getTimelineByPatientId(patientId),
        investigationService.getSummary(patientId),
      ])

      setFiles(f)
      setTimeline(t)
      setSummary(s)
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Connection Lost',
        message: 'Could not connect to Sirona Imaging database nodes.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [patientId])

  // Sync state helpers on mock upload completions
  const handleUploadSuccess = async (
    fileType: InvestigationFileType,
    category: string,
    fileName: string,
    notes: string,
    fileSize: string
  ) => {
    try {
      await investigationService.upload(
        patientId,
        fileType,
        category,
        fileName,
        notes,
        fileSize,
        'Dr. Ananya Iyer'
      )

      // Refresh files list, timelines and counts
      const [f, t, s] = await Promise.all([
        investigationService.getByPatientId(patientId),
        investigationService.getTimelineByPatientId(patientId),
        investigationService.getSummary(patientId),
      ])

      setFiles(f)
      setTimeline(t)
      setSummary(s)

      addToast({
        type: 'success',
        title: 'Imaging Sync Complete',
        message: `Linked "${fileName}" as active clinical diagnostic record.`,
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Transmission Failed',
        message: 'Clinical attachment was rejected by database node.',
      })
    }
  }

  // Simulated download triggers
  const handleDownload = (file: InvestigationFile) => {
    addToast({
      type: 'info',
      title: 'Downloading Attachment...',
      message: `Packaging "${file.fileName}" for local file system export.`,
    })
    
    // Simulate direct browser download trigger
    setTimeout(() => {
      window.open(file.fileUrl, '_blank')
    }, 500)
  }

  // Handle clinical asset delete purges
  const handleDelete = (file: InvestigationFile) => {
    showModalAlert({
      type: 'error',
      title: 'Delete Diagnostic Record?',
      message: `This action will permanently purge "${file.fileName}" from patient files. This will trigger audit warnings.`,
      confirmLabel: 'Purge File Permanently',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        try {
          await investigationService.delete(file.id, 'Dr. Ananya Iyer')
          
          // Refresh list, timeline & summaries
          const [f, t, s] = await Promise.all([
            investigationService.getByPatientId(patientId),
            investigationService.getTimelineByPatientId(patientId),
            investigationService.getSummary(patientId),
          ])

          setFiles(f)
          setTimeline(t)
          setSummary(s)
          
          if (previewFile?.id === file.id) {
            setPreviewFile(null)
          }

          addToast({
            type: 'success',
            title: 'Diagnostic Record Purged',
            message: 'Attachment file removed successfully.',
          })
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Purge Failed',
            message: 'Failed to purge database attachment.',
          })
        }
      },
    })
  }

  // Dynamic In-memory Search & Filtering
  const filteredFiles = files.filter((f) => {
    // 1. Filter by Active Section Chip
    if (activeTabFilter !== 'All' && f.fileType !== activeTabFilter) {
      return false
    }

    // 2. Filter by Clinician selection
    if (clinicianFilter !== 'All' && f.uploadedBy !== clinicianFilter) {
      return false
    }

    // 3. Filter by Category
    if (categoryFilter !== 'All' && f.category !== categoryFilter) {
      return false
    }

    // 4. Search text (matches File Name or custom Notes)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase()
      const matchName = f.fileName.toLowerCase().includes(query)
      const matchNotes = f.notes?.toLowerCase().includes(query) || false
      return matchName || matchNotes
    }

    return true
  })

  // Unique list of Clinicians and Categories for dropdown populating
  const availableClinicians = Array.from(new Set(files.map((f) => f.uploadedBy)))
  const availableCategories = Array.from(new Set(files.map((f) => f.category)))

  if (isLoading) {
    return <InvestigationSkeleton />
  }

  if (hasError) {
    return (
      <CardContainer className="text-center py-12 max-w-lg mx-auto animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
          <FolderOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-text-primary">Failed to Sync Imaging Vault</h3>
        <p className="text-xs text-text-secondary mt-2 mb-6 leading-relaxed">
          Sirona database nodes are unreachable. Check connectivity with central diagnostic server and try again.
        </p>
        <Button variant="primary" onClick={loadData}>
          Retry Connection
        </Button>
      </CardContainer>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* 1. CLINICAL METRICS SUMMARY BAR */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Intra-Oral Photos</span>
            <p className="text-2xl font-black text-primary leading-none">{summary.totalPhotos}</p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Chairside X-Rays</span>
            <p className="text-2xl font-black text-indigo-500 leading-none">{summary.totalXRays}</p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Panoramic OPGs</span>
            <p className="text-2xl font-black text-indigo-500 leading-none">{summary.totalOPGs}</p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-1">
            <span className="text-[10px] font-bold text-text-secondary uppercase">3D STL / Scans</span>
            <p className="text-2xl font-black text-teal-500 leading-none">{summary.totalScans}</p>
          </div>
          <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-1 col-span-2 md:col-span-1 justify-center flex flex-col">
            <span className="text-[10px] font-bold text-text-secondary uppercase">Latest Update</span>
            <p className="text-xs font-bold text-text-primary leading-none mt-1">
              {summary.latestUploadDate
                ? new Date(summary.latestUploadDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
                : 'First screening'}
            </p>
          </div>
        </div>
      )}

      {/* 2. MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Upload Board and Filter criteria */}
        <div className="space-y-6">
          
          {/* File Upload card */}
          <CardContainer className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2.5 flex items-center gap-1.5">
              <Camera className="w-4.5 h-4.5 text-primary" />
              <span>Diagnostic Upload Studio</span>
            </h3>
            <FileUploadManager onUploadSuccess={handleUploadSuccess} />
          </CardContainer>

          {/* Local Filters card */}
          <CardContainer className="space-y-4 text-left">
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-primary" />
              <span>Refine / Filters</span>
            </h3>
            
            <Select
              label="Diagnostic Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Categories' },
                ...availableCategories.map((c) => ({ value: c, label: c })),
              ]}
            />

            <Select
              label="Acquiring Doctor"
              value={clinicianFilter}
              onChange={(e) => setClinicianFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Clinicians' },
                ...availableClinicians.map((cl) => ({ value: cl, label: cl })),
              ]}
            />
          </CardContainer>

        </div>

        {/* Right main workspace: Filtering Chips, Search Bar, and Gallery displays */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filtering Chips & Text Search bar */}
          <CardContainer className="p-4 bg-background/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Chips to filter fileType quickly */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'All', label: 'All Vault' },
                { id: 'Photo', label: 'Clinical Photos' },
                { id: 'Radiology', label: 'Radiology / X-Rays' },
                { id: 'Scan', label: 'STL Scans / Reports' },
              ].map((chip) => {
                const isSelected = activeTabFilter === chip.id
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      setActiveTabFilter(chip.id as any)
                      setCategoryFilter('All') // reset category filter on format change
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background/80 bg-white border border-border/50'
                    }`}
                  >
                    {chip.label}
                  </button>
                )
              })}
            </div>

            {/* Input Search Box */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search file name or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-input text-xs font-medium py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
              />
              <Search className="w-4 h-4 text-text-secondary/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </CardContainer>

          {/* Active Vault Display area */}
          <CardContainer className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide">
                {activeTabFilter === 'All' ? 'Complete Diagnostics Archive' : 
                 activeTabFilter === 'Photo' ? 'Intra-Oral Photo Gallery' :
                 activeTabFilter === 'Radiology' ? 'Radiology Records Archive' : 'Intra-Oral Scans & Reports'}
              </h3>
              <span className="text-[10px] font-bold text-text-secondary uppercase">
                Showing {filteredFiles.length} Records
              </span>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="py-12 text-center text-xs text-text-secondary/50 font-bold border-2 border-dashed border-border/50 rounded-xl bg-background/5">
                No clinical records match your active search or filter criteria.
              </div>
            ) : (
              <div className="animate-fadeIn">
                {activeTabFilter === 'All' && (
                  <div className="space-y-8">
                    {/* Inline groupings */}
                    {files.filter(f => f.fileType === 'Photo').length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider text-left flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-primary" />
                          <span>Intra-Oral Photos</span>
                        </h4>
                        <PhotoGallery
                          files={filteredFiles.filter(f => f.fileType === 'Photo')}
                          onPreview={(f) => setPreviewFile(f)}
                          onDelete={handleDelete}
                        />
                      </div>
                    )}

                    {files.filter(f => f.fileType === 'Radiology').length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-border/40">
                        <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider text-left flex items-center gap-1.5">
                          <FileImage className="w-4 h-4 text-indigo-500" />
                          <span>Radiology Records</span>
                        </h4>
                        <RadiologyRecordsList
                          files={filteredFiles.filter(f => f.fileType === 'Radiology')}
                          onPreview={(f) => setPreviewFile(f)}
                          onDelete={handleDelete}
                          onDownload={handleDownload}
                        />
                      </div>
                    )}

                    {files.filter(f => f.fileType === 'Scan').length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-border/40">
                        <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider text-left flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-teal-500" />
                          <span>Intra-Oral Scans</span>
                        </h4>
                        <IntraOralScansList
                          files={filteredFiles.filter(f => f.fileType === 'Scan')}
                          onPreview={(f) => setPreviewFile(f)}
                          onDelete={handleDelete}
                          onDownload={handleDownload}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTabFilter === 'Photo' && (
                  <PhotoGallery
                    files={filteredFiles}
                    onPreview={(f) => setPreviewFile(f)}
                    onDelete={handleDelete}
                  />
                )}

                {activeTabFilter === 'Radiology' && (
                  <RadiologyRecordsList
                    files={filteredFiles}
                    onPreview={(f) => setPreviewFile(f)}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                )}

                {activeTabFilter === 'Scan' && (
                  <IntraOralScansList
                    files={filteredFiles}
                    onPreview={(f) => setPreviewFile(f)}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                )}
              </div>
            )}
          </CardContainer>

          {/* Investigation History Log Timeline */}
          <CardContainer>
            <button
              type="button"
              onClick={() => setShowTimeline((prev) => !prev)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                <History className="w-4 h-4 text-primary" />
                <span>Diagnostics History Timeline ({timeline.length})</span>
              </h3>
              <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors">
                {showTimeline ? 'Collapse' : 'Expand'}
              </span>
            </button>

            {showTimeline && (
              <div className="mt-4 pt-4 border-t border-border/40 max-h-96 overflow-y-auto custom-scrollbar">
                <InvestigationTimeline timeline={timeline} />
              </div>
            )}
          </CardContainer>

        </div>

      </div>

      {/* Selected file detail details Preview Drawer */}
      <FilePreviewDrawer
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

    </div>
  )
}
export default InvestigationsTab
