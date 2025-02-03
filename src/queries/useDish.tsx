import dishApiRequest from '@/apiRequests/dish';
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetDishMutation = (id: number) => {
  return useMutation({ mutationFn: () => dishApiRequest.getDish(id) });
};

export const useCreateDishMutation = (body: UpdateDishBodyType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => dishApiRequest.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      });
    },
  });
};

export const useUpdateDishMutation = (id: number, body: UpdateDishBodyType) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      });
    },
  });
};

export const useDeleteDishMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dishApiRequest.deleteDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      });
    },
  });
};

export const useGetListDisQuery = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: () => dishApiRequest.list(),
  });
};
