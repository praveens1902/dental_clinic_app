import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Eye, Edit2 } from 'lucide-react'
import { patientService } from '../services/patientService'
import { Patient } from '../types'
import { Table, Column } from '@/components/ui/Table'
import { PageHeader, ContentContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAlertStore } from '@/store/alertStore'

export const PatientListPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToast } = useAlertStore()
  
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Load Patient Registry list
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true)
      setHasError(false)
      try {
        const list = await patientService.getPatients()
        setPatients(list)
      } catch (err) {
        setHasError(true)
        addToast({
          type: 'error',
          title: 'Registry Loading Failed',
          message: 'Could not load active clinical patient directories.',
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchPatients()
  }, [addToast])

  const renderStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-success/10 text-success border border-success/20',
      'In Treatment': 'bg-primary-light text-primary border border-primary/20',
      Inactive: 'bg-text-secondary/10 text-text-secondary border border-border',
    }[status] || 'bg-background text-text-secondary border border-border'

    return (
      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${styles}`}>
        {status}
      </span>
    )
  }

  // Setup column definitions for our high-quality reusable Table wrapper
  const columns: Column<Patient>[] = [
    {
      header: 'Patient ID',
      accessorKey: 'patientId',
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-text-secondary bg-background border border-border px-2 py-1 rounded-lg">
          {row.patientId}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Patient Name',
      accessorKey: 'patientName',
      cell: (row) => (
        <Link 
          to={`/patients/${row.id}`}
          className="text-xs font-bold text-text-primary hover:text-primary hover:underline transition-colors block"
        >
          {row.patientName}
        </Link>
      ),
      sortable: true,
    },
    { header: 'Mobile Number', accessorKey: 'mobileNumber' },
    { header: 'Age', accessorKey: 'age', sortable: true },
    { header: 'Gender', accessorKey: 'gender' },
    { header: 'Clinic Branch', accessorKey: 'branchName' },
    { 
      header: 'Last Visit', 
      accessorKey: 'lastVisitDate',
      cell: (row) => row.lastVisitDate ? <span className="font-semibold text-text-secondary">{row.lastVisitDate}</span> : <span className="text-text-secondary/40">—</span>
    },
    { 
      header: 'Next Session', 
      accessorKey: 'nextAppointmentDate',
      cell: (row) => row.nextAppointmentDate ? <span className="font-bold text-primary">{row.nextAppointmentDate}</span> : <span className="text-text-secondary/40">—</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => renderStatusBadge(row.status),
      sortable: true,
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Button
            variant="outline"
            size="xs"
            onClick={() => navigate(`/patients/${row.id}`)}
            leftIcon={<Eye className="w-3 h-3" />}
            className="text-[10px] font-bold"
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate(`/patients/${row.id}/edit`)}
            leftIcon={<Edit2 className="w-3 h-3" />}
            className="text-[10px] font-bold hover:text-primary hover:bg-primary-light"
          >
            Edit
          </Button>
        </div>
      ),
    },
  ]

  // --- RENDER FALLBACK MATRIX ---

  if (isLoading) {
    return (
      <ContentContainer>
        <PageSkeleton />
      </ContentContainer>
    )
  }

  if (hasError) {
    return (
      <ContentContainer className="py-8">
        <ErrorState 
          type="general" 
          title="Patient Registry Unavailable" 
          description="Failed to load patient entries. Please verify database connection and retry."
          onRetry={() => window.location.reload()}
        />
      </ContentContainer>
    )
  }

  return (
    <ContentContainer className="space-y-6 animate-fadeIn">
      {/* Dynamic Header */}
      <PageHeader
        title="Patients Directory"
        subtitle="Manage and view clinical portfolios, charting history, billing, and document vaults."
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/patients/create')}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="font-bold py-2.5 rounded-xl shadow-md"
          >
            Register Patient
          </Button>
        }
      />

      {patients.length === 0 ? (
        <EmptyState
          title="No Patient Records Registered"
          description="Establish your multi-branch client roster. Register your first dental patient to begin charting diagnoses."
          actionLabel="Register Patient"
          onAction={() => navigate('/patients/create')}
        />
      ) : (
        <Table
          title="Active Patient Files Index"
          data={patients}
          columns={columns}
          searchKey="patientName"
          searchPlaceholder="Query patient by name..."
          filterOptions={[
            {
              key: 'gender',
              label: 'Gender',
              options: [
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]
            },
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'In Treatment', value: 'In Treatment' },
              ]
            }
          ]}
        />
      )}
    </ContentContainer>
  )
}
export default PatientListPage
