import React from 'react'
import { useOverlayStore } from '@/store/overlayStore'
import { Modal } from './Modal'
import { Drawer } from './Drawer'

export const OverlayContainer: React.FC = () => {
  const { modals, drawers, closeModal, closeDrawer } = useOverlayStore()

  const activeModals = Object.values(modals)
  const activeDrawers = Object.values(drawers)

  return (
    <>
      {/* 1. Dynamic Modals rendering */}
      {activeModals.map((m) => (
        <Modal
          key={m.id}
          isOpen={m.isOpen}
          onClose={() => closeModal(m.id)}
          title={m.title}
          size={m.size}
        >
          {m.content}
        </Modal>
      ))}

      {/* 2. Dynamic Drawers rendering */}
      {activeDrawers.map((d) => (
        <Drawer
          key={d.id}
          isOpen={d.isOpen}
          onClose={() => closeDrawer(d.id)}
          title={d.title}
          size={d.size}
        >
          {d.content}
        </Drawer>
      ))}
    </>
  )
}