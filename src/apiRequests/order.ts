import {
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
import { toDate } from 'date-fns';

const orderApiRequest = {
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
