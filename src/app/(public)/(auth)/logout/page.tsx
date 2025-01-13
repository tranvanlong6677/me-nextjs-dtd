'use client';

import { useAppContext } from '@/components/app-provider';
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useRef } from 'react';

export default function LogoutPage() {
  const { mutateAsync: logout } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParam = useSearchParams();
  const refreshTokenOnUrl = searchParam.get('refreshToken');
  const accessTokenOnUrl = searchParam.get('accessToken');
  const { setIsAuth } = useAppContext();

  useEffect(() => {
    if (
      !ref.current &&
      refreshTokenOnUrl &&
      refreshTokenOnUrl === getRefreshTokenFromLocalStorage() &&
      accessTokenOnUrl &&
      accessTokenOnUrl === getAccessTokenFromLocalStorage()
    ) {
      ref.current = logout;

      logout().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        router.push('/login');
        setIsAuth(false);
      });
    } else {
      router.push('/');
    }
  }, [logout, refreshTokenOnUrl, router, accessTokenOnUrl]);
  return <>Log out ....</>;
}
