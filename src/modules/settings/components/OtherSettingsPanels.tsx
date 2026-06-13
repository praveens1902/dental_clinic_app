import React, { useState } from 'react'
import { Save, ShieldCheck, Mail, Phone, Globe, FileText, User, Camera, MessageSquare } from 'lucide-react'
import { ClinicSettings, NotificationChannelSetting } from '../types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { useAlertStore } from '@/store/alertStore'

// ==========================================
// 1. CLINIC SETTINGS PANEL
// ==========================================
interface ClinicSettingsPanelProps {
  settings: ClinicSettings
  onSave: (settings: ClinicSettings) => Promise<void>
}

export const ClinicSettingsPanel: React.FC<ClinicSettingsPanelProps> = ({ settings, onSave }) => {
  const { addToast } = useAlertStore()

  const [name, setName] = useState(settings.clinicName)
  const [address, setAddress] = useState(settings.address)
  const [phone, setPhone] = useState(settings.phoneNumber)
  const [email, setEmail] = useState(settings.email)
  const [website, setWebsite] = useState(settings.website)
  const [tax, setTax] = useState(settings.taxNumber)
  const [reg, setReg] = useState(settings.registrationNumber)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave({
        clinicName: name,
        address,
        phoneNumber: phone,
        email,
        website,
        taxNumber: tax,
        registrationNumber: reg,
      })
      addToast({
        type: 'success',
        title: 'Clinic Settings Updated',
        message: 'Successfully synchronized corporate parameters.',
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto text-left animate-fadeIn">
      <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
        <div className="flex items-center gap-3 border-b border-border/40 pb-2 select-none">
          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Corporate Clinic Parameters
            </h4>
            <p className="text-[10px] text-text-secondary mt-0.5">
              Click to replace clinic logo. Standard formats accepted up to 2MB.
            </p>
          </div>
        </div>

        <Input
          label="Clinic Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Corporate Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            leftIcon={<Phone className="w-4 h-4 text-text-secondary" />}
          />
          <Input
            label="Clinic Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4 text-text-secondary" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Official Website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            leftIcon={<Globe className="w-4 h-4 text-text-secondary" />}
          />
          <Input
            label="Clinic Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GSTIN Tax Number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            required
            leftIcon={<FileText className="w-4 h-4 text-text-secondary" />}
          />
          <Input
            label="Medical Registration ID"
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            required
            leftIcon={<ShieldCheck className="w-4 h-4 text-text-secondary" />}
          />
        </div>
      </div>

      <div className="flex justify-end select-none">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
          className="font-bold text-xs shadow-premium px-5"
        >
          Save Clinic Settings
        </Button>
      </div>
    </form>
  )
}

// ==========================================
// 2. PROFILE SETTINGS PANEL
// ==========================================
export const ProfileSettingsPanel: React.FC = () => {
  const { addToast } = useAlertStore()

  const [name, setName] = useState('Aarav Malhotra')
  const [phone, setPhone] = useState('9810098765')
  const [email, setEmail] = useState('aarav.admin@sironadental.com')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal clinical settings have been successfully synchronized.',
      })
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto text-left animate-fadeIn">
      <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
        <div className="flex items-center gap-3 border-b border-border/40 pb-2 select-none">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-background shrink-0 border border-border">
            <img
              src="https://images.unsplash.com/photo-1579684389782-64d84b5e9053?auto=format&fit=crop&q=80&w=150"
              alt="Aarav Malhotra"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Practitioner Profile Settings
            </h4>
            <p className="text-[10px] text-text-secondary mt-0.5">
              Super Admin clearance • Saket assignment node
            </p>
          </div>
        </div>

        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          leftIcon={<User className="w-4 h-4 text-text-secondary" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Personal Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            leftIcon={<Phone className="w-4 h-4 text-text-secondary" />}
          />
          <Input
            label="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4 text-text-secondary" />}
          />
        </div>
      </div>

      <div className="flex justify-end select-none">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
          className="font-bold text-xs shadow-premium px-5"
        >
          Update Profile Folder
        </Button>
      </div>
    </form>
  )
}

// ==========================================
// 3. NOTIFICATION SETTINGS PANEL
// ==========================================
interface NotificationSettingsPanelProps {
  settings: NotificationChannelSetting[]
  onSave: (settings: NotificationChannelSetting[]) => Promise<void>
}

export const NotificationSettingsPanel: React.FC<NotificationSettingsPanelProps> = ({
  settings,
  onSave,
}) => {
  const { addToast } = useAlertStore()

  const [localSettings, setLocalSettings] = useState<NotificationChannelSetting[]>(
    JSON.parse(JSON.stringify(settings))
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (idx: number, field: 'apptReminders' | 'followUpReminders' | 'billingReminders') => {
    setLocalSettings((prev) => {
      const updated = [...prev]
      updated[idx] = {
        ...updated[idx],
        [field]: !updated[idx][field],
      }
      return updated
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(localSettings)
      addToast({
        type: 'success',
        title: 'Preferences Updated',
        message: 'Notification triggers synchronized on SMS/WhatsApp gateways.',
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // Previews mapping
  const templatesPreview = {
    WhatsApp: 'Hello Kabir, your RCT appointment is confirmed tomorrow @ 10:00 with Dr. Iyer.',
    SMS: 'SDC: Appointment scheduled on 12-June @ 10:00. Call +911140569901 for changes.',
    Email: 'Dear Aarav Mehta, Sirona Clinics invoice receipt INV-2026-001 has been generated...',
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto text-left animate-fadeIn">
      <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-5">
        <div>
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
            Notification dispatch triggers
          </p>
          <p className="text-xs text-text-secondary/70 mt-1">
            Enable or disable automated message templates for active patient reminders.
          </p>
        </div>

        <div className="space-y-4">
          {localSettings.map((channel, idx) => (
            <div key={channel.channel} className="border border-border/60 rounded-xl p-4 bg-white space-y-3 shadow-sm hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between border-b border-border/30 pb-2 select-none">
                <span className="text-xs font-black text-primary uppercase">{channel.channel} Channel</span>
                <span className="text-[9px] font-black text-success uppercase bg-success/5 border border-success/10 px-2 py-0.5 rounded-full select-none">
                  Gateway Connected
                </span>
              </div>

              {/* Checkboxes parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Checkbox
                  label="Appointment SMS"
                  checked={channel.apptReminders}
                  onChange={() => handleToggle(idx, 'apptReminders')}
                />
                <Checkbox
                  label="Follow-Up SMS"
                  checked={channel.followUpReminders}
                  onChange={() => handleToggle(idx, 'followUpReminders')}
                />
                <Checkbox
                  label="Invoicing Reminders"
                  checked={channel.billingReminders}
                  onChange={() => handleToggle(idx, 'billingReminders')}
                />
              </div>

              {/* Template preview details */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 text-[10px] text-text-secondary leading-normal flex items-start gap-1.5 select-none font-semibold">
                <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="italic">
                  Preview: &ldquo;{templatesPreview[channel.channel as keyof typeof templatesPreview]}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end select-none">
        <Button
          type="button"
          variant="primary"
          isLoading={isSaving}
          disabled={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          className="font-bold text-xs shadow-premium px-5"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
export default ClinicSettingsPanel
