import dishApiRequest from '@/apiRequests/dish';
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetDishQuery = (id: number) => {
  return useQuery({
    queryKey: ['dish-detail', id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled: !!id,
  });
};

export const useCreateDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDishBodyType) => dishApiRequest.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      });
    },
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateDishBodyType & {
      id: number;
    }) => dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
      });
    },
  });
};

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => dishApiRequest.deleteDish(id),
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
