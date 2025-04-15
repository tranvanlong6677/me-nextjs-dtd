import { Suspense } from 'react'
import Logout from './logout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logout redirect',
  description: 'Logout redirect',
  robots: {
    index: false
  }
}

export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
