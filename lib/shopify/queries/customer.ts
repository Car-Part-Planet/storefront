//https://shopify.dev/docs/api/customer/2024-01/queries/customer
export const getCustomerQuery = /* GraphQL */ `
  query customer {
    customer {
      emailAddress {
        emailAddress
      }
      firstName
      lastName
      tags
    }
  }
`;
