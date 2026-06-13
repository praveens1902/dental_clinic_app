import { SettingsPage } from './pages/SettingsPage'
export { SettingsPage }
export { SettingsSkeleton } from './components/SettingsSkeleton'
export { SettingsDashboardKPIs } from './components/SettingsDashboardKPIs'
export { SystemConfiguration } from './components/SystemConfiguration'
export { UserManagement } from './components/UserManagement'
export { RolePermissionMatrix } from './components/RolePermissionMatrix'
export { BranchManagement } from './components/BranchManagement'
export { ClinicSettingsPanel, ProfileSettingsPanel, NotificationSettingsPanel } from './components/OtherSettingsPanels'
export { AuditLogsTable } from './components/AuditLogsTable'
export type {
  AdminRole,
  UserStatus,
  UserRecord,
  RoleSummary,
  PermissionRow,
  BranchRecord,
  ClinicSettings,
  NotificationChannelSetting,
  AuditLogRecord,
  SettingsDashboardSummary,
  SystemConfig,
} from './types'
export {
  userRecordFormSchema,
  clinicSettingsFormSchema,
  profileSettingsFormSchema,
  getEmptyUserRecordForm,
} from './schemas'
export type { UserRecordFormSchemaType, ClinicSettingsFormSchemaType, ProfileSettingsFormSchemaType } from './schemas'
export { settingsService } from './services/settingsService'
export default SettingsPage
