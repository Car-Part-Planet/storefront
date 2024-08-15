import Prose from 'components/prose';
import { Image, Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import ProductActions from './actions';
import { Gallery } from './gallery';
import ProductDetails from './product-details';
import SpecialOffer from './special-offer';
import VariantDetails from './vairant-details';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold md:text-2xl">{product.title}</h1>

        <VariantDetails product={product} />
      </div>
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
      </div>
      <SpecialOffer />

      <div className="mt-6 block md:hidden">
        <ProductActions product={product} />
      </div>
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
