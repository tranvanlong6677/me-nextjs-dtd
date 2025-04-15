import dishApiRequest from '@/apiRequests/dish'
import { getIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import DishDetail from './dish-detail'

export default async function Page({ params: { slug } }: { params: { slug: string } }) {
  const id = getIdFromSlugUrl(slug)
  const response: any = await wrapServerApi(() => dishApiRequest.getDish(+(id || -1)))
  const data = response?.payload?.data
  if (!data) {
    return <>Không tìm thấy món ăn</>
  }
  return (
    <>
      <DishDetail data={data} />
    </>
  )
}
