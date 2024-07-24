/* eslint-disable @next/next/no-img-element */
import { ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Price from 'components/price';
import { CONDITIONS } from 'lib/constants';
import { Product, ProductVariant } from 'lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';

const PriceSection = ({ variants }: { variants: ProductVariant[] }) => {
  // Filter out variants that are not available for sale
  const availableVariants = variants.filter((variant) => variant.availableForSale);

  const usedVariants = availableVariants.filter((variant) => variant.condition === CONDITIONS.Used);

  const minUsedVariantPrice = usedVariants.length
    ? usedVariants.reduce(
        (min, variant) => Math.min(min, Number(variant.price.amount)),
        Number(usedVariants[0]?.price.amount)
      )
    : null;

  const remanVariants = availableVariants.filter(
    (variant) => variant.condition === CONDITIONS.Remanufactured
  );

  const minRemanufacturedPrice = remanVariants.length
    ? remanVariants.reduce(
        (min, variant) => Math.min(min, Number(variant.price.amount)),
        Number(remanVariants[0]?.price.amount)
      )
    : null;

  const currencyCode = variants[0]?.price.currencyCode || 'USD';

  return (
    <div className="flex w-full flex-col gap-1">
      {typeof minUsedVariantPrice === 'number' && (
        <div className="flex flex-col items-center justify-between md:flex-row">
          <span className="text-sm">{CONDITIONS.Used}</span>
          <Price amount={String(minUsedVariantPrice)} currencyCode={currencyCode} />
        </div>
      )}
      {typeof minRemanufacturedPrice === 'number' && (
        <div className="flex flex-col items-center justify-between md:flex-row">
          <span className="text-sm">{CONDITIONS.Remanufactured}</span>
          <Price amount={String(minRemanufacturedPrice)} currencyCode={currencyCode} />
        </div>
      )}
    </div>
  );
};

export function GridTileImage({
  active,
  product,
  href,
  ...props
}: {
  active?: boolean;
  product: Product;
  href: string;
} & React.ComponentProps<typeof Image>) {
  const metafieldKeys = ['engineCylinders', 'fuelType'] as Partial<keyof Product>[];
  const shouldShowDescription = metafieldKeys.some((key) => product[key]);
  const variantsWithCondition = product.variants.filter((variant) => variant.condition !== null);
  return (
    <Link href={href}>
      <div className="flex h-full flex-col rounded-b border bg-white">
        <div className="grow">
          <div className="px-4">
            <div
              className={clsx('aspect-h-1 aspect-w-1 relative overflow-hidden', {
                'border-2 border-secondary': active,
                'border-neutral-200': !active
              })}
            >
              {props.src ? (
                // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
                <Image className={clsx('h-full w-full object-contain object-center')} {...props} />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-gray-400"
                  title="Missing product image"
                >
                  <PhotoIcon className="size-7" />
                </div>
              )}
            </div>
          </div>
          <p className="mb-2 mt-4 line-clamp-3 px-4 text-sm font-semibold leading-6 text-gray-800">
            {product.title}
          </p>
        </div>
        <div className="px-4">
          {shouldShowDescription && (
            <div className="flex items-center justify-center gap-x-7 border-t py-3">
              {product.engineCylinders?.length ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/icons/cylinder.png"
                    alt="Cylinder icon"
                    width={16}
                    height={16}
                    className="size-4"
                    sizes="16px"
                  />
                  <span className="text-xs tracking-wide">{`${product.engineCylinders[0]} Cylinder`}</span>
                </div>
              ) : null}
              {product.fuelType ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/icons/fuel.png"
                    alt="Fuel icon"
                    width={16}
                    height={16}
                    className="size-4"
                    sizes="16px"
                  />
                  <span className="text-xs tracking-wide">{product.fuelType}</span>
                </div>
              ) : null}
            </div>
          )}
          <div className="flex justify-end border-t py-3">
            {variantsWithCondition.length ? (
              <PriceSection variants={variantsWithCondition} />
            ) : (
              <Price
                className="text-lg font-medium text-gray-900"
                amount={product.priceRange.minVariantPrice.amount}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-b bg-dark py-3 text-white">
          <span className="text-sm font-medium tracking-wide">More details</span>
          <ArrowRightIcon className="size-4" />
        </div>
      </div>
    </Link>
  );
}

export const TileImage = ({
  active,
  ...props
}: {
  active?: boolean;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div
      className={clsx(
        'aspect-h-1 aspect-w-1 relative h-[80px] w-[80px] overflow-hidden rounded  border bg-white',
        {
          'border-2 border-secondary': active,
          'border-neutral-200': !active
        }
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <img className="h-full w-full object-contain object-center" loading="lazy" {...props} />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-gray-400"
          title="Missing product image"
        >
          <PhotoIcon className="size-7" />
        </div>
      )}
    </div>
  );
};
