import { create } from 'zustand'

export interface SironaNotification {
  id: string
  title: string
  message: string
  type: 'clinical' | 'billing' | 'appointment' | 'system'
  isRead: boolean
  createdAt: string
}

interface NotificationState {
  notifications: SironaNotification[]
  unreadCount: () => number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<SironaNotification, 'id' | 'isRead' | 'createdAt'>) => void
}

const MOCK_NOTIFICATIONS: SironaNotification[] = [
  {
    id: 'n1',
    title: 'New Patient Registration',
    message: 'Aanya Gupta was registered as a patient by receptionist Rahul Sharma.',
    type: 'system',
    isRead: false,
    createdAt: '2026-06-11T10:15:00Z',
  },
  {
    id: 'n2',
    title: 'Appointment Completed',
    message: 'Kabir Malhotra completed his teeth scaling session with Dr. Ananya Iyer.',
    type: 'clinical',
    isRead: false,
    createdAt: '2026-06-11T09:30:00Z',
  },
  {
    id: 'n3',
    title: 'Invoice Payment Received',
    message: 'Received ₹1,200 UPI payment from Kabir Malhotra for invoice CP-9018.',
    type: 'billing',
    isRead: true,
    createdAt: '2026-06-11T09:45:00Z',
  },
  {
    id: 'n4',
    title: 'Upcoming Appointment Alert',
    message: 'Riya Sen is scheduled for root canal surgery at 02:30 PM today.',
    type: 'appointment',
    isRead: false,
    createdAt: '2026-06-11T08:00:00Z',
  },
]

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,

  unreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }))
  },

  addNotification: (noti) => {
    const newNoti: SironaNotification = {
      ...noti,
      id: Math.random().toString(36).substring(2, 9),
      isRead: false,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      notifications: [newNoti, ...state.notifications],
    }))
  },
}))