'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from '@/i18n/navigation'
import { ReactNode, useState } from 'react'

export default function Modal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  const handleCloseModal = (open: boolean) => {
    setOpen(open)
    if (!open) router.back()
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className='max-h-full overflow'>{children}</DialogContent>
    </Dialog>
  )
}
