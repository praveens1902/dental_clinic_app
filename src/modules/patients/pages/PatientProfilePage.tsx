import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Users, 
  MapPin, 
  Phone, 
  Calendar, 
  CreditCard, 
  FileText, 
  Activity, 
  Upload, 
  Trash2, 
  Eye, 
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Heart,
  FileSpreadsheet,
  FolderOpen,
  ClipboardList,
  Clock,
  Loader2
} from 'lucide-react'
import { Select } from '@/components/ui/Select'

  // Core Sirona blocks
import { patientService } from '../services/patientService'
import { Patient, PatientDocument, PatientActivity } from '../types'
import { MedicalHistoryTab } from '@/modules/medical-history/components/MedicalHistoryTab'
import { DentalHistoryTab } from '@/modules/dental-history/components/DentalHistoryTab'
import { ExaminationTab } from '@/modules/examination'
import { InvestigationsTab } from '@/modules/investigations'
import { ClinicalNotesTab } from '@/modules/clinical-notes'
import { PrescriptionTab } from '@/modules/prescriptions'
import { AppointmentListing, appointmentService, Appointment } from '@/modules/appointments'
import { InvoiceListing, billingService, Invoice } from '@/modules/billing'
import { PageHeader, ContentContainer, CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { useAlertStore } from '@/store/alertStore'

export const PatientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast, showModalAlert } = useAlertStore()

  // 1. Core State Bindings
  const [patient, setPatient] = useState<Patient | null>(null)
  const [documents, setDocuments] = useState<PatientDocument[]>([])
  const [activities, setActivities] = useState<PatientActivity[]>([])
  
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'dental' | 'examination' | 'investigations' | 'notes' | 'prescriptions' | 'appointments' | 'billing' | 'documents' | 'timeline'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Patient Appointments State
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([])

  // Patient Invoices State
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([])

  // Document upload simulator state
  const [uploadType, setUploadType] = useState('Dental X-Ray (OPG)')
  const [isUploading, setIsUploading] = useState(false)

  // Fetch patient profile details and sub-tab registries on mount
  useEffect(() => {
    if (!id) return

    const loadProfileData = async () => {
      setIsLoading(true)
      setHasError(false)
      try {
        const [p, docs, acts] = await Promise.all([
          patientService.getPatientById(id),
          patientService.getDocumentsByPatientId(id),
          patientService.getActivitiesByPatientId(id),
        ])
        setPatient(p)
        setDocuments(docs)
        setActivities(acts)
      } catch (err) {
        setHasError(true)
        addToast({
          type: 'error',
          title: 'Profile Loading Failure',
          message: 'Could not fetch secure patient database records.',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadProfileData()
  }, [id, addToast])

  // Load Patient-specific appointments on active tab focus
  useEffect(() => {
    if (!id || activeTab !== 'appointments') return

    appointmentService.getByPatientId(id)
      .then(setPatientAppointments)
      .catch((err) => console.error(err))
  }, [id, activeTab])

  // Load Patient-specific invoices on billing tab focus
  useEffect(() => {
    if (!id || activeTab !== 'billing') return

    billingService.getByPatientId(id)
      .then(setPatientInvoices)
      .catch((err) => console.error(err))
  }, [id, activeTab])

  // Refresh sub-data helper (documents, timelines)
  const refreshDocumentsAndActivities = async () => {
    if (!id) return
    try {
      const [docs, acts] = await Promise.all([
        patientService.getDocumentsByPatientId(id),
        patientService.getActivitiesByPatientId(id),
      ])
      setDocuments(docs)
      setActivities(acts)
    } catch (err) {
      console.error(err)
    }
  }

  // --- ACTIONS HANDLERS ---

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    // 10MB validation pre-flight check
    if (file.size > 10 * 1024 * 1024) {
      addToast({
        type: 'warning',
        title: 'File Exceeds Limits',
        message: 'Clinical attachment uploads are restricted to a maximum size of 10MB.',
      })
      return
    }

    setIsUploading(true)
    addToast({
      type: 'info',
      title: 'Transmitting File...',
      message: `Uploading clinical artifact: ${file.name}`,
    })

    try {
      await patientService.uploadDocument(id, uploadType, file.name)
      addToast({
        type: 'success',
        title: 'Attachment Captured',
        message: `Successfully uploaded ${file.name} to patient secure folder.`,
      })
      await refreshDocumentsAndActivities()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Could not sync document attachment.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDocumentDelete = (docId: string, name: string) => {
    showModalAlert({
      type: 'error',
      title: 'Delete Document Permanently?',
      message: `This action will securely purge "${name}" from Sirona's cloud nodes. It will destroy historical data and trigger audit alerts.`,
      confirmLabel: 'Securely Purge File',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        try {
          await patientService.deleteDocument(docId)
          addToast({
            type: 'success',
            title: 'Attachment Purged',
            message: 'Attachment file removed successfully.',
          })
          await refreshDocumentsAndActivities()
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

  const triggerQuickAction = (label: string) => {
    addToast({
      type: 'success',
      title: 'Command Activated',
      message: `Launched interactive interface: ${label}`,
    })
  }

  // --- RENDER COMPONENT METHODS ---

  if (isLoading) {
    return (
      <ContentContainer>
        <PageSkeleton />
      </ContentContainer>
    )
  }

  if (hasError || !patient) {
    return (
      <ContentContainer className="py-8">
        <ErrorState 
          type="general" 
          title="Profile Index Unreachable" 
          description="The secure clinical profile directory you are searching for is offline or does not exist."
          onRetry={() => window.location.reload()}
        />
      </ContentContainer>
    )
  }

  const TABS_LIST = [
    { id: 'overview', label: 'Overview', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'medical', label: 'Medical History', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'dental', label: 'Dental History', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'examination', label: 'Examination', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'investigations', label: 'Investigations', icon: <FolderOpen className="w-3.5 h-3.5" /> },
    { id: 'notes', label: 'Clinical Notes', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'timeline', label: 'Activity Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
  ] as const

  return (
    <ContentContainer className="space-y-6 animate-fadeIn pb-12">
      
      {/* Dynamic Header */}
      <PageHeader
        title={patient.patientName}
        subtitle={`Patient ID: ${patient.patientId} • Age ${patient.age} • Gender: ${patient.gender}`}
        actions={
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              onClick={() => navigate('/patients')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="font-bold border border-border text-text-secondary bg-white hover:bg-background"
            >
              Back to Directory
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/patients/${patient.id}/edit`)}
              className="font-bold text-primary bg-primary-light border-transparent hover:bg-primary/15"
            >
              Edit Demographics
            </Button>
          </div>
        }
      />

      {/* 1. CLINICAL CORE HEADER METRICS BANNER */}
      <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative overflow-hidden">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-text-secondary uppercase">Mobile Number</p>
          <p className="text-xs font-bold text-text-primary flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{patient.mobileNumber}</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-text-secondary uppercase">Clinic Assignment</p>
          <p className="text-xs font-bold text-text-primary flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{patient.branchName.split(' - ')[0]}</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-text-secondary uppercase">Email Address</p>
          <p className="text-xs font-semibold text-text-primary truncate">{patient.email || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-text-secondary uppercase">Last Clinic Visit</p>
          <p className="text-xs font-bold text-text-secondary/90">{patient.lastVisitDate || 'First Registration'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-text-secondary uppercase">Next Active Session</p>
          <p className="text-xs font-bold text-primary">{patient.nextAppointmentDate || 'No Session Scheduled'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-text-secondary uppercase">Anatomical Status</p>
          <span className="inline-flex text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full mt-0.5 border border-primary/10">
            {patient.status}
          </span>
        </div>
      </div>

      {/* 2. CLINICAL QUICK TASK BAR */}
      <CardContainer className="bg-primary/5 border border-primary/10 flex flex-col md:flex-row md:items-center justify-between p-4.5 gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-primary animate-pulse" />
          <span className="text-xs font-bold text-primary">Secure Clinical Command triggers</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Schedule Chair', action: 'Book Appointment' },
            { label: 'Draft Rx', action: 'Add Prescription' },
            { label: 'Perform Checkout', action: 'Create Invoice' },
            { label: 'Interactive Odontogram', action: 'Start Examination' },
          ].map((act) => (
            <Button
              key={act.label}
              variant="outline"
              size="xs"
              onClick={() => triggerQuickAction(act.action)}
              className="text-[10px] font-bold bg-white border-border/80 hover:bg-background text-text-primary"
            >
              {act.label}
            </Button>
          ))}
        </div>
      </CardContainer>

      {/* 3. SCROLLABLE TAB CHANNELS NAVIGATION */}
      <div className="flex bg-white border border-border/80 p-1.5 rounded-card overflow-x-auto custom-scrollbar gap-1">
        {TABS_LIST.map((tab) => {
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow shadow-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 4. RENDER CONTEXT TAB WORKSPACE PANEL */}
      <div className="animate-fadeIn min-h-[300px]">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'medical' && patient && <MedicalHistoryTab patientId={patient.id} />}
        {activeTab === 'dental' && patient && <DentalHistoryTab patientId={patient.id} />}
        {activeTab === 'examination' && patient && <ExaminationTab patientId={patient.id} />}
        {activeTab === 'investigations' && patient && <InvestigationsTab patientId={patient.id} />}
        {activeTab === 'notes' && patient && <ClinicalNotesTab patientId={patient.id} />}
        {activeTab === 'prescriptions' && patient && <PrescriptionTab patientId={patient.id} />}
        {activeTab === 'appointments' && patient && (
          <CardContainer className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide border-b border-border/40 pb-3 flex items-center justify-between">
              <span>Patient Appointments List</span>
            </h3>
            <AppointmentListing
              data={patientAppointments}
              onStatusChange={async (aptId, status) => {
                const apt = patientAppointments.find((a) => a.id === aptId)
                if (apt) {
                  await appointmentService.save({ ...apt, status })
                  const updated = await appointmentService.getByPatientId(patient.id)
                  setPatientAppointments(updated)
                  addToast({
                    type: 'success',
                    title: 'Status Updated',
                    message: `Changed appointment status to ${status}.`,
                  })
                }
              }}
              onSendReminder={async (aptId, name) => {
                await appointmentService.sendReminder(aptId, 'WhatsApp', name)
                addToast({
                  type: 'success',
                  title: 'WhatsApp Reminder Sent',
                  message: 'Successfully sent automated reminder to patient.',
                })
              }}
              onViewDetails={() => navigate('/appointments')}
            />
          </CardContainer>
        )}
        {activeTab === 'billing' && patient && (
          <CardContainer className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide border-b border-border/40 pb-3 flex items-center justify-between">
              <span>Patient Billing History</span>
            </h3>
            <InvoiceListing
              data={patientInvoices}
              onView={() => navigate('/billing')}
              onRecordPayment={() => navigate('/billing')}
              onPrint={() => window.print()}
            />
          </CardContainer>
        )}
        {activeTab === 'timeline' && renderActivityTimelineTab()}
        {activeTab === 'documents' && renderDocumentsTab()}
        {activeTab !== 'overview' && activeTab !== 'medical' && activeTab !== 'dental' && activeTab !== 'examination' && activeTab !== 'investigations' && activeTab !== 'notes' && activeTab !== 'prescriptions' && activeTab !== 'appointments' && activeTab !== 'billing' && activeTab !== 'timeline' && activeTab !== 'documents' && renderMockModuleFallbackTab()}
      </div>

    </ContentContainer>
  )

  // --- SUB TAB CONTEXT VIEWPORT SUBCOMPONENTS ---

  // TAB A: Overview SUMMARY Viewport
  function renderOverviewTab() {
    if (!patient) return null
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-start">
        
        {/* Left Demographics summary box */}
        <div className="lg:col-span-2 space-y-6">
          <CardContainer className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>Full Portfolio Card</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-text-primary/90">
              <div className="p-3 bg-background/30 rounded-xl space-y-1">
                <span className="text-[10px] text-text-secondary uppercase">Occupation / Career</span>
                <p className="font-bold text-text-primary">{patient.occupation || 'Not registered'}</p>
              </div>
              <div className="p-3 bg-background/30 rounded-xl space-y-1">
                <span className="text-[10px] text-text-secondary uppercase">Referral Channel</span>
                <p className="font-bold text-text-primary">{patient.referralSource || 'Not registered'}</p>
              </div>
              <div className="p-3 bg-background/30 rounded-xl space-y-1 sm:col-span-2">
                <span className="text-[10px] text-text-secondary uppercase">Permanent Address</span>
                <p className="font-bold text-text-primary leading-normal">{patient.address || 'No residential address registered'}</p>
              </div>
            </div>
          </CardContainer>

          <CardContainer className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              <span>Emergency Contacts Card</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="p-3 bg-background/30 rounded-xl space-y-1">
                <span className="text-[10px] text-text-secondary uppercase">Guardian Name</span>
                <p className="font-bold text-text-primary">{patient.emergencyContactName || '—'}</p>
              </div>
              <div className="p-3 bg-background/30 rounded-xl space-y-1">
                <span className="text-[10px] text-text-secondary uppercase">Emergency Phone</span>
                <p className="font-bold text-text-primary">{patient.emergencyContactNumber || '—'}</p>
              </div>
              <div className="p-3 bg-background/30 rounded-xl space-y-1">
                <span className="text-[10px] text-text-secondary uppercase">Relationship</span>
                <p className="font-bold text-text-primary">{patient.relationship || '—'}</p>
              </div>
            </div>
          </CardContainer>
        </div>

        {/* Right Financial Balance & Appointment info card */}
        <div className="space-y-6">
          <CardContainer className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Financial Status Ledger
            </h3>
            <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl text-center space-y-1.5">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Outstanding Balances</span>
              <p className="text-3xl font-bold font-heading text-danger">₹1,500</p>
              <p className="text-[9px] font-bold text-text-secondary/70">From root canal procedure CP-9018. Collect Payment to settle.</p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => triggerQuickAction('Create Invoice')}
              className="w-full font-bold text-xs py-2 border-primary/20 hover:border-primary text-primary"
            >
              Take Payout Settlement
            </Button>
          </CardContainer>

          <CardContainer className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2">
              Timeline Summary
            </h3>
            {activities.slice(0, 2).map((act) => (
              <div key={act.id} className="flex gap-2.5 text-xs text-text-primary">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold">{act.activityType}</p>
                  <p className="text-[10px] text-text-secondary leading-normal mt-0.5">{act.description}</p>
                </div>
              </div>
            ))}
          </CardContainer>
        </div>

      </div>
    )
  }

  // TAB B: Activity Timeline tab
  function renderActivityTimelineTab() {
    return (
      <CardContainer className="space-y-6 max-w-xl">
        <div>
          <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2">
            Dynamic Journey Log
          </h3>
          <p className="text-[10px] font-semibold text-text-secondary mt-1">Chronological history log tracking clinical diagnosis, billing adjustments, and onboarding actions.</p>
        </div>

        {activities.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-secondary/50 font-semibold">
            No chronological activities logged for this patient profile.
          </div>
        ) : (
          <div className="relative pl-4 border-l border-border/80 space-y-6 pt-1 ml-2">
            {activities.map((act) => (
              <div key={act.id} className="relative text-left">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
                <div className="text-xs font-semibold text-text-primary">
                  <p className="font-bold">{act.activityType}</p>
                  <p className="text-[10px] text-text-secondary leading-normal mt-0.5">{act.description}</p>
                  <span className="text-[9px] text-text-secondary/60 block mt-1.5 font-bold">
                    {new Date(act.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })} • By {act.performedBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContainer>
    )
  }

  // TAB C: Document Vault Tab
  function renderDocumentsTab() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-start">
        
        {/* Upload tool board */}
        <div>
          <CardContainer className="space-y-4 sticky top-24">
            <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-primary" />
              <span>Transmit Document</span>
            </h3>
            
            <Select
              label="Diagnostic Category"
              value={uploadType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUploadType(e.target.value)}
              options={[
                { value: 'Dental X-Ray (OPG)', label: 'Dental X-Ray (OPG)' },
                { value: 'Patient Identity proof', label: 'Patient Identity proof' },
                { value: 'Surgical Consent Form', label: 'Surgical Consent Form' },
                { value: 'Clinical Lab Report', label: 'Clinical Lab Report' },
              ]}
              disabled={isUploading}
            />

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-text-primary">Select Attachment file</span>
              <div className="relative flex items-center justify-center border-2 border-dashed border-border/80 rounded-xl hover:border-primary/50 transition-colors p-6 bg-background/25">
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  accept=".png,.jpg,.jpeg,.pdf"
                />
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2.5 bg-primary-light text-primary rounded-xl shrink-0 animate-bounce">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">Drag or click to choose file</p>
                    <p className="text-[10px] text-text-secondary/80 mt-1">Accepts PDF, JPG, or PNG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-primary animate-fadeIn justify-center">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Simulating network upload preflight...</span>
              </div>
            )}
          </CardContainer>
        </div>

        {/* Uploaded Documents tiles list */}
        <div className="lg:col-span-2">
          <CardContainer className="space-y-5">
            <div>
              <h3 className="text-sm font-bold font-heading text-text-primary uppercase tracking-wide border-b border-border/60 pb-2">
                Secure Document Folder
              </h3>
              <p className="text-[10px] font-semibold text-text-secondary mt-1">Access medical attachments, OPG captures, and scanned files.</p>
            </div>

            {documents.length === 0 ? (
              <div className="py-12 text-center text-xs text-text-secondary/50 font-semibold border-2 border-dashed border-border/60 rounded-xl">
                This patient document folder is currently empty. Upload radiography files to register OPG folders.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => {
                  const isPdf = doc.fileName.toLowerCase().endsWith('.pdf')
                  return (
                    <div 
                      key={doc.id} 
                      className="p-4 bg-background/25 border border-border/50 rounded-xl flex flex-col justify-between hover:border-primary/20 transition-all gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`p-2.5 rounded-lg border text-text-secondary shrink-0 ${
                          isPdf ? 'bg-danger/10 text-danger border-danger/10' : 'bg-primary-light text-primary border-primary/10'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 text-left space-y-0.5">
                          <span className="text-[9px] font-bold text-text-secondary/80 bg-white border border-border/80 px-2 py-0.5 rounded-full uppercase truncate block max-w-max">
                            {doc.documentType}
                          </span>
                          <h4 className="text-xs font-bold text-text-primary truncate" title={doc.fileName}>{doc.fileName}</h4>
                          <span className="text-[9px] text-text-secondary/60 block font-bold">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>

                      {/* Triggers */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            addToast({
                              type: 'info',
                              title: 'Lightbox Preview',
                              message: `Opening attachment file: ${doc.fileName}`,
                            })
                            window.open(doc.fileUrl, '_blank')
                          }}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          className="flex-1 font-bold text-[10px] bg-white border-border/80 hover:bg-background"
                        >
                          View File
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleDocumentDelete(doc.id, doc.fileName)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          className="text-[10px] font-bold text-text-secondary hover:text-danger hover:bg-danger/5 px-2.5"
                        />
                      </div>

                    </div>
                  )
                })}
              </div>
            )}
          </CardContainer>
        </div>

      </div>
    )
  }

  // Fallback for medical, dental, odontogram, notes, rx, invoices tabs (slated for later phases)
  function renderMockModuleFallbackTab() {
    const activeData = TABS_LIST.find((t) => t.id === activeTab)
    const label = activeData?.label || 'Clinical Sub-Module'
    const tabIcon = activeData?.icon || <Activity className="w-12 h-12" />

    return (
      <CardContainer className="text-center py-12 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mx-auto mb-4 animate-pulse">
          {tabIcon}
        </div>
        <h3 className="text-lg font-heading font-bold text-text-primary capitalize">{label} Module</h3>
        <p className="text-xs text-text-secondary mt-2 mb-6 leading-relaxed max-w-sm mx-auto">
          The {label} files, diagnosis checklists, prescriptions print-previews, and financial ledgers are scheduled for Phase 02 integrations. They are fully mock-integrated for this prototype session.
        </p>
        <Link to="/demo">
          <Button variant="outline" size="sm">Open Foundation Sandbox</Button>
        </Link>
      </CardContainer>
    )
  }
}
export default PatientProfilePage
