import { formatCurrency, getVietnameseDishStatus } from '@/lib/utils'
import { DishResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'

export default async function DishDetail({ data }: { data: DishResType['data'] | undefined }) {
  if (!data) {
    return <>Không tìm thấy món ăn</>
  }
  return (
    <>
      <div className='space-x-4 flex items-center flex-col gap-2'>
        <h1 className='text-3xl lg:text-4xl font-semibold'>{data?.name}</h1>
        <div className='text-2xl font-bold'>Giá: {formatCurrency(data?.price)}</div>
        <Image
          src={data?.image}
          alt='dish image'
          quality={100}
          width={700}
          height={700}
          className='object-cover max-w-[1080px] max-h-[1080px] w-full h-full rounded-xl border border-1 border-color-white'
        />

        <div className='text-xl'>Mô tả:{data?.description}</div>
        <div className='text-xl'>Trạng thái: {getVietnameseDishStatus(data?.status)}</div>
      </div>
    </>
  )
}
