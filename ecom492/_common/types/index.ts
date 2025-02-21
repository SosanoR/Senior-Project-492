export type data = {
  name: string;
  description: string;
  quantity: number;
  average_rating: number;
  units_sold: number;
  user_id: string;
  discount: number;
  price: number;
  images: string[];
  brand: string;
};

export interface ProductCardProps {
  _id: string;
  name: string;
  images: string[];
  average_rating: number;
  price: number;
  quantity: number;
}

export type user_data = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

export interface suggestionsProps {
  _id: string;
  name: string;
}

export interface userProductQuery {
  query: string;
  limit?: number;
  page: number;
  categories?: string;
  user_id?: string;
}

export interface userProductData {
  _id: string;
  name: string;
  price: number;
  categories: string[];
  quantity: number;
  average_rating: number;
}
