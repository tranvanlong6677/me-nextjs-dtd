import Layout from '@/app/[locale]/(public)/layout'
import { defaultLocale } from '@/i18n/config'
import { ReactNode } from 'react'

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <Layout modal={null} params={{ locale: defaultLocale }}>
      {children}
    </Layout>
  )
}
