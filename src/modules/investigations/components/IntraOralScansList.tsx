import React from 'react'
import { Eye, Download, Trash2, Calendar, Database, FileText } from 'lucide-react'
import { InvestigationFile } from '../types'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

interface IntraOralScansListProps {
  files: InvestigationFile[]
  onPreview: (file: InvestigationFile) => void
  onDelete: (file: InvestigationFile) => void
  onDownload: (file: InvestigationFile) => void
}

export const IntraOralScansList: React.FC<IntraOralScansListProps> = ({
  files,
  onPreview,
  onDelete,
  onDownload,
}) => {
  if (files.length === 0) {
    return (
      <EmptyState
        title="No Intra-Oral Scans"
        description="Itero STL files or orthodontic alignment reports will appear here once registered."
        icon={Database}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {files.map((file) => {
        const isStl = file.category === 'STL File' || file.fileName.toLowerCase().endsWith('.stl')
        return (
          <div
            key={file.id}
            className="bg-white border border-border/80 rounded-xl p-4 flex flex-col justify-between hover:border-primary/20 hover:shadow-premium transition-all gap-4"
          >
            {/* Header info */}
            <div className="flex items-start gap-3.5 text-left min-w-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 select-none border ${
                isStl
                  ? 'bg-teal-50 border-teal-100 text-teal-500'
                  : 'bg-primary-light border-primary/10 text-primary'
              }`}>
                {isStl ? <Database className="w-6 h-6 animate-bounce" /> : <FileText className="w-6 h-6" />}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    isStl ? 'bg-teal-50 text-teal-600' : 'bg-primary-light text-primary'
                  }`}>
                    {file.category}
                  </span>
                  <span className="text-[10px] text-text-secondary font-semibold">
                    {file.fileSize}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-text-primary truncate" title={file.fileName}>
                  {file.fileName}
                </h4>
                <span className="text-[9px] text-text-secondary/60 font-bold block flex items-center gap-0.5">
                  <Calendar className="w-3 h-3" />
                  Uploaded {new Date(file.uploadedAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>

            {/* Actions toolbar */}
            <div className="flex items-center gap-2 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="xs"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => onPreview(file)}
                className="flex-1 font-bold text-[10px] bg-white border-border/80 hover:bg-background"
              >
                {isStl ? 'Preview Mesh' : 'Preview'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={() => onDownload(file)}
                className="font-bold text-[10px] bg-white border-border/80 hover:bg-background text-text-secondary hover:text-primary px-2.5"
              />
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onDelete(file)}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-text-secondary" />}
                className="text-[10px] font-bold hover:text-danger hover:bg-danger/5 px-2.5"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default IntraOralScansList
