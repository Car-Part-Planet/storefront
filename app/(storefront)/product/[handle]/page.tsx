import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BreadcrumbComponent from 'components/breadcrumb';
import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import AdditionalInformation from 'components/product/additional-information';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import ProductSchema from 'components/product/ProductSchema';
import { ProductProvider } from 'context/product-context';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { Image } from 'lib/shopify/types';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({
  params,
  searchParams
}: {
  params: { handle: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  return (
    <div className="xl:px-2">
      <ProductProvider product={product}>
        <ProductSchema product={product} />
        <div className="mx-auto mt-4 max-w-screen-2xl px-8 xl:px-4">
          <div className="hidden lg:block">
            <BreadcrumbComponent type="product" handle={product.handle} />
          </div>
          <div className="my-3 flex flex-col space-x-0 lg:flex-row lg:gap-8 lg:space-x-3">
            <div className="h-full w-full basis-full lg:basis-7/12">
              <ProductDescription product={product} />
              <Suspense>
                <AdditionalInformation product={product} searchParams={searchParams} />
              </Suspense>
            </div>

            <div className="hidden lg:block lg:basis-5/12">
              <Suspense
                fallback={
                  <div className="aspect-square relative h-full max-h-[550px] w-full overflow-hidden" />
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
          </div>
          <Suspense>
            <RelatedProducts id={product.id} />
          </Suspense>
        </div>
        <Footer />
      </ProductProvider>
    </div>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <GridTileImage
              alt={product.title}
              product={product}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              href={`/product/${product.handle}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
