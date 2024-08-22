import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BreadcrumbComponent from 'components/breadcrumb';
import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import ProductActions from 'components/product/actions';
import AdditionalInformation from 'components/product/additional-information';
import { Gallery } from 'components/product/gallery';
import InstallationManual from 'components/product/installation-manual';
import PartAttributes from 'components/product/part-attributes';
import { ProductDescription } from 'components/product/product-description';
import ProductSchema from 'components/product/ProductSchema';
import RemanufacturingUpdates from 'components/product/remanufacturing-updates';
import VehicleCompatibility from 'components/product/vehicle-compatibility';
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
    <>
      <ProductProvider product={product}>
        <ProductSchema product={product} />
        <div className="mx-auto mt-4 max-w-screen-2xl px-8 xl:px-4">
          <div className="hidden lg:block">
            <BreadcrumbComponent type="product" handle={product.handle} />
          </div>
          <div className="my-3 flex flex-col space-x-0 md:flex-row lg:gap-8 lg:space-x-3">
            <div className="flex basis-full flex-col md:basis-8/12 xl:basis-9/12">
              <div className="hidden xl:flex">
                <div className="hidden xl:mr-8 xl:block xl:basis-1/3">
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
                <div className="basis-2/3">
                  <ProductDescription product={product} />
                </div>
              </div>

              <div className="block xl:hidden">
                <ProductDescription product={product} />
              </div>

              <div className="hidden xl:block">
                <Suspense>
                  <VehicleCompatibility product={product} />
                </Suspense>
                <PartAttributes />
                <RemanufacturingUpdates />
              </div>

              <div className="content-visibility-auto contain-intrinsic-size-[auto_300px]">
                <Suspense>
                  <InstallationManual product={product} searchParams={searchParams} />
                </Suspense>
              </div>

              <Suspense>
                <AdditionalInformation product={product} searchParams={searchParams} />
              </Suspense>
            </div>
            <div className="hidden md:block md:basis-4/12 xl:basis-3/12">
              <ProductActions product={product} />
            </div>
          </div>

          <Suspense>
            <RelatedProducts id={product.id} />
          </Suspense>
        </div>
        <Footer />
      </ProductProvider>
    </>
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
