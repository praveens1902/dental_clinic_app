import React from 'react'
import { Download, Trash2, Calendar, User, HardDrive, FileText, Database } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { InvestigationFile } from '../types'

interface FilePreviewDrawerProps {
  file: InvestigationFile | null
  onClose: () => void
  onDownload: (file: InvestigationFile) => void
  onDelete: (file: InvestigationFile) => void
}

export const FilePreviewDrawer: React.FC<FilePreviewDrawerProps> = ({
  file,
  onClose,
  onDownload,
  onDelete,
}) => {
  if (!file) return null

  const isImage = file.fileName.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/) !== null
  const isPdf = file.fileName.toLowerCase().endsWith('.pdf')
  const isStl = file.fileName.toLowerCase().endsWith('.stl')

  // Render file-specific preview viewport
  const renderPreviewContent = () => {
    if (isImage) {
      return (
        <div className="relative rounded-xl overflow-hidden bg-background/30 border border-border select-none max-h-96 flex items-center justify-center">
          <img
            src={file.fileUrl}
            alt={file.fileName}
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      )
    }

    if (isPdf) {
      return (
        <div className="rounded-xl border border-dashed border-danger/30 bg-danger/5 p-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center">
            <FileText className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h5 className="text-sm font-extrabold text-text-primary">PDF Scan Document Preview</h5>
            <p className="text-[10px] text-text-secondary/80 mt-1 max-w-xs">
              Direct embedding is disabled for security clearance. Click &quot;Download Attachment&quot; to inspect full report.
            </p>
          </div>
        </div>
      )
    }

    if (isStl) {
      return (
        <div className="rounded-xl border border-dashed border-teal/30 bg-teal/5 p-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center">
            <Database className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h5 className="text-sm font-extrabold text-text-primary">3D STL Mesh Object Loaded</h5>
            <p className="text-[10px] text-text-secondary/80 mt-1 max-w-xs">
              Ready for 3Shape / Itero CAD link simulation. Export mesh file to load into clinical planner.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-xl border border-dashed border-border p-8 flex flex-col items-center justify-center text-center">
        <FileText className="w-10 h-10 text-text-secondary/50 mb-2" />
        <p className="text-xs text-text-secondary font-bold">Standard Document Format</p>
      </div>
    )
  }

  const drawerFooter = (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => onDelete(file)}
        leftIcon={<Trash2 className="w-4 h-4" />}
        className="font-bold text-xs text-text-secondary hover:text-danger hover:bg-danger/5 mr-auto px-3.5 py-2.5"
      >
        Delete Report
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={() => onDownload(file)}
        leftIcon={<Download className="w-4 h-4" />}
        className="font-bold text-xs shadow-premium px-4 py-2.5"
      >
        Download Attachment
      </Button>
    </>
  )

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="File Details & Preview"
      size="md"
      footer={drawerFooter}
    >
      <div className="space-y-6">
        {/* 1. Preview Container */}
        {renderPreviewContent()}

        {/* 2. File Metadata */}
        <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-3 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-2">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase">File Reference</p>
              <h4 className="text-sm font-black text-text-primary leading-tight truncate max-w-xs sm:max-w-md">
                {file.fileName}
              </h4>
            </div>
            <span className="inline-flex text-[9px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full uppercase shrink-0">
              {file.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <span className="text-[9px] text-text-secondary/70 uppercase">Size on Disk</span>
              <p className="text-text-primary flex items-center gap-1.5 font-bold">
                <HardDrive className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{file.fileSize}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-text-secondary/70 uppercase">Acquisition Date</span>
              <p className="text-text-primary flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>
                  {new Date(file.uploadedAt).toLocaleDateString([], {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-[9px] text-text-secondary/70 uppercase">Acquiring Clinician</span>
              <p className="text-text-primary flex items-center gap-1.5 font-bold">
                <User className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{file.uploadedBy}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 3. Clinical Notes */}
        {file.notes && (
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Clinical Annotations / Notes
            </span>
            <div className="bg-warning/5 border border-warning/15 rounded-xl p-3.5 text-xs text-text-primary font-medium leading-relaxed italic">
              &ldquo;{file.notes}&rdquo;
            </div>
          </div>
        )}

      </div>
    </Drawer>
  )
}
export default FilePreviewDrawer
