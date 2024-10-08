import imageFragment from './image';
import seoFragment from './seo';

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    productType
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 1) {
      nodes {
        title
        handle
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          barcode
          sku
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          coreCharge: metafield(namespace: "custom", key: "core_charge") {
            value
          }
          waiverAvailable: metafield(namespace: "custom", key: "waiver_available") {
            value
          }
          coreVariantId: metafield(namespace: "custom", key: "corevariant") {
            value
          }
          estimatedDelivery: metafield(namespace: "custom", key: "delivery") {
            value
          }
          mileage: metafield(namespace: "custom", key: "mileage") {
            value
          }
          supplier: metafield(namespace: "custom", key: "supplier") {
            value
          }
          warranty_years: metafield(namespace: "custom", key: "warranty_years") {
            value
          }
          condition: metafield(namespace: "custom", key: "condition") {
            value
          }
          addOnQuantity: metafield(namespace: "custom", key: "add_on_quantity") {
            value
          }
          addOnProductId: metafield(namespace: "custom", key: "add_on") {
            value
          }
          partAttributes: metafield(namespace: "custom", key: "part_attributes") {
            value
          }
          remanufacturingUpdates: metafield(namespace: "custom", key: "remanufacturing_updates") {
            value
          }
          installationManual: metafield(namespace: "custom", key: "installation_manual") {
            value
          }
          includes: metafield(namespace: "custom", key: "includes") {
            value
          }
          applicationSummary: metafield(namespace: "custom", key: "application_summary") {
            value
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    engineCylinders: metafield(namespace: "custom", key: "engine_cylinders") {
      value
    }
    fuelType: metafield(namespace: "custom", key: "fuel") {
      value
    }
    transmissionType: metafield(namespace: "custom", key: "transmission_type") {
      value
    }
    transmissionSpeeds: metafield(namespace: "custom", key: "transmission_speeds") {
      value
    }
    driveType: metafield(namespace: "custom", key: "drive_type") {
      value
    }
    transmissionCode: metafield(namespace: "custom", key: "transmission_code") {
      value
    }
    transmissionTag: metafield(namespace: "custom", key: "transmission_tag") {
      value
    }
    makes: metafield(namespace: "custom", key: "make_composite") {
      value
    }
    models: metafield(namespace: "custom", key: "make_model_composite") {
      value
    }
    years: metafield(namespace: "custom", key: "make_model_year_composite") {
      value
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
