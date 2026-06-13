import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WifiOff, ShieldAlert, FileSearch, Lock, ArrowLeft, RotateCw } from 'lucide-react'
import { Button } from './Button'

// --- 1. NO INTERNET / OFFLINE STATE ---
export const OfflineState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-card border border-border/80 shadow-premium max-w-md mx-auto w-full animate-fadeIn my-6">
      <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center text-warning mb-5 shrink-0 pulse-medical">
        <WifiOff className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">No Internet Connection</h3>
      <p className="text-xs text-text-secondary font-medium leading-relaxed mb-6 max-w-xs">
        Your device has disconnected from Sirona's cloud nodes. Please check your local network connection.
      </p>
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCw className="w-4 h-4" />}
          className="font-bold py-2.5 rounded-xl w-full"
        >
          Check Connectivity Again
        </Button>
      )}
    </div>
  )
}

// --- 2. PERMISSION DENIED STATE ---
export const PermissionDeniedState: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-card border border-border/80 shadow-premium max-w-md mx-auto w-full animate-fadeIn my-6">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-5 shrink-0">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Access Restrained</h3>
      <p className="text-xs text-text-secondary font-medium leading-relaxed mb-6 max-w-xs">
        Your assigned clinic staff role does not possess the matching cryptographic permissions required to load this administrative portal.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/')}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="font-bold py-2.5 rounded-xl w-full"
      >
        Return to Dashboard Overview
      </Button>
    </div>
  )
}

// --- 3. 404 PAGE NOT FOUND ---
export const NotFoundState: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-card border border-border/80 shadow-premium max-w-md mx-auto w-full animate-fadeIn my-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5 shrink-0">
        <FileSearch className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Medical Archive Not Found</h3>
      <p className="text-xs text-text-secondary font-medium leading-relaxed mb-6 max-w-xs">
        The route directory or patient archive file you are attempting to view does not exist on this active branch scope.
      </p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => navigate('/')}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="font-bold py-2.5 rounded-xl w-full"
      >
        Back to Clinic Dashboard
      </Button>
    </div>
  )
}

// --- 4. SESSION EXPIRED STATE ---
export const SessionExpiredState: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-card border border-border/80 shadow-premium max-w-md mx-auto w-full animate-fadeIn my-6">
      <div className="w-16 h-16 rounded-full bg-text-secondary/15 flex items-center justify-center text-text-secondary mb-5 shrink-0">
        <Lock className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">Staff Session Expired</h3>
      <p className="text-xs text-text-secondary font-medium leading-relaxed mb-6 max-w-xs">
        Your security handshake lease has expired. Please authenticate again to access Sirona's clinical patient registries.
      </p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => navigate('/login')}
        className="font-bold py-2.5 rounded-xl w-full"
      >
        Re-authenticate via Mobile OTP
      </Button>
    </div>
  )
}
