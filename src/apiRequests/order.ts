import {
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
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
};

export default orderApiRequest;
