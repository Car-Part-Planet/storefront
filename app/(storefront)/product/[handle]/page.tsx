import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BreadcrumbComponent from 'components/breadcrumb';
import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import AdditionalInformation from 'components/product/additional-information';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { Image, Product } from 'lib/shopify/types';

const { SITE_NAME, STORE_PREFIX } = process.env

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata>
{
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
})
{
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const shippingPrice = STORE_PREFIX === 'reman-transmission' ? '299.00' : '0.00';
  const variant = product.variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams?.[option.name.toLowerCase()]
    )
  );

  const additionalProperties: Array<{ title: string, key: keyof Product, value: string | undefined }> = [
    { key: 'transmissionType', title: 'Transmission Type', value: product.transmissionType?.toString() },
    { key: 'transmissionSpeeds', title: 'Number of Speeds', value: `${product.transmissionSpeeds?.[0]}-Speed` },
    { key: 'driveType', title: 'Drivetrain', value: product.driveType?.[0] },
    { key: 'engineCylinders', title: 'Number of Cylinders', value: `${product.engineCylinders?.[0]} Cylinders` },
    { key: 'transmissionCode', title: 'Transmission Code', value: product.transmissionCode?.[0] }
  ];

  const validProperties = additionalProperties.filter((property) => product[property.key])
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.seo.description,
    image: product.featuredImage?.url,
    sku: variant?.sku?.substring(0, 6),
    additionalProperty: validProperties.map(prop => ({
      '@type': 'PropertyValue',
      name: prop.title,
      value: prop.value
    })),
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
      itemCondition: 'https://schema.org/RefurbishedCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME
      },
      url: `${process.env.SHOPIFY_ORIGIN_URL}/product/${product.handle}`,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: shippingPrice
        }
      },
      warranty: {
        '@type': 'WarrantyPromise',
        durationOfWarranty: {
          '@type': 'QuantitativeValue',
          value: variant?.warranty_years || '3',
          unitCode: 'ANN'
        },
        warrantyScope: 'https://schema.org/PartsAndLaborWarrantyScope'
      }
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
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
    </>
  );
}

async function RelatedProducts({ id }: { id: string })
{
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
