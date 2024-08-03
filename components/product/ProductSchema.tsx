import { Product } from 'lib/shopify/types';
import { SearchParams } from 'lib/types';

const { STORE_PREFIX, SITE_NAME } = process.env;

const ProductSchema = ({
  product,
  searchParams
}: {
  product: Product;
  searchParams?: SearchParams;
}) => {
  const shippingPrice = STORE_PREFIX === 'reman-transmission' ? '299.00' : '0.00';
  const variant = product.variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams?.[option.name.toLowerCase()]
    )
  );

  const additionalProperties: Array<{
    title: string;
    key: keyof Product;
    value: string | undefined;
  }> = [
    {
      key: 'transmissionType',
      title: 'Transmission Type',
      value: product.transmissionType?.toString()
    },
    {
      key: 'transmissionSpeeds',
      title: 'Number of Speeds',
      value: `${product.transmissionSpeeds?.[0]}-Speed`
    },
    { key: 'driveType', title: 'Drivetrain', value: product.driveType?.[0] },
    {
      key: 'engineCylinders',
      title: 'Number of Cylinders',
      value: `${product.engineCylinders?.[0]} Cylinders`
    },
    { key: 'transmissionCode', title: 'Transmission Code', value: product.transmissionCode?.[0] }
  ];

  const validProperties = additionalProperties.filter((property) => product[property.key]);
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.seo.description,
    image: product.featuredImage?.url,
    sku: variant?.sku?.substring(0, 6),
    additionalProperty: validProperties.map((prop) => ({
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
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productJsonLd)
      }}
    />
  );
};

export default ProductSchema;
