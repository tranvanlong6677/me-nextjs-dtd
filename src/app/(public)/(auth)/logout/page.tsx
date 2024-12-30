'use client'

import { getRefreshTokenToLocalStorage } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import {useEffect, useRef} from 'react'
export default function LogoutPage() {
  const {mutateAsync:logout} = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParam = useSearchParams()
  const refreshTokenOnUrl = searchParam.get('refreshToken');
  useEffect(() => {
    if(ref.current || refreshTokenOnUrl!==getRefreshTokenToLocalStorage()) return;
    ref.current = logout

    logout().then((res)=>{
      setTimeout(()=>{
        ref.current = null;
      },1000)
      router.push('/login');
    })
  }, [logout, refreshTokenOnUrl, router])
  return (
    <>Log out ....</>
  )
}