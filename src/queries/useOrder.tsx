import orderApiRequest from '@/apiRequests/order';
import {
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from '@/schemaValidations/order.schema';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: number }) =>
      orderApiRequest.updateOrder(id, body),
  });
};

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => orderApiRequest.getOrderLists(queryParams),
  });
};

export const useGetOrderDetailQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApiRequest.getOrderDetail(id),
    enabled,
  });
};

export const usePayOrderForGuestMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderApiRequest.pay(body),
  });
};
