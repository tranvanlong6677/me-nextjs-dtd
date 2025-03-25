'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RefreshToken from '@/components/refresh-token'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage
} from '@/lib/utils'
import { RoleType } from '@/constants/type'
import type { Socket } from 'socket.io-client'
import ListenLogoutSocket from './listen-logout-socket'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
const AppContext = createContext({
  role: undefined as RoleType | undefined,
  setRole: (role: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket: Socket | undefined) => {},
  disconnectSocket: () => {}
})
export const useAppContext = () => {
  return useContext(AppContext)
}
export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const count = useRef(0)

  const disconnectSocket = useCallback(() => {
    socket?.disconnect()
    setSocket(undefined)
  }, [socket, setSocket])

  useEffect(() => {
    if (count.current >= 1) return

    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const decode = decodeToken(accessToken)
      setRoleState(decode.role)
      setSocket(generateSocketInstance(accessToken))
    }
    count.current++
  }, [])

  // Các bạn nào mà dùng Next.js 15 và React 19 thì không cần dùng useCallback đoạn này cũng được
  const setRole = useCallback((role: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }, [])

  // Nếu mọi người dùng React 19 và Next.js 15 thì không cần AppContext.Provider, chỉ cần AppContext là đủ

  return (
    <AppContext.Provider value={{ role, setRole, socket, setSocket, disconnectSocket }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ListenLogoutSocket />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
