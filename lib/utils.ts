import clsx, { ClassValue } from 'clsx';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Menu, Product, ProductVariant } from './shopify/types';

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}
export const focusInput = [
  // base
  'focus:ring-2 focus:ring-offset-4'
];

export const hasErrorInput = [
  // base
  'ring-2',
  // border color
  'border-red-500 dark:border-red-700',
  // ring color
  'ring-red-200 dark:ring-red-700/30'
];

export const focusRing = [
  // base
  'outline outline-offset-2 outline-0 focus-visible:outline-2',
  // outline color
  'outline-blue-500 dark:outline-blue-500'
];

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'STORE_PREFIX',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
    'SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID',
    'SHOPIFY_CUSTOMER_ACCOUNT_API_URL',
    'SHOPIFY_ORIGIN_URL',
    'SHOPIFY_ADMIN_API_ACCESS_TOKEN'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeUrl(url: string) {
  const cleanUrl = new URL(url).pathname;

  if (cleanUrl.startsWith('/collections')) {
    return getCollectionUrl(cleanUrl.replace('/collections', ''), false);
  }

  return cleanUrl.replace('/pages', '');
}

export const parseMetaFieldValue = <T>(field: { value: string } | null): T | null => {
  try {
    return field?.value ? JSON.parse(field.value) : null;
  } catch (error) {
    return null;
  }
};

export const findParentCollection = (menu: Menu[], collection: string): Menu | null => {
  let parentCollection: Menu | null = null;
  for (const item of menu) {
    if (item.items.length) {
      const hasParent = item.items.some((subItem) =>
        subItem.path.includes(getCollectionUrl(collection))
      );
      if (hasParent) {
        return item;
      } else {
        parentCollection = findParentCollection(item.items, collection);
      }
    }
  }
  return parentCollection;
};

export function parseJSON(json: any) {
  if (String(json).includes('__proto__')) return JSON.parse(json, noproto);
  return JSON.parse(json);
}

function noproto(k: string, v: string) {
  if (k !== '__proto__') return v;
}

export function toPrintDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export const isBeforeToday = (date?: string | null) => {
  if (!date) return false;
  const today = new Date();
  const compareDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate <= today;
};

export const getCollectionUrl = (handle: string, includeSlashPrefix = true) => {
  const rewriteUrl = handle.split('_').filter(Boolean).join('/').toLowerCase();

  return includeSlashPrefix ? `/${rewriteUrl}` : rewriteUrl;
};

export const getSelectedProductVariant = ({
  product,
  searchParams
}: {
  product: Product;
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const variant = product.variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams?.[option.name.toLowerCase()]
    )
  );

  return variant || product.variants[0];
};

export const findVariantWithMinPrice = (variants: ProductVariant[]) => {
  const availableVariants = variants.filter(
    (variant) => variant.availableForSale && variant.condition !== 'Used'
  );

  if (!availableVariants.length) return null;

  return availableVariants.reduce((min, variant) => {
    if (Number(variant.price.amount) < Number(min.price.amount)) {
      min = variant;
    }
    return min;
  }, availableVariants[0]!);
};

export const toShopifyId = (id: string) => `gid://shopify/Metaobject/${id}`;

export function formatNumber(value: number) {
  // Use the toLocaleString method to add suffixes to the number
  return value.toLocaleString('en-US', {
    // add suffixes for thousands, millions, and billions
    // the maximum number of decimal places to use
    maximumFractionDigits: 2,
    // specify the abbreviations to use for the suffixes
    notation: 'compact',
    compactDisplay: 'short'
  });
}

export function isValidShopifyCdnUrl(url: string) {
  const shopifyCdnPattern =
    /^https:\/\/cdn\.shopify\.com\/s\/files\/\d+\/\d+\/\d+\/\d+\/(?:files|products)\/[a-zA-Z0-9-_]+\.(jpg|jpeg|png|gif|webp)(\?v=\d+)?$/;

  try {
    const parsedUrl = new URL(url);
    return shopifyCdnPattern.test(parsedUrl.href);
  } catch (error) {
    return false; // Invalid URL format
  }
}

const maliciousPattern = /('|sleep|select|union|\*|script|drop|--)/i; // Simple example to exclude malicious patterns

export function isSafeUrl(url: string) {
  return !maliciousPattern.test(url);
}
