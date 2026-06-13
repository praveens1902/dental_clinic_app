import React, { useState } from 'react'
import { 
  Activity, 
  UserPlus
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Checkbox } from '../ui/Checkbox'
import { Textarea } from '../ui/Textarea'
import { Table, Column } from '../ui/Table'
import { InlineAlert } from '../ui/InlineAlert'
import { useAlertStore } from '@/store/alertStore'
import { useOverlayStore } from '@/store/overlayStore'
import { EmptyState } from '../ui/EmptyState'
import { ErrorState, ErrorType } from '../ui/ErrorState'
import { PageSkeleton } from '../ui/Skeleton'

interface DemoPatient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  lastVisit: string
  status: 'Scheduled' | 'Completed' | 'Checked In' | 'Cancelled'
}

const MOCK_PATIENTS: DemoPatient[] = [
  { id: 'p1', name: 'Kabir Malhotra', age: 34, gender: 'Male', phone: '+91 98765 43210', lastVisit: '2026-06-01', status: 'Completed' },
  { id: 'p2', name: 'Riya Sen', age: 28, gender: 'Female', phone: '+91 87654 32109', lastVisit: '2026-06-08', status: 'Scheduled' },
  { id: 'p3', name: 'Dr. John Miller', age: 45, gender: 'Male', phone: '+91 76543 21098', lastVisit: '2026-05-15', status: 'Checked In' },
  { id: 'p4', name: 'Aanya Gupta', age: 22, gender: 'Female', phone: '+91 95432 10987', lastVisit: '2026-06-11', status: 'Checked In' },
  { id: 'p5', name: 'Vikram Singh', age: 58, gender: 'Male', phone: '+91 94321 09876', lastVisit: '2026-04-30', status: 'Cancelled' },
]

export const FoundationDemo: React.FC = () => {
  const { addToast, addBanner, showModalAlert } = useAlertStore()
  const { openModal, openDrawer } = useOverlayStore()

  // Sandbox Form state
  const [formName, setFormName] = useState('')
  const [formGender, setFormGender] = useState('')
  const [formChecked, setFormChecked] = useState(false)
  const [formError, setFormError] = useState(false)

  // Skeletons and special state sandbox triggers
  const [showPageSkeleton, setShowPageSkeleton] = useState(false)
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [showEmptyState, setShowEmptyState] = useState(false)

  // Patient Status badges
  const renderStatusBadge = (status: string) => {
    const styles = {
      Completed: 'bg-success/10 text-success border border-success/20',
      Scheduled: 'bg-info/10 text-info border border-info/20',
      'Checked In': 'bg-primary-light text-primary border border-primary/20',
      Cancelled: 'bg-danger/10 text-danger border border-danger/20',
    }[status] || 'bg-background text-text-secondary border border-border'

    return (
      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${styles}`}>
        {status}
      </span>
    )
  }

  // Define Table columns
  const columns: Column<DemoPatient>[] = [
    { header: 'Patient Name', accessorKey: 'name', sortable: true },
    { header: 'Age', accessorKey: 'age', sortable: true },
    { header: 'Gender', accessorKey: 'gender' },
    { header: 'Phone Number', accessorKey: 'phone' },
    { header: 'Last Visit', accessorKey: 'lastVisit', sortable: true },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: (row) => renderStatusBadge(row.status) 
    },
  ]

  // Triggers
  const triggerToast = (type: 'success' | 'warning' | 'error' | 'info') => {
    addToast({
      type,
      title: `${type.toUpperCase()} Notification`,
      message: `This is a premium design system toast demonstrating ${type} alerts.`,
    })
  }

  const triggerBanner = () => {
    addBanner({
      type: 'info',
      message: 'System Maintenance: The platform will undergo regular SaaS scaling updates on Sunday at 02:00 AM UTC.',
      dismissible: true,
    })
  }

  const triggerModalAlert = () => {
    showModalAlert({
      type: 'warning',
      title: 'Confirm Invoice Voiding',
      message: 'Are you sure you want to void this invoice? This action cannot be undone and will record an official audit log entry.',
      confirmLabel: 'Void Invoice',
      cancelLabel: 'Keep Invoice',
      onConfirm: () => triggerToast('success'),
    })
  }

  const triggerOpenModal = () => {
    openModal({
      id: 'm-demo',
      title: 'Add New Clinical Diagnosis Record',
      size: 'lg',
      content: (
        <div className="space-y-4">
          <p className="text-sm font-medium text-text-secondary leading-relaxed">
            Please fill in the chief medical complaints and initial patient analysis. This record maps to future APIs.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tooth Code (ISO)" placeholder="e.g. 18, 24" />
            <Select 
              label="Diagnostic Category" 
              placeholder="Select diagnosis"
              options={[
                { label: 'Dental Caries', value: 'caries' },
                { label: 'Gingivitis', value: 'gingivitis' },
                { label: 'Pulpitis', value: 'pulpitis' },
              ]} 
            />
          </div>
          <Textarea label="Clinical Notes" placeholder="Enter findings..." />
        </div>
      ),
    })
  }

  const triggerOpenDrawer = () => {
    openDrawer({
      id: 'd-demo',
      title: 'Audit Logs & Timeline',
      size: 'md',
      content: (
        <div className="space-y-6">
          <p className="text-xs font-semibold text-text-secondary">TIMELINE HISTORY</p>
          <div className="border-l-2 border-primary/30 pl-4 space-y-6">
            <div className="relative">
              <div className="absolute -left-[25px] top-1.5 w-3.5 h-3.5 bg-primary rounded-full ring-4 ring-white" />
              <p className="text-xs font-bold text-text-primary">Treatment Plan Finalized</p>
              <p className="text-[11px] text-text-secondary font-medium">By Dr. Ananya Iyer • June 11, 2026, 11:30 AM</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] top-1.5 w-3.5 h-3.5 bg-text-secondary rounded-full ring-4 ring-white" />
              <p className="text-xs font-bold text-text-primary">New Patient Registered</p>
              <p className="text-[11px] text-text-secondary font-medium">By receptionist Rahul Sharma • June 11, 2026, 10:15 AM</p>
            </div>
          </div>
        </div>
      ),
    })
  }

  // Render Page Shimmer Skeleton simulation
  if (showPageSkeleton) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-primary">Simulating Loaders...</h2>
          <Button variant="outline" size="sm" onClick={() => setShowPageSkeleton(false)}>
            Close Loading Simulation
          </Button>
        </div>
        <PageSkeleton />
      </div>
    )
  }

  // Render full size Error States simulation
  if (errorType) {
    return (
      <div className="space-y-6 max-w-lg mx-auto py-12">
        <div className="text-center mb-4">
          <Button variant="outline" size="xs" onClick={() => setErrorType(null)}>
            Back to Sandbox Demo
          </Button>
        </div>
        <ErrorState type={errorType} onRetry={() => setErrorType(null)} />
      </div>
    )
  }

  // Render full size Empty States simulation
  if (showEmptyState) {
    return (
      <div className="space-y-6 max-w-lg mx-auto py-12">
        <div className="text-center mb-4">
          <Button variant="outline" size="xs" onClick={() => setShowEmptyState(false)}>
            Back to Sandbox Demo
          </Button>
        </div>
        <EmptyState 
          title="No Dental Charts Registered" 
          description="This patient has not logged an initial odontogram examination chart yet. Create one to map dental treatments."
          actionLabel="Begin Examination Chart"
          onAction={() => {
            setShowEmptyState(false)
            triggerToast('success')
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* SECTION HEADER */}
      <div className="border-b border-border/80 pb-5">
        <div className="flex items-center gap-3 text-primary mb-1">
          <Activity className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">Phase 01 Framework</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-text-primary md:text-4xl">
          Project Foundation Sandbox
        </h1>
        <p className="text-sm font-medium text-text-secondary mt-1 max-w-2xl">
          Interact with Sirona&apos;s Design Tokens, Theme Systems, Layout Architecture, Forms, responsive grid rules, dynamic alert overlays, and tables.
        </p>
      </div>

      {/* DESIGN SYSTEM TOKENS */}
      <div className="bg-white rounded-card border border-border/80 p-6 space-y-6 shadow-premium">
        <div>
          <h3 className="text-lg font-heading font-bold text-text-primary">Theme & Design Tokens</h3>
          <p className="text-xs font-medium text-text-secondary">Colors and styles mapped in tailwind.config.js</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { label: 'Primary (#156B4A)', bg: 'bg-primary text-white' },
            { label: 'Primary Hover (#0F5A3E)', bg: 'bg-primary-hover text-white' },
            { label: 'Primary Light', bg: 'bg-primary-light text-primary border border-primary/20' },
            { label: 'Background', bg: 'bg-background text-text-primary border border-border' },
            { label: 'Surface (White)', bg: 'bg-white text-text-primary border border-border/80' },
            { label: 'Border Color', bg: 'bg-border text-text-secondary' },
          ].map((token) => (
            <div key={token.label} className={`p-4.5 rounded-xl text-center text-xs font-semibold ${token.bg}`}>
              {token.label}
            </div>
          ))}
        </div>
      </div>

      {/* TYPOGRAPHY SYSTEM */}
      <div className="bg-white rounded-card border border-border/80 p-6 shadow-premium">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-bold text-text-primary">Typography System</h3>
          <p className="text-xs font-medium text-text-secondary">Playfair Display for headings, Inter for body and labels</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-text-secondary uppercase">Headings (Playfair Display)</p>
            <h1 className="text-4xl">Playfair Heading h1 (4xl)</h1>
            <h2 className="text-3xl">Playfair Heading h2 (3xl)</h2>
            <h3 className="text-2xl">Playfair Heading h3 (2xl)</h3>
            <h4 className="text-xl">Playfair Heading h4 (xl)</h4>
          </div>
          <div className="space-y-4 font-sans">
            <p className="text-[10px] font-bold text-text-secondary uppercase">Body Text (Inter)</p>
            <p className="text-base font-normal">Inter Body Text Regular (400) - Sirona Medical SaaS.</p>
            <p className="text-sm font-medium">Inter Medium (500) - For navigation links, buttons, and card labels.</p>
            <p className="text-sm font-semibold">Inter SemiBold (600) - Highly readable status indicators.</p>
            <p className="text-sm font-bold text-primary">Inter Bold (700) - Highlighted dental and billing figures.</p>
          </div>
        </div>
      </div>

      {/* BUTTONS SANDBOX */}
      <div className="bg-white rounded-card border border-border/80 p-6 shadow-premium">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-bold text-text-primary">Buttons System</h3>
          <p className="text-xs font-medium text-text-secondary">12px border radius, custom variants and loading feedback states</p>
        </div>
        <div className="flex flex-wrap gap-3.5 items-center">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger CTA</Button>
          <Button variant="info">Info Badge</Button>
          <Button variant="success">Success Badge</Button>
          <Button variant="primary" isLoading>Processing</Button>
          <Button variant="outline" leftIcon={<UserPlus className="w-4 h-4" />}>Add Patient</Button>
        </div>
      </div>

      {/* FORM STANDARDS (Interactive Sandbox) */}
      <div className="bg-white rounded-card border border-border/80 p-6 shadow-premium">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-heading font-bold text-text-primary">Form Components Standards</h3>
            <p className="text-xs font-medium text-text-secondary">Custom inputs, select dropdowns, checkboxes and error handling</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFormError(!formError)}
            className="text-xs"
          >
            {formError ? 'Clear Form Errors' : 'Force Error States'}
          </Button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-5" onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="Patient Legal Name" 
            placeholder="e.g. Rahul Verma"
            required 
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            error={formError && !formName ? 'Patient name is required' : undefined}
          />
          <Select 
            label="Branch Assignment" 
            placeholder="Select Branch"
            value={formGender}
            onChange={(e) => setFormGender(e.target.value)}
            options={[
              { value: 'cp', label: 'Connaught Place Branch' },
              { value: 'dlf', label: 'DLF Gurugram Branch' },
            ]}
            required
            error={formError && !formGender ? 'Please assign a branch' : undefined}
          />
          <div className="md:col-span-3">
            <Textarea 
              label="Dental Chief Complaints / Diagnoses History" 
              placeholder="Record any details regarding root canal treatments, scaling, chief tooth crown aches..." 
              required
            />
          </div>
          <div className="md:col-span-3">
            <Checkbox 
              label="I certify that I have read the Patient Consent terms and medical privacy regulations." 
              checked={formChecked}
              onChange={(e) => setFormChecked(e.target.checked)}
              error={formError && !formChecked ? 'Terms agreement is required to register' : undefined}
            />
          </div>
        </form>
      </div>

      {/* DYNAMIC ALERT TRIGGERS */}
      <div className="bg-white rounded-card border border-border/80 p-6 shadow-premium">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-bold text-text-primary">Dynamic Alert System</h3>
          <p className="text-xs font-medium text-text-secondary">Toasts, inline banners, block alerts and confirmation overlays</p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="success" size="sm" onClick={() => triggerToast('success')}>Success Toast</Button>
            <Button variant="danger" size="sm" onClick={() => triggerToast('error')}>Error Toast</Button>
            <Button variant="info" size="sm" onClick={() => triggerToast('info')}>Info Toast</Button>
            <Button variant="secondary" size="sm" onClick={() => triggerToast('warning')}>Warning Toast</Button>
            <Button variant="outline" size="sm" onClick={triggerBanner}>Global Banner Alert</Button>
            <Button variant="danger" size="sm" onClick={triggerModalAlert}>Modal Confirmation Alert</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <InlineAlert 
              type="info" 
              title="Aadhar ID Missing" 
              message="The system mandates adding valid Identification for billing compliance. Click settings to adjust." 
            />
            <InlineAlert 
              type="success" 
              title="Sync Completed" 
              message="All patient clinical records successfully synchronized with SaaS branch nodes." 
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC PORTALS (Modal & Drawer) */}
      <div className="bg-white rounded-card border border-border/80 p-6 shadow-premium">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-bold text-text-primary">Overlay Portal Systems</h3>
          <p className="text-xs font-medium text-text-secondary">Responsive modal dialogues and drawer panels anchored to global stores</p>
        </div>
        <div className="flex gap-4">
          <Button variant="primary" onClick={triggerOpenModal}>Open Interactive Modal</Button>
          <Button variant="secondary" onClick={triggerOpenDrawer}>Open Sliding Audit Drawer</Button>
        </div>
      </div>

      {/* OTHER GLOBAL STATES SIMULATION */}
      <div className="bg-white rounded-card border border-border/80 p-6 shadow-premium">
        <div className="mb-6">
          <h3 className="text-lg font-heading font-bold text-text-primary">Global States & Skeletons Simulation</h3>
          <p className="text-xs font-medium text-text-secondary">Test full-screen loading skeleton viewports, permission exclusions, and offline states</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowPageSkeleton(true)}>
            Page Skeleton Loader
          </Button>
          <Button variant="outline" size="sm" onClick={() => setErrorType('offline')}>
            Offline Screen (WifiOff)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setErrorType('permission-denied')}>
            Permission Denied Screen
          </Button>
          <Button variant="outline" size="sm" onClick={() => setErrorType('general')}>
            Application Crash Screen
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowEmptyState(true)}>
            Empty State Illustrator
          </Button>
        </div>
      </div>

      {/* HIGHLY COMPREHENSIVE MEDICAL RECORDS TABLE */}
      <Table 
        title="Enterprise Patient Records System (Phase 01 Table)"
        data={MOCK_PATIENTS}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Filter patients by name..."
        filterOptions={[
          {
            key: 'gender',
            label: 'Gender',
            options: [
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Completed', value: 'Completed' },
              { label: 'Scheduled', value: 'Scheduled' },
              { label: 'Checked In', value: 'Checked In' },
              { label: 'Cancelled', value: 'Cancelled' },
            ]
          }
        ]}
      />

    </div>
  )
}