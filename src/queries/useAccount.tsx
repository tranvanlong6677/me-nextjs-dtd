import { accountApiRequest } from '@/apiRequests/account';
import { toast } from '@/components/ui/use-toast';
import { handleErrorApi } from '@/lib/utils';
import { UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: accountApiRequest.me,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2,
  });
};

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list,
  });
};

export const useGetAccountDetail = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ['account-detail', id],
    queryFn: () => accountApiRequest.getEmployee(id),
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateEmployeeAccountBodyType;
    }) => accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => accountApiRequest.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
