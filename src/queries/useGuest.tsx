import guestApiRequest from '@/apiRequests/guest';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};

export const useGuestOrderMutaion = () => {
  return useMutation({
    mutationFn: guestApiRequest.order,
  });
};

export const useGuestOrderListQuery = () => {
  return useQuery({
    queryKey: ['guest-orders'],
    queryFn: guestApiRequest.getOrderList,
  });
};
