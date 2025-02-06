import tableApiRequest from '@/apiRequests/table';
import {
  CreateTableBodyType,
  UpdateTableBodyType,
} from '@/schemaValidations/table.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetTableQuery = (id: number) => {
  return useQuery({
    queryKey: ['table-detail', id],
    queryFn: () => tableApiRequest.getTable(id),
  });
};

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTableBodyType) => tableApiRequest.add(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
      });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateTableBodyType & {
      id: number;
    }) => tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
      });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tableApiRequest.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tables'],
      });
    },
  });
};

export const useGetListTableQuery = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApiRequest.list(),
  });
};
