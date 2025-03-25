'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppContext } from './app-provider'

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()
  const { socket, disconnectSocket } = useAppContext()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    let interval: any = null

    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        force,
        onError: () => {
          clearInterval(interval)
          router.push('/login')
          disconnectSocket()
        }
      })
    }
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    onRefreshToken()
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000
    interval = setInterval(() => onRefreshToken(), TIMEOUT)

    if (!socket) return

    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log('id:', socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true)
    }

    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)
    socket?.on('refresh-token', onRefreshTokenSocket)

    return () => {
      clearInterval(interval)
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('refresh-token', onRefreshTokenSocket)
    }
  }, [pathname, router])
  return null
}
