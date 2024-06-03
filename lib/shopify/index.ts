import {
  AVAILABILITY_FILTER_ID,
  HIDDEN_PRODUCT_TAG,
  MAKE_FILTER_ID,
  MODEL_FILTER_ID,
  PRICE_FILTER_ID,
  PRODUCT_METAFIELD_PREFIX,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
  VARIANT_METAFIELD_PREFIX,
  YEAR_FILTER_ID
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith, normalizeUrl, parseMetaFieldValue } from 'lib/utils';
import { revalidatePath, revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getMetaobjectQuery, getMetaobjectsQuery } from './queries/metaobject';
import { getImageQuery, getMetaobjectsByIdsQuery } from './queries/node';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductVariantQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  CartItem,
  CartProductVariant,
  Collection,
  Connection,
  Filter,
  Image,
  Menu,
  Metaobject,
  Money,
  Page,
  PageInfo,
  Product,
  ProductVariant,
  ProductVariantOperation,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyFilter,
  ShopifyImageOperation,
  ShopifyMenuOperation,
  ShopifyMetaobject,
  ShopifyMetaobjectsOperation,
  ShopifyPage,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductVariant,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines).map((lineItem) => ({
      ...lineItem,
      merchandise: {
        ...lineItem.merchandise,
        product: reshapeProduct(lineItem.merchandise.product)
      }
    }))
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeFilters = (filters: ShopifyFilter[]): Filter[] => {
  const reshapedFilters = [];
  const excludedYMMFilters = filters.filter(
    (filter) => ![MODEL_FILTER_ID, MAKE_FILTER_ID, YEAR_FILTER_ID].includes(filter.id)
  );
  for (const filter of excludedYMMFilters) {
    const values = filter.values
      .map((valueItem) => {
        if (filter.id === AVAILABILITY_FILTER_ID) {
          return {
            ...valueItem,
            value: JSON.parse(valueItem.input).available
          };
        }

        if (filter.id === PRICE_FILTER_ID) {
          return {
            ...valueItem,
            value: JSON.parse(valueItem.input)
          };
        }

        if (filter.id.startsWith(PRODUCT_METAFIELD_PREFIX)) {
          return {
            ...valueItem,
            value: JSON.parse(valueItem.input).productMetafield.value
          };
        }

        if (filter.id.startsWith(VARIANT_METAFIELD_PREFIX)) {
          return {
            ...valueItem,
            value: JSON.parse(valueItem.input).variantMetafield.value
          };
        }

        return null;
      })
      .filter(Boolean) as Filter['values'];

    reshapedFilters.push({ ...filter, values });
  }

  return reshapedFilters;
};

const reshapeMetaobjects = (metaobjects: ShopifyMetaobject[]): Metaobject[] => {
  return metaobjects.map(({ fields, id, type }) => {
    const groupedFieldsByKey = fields.reduce(
      (acc, field) => {
        return {
          ...acc,
          [field.key]: field.value
        };
      },
      {} as {
        [key: string]:
          | {
              value: string;
              referenceId: string;
            }
          | string;
      }
    );

    return { id, type, ...groupedFieldsByKey };
  });
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeVariants = (variants: ShopifyProductVariant[]): ProductVariant[] => {
  return variants.map((variant) => ({
    ...variant,
    waiverAvailable: parseMetaFieldValue<boolean>(variant.waiverAvailable),
    coreVariantId: variant.coreVariantId?.value || null,
    coreCharge: parseMetaFieldValue<Money>(variant.coreCharge),
    mileage: variant.mileage?.value ?? null,
    estimatedDelivery: variant.estimatedDelivery?.value || null,
    condition: variant.condition?.value || null
  }));
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;
  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: reshapeVariants(removeEdgesAndNodes(variants))
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  const cart = reshapeCart(res.body.data.cart);

  let extendedCartLines = cart.lines;

  const lineIdMap = {} as { [key: string]: string };
  // get product variants details including core charge variant data
  const productVariantPromises =
    cart?.lines.map((line) => {
      lineIdMap[line.merchandise.id] = line.id;
      return getProductVariant(line?.merchandise.id);
    }) || [];

  if (productVariantPromises.length) {
    const productVariantsById = (await Promise.allSettled(productVariantPromises))
      .filter((result) => result.status === 'fulfilled')
      .reduce(
        (acc, result) => {
          const _result = result as PromiseFulfilledResult<CartProductVariant>;
          return {
            ...acc,
            [_result.value.id]: { ..._result.value, lineId: lineIdMap[_result.value.id] }
          };
        },
        {} as { [key: string]: CartProductVariant & { lineId?: string } }
      );

    // add core charge field to cart line item if any
    extendedCartLines = cart?.lines.reduce((lines, item) => {
      const productVariant = productVariantsById[item.merchandise.id];
      if (productVariant && productVariant.coreVariantId) {
        const coreCharge = productVariantsById[productVariant.coreVariantId];
        return lines.concat([
          {
            ...item,
            coreCharge
          }
        ]);
      }
      return lines;
    }, [] as CartItem[]);
  }

  const totalQuantity = extendedCartLines.reduce((sum, line) => sum + line.quantity, 0);

  return { ...cart, totalQuantity, lines: extendedCartLines };
}

export async function getCollection({
  handle,
  id
}: {
  handle?: string;
  id?: string;
}): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle,
      id
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  filters,
  after
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  filters?: Array<object>;
  after?: string;
}): Promise<{ products: Product[]; filters: Filter[]; pageInfo: PageInfo }> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey,
      filters,
      after
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return {
      products: [],
      filters: [],
      pageInfo: { startCursor: '', hasNextPage: false, endCursor: '' }
    };
  }

  const pageInfo = res.body.data.collection.products.pageInfo;
  return {
    products: reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products)),
    filters: reshapeFilters(res.body.data.collection.products.filters),
    pageInfo
  };
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  const formatMenuItems = (
    menu: { title: string; url: string; items?: { title: string; url: string }[] }[] = []
  ): Menu[] =>
    menu.map((item) => ({
      title: item.title,
      path: normalizeUrl(domain, item.url),
      items: item.items?.length ? formatMenuItems(item.items) : []
    }));

  return formatMenuItems(res.body?.data?.menu?.items);
}

export async function getMetaobjects(type: string) {
  const res = await shopifyFetch<ShopifyMetaobjectsOperation>({
    query: getMetaobjectsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: { type }
  });

  return reshapeMetaobjects(removeEdgesAndNodes(res.body.data.metaobjects));
}

export async function getMetaobjectsByIds(ids: string[]) {
  if (!ids.length) return [];

  const res = await shopifyFetch<{
    data: { nodes: ShopifyMetaobject[] };
    variables: { ids: string[] };
  }>({
    query: getMetaobjectsByIdsQuery,
    variables: { ids }
  });

  return reshapeMetaobjects(res.body.data.nodes);
}

export async function getMetaobjectById(id: string) {
  const res = await shopifyFetch<{
    data: { metaobject: ShopifyMetaobject };
    variables: { id: string };
  }>({
    query: getMetaobjectQuery,
    variables: { id }
  });

  return res.body.data.metaobject ? reshapeMetaobjects([res.body.data.metaobject])[0] : null;
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle, key: 'page_content', namespace: 'custom' },
    tags: [TAGS.pages]
  });

  const page = res.body.data.pageByHandle;

  if (page.metafield) {
    const metaobjectIds = parseMetaFieldValue<string[]>(page.metafield) || [];

    const metaobjects = await getMetaobjectsByIds(metaobjectIds);

    const { metafield, ...restPage } = page;
    return { ...restPage, metaobjects };
  }

  return page;
}

export async function getPages(): Promise<ShopifyPage[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductVariant(id: string) {
  const res = await shopifyFetch<ProductVariantOperation>({
    query: getProductVariantQuery,
    tags: [TAGS.products],
    variables: {
      id
    }
  });

  const variant = res.body.data.node;
  return { ...variant, coreVariantId: variant.coreVariantId?.value || null };
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  after
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  after?: string;
}): Promise<{ products: Product[]; pageInfo: PageInfo }> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
      after
    }
  });
  const pageInfo = res.body.data.products.pageInfo;
  return {
    products: reshapeProducts(removeEdgesAndNodes(res.body.data.products)),
    pageInfo
  };
}
// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  console.log(`Receiving revalidation request from Shopify.`);
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
  const productWebhooks = ['products/create', 'products/delete', 'products/update'];
  const topic = headers().get('x-shopify-topic') || 'unknown';
  console.log(`Receiving revalidation request with topic.`, { topic });

  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);
  const isPageUpdate = topic.startsWith(TAGS.pages);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate && !isPageUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  if (isPageUpdate) {
    const pageHandle = topic.split(':')[1];
    pageHandle && revalidatePath(pageHandle);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export const getImage = async (id: string): Promise<Image> => {
  const res = await shopifyFetch<ShopifyImageOperation>({
    query: getImageQuery,
    variables: { id }
  });

  return res.body.data.node.image;
};
