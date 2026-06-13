import React, { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, Calendar, UserPlus, Lock, Key, Power } from 'lucide-react'
import { UserRecord } from '../types'
import { Table, Column } from '@/components/ui/Table'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { userRecordFormSchema, UserRecordFormSchemaType, getEmptyUserRecordForm } from '../schemas'
import { BRANCH_OPTIONS } from '@/modules/appointments/schemas'

interface UserManagementProps {
  users: UserRecord[]
  onSaveUser: (data: UserRecordFormSchemaType) => Promise<void>
  onToggleUserStatus: (id: string) => Promise<void>
  onResetAccess: (id: string, name: string) => void
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onSaveUser,
  onToggleUserStatus,
  onResetAccess,
}) => {
  // View state: 'list' or 'create'
  const [viewState, setViewState] = useState<'list' | 'create'>('list')

  // Configure Form hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserRecordFormSchemaType>({
    resolver: zodResolver(userRecordFormSchema),
    defaultValues: getEmptyUserRecordForm(),
  })

  // Columns declaration for reusable Table component
  const columns: Column<UserRecord>[] = useMemo(() => [
    {
      header: 'Full Name',
      accessorKey: 'firstName',
      sortable: true,
      cell: (row) => (
        <span className="font-extrabold text-text-primary">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      header: 'Contact Info',
      accessorKey: 'email',
      sortable: true,
      cell: (row) => (
        <div className="text-left py-0.5 select-none">
          <p className="font-semibold text-text-primary flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span>{row.email}</span>
          </p>
          <p className="text-[10px] text-text-secondary flex items-center gap-1 font-semibold mt-0.5">
            <Phone className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            <span>{row.mobileNumber}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'System Role',
      accessorKey: 'role',
      sortable: true,
      cell: (row) => {
        let badgeStyle = 'bg-primary-light text-primary border-primary/10'
        if (row.role === 'Super Admin') badgeStyle = 'bg-danger/5 text-danger border-danger/10'
        else if (row.role === 'Receptionist') badgeStyle = 'bg-warning/5 text-warning-dark border-warning/10'
        else if (row.role === 'Accountant') badgeStyle = 'bg-indigo-50 text-indigo-600 border-indigo-100'

        return (
          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full select-none ${badgeStyle}`}>
            {row.role}
          </span>
        )
      },
    },
    {
      header: 'Branch Office',
      accessorKey: 'branchName',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-text-secondary/90">
          {row.branchName.split(' - ')[0]}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => {
        const isActive = row.status === 'Active'
        return (
          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 border rounded-full select-none ${
            isActive ? 'bg-success/10 text-success border-success/15' : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {row.status}
          </span>
        )
      },
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLogin',
      sortable: true,
      cell: (row) => (
        <span className="flex items-center gap-1 font-bold text-text-secondary/95 select-none text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
          <span>{row.lastLogin}</span>
        </span>
      ),
    },
    {
      header: 'Admin Actions',
      accessorKey: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-end py-1">
          {/* Status Deactivate / Activate Toggle */}
          <Button
            type="button"
            variant="outline"
            size="xs"
            leftIcon={<Power className="w-3.5 h-3.5" />}
            onClick={() => onToggleUserStatus(row.id)}
            className={`text-[9px] font-black border uppercase py-1 px-2.5 h-auto ${
              row.status === 'Active'
                ? 'text-danger border-danger/10 bg-danger/5 hover:bg-danger/10'
                : 'text-success border-success/10 bg-success/5 hover:bg-success/10'
            }`}
          >
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>

          {/* Reset Access Credentials */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onResetAccess(row.id, `${row.firstName} ${row.lastName}`)}
            leftIcon={<Key className="w-3.5 h-3.5 text-text-secondary" />}
            className="p-2 h-auto text-text-secondary hover:text-primary"
            title="Reset Access Credentials"
          />
        </div>
      ),
    },
  ], [onToggleUserStatus, onResetAccess])

  const filterOptions = [
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    },
    {
      key: 'role',
      label: 'Roles',
      options: [
        { label: 'Super Admin', value: 'Super Admin' },
        { label: 'Doctor', value: 'Doctor' },
        { label: 'Receptionist', value: 'Receptionist' },
        { label: 'Accountant', value: 'Accountant' },
      ],
    },
  ]

  const handleFormSubmit = async (data: UserRecordFormSchemaType) => {
    await onSaveUser(data)
    reset()
    setViewState('list')
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header controls tab */}
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <div>
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide text-left">
            {viewState === 'list' ? 'Registered User Directory' : 'Onboard New Practitioner'}
          </p>
          <p className="text-xs text-text-secondary/70 mt-1 text-left">
            {viewState === 'list' 
              ? 'Manage clinic practitioners, admins, and accountants.' 
              : 'Add new staff members to assigns branch locations.'}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="xs"
          leftIcon={viewState === 'list' ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          onClick={() => setViewState(viewState === 'list' ? 'create' : 'list')}
          className="font-bold py-2 px-3 h-auto"
        >
          {viewState === 'list' ? 'Add User' : 'View Directory'}
        </Button>
      </div>

      {/* 2. VIEWS VIEWPORT */}
      {viewState === 'list' ? (
        /* LISTING VIEW */
        <div className="animate-fadeIn">
          <Table<UserRecord>
            data={users}
            columns={columns}
            searchKey="firstName"
            searchPlaceholder="Search first name..."
            filterOptions={filterOptions}
          />
        </div>
      ) : (
        /* CREATION FORM VIEW */
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-xl mx-auto text-left animate-fadeIn">
          <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="e.g. Rahul"
                required
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="e.g. Sen"
                required
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Number"
                placeholder="e.g. 9812345678"
                required
                error={errors.mobileNumber?.message}
                {...register('mobileNumber')}
              />
              <Input
                label="Email Address"
                placeholder="e.g. rahul.reception@sironadental.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="System Role"
                placeholder="Select role..."
                options={[
                  { value: 'Doctor', label: 'Doctor (Practitioner)' },
                  { value: 'Receptionist', label: 'Receptionist' },
                  { value: 'Accountant', label: 'Accountant' },
                  { value: 'Clinic Admin', label: 'Clinic Admin' },
                  { value: 'Super Admin', label: 'Super Admin' },
                ]}
                error={errors.role?.message}
                {...register('role')}
              />

              <Select
                label="Primary Branch Assignment"
                placeholder="Select branch..."
                options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b.split(' - ')[0] }))}
                error={errors.branchName?.message}
                {...register('branchName')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 select-none">
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewState('list')}
              className="font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<Lock className="w-4 h-4" />}
              className="font-bold text-xs shadow-premium"
            >
              Onboard User Folder
            </Button>
          </div>
        </form>
      )}

    </div>
  )
}
export default UserManagement
