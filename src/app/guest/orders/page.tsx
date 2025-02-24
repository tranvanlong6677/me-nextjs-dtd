import OrderCart from './order-cart';

export default function Page() {
  return (
    <>
      <div className="max-w-[400px] mx-auto space-y-4">
        <h1 className="text-center text-xl font-bold">Đơn hàng</h1>
        <OrderCart />
      </div>
    </>
  );
}
