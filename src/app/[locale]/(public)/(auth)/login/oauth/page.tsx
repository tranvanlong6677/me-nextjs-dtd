'use client'
import { useAppStore } from '@/components/app-provider'
import { toast } from '@/components/ui/use-toast'
import { decodeToken, generateSocketInstance } from '@/lib/utils'
import { useSetTokenToCookiesMutation } from '@/queries/useAuth'
import { Suspense, useEffect, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import SearchParamsLoader, { useSearchParamsLoader } from '@/components/search-params-loader'

export default function OAuth() {
  const { searchParams, setSearchParams } = useSearchParamsLoader()
  const accessToken = searchParams?.get('accessToken')
  const refreshToken = searchParams?.get('refreshToken')
  const message = searchParams?.get('message')
  const router = useRouter()
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)

  const countRef = useRef(0)

  const { mutateAsync: setTokenToCookies, isPending } = useSetTokenToCookiesMutation()

  useEffect(() => {
    if (isPending || countRef.current !== 0) return
    if (!accessToken || !refreshToken) {
      if (countRef.current === 0) {
        setTimeout(() => {
          toast({ description: message ?? 'Có lỗi xảy ra' })
        })
        countRef.current++
      }
      return
    }
    setTokenToCookies({ accessToken, refreshToken })
      .then(() => {
        const { role } = decodeToken(accessToken)
        setRole(role)
        setSocket(generateSocketInstance(accessToken))
        router.push('/manage/dashboard')
      })
      .catch((error) => {
        toast({ description: error.message ?? 'Có lỗi xảy ra' })
      })

    countRef.current++
  }, [accessToken, refreshToken, router, setRole, setSocket, isPending, setTokenToCookies])
  return (
    <>
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      OAuthPage
    </>
  )
}
