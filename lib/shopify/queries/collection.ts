import productFragment from '../fragments/product';
import seoFragment from '../fragments/seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    helpfulLinks: metafield(namespace: "custom", key: "helpful_links") {
      value
    }
    helpfulLinksTop: metafield(namespace: "custom", key: "helpful_links_top") {
      value
    }
    dynamicContent: metafield(namespace: "custom", key: "plp_content") {
      value
    }
    plpType: metafield(namespace: "custom", key: "plp_type") {
      value
    }
    lhnLinks: metafield(namespace: "custom", key: "lhn_links") {
      value
    }
    engineSizeLinks: metafield(namespace: "custom", key: "engine_size_links") {
      value
    }
    transmissionCodeLinks: metafield(namespace: "custom", key: "transmission_code_links") {
      value
    }
    updatedAt
  }
  ${seoFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String, $id: ID) {
    collection(handle: $handle, id: $id) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $after: String
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, filters: $filters, reverse: $reverse, first: 20, after: $after) {
        edges {
          node {
            ...product
          }
        }
        filters {
          id
          label
          type
          values {
            id
            count
            input
            label
          }
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductFiltersQuery = /* GraphQL */ `
  query getProductFilters($handle: String!, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      products(first: 1, filters: $filters) {
        filters {
          id
          label
          type
          values {
            id
            input
            label
          }
        }
      }
    }
  }
`;
