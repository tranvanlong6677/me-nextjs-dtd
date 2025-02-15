import orderApiRequest from '@/apiRequests/order';
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateOrderBodyType & { id: number }) =>
      orderApiRequest.updateOrder(id, body),
  });
};

export const useGetOrderListQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderApiRequest.getOrderLists,
  });
};
