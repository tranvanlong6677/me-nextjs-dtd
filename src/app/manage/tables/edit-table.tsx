'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  getTableLink,
  getVietnameseTableStatus,
  handleErrorApi,
} from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from '@/schemaValidations/table.schema';
import { TableStatus, TableStatusValues } from '@/constants/type';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { useGetTableQuery, useUpdateTableMutation } from '@/queries/useTable';
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { QRCodeTable } from '@/components/QRCodeTable';

export default function EditTable({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });
  const { mutateAsync, isPending } = useUpdateTableMutation();
  const { data: detailTable } = useGetTableQuery(id as number);

  const onSubmit = async () => {
    if (isPending || !id) return;
    try {
      const result = await mutateAsync({ id, ...form.getValues() });
      toast({
        description: result.payload.message,
      });
      onSubmitSuccess?.();
      reset();
    } catch (error) {
      console.error(error);
      handleErrorApi({ error });
    }
  };

  const reset = () => {
    form.reset();
    setId(undefined);
  };

  useEffect(() => {
    if (!detailTable) return;
    const dataTable = detailTable?.payload.data;
    form.reset({
      capacity: dataTable?.capacity,
      status: dataTable?.status,
      changeToken: form.getValues('changeToken'),
    });
  }, [detailTable, form]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          form.reset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            onReset={reset}
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label htmlFor="name">Số hiệu bàn</Label>
                  <div className="col-span-3 w-full space-y-2">
                    <Input
                      id="number"
                      type="number"
                      className="w-full"
                      value={detailTable?.payload.data?.number ?? 0}
                      readOnly
                    />
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Sức chứa (người)</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="capacity"
                          className="w-full"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changeToken"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Đổi QR Code</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="changeToken"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-3 w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          {!!detailTable && (
                            <QRCodeTable
                              token={detailTable?.payload?.data?.token}
                              tableNumber={detailTable?.payload?.data?.number}
                            />
                          )}
                        </div>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>QR Code</Label>
                  <div className="col-span-3 w-full space-y-2"></div>
                </div>
              </FormItem>
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>URL gọi món</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {!!detailTable && (
                      <Link
                        href={getTableLink({
                          token: detailTable.payload.data.token,
                          tableNumber: detailTable.payload.data.number,
                        })}
                        target="_blank"
                        className="break-all"
                      >
                        {getTableLink({
                          token: detailTable.payload.data.token,
                          tableNumber: detailTable.payload.data.number,
                        })}
                      </Link>
                    )}
                  </div>
                </div>
              </FormItem>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-table-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
