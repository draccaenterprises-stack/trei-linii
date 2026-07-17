export const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  tags
  featuredImage {
    url(transform: { maxWidth: 1200, preferredContentType: WEBP })
    altText
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  collections(first: 3) {
    nodes {
      handle
      title
    }
  }
  images(first: 10) {
    nodes {
      url(transform: { maxWidth: 1200, preferredContentType: WEBP })
      altText
    }
  }
  variants(first: 100) {
    nodes {
      id
      title
      availableForSale
      quantityAvailable
      selectedOptions {
        name
        value
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

export const PRODUCTS_QUERY = `
  query Products {
    products(first: 50) {
      nodes {
        ${PRODUCT_FIELDS}
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections {
    collections(first: 20) {
      nodes {
        handle
        title
        description
        image {
          url(transform: { maxWidth: 1200, preferredContentType: WEBP })
          altText
        }
        products(first: 100) {
          nodes {
            id
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        message
      }
    }
  }
`;
