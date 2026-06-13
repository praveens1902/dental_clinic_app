import React, { useState, useEffect } from 'react'
import { Clock, User, Phone, Bell, History, Award, Mail, MessageSquare } from 'lucide-react'
import { Appointment, ReminderHistoryItem, AppointmentStatus, ReminderChannel } from '../types'
import { appointmentService } from '../services/appointmentService'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { useAlertStore } from '@/store/alertStore'

interface AppointmentDetailsPageProps {
  appointmentId: string | null
  onClose: () => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
  onSendReminderCompleted: () => void
}

export const AppointmentDetailsPage: React.FC<AppointmentDetailsPageProps> = ({
  appointmentId,
  onClose,
  onStatusChange,
  onSendReminderCompleted,
}) => {
  const { addToast } = useAlertStore()

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [timeline, setTimeline] = useState<{ status: AppointmentStatus; date: string; notes: string }[]>([])
  const [reminders, setReminders] = useState<ReminderHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<ReminderChannel>('WhatsApp')

  const loadData = async () => {
    if (!appointmentId) return
    setIsLoading(true)
    try {
      const [apt, tl, rems] = await Promise.all([
        appointmentService.getById(appointmentId),
        appointmentService.getTimeline(appointmentId),
        appointmentService.getRemindersByAppointmentId(appointmentId),
      ])
      setAppointment(apt)
      setTimeline(tl)
      setReminders(rems)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [appointmentId, appointmentId ? appointmentId : null]) // react on ID change

  if (!appointmentId || !appointment) return null

  const handleSendReminder = async () => {
    try {
      await appointmentService.sendReminder(appointmentId, selectedChannel, appointment.patientName)
      
      // Refresh reminder logs
      const rems = await appointmentService.getRemindersByAppointmentId(appointmentId)
      setReminders(rems)
      
      onSendReminderCompleted()

      addToast({
        type: 'success',
        title: `${selectedChannel} Reminder Dispatched`,
        message: `Successfully transmitted slot reminder template to ${appointment.patientName}.`,
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Reminder Blocked',
        message: 'Could not connect to SMS/WhatsApp dispatch gateway.',
      })
    }
  }

  const handleApplyStatusChange = async (status: AppointmentStatus) => {
    onStatusChange(appointment.id, status)
    
    // Smooth local state refresh
    setTimeout(() => {
      loadData()
    }, 100)
  }

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="Appointment Details & Timeline"
      size="md"
    >
      {isLoading ? (
        <div className="py-12 text-center text-xs font-semibold text-text-secondary animate-pulse">
          Retrieving clinic session details...
        </div>
      ) : (
        <div className="space-y-6 text-left text-text-primary">
          {/* 1. Patient Folder Info */}
          <div className="bg-background/20 border border-border/50 rounded-xl p-4.5 space-y-3.5 select-none">
            <div className="flex items-start justify-between border-b border-border/40 pb-2">
              <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Patient Details</p>
                <h4 className="text-sm font-black text-text-primary leading-tight">
                  {appointment.patientName}
                </h4>
              </div>
              <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                appointment.status === 'Completed' ? 'bg-success/15 text-success border-success/15' :
                appointment.status === 'Cancelled' ? 'bg-danger/15 text-danger border-danger/15' :
                appointment.status === 'Checked In' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                'bg-primary-light text-primary border-primary/10'
              }`}>
                {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-0.5">
                <span className="text-[9px] text-text-secondary/70 uppercase">Mobile Number</span>
                <p className="text-text-primary flex items-center gap-1 font-bold">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{appointment.mobileNumber}</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-text-secondary/70 uppercase">Consulting Dentist</span>
                <p className="text-text-primary flex items-center gap-1 font-bold">
                  <User className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{appointment.doctorName}</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-text-secondary/70 uppercase">Scheduled Time</span>
                <p className="text-primary flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{new Date(appointment.appointmentDate).toLocaleDateString([], { day: '2-digit', month: 'short' })} @ {appointment.appointmentTime}</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-text-secondary/70 uppercase">Clinic Branch</span>
                <p className="text-text-primary flex items-center gap-1 font-bold">
                  <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{appointment.branchName.split(' - ')[0]}</span>
                </p>
              </div>
            </div>

            {appointment.remarks && (
              <div className="pt-2 border-t border-border/30">
                <span className="text-[9px] text-text-secondary/70 uppercase">Chief Complaint / Remarks</span>
                <p className="text-xs text-text-primary font-bold mt-0.5">
                  &ldquo;{appointment.remarks}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* 2. Action Workflow buttons */}
          {(appointment.status === 'Scheduled' || appointment.status === 'Checked In' || appointment.status === 'In Progress') && (
            <div className="space-y-2 select-none">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
                Update Booking Status
              </span>
              <div className="flex flex-wrap gap-2.5">
                {appointment.status === 'Scheduled' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleApplyStatusChange('Checked In')}
                    className="flex-1 font-black text-xs border-primary/20 text-primary hover:bg-primary-light/10"
                  >
                    Check-In Patient
                  </Button>
                )}

                {appointment.status === 'Checked In' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleApplyStatusChange('In Progress')}
                    className="flex-1 font-black text-xs border-warning/20 text-warning-dark hover:bg-warning/10"
                  >
                    Start Treatment
                  </Button>
                )}

                {(appointment.status === 'In Progress' || appointment.status === 'Checked In' || appointment.status === 'Scheduled') && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleApplyStatusChange('Completed')}
                    className="flex-1 font-black text-xs border-success/20 text-success hover:bg-success/10"
                  >
                    Complete Session
                  </Button>
                )}

                {(appointment.status === 'Scheduled' || appointment.status === 'Checked In') && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleApplyStatusChange('Cancelled')}
                    className="font-bold text-xs hover:text-danger hover:bg-danger/5 text-text-secondary px-3.5 border-border"
                  >
                    Cancel Slot
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* 3. Reminder Center Console */}
          {appointment.status === 'Scheduled' && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4.5 space-y-3.5 select-none">
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <Bell className="w-4.5 h-4.5 text-primary shrink-0 animate-bounce" />
                  <span>Reminder Dispatch Center</span>
                </h4>
                <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                  Dispatch automated slot reminders directly using customized templates.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-36 shrink-0">
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value as ReminderChannel)}
                    className="w-full bg-white border border-border/80 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS Message</option>
                    <option value="Email">Email Letter</option>
                  </select>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="xs"
                  onClick={handleSendReminder}
                  className="font-bold text-[10px]"
                >
                  Send Confirmation Reminder
                </Button>
              </div>
            </div>
          )}

          {/* 4. Reminder History Queue */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Reminder History Logs ({reminders.length})
            </h4>

            {reminders.length === 0 ? (
              <p className="text-xs font-bold text-text-secondary/40 py-2 italic">
                No reminders sent for this slot yet.
              </p>
            ) : (
              <div className="space-y-2">
                {reminders.map((rem) => (
                  <div key={rem.id} className="bg-background/25 border border-border/50 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1 text-text-secondary">
                      {rem.channel === 'WhatsApp' && <MessageSquare className="w-3.5 h-3.5 text-success shrink-0" />}
                      {rem.channel === 'SMS' && <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      {rem.channel === 'Email' && <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                      <span>{rem.channel} Sent @ {rem.date}</span>
                    </span>
                    <span className="text-[9px] font-black text-success uppercase">
                      {rem.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Status timeline tracker */}
          <div className="space-y-4 border-t border-border/40 pt-4">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 select-none">
              <History className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>Status History timeline</span>
            </h4>

            <div className="relative pl-4 border-l border-border/80 space-y-4 pt-1 ml-2 select-none">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative text-left">
                  <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
                  <div className="text-xs font-semibold text-text-primary">
                    <p className="font-extrabold text-primary">{item.status}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                      {item.notes}
                    </p>
                    <span className="text-[8px] text-text-secondary/50 block mt-1 font-bold">
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </Drawer>
  )
}
export default AppointmentDetailsPage
