import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Save, Search, UserPlus } from 'lucide-react'
import { appointmentFormSchema, AppointmentFormSchemaType, DOCTOR_OPTIONS, BRANCH_OPTIONS, TIME_SLOTS } from '../schemas'
import { patientService } from '@/modules/patients/services/patientService'
import { Patient } from '@/modules/patients/types'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface CreateAppointmentFormProps {
  onSuccess: (data: AppointmentFormSchemaType, isNewPatientReg: boolean) => Promise<void>
  initialDate?: string
  initialTime?: string
  initialDoctor?: string
  onCancel?: () => void
}

export const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({
  onSuccess,
  initialDate,
  initialTime,
  initialDoctor,
  onCancel,
}) => {
  // Form modes: 'existing' or 'new' (Quick walk-in registration)
  const [regMode, setRegMode] = useState<'existing' | 'new'>('existing')
  const [patientsList, setPatientsList] = useState<Patient[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(false)

  // Configure Form hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormSchemaType>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: '',
      patientName: '',
      mobileNumber: '',
      age: '',
      gender: '',
      appointmentDate: initialDate || new Date().toISOString().split('T')[0],
      appointmentTime: initialTime || '09:00',
      doctorName: initialDoctor || 'Dr. Ananya Iyer',
      branchName: 'Saket - New Delhi',
      remarks: '',
      status: 'Scheduled',
    },
  })

  // Load existing patients for search selector
  useEffect(() => {
    setIsLoadingPatients(true)
    patientService.getPatients()
      .then((list) => {
        setPatientsList(list)
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingPatients(false))
  }, [])

  // Auto-populate when selecting an existing patient
  const handleSelectPatient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    if (!id) return

    const p = patientsList.find((pat) => pat.id === id)
    if (p) {
      setValue('patientId', p.id)
      setValue('patientName', p.patientName)
      setValue('mobileNumber', p.mobileNumber)
      setValue('age', String(p.age || ''))
      setValue('gender', p.gender as any)
    }
  }

  const handleModeChange = (mode: 'existing' | 'new') => {
    setRegMode(mode)
    reset({
      patientId: '',
      patientName: '',
      mobileNumber: '',
      age: '',
      gender: '',
      appointmentDate: initialDate || new Date().toISOString().split('T')[0],
      appointmentTime: initialTime || '09:00',
      doctorName: initialDoctor || 'Dr. Ananya Iyer',
      branchName: 'Saket - New Delhi',
      remarks: '',
      status: 'Scheduled',
    })
  }

  const handleFormSubmit = async (data: AppointmentFormSchemaType) => {
    await onSuccess(data, regMode === 'new')
  }

  return (
    <div className="space-y-6 text-left max-w-xl mx-auto">
      
      {/* Tab select mode */}
      <div className="flex border-b border-border/60 pb-3 justify-between items-center gap-4">
        <div>
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
            Appointment Booking Wizard
          </p>
          <p className="text-xs text-text-secondary/70 mt-1">
            Choose whether to schedule for an existing folder or perform a quick new walk-in.
          </p>
        </div>

        <div className="flex bg-background/50 border border-border/80 p-1 rounded-xl select-none shrink-0">
          <button
            type="button"
            onClick={() => handleModeChange('existing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              regMode === 'existing'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Existing Folder
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('new')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              regMode === 'new'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Quick Walk-In</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 animate-fadeIn">
        
        {/* EXISTING PATIENT SELECTION */}
        {regMode === 'existing' ? (
          <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                <Search className="w-4 h-4 text-primary" />
                <span>Select Patient Folder</span>
              </label>
              
              <select
                onChange={handleSelectPatient}
                className="w-full bg-surface border border-border/80 rounded-input text-xs font-semibold py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
                disabled={isLoadingPatients}
                defaultValue=""
              >
                <option value="" disabled>
                  {isLoadingPatients ? 'Loading Sirona registry...' : 'Select patient from database...'}
                </option>
                {patientsList.map((pat) => (
                  <option key={pat.id} value={pat.id}>
                    {pat.patientName} ({pat.mobileNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Read-only verification inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Selected Name"
                disabled
                required
                error={errors.patientName?.message}
                {...register('patientName')}
              />
              <Input
                label="Registered Mobile Number"
                disabled
                required
                error={errors.mobileNumber?.message}
                {...register('mobileNumber')}
              />
            </div>
          </div>
        ) : (
          /* NEW WALK-IN REGISTRATION FIELDS */
          <div className="bg-success/5 border border-success/15 rounded-xl p-4.5 space-y-4 animate-fadeIn">
            <h4 className="text-xs font-black text-success uppercase tracking-wide flex items-center gap-1">
              <UserPlus className="w-4.5 h-4.5 text-success" />
              <span>New Patient Quick Intake</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Patient Name"
                placeholder="e.g. Sanya Arora"
                required
                error={errors.patientName?.message}
                {...register('patientName')}
              />
              <Input
                label="Mobile Number"
                placeholder="e.g. 9812345678"
                required
                error={errors.mobileNumber?.message}
                {...register('mobileNumber')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Age (Years)"
                placeholder="e.g. 28"
                type="number"
                error={errors.age?.message}
                {...register('age')}
              />
              
              <Select
                label="Gender"
                placeholder="Select gender..."
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
                error={errors.gender?.message}
                {...register('gender')}
              />
            </div>
          </div>
        )}

        {/* APPOINTMENT SLOT SETTINGS */}
        <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="w-4.5 h-4.5 text-primary" />
            <span>Select Scheduling Slot</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Appointment Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4 text-text-secondary" />}
              error={errors.appointmentDate?.message}
              {...register('appointmentDate')}
            />

            <Select
              label="Available Time Slot"
              placeholder="Select slot..."
              options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
              error={errors.appointmentTime?.message}
              {...register('appointmentTime')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Consulting Dentist"
              placeholder="Choose dentist..."
              options={DOCTOR_OPTIONS.map((d) => ({ value: d, label: d }))}
              error={errors.doctorName?.message}
              {...register('doctorName')}
            />

            <Select
              label="Clinic Branch Location"
              placeholder="Choose branch..."
              options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b }))}
              error={errors.branchName?.message}
              {...register('branchName')}
            />
          </div>

          <Input
            label="Booking Remarks / Chief Complaint"
            placeholder="e.g. Tooth scaling or wisdom swelling..."
            error={errors.remarks?.message}
            {...register('remarks')}
          />
        </div>

        {/* Form controls */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/40 shrink-0 select-none">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="font-bold text-xs shadow-premium"
          >
            Secure Slot Booking
          </Button>
        </div>

      </form>
    </div>
  )
}
export default CreateAppointmentForm
