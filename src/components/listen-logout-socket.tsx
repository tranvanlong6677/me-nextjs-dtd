import { useLogoutMutation } from '@/queries/useAuth'
import { useEffect } from 'react'
import { handleErrorApi } from '@/lib/utils'
import { useAppStore } from './app-provider'
import { useRouter, usePathname } from '@/i18n/navigation'

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']

export default function ListenLogoutSocket() {
  const pathname = usePathname()
  const router = useRouter()
  const { mutateAsync, isPending } = useLogoutMutation()
  const socket = useAppStore((state) => state.socket)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    async function onLogout() {
      if (isPending) return
      try {
        await mutateAsync()
        setRole(undefined)
        router.push('/')
        disconnectSocket()
      } catch (error) {
        handleErrorApi({ error })
      }
    }
    socket?.on('logout', onLogout)
  }, [socket, pathname, isPending, mutateAsync, disconnectSocket, setRole, router])

  return <></>
}
