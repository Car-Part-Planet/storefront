import { AddToCart } from 'components/cart/add-to-cart';
import PhoneBlock from 'components/phone-block';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import CoreCharge from './core-charge';
import CoreDialogContent from './core-dialog-content';
import Delivery from './delivery';
import PriceSummary from './price-summary';
import Warranty from './warranty';

const { SITE_NAME, STORE_PREFIX } = process.env;

const ProductActions = ({ product }: { product: Product }) => {
  return (
    <div className="flex flex-col space-y-5 divide-y rounded-lg p-5 shadow-md">
      <CoreCharge>
        <CoreDialogContent />
      </CoreCharge>
      <Warranty product={product} siteName={SITE_NAME} storePrefix={STORE_PREFIX!} />
      <Delivery storePrefix={STORE_PREFIX} siteName={SITE_NAME} phoneBlock={<PhoneBlock />} />

      <PriceSummary defaultPrice={product.priceRange.minVariantPrice} storePrefix={STORE_PREFIX} />
      <Suspense fallback={null}>
        <AddToCart availableForSale={product.availableForSale} productName={product.title} />
      </Suspense>
    </div>
  );
};

export default ProductActions;
