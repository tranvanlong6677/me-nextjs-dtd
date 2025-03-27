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
import { create } from 'zustand'

type appStoreStateType = {
  role: RoleType | undefined
  setRole: (role?: RoleType | undefined) => void
  socket: Socket | undefined
  setSocket: (socket: Socket | undefined) => void
  disconnectSocket: () => void
}

export const useAppStore = create<appStoreStateType>((set) => ({
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    if (!role) {
      removeTokensFromLocalStorage()
    }
    set({ role })
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket: Socket | undefined) => set({ socket }),
  disconnectSocket: () =>
    set((state) => {
      state.socket?.disconnect()
      return { socket: undefined }
    })
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})
// const AppContext = createContext({
//   role: undefined as RoleType | undefined,
//   setRole: (role: RoleType | undefined) => {},
//   socket: undefined as Socket | undefined,
//   setSocket: (socket: Socket | undefined) => {},
//   disconnectSocket: () => {}
// })
// export const useAppContext = () => {
//   return useContext(AppContext)
// }
export default function AppProvider({ children }: { children: React.ReactNode }) {
  const count = useRef(0)
  const role = useAppStore((state) => state.role)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const setRole = useAppStore((state) => state.setRole)
  const socket = useAppStore((state) => state.socket)
  const setSocket = useAppStore((state) => state.setSocket)

  useEffect(() => {
    if (count.current >= 1) return

    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const decode = decodeToken(accessToken)
      setRole(decode.role)
      setSocket(generateSocketInstance(accessToken))
    }
    count.current++
  }, [])

  // Nếu mọi người dùng React 19 và Next.js 15 thì không cần AppContext.Provider, chỉ cần AppContext là đủ

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
