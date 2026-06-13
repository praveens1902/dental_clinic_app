import { InvestigationsTab } from './components/InvestigationsTab'
export { InvestigationsTab }
export { InvestigationSkeleton } from './components/InvestigationSkeleton'
export { FileUploadManager } from './components/FileUploadManager'
export { PhotoGallery } from './components/PhotoGallery'
export { RadiologyRecordsList } from './components/RadiologyRecordsList'
export { IntraOralScansList } from './components/IntraOralScansList'
export { FilePreviewDrawer } from './components/FilePreviewDrawer'
export { InvestigationTimeline } from './components/InvestigationTimeline'
export type {
  InvestigationFileType,
  PhotoCategory,
  RadiologyType,
  ScanFileType,
  InvestigationFile,
  InvestigationTimelineItem,
  InvestigationSummary,
  UploadQueueItem,
  InvestigationFilter,
} from './types'
export {
  investigationFileSchema,
  INITIAL_PHOTO_CATEGORIES,
  INITIAL_RADIOLOGY_TYPES,
  INITIAL_SCAN_TYPES,
} from './schemas'
export type { InvestigationFileSchemaType } from './schemas'
export { investigationService } from './services/investigationService'
export default InvestigationsTab
