import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from '@/schemaValidations/order.schema';
import http from '../lib/http';
import queryString from 'query-string';

const orderApiRequest = {
  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`/orders`, body),
  getOrderLists: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `/orders?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        }),
    ),
  updateOrder: (id: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${id}`, body),
  getOrderDetail: (id: number) =>
    http.get<GetOrderDetailResType>(`/orders/${id}`),
  pay: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`/orders/pay`, { ...body }),
};

export default orderApiRequest;
