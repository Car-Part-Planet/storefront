'use client';

import Price from 'components/price';
import { useProduct } from 'context/product-context';
import { CORE_VARIANT_ID_KEY, CORE_WAIVER, DELIVERY_OPTION_KEY } from 'lib/constants';
import { Money } from 'lib/shopify/types';
import { getDeliveryOptions } from './delivery';

type PriceSummaryProps = {
  defaultPrice: Money;
  storePrefix: string | undefined;
};

const PriceSummary = ({ defaultPrice, storePrefix }: PriceSummaryProps) => {
  const { variant, state } = useProduct();

  const price = variant?.price.amount || defaultPrice.amount;
  const selectedCoreChargeOption = state[CORE_VARIANT_ID_KEY];
  const selectedDeliveryOption = state[DELIVERY_OPTION_KEY];

  // Determine delivery prices based on storePrefix
  const commercialPrice = storePrefix === 'reman-transmission' ? 299 : 0;
  const residentialPrice = storePrefix === 'reman-transmission' ? 398 : 99;
  const deliveryOptions = getDeliveryOptions(commercialPrice, residentialPrice);

  const deliveryPrice =
    deliveryOptions.find((option) => option.key === selectedDeliveryOption)?.price ?? 0;
  const currencyCode = variant?.price.currencyCode || defaultPrice.currencyCode;
  const corePrice =
    selectedCoreChargeOption === CORE_WAIVER ? 0 : (variant?.coreCharge?.amount ?? 0);

  const totalPrice = Number(price) + deliveryPrice + Number(corePrice);

  // Determine shipping label based on deliveryPrice
  const shippingLabel = deliveryPrice === 0 ? 'Free Shipping' : 'Flat Rate Shipping';

  return (
    <div className="mb-3 flex flex-col gap-2 pt-5">
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm font-medium">Subtotal</span>
        <Price amount={price} currencyCode={currencyCode} className="text-sm font-medium" />
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-xs">{`Fully Refundable Core Charge ${selectedCoreChargeOption === CORE_WAIVER ? '(Waived for 30 days)' : ''}`}</span>
        {selectedCoreChargeOption === CORE_WAIVER ? (
          <span className="text-xs">{`+$0.00`}</span>
        ) : (
          <Price
            amount={variant?.coreCharge?.amount ?? '0'}
            currencyCode={currencyCode}
            className="text-xs"
            prefix="+"
          />
        )}
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-xs">{`${shippingLabel} (${selectedDeliveryOption} address)`}</span>
        <Price
          amount={String(deliveryPrice)}
          currencyCode={currencyCode}
          className="text-xs"
          prefix="+"
        />
      </div>
      <hr />
      <div className="flex flex-row items-center justify-between">
        <span className="font-semibold">Due Today</span>
        <Price
          amount={String(totalPrice)}
          currencyCode={currencyCode}
          className="font-semibold text-emerald-500"
        />
      </div>
    </div>
  );
};

export default PriceSummary;
