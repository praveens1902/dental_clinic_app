import React, { useState, useRef } from 'react'
import { UploadCloud, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { UploadQueueItem, InvestigationFileType } from '../types'
import {
  INITIAL_PHOTO_CATEGORIES,
  INITIAL_RADIOLOGY_TYPES,
  INITIAL_SCAN_TYPES,
} from '../schemas'

interface FileUploadManagerProps {
  onUploadSuccess: (
    fileType: InvestigationFileType,
    category: string,
    fileName: string,
    notes: string,
    fileSize: string
  ) => Promise<void>
}

export const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  onUploadSuccess,
}) => {
  const [fileType, setFileType] = useState<InvestigationFileType>('Photo')
  const [category, setCategory] = useState<string>('Front View')
  const [notes, setNotes] = useState('')
  
  // Drag & drop highlight state
  const [isDragging, setIsDragging] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get matching categories depending on file type
  const getCategories = (): string[] => {
    switch (fileType) {
      case 'Photo':
        return [...INITIAL_PHOTO_CATEGORIES]
      case 'Radiology':
        return [...INITIAL_RADIOLOGY_TYPES]
      case 'Scan':
        return [...INITIAL_SCAN_TYPES]
      default:
        return []
    }
  }

  // Adjust category default when fileType changes
  const handleFileTypeChange = (type: InvestigationFileType) => {
    setFileType(type)
    const cats = type === 'Photo' ? INITIAL_PHOTO_CATEGORIES :
                 type === 'Radiology' ? INITIAL_RADIOLOGY_TYPES : INITIAL_SCAN_TYPES
    setCategory(cats[0])
  }

  // Simulate file uploading queue
  const processFiles = (files: FileList) => {
    const newItems: UploadQueueItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      progress: 0,
      status: 'uploading',
      category,
      notes,
    }))

    setUploadQueue((prev) => [...prev, ...newItems])

    // Run parallel progress bars simulations
    newItems.forEach((item) => {
      let currentProgress = 0
      const interval = setInterval(async () => {
        currentProgress += Math.floor(Math.random() * 25) + 15
        
        if (currentProgress >= 100) {
          currentProgress = 100
          clearInterval(interval)
          
          // Complete upload successfully
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: 100, status: 'completed' } : q))
          )

          // Commit to service
          await onUploadSuccess(fileType, category, item.fileName, notes, item.fileSize)

          // Auto-clear item from queue after 3 seconds
          setTimeout(() => {
            setUploadQueue((prev) => prev.filter((q) => q.id !== item.id))
          }, 3000)

        } else {
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: currentProgress } : q))
          )
        }
      }, 350)
    })

    // Reset notes input
    setNotes('')
  }

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleCameraCapture = () => {
    // Simulated instant snapshot
    const simulatedFiles = {
      0: {
        name: `camera_capture_${new Date().getTime()}.jpg`,
        size: 1.8 * 1024 * 1024,
      },
      length: 1,
    } as unknown as FileList
    processFiles(simulatedFiles)
  }

  return (
    <div className="space-y-4">
      {/* 1. Parameter Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <Select
          label="Investigation Type"
          value={fileType}
          onChange={(e) => handleFileTypeChange(e.target.value as InvestigationFileType)}
          options={[
            { value: 'Photo', label: 'Intra-Oral Photo' },
            { value: 'Radiology', label: 'Radiology (X-Ray / OPG)' },
            { value: 'Scan', label: 'Intra-Oral Scan (STL / Report)' },
          ]}
        />

        <Select
          label="Anatomical Category / Technique"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={getCategories().map((c) => ({ value: c, label: c }))}
        />
      </div>

      <Input
        label="Clinical Annotations / Notes"
        placeholder="e.g. Taken pre-treatment. Severe decay on #14."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* 2. Drag & Drop Surface */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-card p-6 flex flex-col items-center text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary-light/10 shadow-inner scale-[0.99]'
            : 'border-border/80 hover:border-primary/50 bg-background/25'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp,.pdf,.stl"
        />

        <div className="p-3 bg-primary-light rounded-full text-primary mb-3">
          <UploadCloud className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-1 select-none">
          <p className="text-xs font-bold text-text-primary">
            Drag &amp; drop file here, or click to browse
          </p>
          <p className="text-[10px] text-text-secondary/80 font-semibold">
            Supports JPG, PNG, WEBP, PDF, or STL files
          </p>
        </div>
      </div>

      {/* Camera Capture Option */}
      <Button
        type="button"
        variant="outline"
        size="xs"
        leftIcon={<Camera className="w-3.5 h-3.5" />}
        onClick={handleCameraCapture}
        className="w-full font-bold bg-white text-text-primary border-border/80 hover:bg-background"
      >
        Capture from Intra-Oral Camera
      </Button>

      {/* 3. Upload Progression Queue */}
      {uploadQueue.length > 0 && (
        <div className="bg-white border border-border/80 rounded-xl p-3.5 space-y-3 shadow-premium animate-fadeIn text-left">
          <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
            <span>Transmitting Queue ({uploadQueue.length})</span>
          </h4>

          <div className="space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
            {uploadQueue.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-text-primary gap-4">
                  <span className="truncate font-bold shrink-0 max-w-[60%]">{item.fileName}</span>
                  <span className="text-[10px] text-text-secondary/70 shrink-0">{item.fileSize}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-border/40 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status === 'completed'
                          ? 'bg-success'
                          : item.status === 'failed'
                          ? 'bg-danger'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  
                  {item.status === 'completed' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  )}
                  {item.status === 'failed' && (
                    <AlertCircle className="w-3.5 h-3.5 text-danger shrink-0" />
                  )}
                  {item.status === 'uploading' && (
                    <span className="text-[9px] font-bold text-primary shrink-0">{item.progress}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default FileUploadManager
