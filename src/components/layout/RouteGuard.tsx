import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { PermissionDeniedState } from '@/components/ui/FallbackStates'

interface RequireAuthProps {
  children: React.ReactNode
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Save current pathname to redirect back after OTP success
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

interface RequirePermissionProps {
  children: React.ReactNode
  permission: string
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  children,
  permission,
}) => {
  const { hasPermission } = useAuthStore()

  if (!hasPermission(permission)) {
    // Render the beautiful inline PermissionDeniedState rather than blank page
    return <PermissionDeniedState />
  }

  return <>{children}</>
}
export default RequireAuth
