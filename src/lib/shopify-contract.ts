export type ShopifyGraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText?: string | null;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string | null;
  availableForSale: boolean;
  totalInventory?: number | null;
  tags: string[];
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  collections: {
    nodes: Array<{
      handle: string;
      title: string;
    }>;
  };
  images: {
    nodes: ShopifyImage[];
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      selectedOptions: ShopifySelectedOption[];
      price: ShopifyMoney;
    }>;
  };
};

export type ShopifyCollectionNode = {
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    nodes: Array<{ id: string }>;
  };
};

export type ShopifyCartResult = {
  id: string;
  checkoutUrl: string;
};

export type ShopifyCartPayload = {
  cart: ShopifyCartResult | null;
  userErrors: Array<{ message: string }>;
};

export type ShopifyCartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type ShopifyCartLineUpdateInput = ShopifyCartLineInput & {
  id: string;
};
