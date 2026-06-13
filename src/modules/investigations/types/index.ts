export type InvestigationFileType = 'Photo' | 'Radiology' | 'Scan'

export type PhotoCategory =
  | 'Front View'
  | 'Upper Arch'
  | 'Lower Arch'
  | 'Left View'
  | 'Right View'
  | 'Occlusal View'
  | 'Other'

export type RadiologyType =
  | 'Chairside X-Ray'
  | 'Full Mouth X-Ray'
  | 'OPG'
  | 'CBCT'

export type ScanFileType =
  | 'STL File'
  | 'Scan Image'
  | 'Scan Report'

export interface InvestigationFile {
  id: string
  patientId: string
  fileName: string
  fileUrl: string
  fileType: InvestigationFileType
  category: PhotoCategory | RadiologyType | ScanFileType | string
  uploadedAt: string
  uploadedBy: string
  fileSize: string
  notes?: string
}

export interface InvestigationTimelineItem {
  id: string
  patientId: string
  activity: string
  performedBy: string
  createdAt: string
}

export interface InvestigationSummary {
  totalPhotos: number
  totalXRays: number
  totalOPGs: number
  totalScans: number
  latestUploadDate: string | null
}

export interface UploadQueueItem {
  id: string
  fileName: string
  fileSize: string
  progress: number
  status: 'uploading' | 'completed' | 'failed'
  category: string
  notes: string
}

export interface InvestigationFilter {
  fileType: InvestigationFileType | 'All'
  category: string | 'All'
  uploadedBy: string | 'All'
  searchTerm: string
  dateFrom: string
  dateTo: string
}
