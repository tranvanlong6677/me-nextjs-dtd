import { useLogoutMutation } from '@/queries/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppContext } from './app-provider'
import { handleErrorApi } from '@/lib/utils'
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']

export default function ListenLogoutSocket() {
  const pathname = usePathname()
  const router = useRouter()
  const { mutateAsync, isPending } = useLogoutMutation()
  const { setRole, disconnectSocket, socket } = useAppContext()

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
