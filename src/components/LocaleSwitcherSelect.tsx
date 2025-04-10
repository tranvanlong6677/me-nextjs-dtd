'use client'

import { CheckIcon, GlobeIcon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

type Props = {
  defaultValue: string
  items: Array<{ value: string; label: string }>
  label: string
}

export default function LocaleSwitcherSelect({ defaultValue, items, label }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()

  const onChange = (value: string) => {
    router.replace(pathname, { locale: value })
  }

  return (
    <div className='relative'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' className='rounded-full w-10 h-10'>
            <GlobeIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:text-white' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className='flex cursor-default items-center px-3 py-2 text-base dark:data-[highlighted]:bg-slate-800'
              onClick={() => onChange(item.value)}
            >
              <div className='mr-2 w-[1rem]'>
                {item.value === defaultValue && (
                  <CheckIcon className='h-5 w-5 dark:text-slate-100 light:text-gray-700' />
                )}
              </div>
              <span className='dark:text-slate-100 light:text-gray-700'>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
