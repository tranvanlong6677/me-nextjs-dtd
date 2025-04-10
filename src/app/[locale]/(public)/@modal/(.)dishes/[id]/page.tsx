import dishApiRequest from '@/apiRequests/dish'
import { wrapServerApi } from '@/lib/utils'
import Modal from './modal'
import DishDetail from '@/app/[locale]/(public)/dishes/[id]/dish-detail'

export default async function DishPage({ params: { id } }: { params: { id?: string } }) {
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
