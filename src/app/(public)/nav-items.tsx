'use client'
import { useAppStore } from '@/components/app-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Role, RoleType } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: {
  title: string
  href: string
  hideWhenLoggedIn?: boolean
  roles?: RoleType[]
}[] = [
  {
    title: 'Trang chủ',
    href: '/' // authRequired = undefined nghĩa là đăng nhập hay chưa đều cho hiển thị
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    roles: [Role.Guest]
  },
  {
    title: 'Settings',
    href: '/settings'
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    roles: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLoggedIn: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    roles: [Role.Owner, Role.Employee]
  }
]

// Server: Món ăn, Đăng nhập. Do server không biết trạng thái đăng nhập của user
// CLient: Đầu tiên client sẽ hiển thị là Món ăn, Đăng nhập.
// Nhưng ngay sau đó thì client render ra là Món ăn, Đơn hàng, Quản lý do đã check được trạng thái đăng nhập

export default function NavItems({ className }: { className?: string }) {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  const isLoggedIn = !!role
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      disconnectSocket()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error
      })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        const isHide =
          (item?.hideWhenLoggedIn && isLoggedIn) ||
          (isLoggedIn && item.roles && !item.roles.includes(role)) ||
          (!isLoggedIn && !!item.roles)
        if (isHide) return null
        return (
          <Link href={item.href} key={item.href} className={className}>
            {item.title}
          </Link>
        )
      })}

      {!!isLoggedIn && (
        <AlertDialog>
          <AlertDialogTrigger>
            <div className={cn(`${className} cursor-pointer text-start`)}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
              <AlertDialogDescription>Đăng xuất có thể làm mất đi hóa đơn của bạn</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Thoát</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
