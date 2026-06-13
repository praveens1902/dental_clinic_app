import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { FoundationDemo } from './components/demo/FoundationDemo'
import { ToastContainer } from './components/ui/ToastContainer'
import { BannerContainer } from './components/ui/BannerContainer'
import { ModalAlertContainer } from './components/ui/ModalAlertContainer'
import { OverlayContainer } from './components/ui/OverlayContainer'
import { LoginPage } from './modules/auth/pages/LoginPage'
import { OtpPage } from './modules/auth/pages/OtpPage'
import { BranchSelectPage } from './modules/auth/pages/BranchSelectPage'
import { DashboardPage } from './modules/dashboard/pages/DashboardPage'
import { PatientListPage } from './modules/patients/pages/PatientListPage'
import { PatientFormPage } from './modules/patients/pages/PatientFormPage'
import { PatientProfilePage } from './modules/patients/pages/PatientProfilePage'
import { ClinicalModuleWorkspace } from './modules/patients/pages/ClinicalModuleWorkspace'
import { AppointmentsPage } from './modules/appointments'
import { BillingPage } from './modules/billing'
import { ReportsPage } from './modules/reports'
import { SettingsPage } from './modules/settings'
import { 
  RequireAuth, 
  RequirePermission 
} from './components/layout/RouteGuard'
import { 
  NotFoundState, 
  PermissionDeniedState 
} from './components/ui/FallbackStates'

// --- MAIN APP ROUTING wrapper ---
export const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public authentication flows (without MainLayout border wraps) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/select-branch" element={<BranchSelectPage />} />

        {/* Private clinic workspace routes (securely guarded using session validation) */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <MainLayout>
                <Routes>
                  {/* Dashboard - view_dashboard permission */}
                  <Route path="/" element={<DashboardPage />} />
                  
                  {/* Patients Registry - view_patients and edit_patients permissions */}
                  <Route 
                    path="/patients" 
                    element={
                      <RequirePermission permission="view_patients">
                        <PatientListPage />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/patients/create" 
                    element={
                      <RequirePermission permission="edit_patients">
                        <PatientFormPage />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/patients/:id/edit" 
                    element={
                      <RequirePermission permission="edit_patients">
                        <PatientFormPage />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/patients/:id" 
                    element={
                      <RequirePermission permission="view_patients">
                        <PatientProfilePage />
                      </RequirePermission>
                    } 
                  />
                  
                  {/* Appointments Scheduler - view_appointments permission */}
                  <Route 
                    path="/appointments" 
                    element={
                      <RequirePermission permission="view_appointments">
                        <AppointmentsPage />
                      </RequirePermission>
                    } 
                  />
                  
                  {/* Clinical Sub-modules protected under active clinician permissions */}
                  <Route 
                    path="/medical-history" 
                    element={
                      <RequirePermission permission="view_clinical_notes">
                        <ClinicalModuleWorkspace moduleType="medical" />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/dental-history" 
                    element={
                      <RequirePermission permission="view_clinical_notes">
                        <ClinicalModuleWorkspace moduleType="dental" />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/examination" 
                    element={
                      <RequirePermission permission="view_clinical_notes">
                        <ClinicalModuleWorkspace moduleType="examination" />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/investigations" 
                    element={
                      <RequirePermission permission="view_clinical_notes">
                        <ClinicalModuleWorkspace moduleType="investigations" />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/clinical-notes" 
                    element={
                      <RequirePermission permission="view_clinical_notes">
                        <ClinicalModuleWorkspace moduleType="notes" />
                      </RequirePermission>
                    } 
                  />
                  
                  <Route 
                    path="/prescriptions" 
                    element={
                      <RequirePermission permission="view_prescriptions">
                        <ClinicalModuleWorkspace moduleType="prescriptions" />
                      </RequirePermission>
                    } 
                  />
                  
                  {/* Billing Module - view_billing permission */}
                  <Route 
                    path="/billing" 
                    element={
                      <RequirePermission permission="view_billing">
                        <BillingPage />
                      </RequirePermission>
                    } 
                  />
                  
                  {/* Reports Insights - view_reports permission */}
                  <Route 
                    path="/reports" 
                    element={
                      <RequirePermission permission="view_reports">
                        <ReportsPage />
                      </RequirePermission>
                    } 
                  />
                  
                  {/* Settings - general view_dashboard permission */}
                  <Route path="/settings" element={<SettingsPage />} />
                  
                  {/* Component Tokens Library */}
                  <Route path="/demo" element={<FoundationDemo />} />
                  
                  {/* Fallbacks */}
                  <Route path="/403" element={<PermissionDeniedState />} />
                  <Route path="*" element={<NotFoundState />} />
                </Routes>
              </MainLayout>
            </RequireAuth>
          }
        />
      </Routes>

      {/* Dynamic Overlay & Feedback Portal mount points */}
      <ToastContainer />
      <BannerContainer />
      <ModalAlertContainer />
      <OverlayContainer />
    </>
  )
}