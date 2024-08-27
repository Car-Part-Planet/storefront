'use client';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { Button } from 'components/ui';
import { useProduct } from 'context/product-context';
import { CORE_VARIANT_ID_KEY, CORE_WAIVER, DELIVERY_OPTION_KEY } from 'lib/constants';
import { Money, Product } from 'lib/shopify/types';
import { Suspense, useEffect, useRef, useState } from 'react';
import { getDeliveryOptions } from './delivery';
import DuePrice from './due-price';
import FixedBuySection from './fixed-buy-section';

type PriceSummaryProps = {
  defaultPrice: Money;
  storePrefix: string | undefined;
  product: Product;
};

const PriceSummary = ({ defaultPrice, storePrefix, product }: PriceSummaryProps) => {
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

  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(!!entry?.isIntersecting);
    });

    const element = containerRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleClickOptions = () => {
    containerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <>
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
        <DuePrice
          ref={containerRef}
          direction="horizontal"
          price={String(totalPrice)}
          currencyCode={currencyCode}
        />
      </div>
      <FixedBuySection>
        <DuePrice price={String(totalPrice)} currencyCode={currencyCode} direction="vertical" />
        {isVisible ? (
          <Suspense fallback={null}>
            <AddToCart availableForSale={product.availableForSale} productName={product.title} />
          </Suspense>
        ) : (
          <Button
            variant="solid"
            color="primary"
            className="px-3 py-2 font-normal tracking-wide"
            onClick={handleClickOptions}
            size="lg"
          >
            Select Options
          </Button>
        )}
      </FixedBuySection>
    </>
  );
};

export default PriceSummary;
