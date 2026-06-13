import React from 'react'
import { Eye, Trash2, Camera, Calendar, User } from 'lucide-react'
import { InvestigationFile } from '../types'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

interface PhotoGalleryProps {
  files: InvestigationFile[]
  onPreview: (file: InvestigationFile) => void
  onDelete: (file: InvestigationFile) => void
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  files,
  onPreview,
  onDelete,
}) => {
  if (files.length === 0) {
    return (
      <EmptyState
        title="No Intra-Oral Photos"
        description="Intra-oral smile captures and arch records will appear here once captured or uploaded."
        icon={Camera}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="group bg-white border border-border/80 rounded-xl overflow-hidden hover:border-primary/20 hover:shadow-premium transition-all flex flex-col justify-between"
        >
          {/* Thumbnail / Image container */}
          <div className="relative aspect-square overflow-hidden bg-background/30 shrink-0">
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover overlay controls */}
            <div className="absolute inset-0 bg-text-primary/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="xs"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => onPreview(file)}
                className="font-bold text-[10px]"
              >
                Inspect
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onDelete(file)}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-white" />}
                className="bg-danger/20 hover:bg-danger text-white rounded-lg p-2.5 h-auto border-transparent"
              />
            </div>
          </div>

          {/* Info bar */}
          <div className="p-3 text-left space-y-1">
            <span className="inline-flex text-[9px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full uppercase">
              {file.category}
            </span>
            <h4 className="text-[11px] font-bold text-text-primary truncate" title={file.fileName}>
              {file.fileName}
            </h4>
            <div className="flex items-center justify-between text-[9px] text-text-secondary/70 font-semibold pt-1 border-t border-border/40">
              <span className="flex items-center gap-0.5">
                <Calendar className="w-3 h-3" />
                {new Date(file.uploadedAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
              </span>
              <span className="flex items-center gap-0.5 max-w-[50%] truncate">
                <User className="w-3 h-3" />
                {file.uploadedBy.split(' ').pop()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default PhotoGallery
