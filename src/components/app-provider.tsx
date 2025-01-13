'use client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RefreshToken from './refresh-token';
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from '@/lib/utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (value: boolean) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuthState] = useState(false);
  const setIsAuth = useCallback((value: boolean) => {
    setIsAuthState(value);
    if (!value) {
      removeTokenFromLocalStorage();
    }
  }, []);

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      setIsAuthState(true);
    }
  }, []);

  return (
    <AppContext.Provider value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <RefreshToken />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
