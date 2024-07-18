import customerAddress from './customer-address';
import orderCard from './order';

const customerDetailsFragment = /* GraphQL */ `
  ${customerAddress}
  ${orderCard}

  fragment CustomerDetails on Customer {
    firstName
    lastName
    phoneNumber {
      phoneNumber
    }
    emailAddress {
      emailAddress
    }
    defaultAddress {
      ...CustomerAddress
    }
    addresses(first: 6) {
      edges {
        node {
          ...CustomerAddress
        }
      }
    }
    orders(first: 30, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          ...OrderCard
        }
      }
    }
  }
`;
export default customerDetailsFragment;
