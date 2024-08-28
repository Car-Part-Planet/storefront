'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { Cart } from 'lib/shopify/types';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { setMetafields } from './actions';
import LineItem from './line-item';
import VehicleDetails, { VehicleFormSchema, vehicleFormSchema } from './vehicle-details';

const CartDetails = ({ cart, checkoutUrl }: { cart: Cart; checkoutUrl: string }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const { control, handleSubmit } = useForm<VehicleFormSchema>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      customer_vin: cart?.attributes.find((a) => a.key === 'customer_vin')?.value,
      customer_mileage: Number(cart?.attributes.find((a) => a.key === 'customer_mileage')?.value)
    }
  });

  // Sort cart lines such that items with productType "Add On" come last
  const sortedCartLines = cart?.lines.toSorted((a, b) => {
    if (
      a.merchandise.product.productType === 'Add On' &&
      b.merchandise.product.productType !== 'Add On'
    ) {
      return 1;
    }
    if (
      a.merchandise.product.productType !== 'Add On' &&
      b.merchandise.product.productType === 'Add On'
    ) {
      return -1;
    }
    return 0;
  });

  const onSubmit = async (data: VehicleFormSchema) => {
    if (!cart) return;

    setLoading(true);

    try {
      const message = await setMetafields(cart.id, data);
      if (message) {
        setMessage(message);
      } else {
        linkRef.current?.click();
      }
    } catch (error) {
      setMessage('Error updating vehicle details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 md:mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>
        <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
          {sortedCartLines?.map((item) => {
            return <LineItem item={item} key={item.id} />;
          })}
        </ul>
      </section>
      <form
        className="my-16 divide-y rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:my-0 lg:p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <VehicleDetails control={control} />

        <div className="pt-5">
          <h2 className="mb-3 text-lg font-medium text-gray-900">Order summary</h2>
          <dl className="space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Taxes</dt>
              <dd className="text-sm font-medium text-gray-900">
                <Price
                  amount={cart.cost.totalTaxAmount.amount}
                  currencyCode={cart.cost.totalTaxAmount.currencyCode}
                />
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-sm text-gray-600">
                <span>Shipping</span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Total</dt>
              <dd className="text-base font-medium text-gray-900">
                <Price
                  amount={cart.cost.totalAmount.amount}
                  currencyCode={cart.cost.totalAmount.currencyCode}
                />
              </dd>
            </div>
          </dl>
          <div className="mt-6">
            <a href={checkoutUrl} className="invisible" ref={linkRef} />
            <button
              type="submit"
              className={clsx(
                'w-full rounded-md border border-transparent bg-secondary px-4 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-gray-50',
                { 'cursor-not-allowed opacity-60 hover:opacity-60': loading },
                { 'cursor-pointer opacity-90 hover:opacity-100': !loading }
              )}
              aria-disabled={loading}
              disabled={sortedCartLines.some(
                (line) => parseFloat(line.cost.totalAmount.amount) === 0
              )}
            >
              {loading && <LoadingDots className="bg-white" />}
              Proceed to Checkout
            </button>
            <p aria-live="polite" className="sr-only" role="status">
              {message}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CartDetails;
