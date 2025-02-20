'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useGetListDisQuery } from '@/queries/useDish';
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema';
import { useMemo, useState } from 'react';
import Quantity from './quantity';
import { useGuestOrderMutaion } from '@/queries/useGuest';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { handleErrorApi } from '@/lib/utils';
import { DishStatus } from '@/constants/type';

export default function MenuOrders() {
  const router = useRouter();

  const data = useGetListDisQuery();
  const { mutateAsync: guestOrder } = useGuestOrderMutaion();

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const dishes = useMemo(() => data.data?.payload.data || [], [data]);
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + dish.price * order.quantity;
    }, 0);
  }, [dishes, orders]);

  const handleQuantityOnChange = (dishId: number, quantity: number) => {
    if (quantity === 0) {
      setOrders(orders.filter((order) => order.dishId !== dishId));
      return;
    }
    const index = orders.findIndex((order) => order.dishId === dishId);
    if (index === -1) {
      setOrders([...orders, { dishId, quantity }]);
      return;
    }
    const newOrders = [...orders];
    newOrders[index] = { ...newOrders[index], quantity };
    console.log(newOrders);
    setOrders([...newOrders]);
  };

  const handleOrder = async () => {
    try {
      const result = await guestOrder(orders);
      toast({
        description: result.payload.message,
      });
      router.push('/guest/orders');
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <div>
      {dishes
        .filter((item) => item.status !== DishStatus.Hidden)
        .map((dish) => (
          <div key={dish?.id} className="flex gap-4 mb-4">
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               bg-opacity-50 bg-white text-red-500 text-sm italic px-3 py-1 rounded-md"
                >
                  Hết hàng
                </span>
              )}
              <Image
                src={dish?.image}
                alt={dish?.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish?.name}</h3>
              <p className="text-xs">{dish?.description}</p>
              <p className="text-xs font-semibold">{dish?.price}đ</p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Quantity
                value={
                  orders.find((item) => item.dishId === dish?.id)?.quantity ?? 0
                }
                onChange={(value) => handleQuantityOnChange(dish.id, value)}
              />
            </div>
          </div>
        ))}
      <div className="sticky bottom-0 mt-4">
        <Button
          className="w-full justify-between"
          disabled={orders?.length === 0}
          onClick={handleOrder}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{totalPrice.toLocaleString()} đ</span>
        </Button>
      </div>
    </div>
  );
}
