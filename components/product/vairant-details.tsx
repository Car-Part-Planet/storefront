'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Price from 'components/price';
import { Product, ProductVariant } from 'lib/shopify/types';
import { findVariantWithMinPrice } from 'lib/utils';
import { useSearchParams } from 'next/navigation';

type VariantDetailsProps = {
  product: Product;
};

const VariantDetails = ({ product }: VariantDetailsProps) => {
  const searchParams = useSearchParams();
  const variant = product.variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );

  const variantWithMinPrice = findVariantWithMinPrice(product.variants);

  const price = variant?.price.amount || variantWithMinPrice?.price.amount || 0;
  const currencyCode = variant?.price.currencyCode || 'USD';

  return (
    <div className="mt-1">
      <Price
        amount={String(price)}
        currencyCode={currencyCode}
        className="text-2xl font-semibold"
      />
      <div className="mt-2 flex flex-col items-start justify-start gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
        {variant?.availableForSale ? (
          <div className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircleIcon className="size-5" /> <strong>In Stock</strong>
          </div>
        ) : (
          <span className="text-sm text-red-600">Out of Stock</span>
        )}
        <span className="hidden text-sm sm:inline">|</span>
        <p className="text-sm">
          <strong>SKU:</strong> {variant?.sku || 'N/A'}
        </p>
        <span className="hidden text-sm sm:inline">|</span>
        <p className="text-sm">
          <strong>Condition:</strong> {variant?.condition || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default VariantDetails;
