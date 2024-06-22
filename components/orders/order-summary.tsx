import Image from 'next/image';
import Price from 'components/price';
import Badge from 'components/ui/badge';
import Heading from 'components/ui/heading';
import Label from 'components/ui/label';
import Text from 'components/ui/text';
import { Order } from 'lib/shopify/types';

export default function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-6">
      <Heading size="sm">Order Summary</Heading>
      <div className="flex flex-col gap-6">
        {order.lineItems.map((lineItem, index) => (
          <div key={index} className="flex items-center gap-4">
            <Badge content={lineItem.quantity!}>
              <Image
                src={lineItem.image.url}
                alt={lineItem.image.altText}
                width={lineItem.image.width}
                height={lineItem.image.height}
                className="rounded border"
              />
            </Badge>
            <div className="flex flex-col gap-2">
              <Text>{lineItem.title}</Text>
              <Label>{lineItem.sku}</Label>
            </div>
            <Price
              className="text-sm"
              amount={lineItem.price!.amount}
              currencyCode={lineItem.price!.currencyCode}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <Text>Subtotal</Text>
            <Price
              className="text-sm font-semibold"
              amount={order.totalPrice!.amount}
              currencyCode={order.totalPrice!.currencyCode}
            />
          </div>
          <div className="flex items-center justify-between">
            <Text>Shipping</Text>
            {order.shippingMethod?.price.amount !== '0.0' ? (
              <Price
                className="text-sm font-semibold"
                amount={order.shippingMethod!.price.amount}
                currencyCode={order.shippingMethod!.price.currencyCode}
              />
            ) : (
              <Text className="font-semibold">Free</Text>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Heading as="span" size="sm">
            Total
          </Heading>
          <Price
            className="font-semibold"
            amount={order.totalPrice!.amount}
            currencyCode={order.totalPrice!.currencyCode}
          />
        </div>
      </div>
    </div>
  );
}