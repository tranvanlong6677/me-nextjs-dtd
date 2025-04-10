'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import SearchParamsLoader, { useSearchParamsLoader } from '@/components/search-params-loader'

export default function RefreshToken() {
  const router = useRouter()
  const { searchParams, setSearchParams } = useSearchParamsLoader()

  const refreshTokenFromUrl = searchParams?.get('refreshToken')
  const redirectPathname = searchParams?.get('redirect')
  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || '/')
        }
      })
    } else {
      router.push('/')
    }
  }, [router, refreshTokenFromUrl, redirectPathname])
  return (
    <div>
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      Refresh token....
    </div>
  )
}
