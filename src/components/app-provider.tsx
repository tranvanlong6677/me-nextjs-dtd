'use client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RefreshToken from '@/components/refresh-token';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from '@/lib/utils';
import { RoleType } from '@/constants/type';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const AppContext = createContext({
  role: undefined as RoleType | undefined,
  setRole: (role: RoleType | undefined) => {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined);
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const decode = decodeToken(accessToken);
      setRoleState(decode.role);
    }
  }, []);

  // Các bạn nào mà dùng Next.js 15 và React 19 thì không cần dùng useCallback đoạn này cũng được
  const setRole = useCallback((role: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  }, []);

  // Nếu mọi người dùng React 19 và Next.js 15 thì không cần AppContext.Provider, chỉ cần AppContext là đủ
  return (
    <AppContext.Provider value={{ role, setRole }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
