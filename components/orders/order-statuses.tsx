import { Order } from 'lib/shopify/types';
import CoreStatus from './core-return-status';
import OrderConfirmedStatus from './order-confirmation-status';
import WarrantyActivatedStatus from './warranty-activated-status';

export default function OrderStatuses({ order, className }: { order: Order; className?: string }) {
  return (
    <div className={className}>
      <OrderConfirmedStatus order={order} />
      <CoreStatus order={order} />
      <WarrantyActivatedStatus order={order} />
    </div>
  );
}
