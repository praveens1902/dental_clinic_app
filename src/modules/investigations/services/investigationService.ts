import {
  InvestigationFile,
  InvestigationTimelineItem,
  InvestigationSummary,
} from '../types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_FILES: InvestigationFile[] = [
  {
    id: 'file-1',
    patientId: 'p1',
    fileName: 'intraoral_front_smile.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?auto=format&fit=crop&q=80&w=600',
    fileType: 'Photo',
    category: 'Front View',
    uploadedAt: '2026-06-11T10:30:00Z',
    uploadedBy: 'Dr. Ananya Iyer',
    fileSize: '2.4 MB',
    notes: 'Pre-operative portrait smile photo. Shows alignment baseline.',
  },
  {
    id: 'file-2',
    patientId: 'p1',
    fileName: 'maxillary_arch_occlusal.png',
    fileUrl: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&q=80&w=600',
    fileType: 'Photo',
    category: 'Upper Arch',
    uploadedAt: '2026-06-11T10:35:00Z',
    uploadedBy: 'Dr. Ananya Iyer',
    fileSize: '3.1 MB',
    notes: 'Maxillary occlusal view showing deep grooves on upper right molars.',
  },
  {
    id: 'file-3',
    patientId: 'p1',
    fileName: 'mandibular_arch_occlusal.png',
    fileUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    fileType: 'Photo',
    category: 'Lower Arch',
    uploadedAt: '2026-06-11T10:37:00Z',
    uploadedBy: 'Dr. Ananya Iyer',
    fileSize: '2.8 MB',
    notes: 'Mandibular arch occlusal view showing slight crowding in anterior teeth.',
  },
  {
    id: 'file-4',
    patientId: 'p1',
    fileName: 'dental_panoramic_opg_screening.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
    fileType: 'Radiology',
    category: 'OPG',
    uploadedAt: '2026-05-10T10:45:00Z',
    uploadedBy: 'Dr. Ananya Iyer',
    fileSize: '4.5 MB',
    notes: 'Panoramic screening radiograph. Confirms congenitally missing third molar (#18) and wisdom impaction on #48.',
  },
  {
    id: 'file-5',
    patientId: 'p1',
    fileName: 'bicuspid_tooth_14_rvg.png',
    fileUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
    fileType: 'Radiology',
    category: 'Chairside X-Ray',
    uploadedAt: '2026-06-12T14:40:00Z',
    uploadedBy: 'Dr. Ananya Iyer',
    fileSize: '1.2 MB',
    notes: 'Periapical RVG image for #14. Shows deep dentinal caries approaching the pulp horn.',
  },
  {
    id: 'file-6',
    patientId: 'p1',
    fileName: 'itero_3d_maxillary_scan.stl',
    fileUrl: 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&q=80&w=600',
    fileType: 'Scan',
    category: 'STL File',
    uploadedAt: '2026-06-11T11:00:00Z',
    uploadedBy: 'Dr. Ananya Iyer',
    fileSize: '18.4 MB',
    notes: '3D digital impression scan of the upper jaw for future aligner simulation.',
  },
  {
    id: 'file-7',
    patientId: 'p1',
    fileName: 'itero_bite_alignment_report.pdf',
    // We can use a free pdf placeholder or dummy url
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'Scan',
    category: 'Scan Report',
    uploadedAt: '2026-06-11T11:15:00Z',
    uploadedBy: 'Dr. Ananya Iyer',
    fileSize: '1.8 MB',
    notes: 'Full mouth digital occlusion scan summary report.',
  },
]

const INITIAL_MOCK_TIMELINE: InvestigationTimelineItem[] = [
  {
    id: 'it-1',
    patientId: 'p1',
    activity: 'X-Ray Uploaded: bicuspid_tooth_14_rvg.png',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-06-12T14:40:00Z',
  },
  {
    id: 'it-2',
    patientId: 'p1',
    activity: 'Photos Uploaded: 3 intra-oral photos added (Front View, Upper, Lower Arches)',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-06-11T10:37:00Z',
  },
  {
    id: 'it-3',
    patientId: 'p1',
    activity: 'Scan Uploaded: itero_3d_maxillary_scan.stl',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-06-11T11:00:00Z',
  },
  {
    id: 'it-4',
    patientId: 'p1',
    activity: 'OPG Radiograph Uploaded: dental_panoramic_opg_screening.jpg',
    performedBy: 'Dr. Ananya Iyer',
    createdAt: '2026-05-10T10:45:00Z',
  },
]

// --- LOCAL STORAGE DATA SYNC ---
const getFiles = (): InvestigationFile[] => {
  const data = localStorage.getItem('sirona_investigation_files')
  return data ? JSON.parse(data) : INITIAL_MOCK_FILES
}

const saveFiles = (list: InvestigationFile[]) => {
  localStorage.setItem('sirona_investigation_files', JSON.stringify(list))
}

const getTimeline = (): InvestigationTimelineItem[] => {
  const data = localStorage.getItem('sirona_investigation_timeline')
  return data ? JSON.parse(data) : INITIAL_MOCK_TIMELINE
}

const saveTimeline = (list: InvestigationTimelineItem[]) => {
  localStorage.setItem('sirona_investigation_timeline', JSON.stringify(list))
}

// --- SERVICE IMPLEMENTATION ---
export const investigationService = {
  // Fetch investigations for patient
  getByPatientId: async (patientId: string): Promise<InvestigationFile[]> => {
    await delay(500)
    const list = getFiles()
    return list.filter((f) => f.patientId === patientId)
  },

  // Simulate file upload (creates entry in DB)
  upload: async (
    patientId: string,
    fileType: 'Photo' | 'Radiology' | 'Scan',
    category: string,
    fileName: string,
    notes: string = '',
    fileSize: string = '2.5 MB',
    uploadedBy: string = 'Dr. Ananya Iyer'
  ): Promise<InvestigationFile> => {
    await delay(1200) // Longer delay to simulate upload progression
    const list = getFiles()
    const now = new Date().toISOString()

    // Assign mock URLs based on file type so that it displays nicely in the gallery
    let mockUrl = 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?auto=format&fit=crop&q=80&w=600'
    if (fileType === 'Radiology') {
      mockUrl = category === 'OPG' 
        ? 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600'
    } else if (fileType === 'Scan') {
      mockUrl = fileName.endsWith('.pdf')
        ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        : 'https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&q=80&w=600'
    }

    const newFile: InvestigationFile = {
      id: Math.random().toString(36).substring(2, 9),
      patientId,
      fileName,
      fileUrl: mockUrl,
      fileType,
      category,
      uploadedAt: now,
      uploadedBy,
      fileSize,
      notes: notes || undefined,
    }

    const updatedList = [newFile, ...list]
    saveFiles(updatedList)

    // Add Timeline audit event
    const timeline = getTimeline()
    const actionLabel = 
      fileType === 'Photo' ? 'Photo Uploaded' :
      fileType === 'Radiology' ? 'X-Ray Uploaded' : 'Scan Uploaded'

    const newTimelineEvent: InvestigationTimelineItem = {
      id: Math.random().toString(36).substring(2, 9),
      patientId,
      activity: `${actionLabel}: ${fileName} (${category})`,
      performedBy: uploadedBy,
      createdAt: now,
    }
    saveTimeline([newTimelineEvent, ...timeline])

    return newFile
  },

  // Delete an investigation record (soft delete)
  delete: async (id: string, performedBy: string = 'Dr. Ananya Iyer'): Promise<boolean> => {
    await delay(600)
    const list = getFiles()
    const found = list.find((f) => f.id === id)
    if (!found) return false

    const filtered = list.filter((f) => f.id !== id)
    saveFiles(filtered)

    // Log to Timeline
    const timeline = getTimeline()
    const newTimelineEvent: InvestigationTimelineItem = {
      id: Math.random().toString(36).substring(2, 9),
      patientId: found.patientId,
      activity: `Report Deleted: ${found.fileName} (${found.category})`,
      performedBy,
      createdAt: new Date().toISOString(),
    }
    saveTimeline([newTimelineEvent, ...timeline])

    return true
  },

  // Fetch timeline logs
  getTimelineByPatientId: async (patientId: string): Promise<InvestigationTimelineItem[]> => {
    await delay(300)
    const list = getTimeline()
    return list
      .filter((t) => t.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // Calculate summary metrics
  getSummary: async (patientId: string): Promise<InvestigationSummary> => {
    await delay(400)
    const files = await investigationService.getByPatientId(patientId)
    
    const photos = files.filter((f) => f.fileType === 'Photo')
    const xrays = files.filter((f) => f.fileType === 'Radiology' && f.category !== 'OPG')
    const opgs = files.filter((f) => f.fileType === 'Radiology' && f.category === 'OPG')
    const scans = files.filter((f) => f.fileType === 'Scan')

    // Find latest upload date
    let latestUploadDate: string | null = null
    if (files.length > 0) {
      const dates = files.map((f) => new Date(f.uploadedAt).getTime())
      const maxTime = Math.max(...dates)
      latestUploadDate = new Date(maxTime).toISOString()
    }

    return {
      totalPhotos: photos.length,
      totalXRays: xrays.length,
      totalOPGs: opgs.length,
      totalScans: scans.length,
      latestUploadDate,
    }
  },
}

export default investigationService
