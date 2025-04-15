import dishApiRequest from '@/apiRequests/dish'
import { wrapServerApi, getIdFromSlugUrl } from '@/lib/utils'
import Modal from './modal'
import DishDetail from '@/app/[locale]/(public)/dishes/[slug]/dish-detail'

export default async function DishPage({ params: { slug } }: { params: { slug: string } }) {
  const id = getIdFromSlugUrl(slug)
  const response: any = await wrapServerApi(() => dishApiRequest.getDish(+(id || -1)))
  const data = response?.payload?.data
  if (!data) {
    return <>Không tìm thấy món ăn</>
  }
  return (
    <>
      <Modal>
        <DishDetail data={data} />
      </Modal>
    </>
  )
}
