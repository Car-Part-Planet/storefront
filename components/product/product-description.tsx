import Prose from 'components/prose';
import { Image, Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import ProductActions from './actions';
import { Gallery } from './gallery';
import PartAttributes from './part-attributes';
import ProductDetails from './product-details';
import RemanufacturingUpdates from './remanufacturing-updates';
import SpecialOffer from './special-offer';
import VariantDetails from './variant-details';
import VehicleCompatibility from './vehicle-compatibility';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="w-auto max-w-full overflow-hidden">
        <h1 className="break-words text-xl font-semibold md:text-2xl">{product.title}</h1>
      </div>

      <VariantDetails product={product} />
      <div className="block xl:hidden">
        <Suspense
          fallback={
            <div className="aspect-square relative h-full max-h-[300px] w-full overflow-hidden" />
          }
        >
          <Gallery
            images={product.images.slice(0, 5).map((image: Image) => ({
              src: image.url,
              altText: image.altText
            }))}
          />
        </Suspense>
        <Suspense>
          <div className="mt-6">
            <VehicleCompatibility product={product} />
          </div>
        </Suspense>
        <PartAttributes />
        <RemanufacturingUpdates />
      </div>

      <div className="mt-6 block md:hidden">
        <ProductActions product={product} />
      </div>
      <SpecialOffer />
      {product.descriptionHtml ? (
        <Prose
          className="mb-4 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}

      <ProductDetails product={product} />
    </>
  );
}
