import {
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from '@/schemaValidations/order.schema';
import http from '../lib/http';

const orderApiRequest = {
  getOrderLists: () => http.get<GetOrdersResType>('/orders'),
  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${id}`, body),
};

export default orderApiRequest;
