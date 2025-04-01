import Layout from '@/app/(public)/layout'
import { ReactNode } from 'react'

export default function GuestLayout({ children }: { children: ReactNode }) {
  return <Layout modal={null}>{children}</Layout>
}
