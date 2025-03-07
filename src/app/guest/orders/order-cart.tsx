'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { DishStatus, OrderStatus } from '@/constants/type';
import socket from '@/lib/socket';
import { getVietnameseOrderStatus } from '@/lib/utils';
import { useGuestOrderListQuery } from '@/queries/useGuest';
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from '@/schemaValidations/order.schema';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

export default function OrderCart() {
  const { data, refetch } = useGuestOrderListQuery();
  const orders = data?.payload?.data ?? [];
  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          !![
            OrderStatus.Pending,
            OrderStatus.Processing,
            OrderStatus.Delivered,
          ].includes(order.status as any)
        )
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };

        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }

        return { ...result };
      },
      {
        waitingForPaying: { price: 0, quantity: 0 },
        paid: { price: 0, quantity: 0 },
      },
    );
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

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0];
      if (!guest) {
        return;
      }
      toast({
        description: `${guest.name} tại bàn ${guest.tableNumber} thanh toán thành công ${data.length} đơn`,
      });
      refetch();
    }

    socket.on('update-order', onUpdateOrder);
    socket.on('payment', onPayment);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('update-order', onUpdateOrder);
      socket.off('payment', onPayment);
    };
  }, [refetch]);
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

      {paid.quantity > 0 && (
        <div className="sticky bottom-0 mt-4">
          <Button className="w-full justify-between flex gap-2" disabled={true}>
            <span>Đơn đã thanh toán: {paid.quantity} món</span>
            <span>{paid.price.toLocaleString()} đ</span>
          </Button>
        </div>
      )}
      <div className="sticky bottom-0 mt-4">
        <Button className="w-full justify-between flex gap-2" disabled={true}>
          <span>Đơn chưa thanh toán:{waitingForPaying.quantity} món</span>
          <span>{waitingForPaying.price.toLocaleString()} đ</span>
        </Button>
      </div>
    </>
  );
}
