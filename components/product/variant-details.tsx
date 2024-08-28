'use client';

import Price from 'components/price';
import { useProduct, useUpdateURL } from 'context/product-context';
import { Product } from 'lib/shopify/types';
import { findVariantWithMinPrice, formatNumber } from 'lib/utils';
import { useEffect, useMemo, useTransition } from 'react';
import EmptyVariant from './empty-variants';
import { Combination, VariantSelector } from './variant-selector';

type VariantDetailsProps = {
  product: Product;
};

const VariantDetails = ({ product }: VariantDetailsProps) => {
  const { variant, state, updateOptions } = useProduct();

  const variantWithMinPrice = findVariantWithMinPrice(product.variants);
  const updateURL = useUpdateURL();
  const [, startTransition] = useTransition();

  const price = variant?.price.amount || variantWithMinPrice?.price.amount || 0;
  const currencyCode = variant?.price.currencyCode || 'USD';
  const variants = product.variants;

  const combinations: Combination[] = useMemo(
    () =>
      variants.map((variant) => ({
        id: variant.id,
        availableForSale: variant.availableForSale,
        ...variant.selectedOptions.reduce(
          (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
          {}
        )
      })),
    [variants]
  );

  // If a variant is not selected, we want to select the first available for sale variant as default
  useEffect(() => {
    const hasSelectedVariant = Object.entries(state).some(([key, value]) => {
      return combinations.some((combination) => combination[key] === value);
    });

    if (!hasSelectedVariant) {
      const defaultVariant =
        variantWithMinPrice || variants.find((variant) => variant.availableForSale);
      if (defaultVariant) {
        startTransition(() => {
          const newState = updateOptions(
            defaultVariant.selectedOptions.map((option) => ({
              name: option.name.toLowerCase(),
              value: option.value
            }))
          );

          updateURL(newState);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantWithMinPrice, variants, combinations]);

  return (
    <div className="mt-1">
      <Price
        amount={String(price)}
        currencyCode={currencyCode}
        className="text-2xl font-semibold text-emerald-500"
      />
      <div className="mt-2 flex flex-wrap items-center justify-start gap-2">
        <p className="text-sm">
          <strong>SKU:</strong> {variant?.sku || 'N/A'}
        </p>
        <span className="text-sm">|</span>
        <p className="text-sm">
          <strong>Condition:</strong> {variant?.condition || 'N/A'}
        </p>
        <span className="text-sm">|</span>
        <p className="text-sm">
          <strong>Mileage:</strong>{' '}
          {variant?.mileage ? formatNumber(Number(variant.mileage)) : '0 miles'}
        </p>
        {!variant?.availableForSale ? (
          <>
            <span className="text-sm">|</span>
            <span className="text-sm text-red-600">Out of Stock</span>
          </>
        ) : null}
      </div>
      <div className="mb-5 mt-3 flex flex-wrap items-center gap-3">
        {/* <VariantSelector
          options={product.options}
          variants={product.variants.filter((v) => v.condition === 'Used')}
          minPrice={product.priceRange.minVariantPrice}
          condition="used"
          combinations={combinations}
        /> */}
        <EmptyVariant condition="used" />
        <VariantSelector
          options={product.options}
          variants={product.variants.filter((v) => v.condition === 'Remanufactured')}
          minPrice={product.priceRange.minVariantPrice}
          condition="remanufactured"
          combinations={combinations}
        />
      </div>
    </div>
  );
};

export default VariantDetails;
