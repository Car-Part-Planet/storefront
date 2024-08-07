'use client';

import Price from 'components/price';
import { useProduct } from 'context/product-context';
import { CORE_VARIANT_ID_KEY, CORE_WAIVER, DELIVERY_OPTION_KEY } from 'lib/constants';
import { Money, ProductVariant } from 'lib/shopify/types';
import { getDeliveryOptions } from './delivery';

type PriceSummaryProps = {
  variants: ProductVariant[];
  defaultPrice: Money;
  storePrefix: string | undefined;
};

const PriceSummary = ({ variants, defaultPrice, storePrefix }: PriceSummaryProps) => {
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
    <div className="mb-3 flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <span className="text-xl font-semibold">Our Price</span>
        <Price amount={price} currencyCode={currencyCode} className="text-2xl font-semibold" />
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm text-gray-400">{`Fully Refundable Core Charge ${selectedCoreChargeOption === CORE_WAIVER ? '(Waived for 30 days)' : ''}`}</span>
        {selectedCoreChargeOption === CORE_WAIVER ? (
          <span className="text-sm text-gray-400">{`+$0.00`}</span>
        ) : (
          <Price
            amount={variant?.coreCharge?.amount ?? '0'}
            currencyCode={currencyCode}
            className="text-sm text-gray-400"
            prefix="+"
          />
        )}
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm text-gray-400">{`${shippingLabel} (${selectedDeliveryOption} address)`}</span>
        <Price
          amount={String(deliveryPrice)}
          currencyCode={currencyCode}
          className="text-sm text-gray-400"
          prefix="+"
        />
      </div>
      <hr />
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm text-gray-400">To Pay Today</span>
        <Price
          amount={String(totalPrice)}
          currencyCode={currencyCode}
          className="text-sm text-gray-400"
        />
      </div>
    </div>
  );
};

export default PriceSummary;
