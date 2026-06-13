import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, RotateCcw, ShieldCheck, HeartPulse } from 'lucide-react'
import { patientFormSchema, PatientFormSchemaType } from '../schemas'
import { patientService } from '../services/patientService'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { PageHeader, ContentContainer, CardContainer } from '@/components/layout/LayoutComponents'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { useAlertStore } from '@/store/alertStore'
import { useUIStore } from '@/store/uiStore'

export const PatientFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>() // Active Patient ID if editing
  const isEditMode = !!id

  const { addToast, showModalAlert } = useAlertStore()
  const { availableBranches } = useUIStore()

  const [isLoading, setIsLoading] = useState(false)
  const [dataFetching, setDataFetching] = useState(isEditMode)
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<PatientFormSchemaType>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      patientName: '',
      dateOfBirth: '',
      gender: undefined,
      mobileNumber: '',
      email: '',
      occupation: '',
      address: '',
      referralSource: '',
      branchId: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      relationship: '',
    },
  })

  // Watch Date of Birth changes to dynamically auto-calculate and display patient age
  const dobWatch = useWatch({ control, name: 'dateOfBirth' })

  useEffect(() => {
    if (dobWatch) {
      const dob = new Date(dobWatch)
      if (!isNaN(dob.getTime())) {
        const age = new Date().getFullYear() - dob.getFullYear()
        setCalculatedAge(age >= 0 ? age : null)
      } else {
        setCalculatedAge(null)
      }
    } else {
      setCalculatedAge(null)
    }
  }, [dobWatch])

  // Load patient details if editing
  useEffect(() => {
    if (!isEditMode) return

    const loadPatient = async () => {
      setDataFetching(true)
      try {
        const p = await patientService.getPatientById(id)
        reset({
          patientName: p.patientName,
          dateOfBirth: p.dateOfBirth,
          gender: p.gender,
          mobileNumber: p.mobileNumber,
          email: p.email || '',
          occupation: p.occupation || '',
          address: p.address || '',
          referralSource: p.referralSource || '',
          branchId: p.branchId,
          emergencyContactName: p.emergencyContactName || '',
          emergencyContactNumber: p.emergencyContactNumber || '',
          relationship: p.relationship || '',
        })
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Retrieval Failure',
          message: err.message || 'Could not load the patient records.',
        })
        navigate('/patients')
      } finally {
        setDataFetching(false)
      }
    }
    loadPatient()
  }, [id, isEditMode, reset, navigate, addToast])

  const onSubmit = async (data: PatientFormSchemaType) => {
    setIsLoading(true)
    try {
      const branchName = availableBranches.find((b) => b.id === data.branchId)?.name || 'Sirona Branch'
      const payload = {
        patientName: data.patientName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        mobileNumber: data.mobileNumber,
        email: data.email || '',
        occupation: data.occupation || '',
        address: data.address || '',
        referralSource: data.referralSource || '',
        branchId: data.branchId,
        branchName,
        emergencyContactName: data.emergencyContactName || '',
        emergencyContactNumber: data.emergencyContactNumber || '',
        relationship: data.relationship || '',
        status: (isEditMode ? undefined : 'Active') as any, // Preserve or set default
      }

      if (isEditMode) {
        await patientService.updatePatient(id, payload)
        addToast({
          type: 'success',
          title: 'Patient Profile Saved',
          message: `Successfully updated clinical record file for ${data.patientName}.`,
        })
        navigate(`/patients/${id}`)
      } else {
        const created = await patientService.createPatient(payload)
        addToast({
          type: 'success',
          title: 'Patient Registered',
          message: `Successfully established file PAT-CP-*** for ${data.patientName}.`,
        })
        navigate(`/patients/${created.id}`)
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Form Submission Failure',
        message: err.message || 'Failed to submit patient. Check form fields.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Dirty state tracker block triggers modal confirm
  const handleCancelClick = () => {
    if (isDirty) {
      showModalAlert({
        type: 'warning',
        title: 'Unsaved Profile Modifications',
        message: 'You have unsaved edits in this patient directory file. Navigating away now will permanently discard them.',
        confirmLabel: 'Discard & Go Back',
        cancelLabel: 'Keep Editing',
        onConfirm: () => navigate(isEditMode ? `/patients/${id}` : '/patients'),
      })
    } else {
      navigate(isEditMode ? `/patients/${id}` : '/patients')
    }
  }

  const branchOptions = availableBranches.map((b) => ({
    value: b.id,
    label: b.name,
  }))

  if (dataFetching) {
    return (
      <ContentContainer>
        <PageSkeleton />
      </ContentContainer>
    )
  }

  return (
    <ContentContainer className="space-y-6 max-w-4xl animate-fadeIn">
      {/* Dynamic Header */}
      <PageHeader
        title={isEditMode ? 'Modify Patient Portfolio' : 'Demographics Intake Registry'}
        subtitle={isEditMode ? 'Update contact, legal, or emergency details for clinical records.' : 'Establish a new patient directory card with secure medical-grade schemas.'}
        actions={
          <Button
            variant="ghost"
            onClick={handleCancelClick}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="font-bold border border-border text-text-secondary bg-white hover:bg-background"
          >
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* CARD 1: PERSONAL INFORMATION */}
        <CardContainer className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center gap-2">
            <HeartPulse className="w-4.5 h-4.5 text-primary shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Patient Legal Name"
              placeholder="e.g. Meenakshi Sharma"
              required
              disabled={isLoading}
              error={errors.patientName?.message}
              {...register('patientName')}
            />

            <div className="grid grid-cols-3 gap-2.5 items-end">
              <div className="col-span-2">
                <Input
                  label="Date of Birth"
                  type="date"
                  required
                  disabled={isLoading}
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')}
                />
              </div>
              <div className="space-y-1.5 h-11.5 flex flex-col justify-center bg-background rounded-input px-4 border border-border/60">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Age Summary</span>
                <span className="text-xs font-bold text-primary">
                  {calculatedAge !== null ? `${calculatedAge} Yrs` : '—'}
                </span>
              </div>
            </div>

            <Select
              label="Gender Designation"
              placeholder="Select Gender"
              required
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              disabled={isLoading}
              error={errors.gender?.message}
              {...register('gender')}
            />

            <Input
              label="Mobile Number"
              placeholder="9876543210"
              required
              disabled={isLoading}
              error={errors.mobileNumber?.message}
              {...register('mobileNumber')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@gmail.com"
              disabled={isLoading}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Assigned Clinic Branch"
              type="text" // using select
              required // mock
              disabled // handled below
              value={branchOptions.length > 0 ? '' : ''} // fallback
              className="hidden"
            />
            
            {/* Proper Select branch */}
            <Select
              label="Primary Clinic Branch Assignment"
              placeholder="Assign Branch"
              required
              options={branchOptions}
              disabled={isLoading}
              error={errors.branchId?.message}
              {...register('branchId')}
            />

            <Input
              label="Occupation"
              placeholder="e.g. Banker, Student, Consultant"
              disabled={isLoading}
              {...register('occupation')}
            />

            <Input
              label="Referral Channel Source"
              placeholder="e.g. Practo, Instagram, Google"
              disabled={isLoading}
              {...register('referralSource')}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Permanent Residential Address"
                placeholder="Enter complete door number, apartment, street details..."
                disabled={isLoading}
                {...register('address')}
              />
            </div>
          </div>
        </CardContainer>

        {/* CARD 2: EMERGENCY CONTACT INFO */}
        <CardContainer className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Emergency Contacts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Contact Guardian Name"
              placeholder="e.g. Amit Sharma"
              disabled={isLoading}
              {...register('emergencyContactName')}
            />

            <Input
              label="Emergency Phone Number"
              placeholder="9876543210"
              disabled={isLoading}
              error={errors.emergencyContactNumber?.message}
              {...register('emergencyContactNumber')}
            />

            <Input
              label="Relationship"
              placeholder="e.g. Father, Mother, Spouse"
              disabled={isLoading}
              {...register('relationship')}
            />
          </div>
        </CardContainer>

        {/* CTAs TRIGGERS */}
        <div className="flex items-center justify-end gap-3.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isLoading || !isDirty}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="font-bold py-3 text-sm rounded-xl border-border/80 text-text-secondary bg-white hover:bg-background"
          >
            Reset Form
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-bold py-3 text-sm rounded-xl px-8 shadow-premium"
          >
            {isEditMode ? 'Save Modifications' : 'Register & Create File'}
          </Button>
        </div>

      </form>
    </ContentContainer>
  )
}
export default PatientFormPage
