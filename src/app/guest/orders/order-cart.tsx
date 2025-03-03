'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import socket from '@/lib/socket';
import { getVietnameseOrderStatus } from '@/lib/utils';
import { useGuestOrderListQuery } from '@/queries/useGuest';
import { UpdateOrderResType } from '@/schemaValidations/order.schema';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

export default function OrderCart() {
  const { data, refetch } = useGuestOrderListQuery();
  const orders = data?.payload?.data ?? [];
  const totalPrice = useMemo(() => {
    return orders.reduce((result, dish) => {
      return result + dish?.dishSnapshot?.price * dish?.quantity;
    }, 0);
  }, [orders]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('id:', socket.id);
    }

    function onDisconnect() {
      console.log('disconnect');
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      console.log(data);
      toast({
        description: `Món ăn ${
          data?.dishSnapshot?.name
        } đã được cập nhật sang trạng thái ${getVietnameseOrderStatus(
          data.status,
        )}`,
      });
      refetch();
    }

    socket.on('update-order', onUpdateOrder);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  return (
    <>
      {orders?.map((dish) => {
        return (
          <div key={dish?.id} className="flex gap-4 mb-4">
            <div className="flex-shrink-0 relative">
              <Image
                src={dish?.dishSnapshot?.image}
                alt={dish?.dishSnapshot?.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish?.dishSnapshot?.name}</h3>
              <p className="text-xs">{dish?.dishSnapshot?.description}</p>
              <p className="text-xs font-semibold">
                {dish?.dishSnapshot?.price}đ x {dish?.quantity}
              </p>
            </div>
            <div className="flex-shrink-0 flex-1 flex justify-end items-center">
              <Badge>{getVietnameseOrderStatus(dish?.status)}</Badge>
            </div>
          </div>
        );
      })}
      <div className="sticky bottom-0 mt-4">
        <Button className="w-full justify-between flex gap-2" disabled={true}>
          <span>{orders.length} món</span>
          <span>{totalPrice.toLocaleString()} đ</span>
        </Button>
      </div>
    </>
  );
}
