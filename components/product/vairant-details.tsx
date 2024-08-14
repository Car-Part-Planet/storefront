'use client';

import Price from 'components/price';
import { useProduct } from 'context/product-context';
import { Product } from 'lib/shopify/types';
import { findVariantWithMinPrice } from 'lib/utils';
import { VariantSelector } from './variant-selector';

type VariantDetailsProps = {
  product: Product;
};

const VariantDetails = ({ product }: VariantDetailsProps) => {
  const { variant } = useProduct();

  const variantWithMinPrice = findVariantWithMinPrice(product.variants);

  const price = variant?.price.amount || variantWithMinPrice?.price.amount || 0;
  const currencyCode = variant?.price.currencyCode || 'USD';

  return (
    <div className="mt-1">
      <Price
        amount={String(price)}
        currencyCode={currencyCode}
        className="text-2xl font-semibold text-emerald-500 md:text-4xl"
      />
      <VariantSelector
        options={product.options}
        variants={product.variants}
        minPrice={product.priceRange.minVariantPrice}
      />
    </div>
  );
};

export default VariantDetails;
