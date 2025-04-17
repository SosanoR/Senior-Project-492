import type { ObjectId } from "mongodb";

export type data = {
  _id: string | ObjectId;
  name: string;
  description: string;
  quantity: number;
  average_rating: number;
  reviewer_count: number;
  units_sold: number;
  user_id: string;
  discount: number;
  price: number;
  images: string[];
  category: string;
  brand: string;
  created_on: Date;
  last_modified: Date;
};

export type insertionData = {
  name: string;
  description: string;
  quantity: number;
  average_rating: number;
  reviewer_count: number;
  units_sold: number;
  user_id: string;
  discount: number;
  price: number;
  images: string[];
  category: string;
  brand: string;
  created_on: Date;
  last_modified: Date;
};

export interface ProductCardProps {
  _id: string | ObjectId;
  name: string;
  images: string[];
  average_rating: number;
  price: number;
  quantity: number;
}

export interface ProductResultsCardProps extends ProductCardProps {
  category: string;
  brand: string;
}

export type user_data = {
  _id: string | ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  last_viewed: string[];
};

export interface suggestionsProps {
  _id: string | ObjectId;
  name: string;
}

export interface userProductQuery {
  query?: string;
  limit?: number;
  page: number;
  user_id: string;
}

export interface productQuery {
  query: string;
  limit: number;
  page: number;
  category?: string;
}

export interface productFilterQuery extends productQuery {
  brand?: string;
  sort?: string;
  rating?: string;
  min?: string;
  max?: string;
}

export interface userProductData {
  _id: string | ObjectId;
  name: string;
  price: number;
  category: string;
  quantity?: number;
  average_rating: number;
}

export interface userReviews {
  _id: string;
  user_id: string;
  user_name: string;
  product_id: string;
  text: string;
  rating: number;
  created_on: Date;
  last_modified: Date;
}

export interface userProjectedReviews {
  _id: string
  user_id: string
  user_name: string;
  product_id: string
  text: string;
  rating: number;
}

export interface cartItem {
  _id?: string | ObjectId;
  product_id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  average_rating: number;
  cart_id?: string;
  createdAt?: Date;
}

export interface cart {
  _id: string | ObjectId;
  user_id?: string | null | ObjectId;
  items: cartItem[];
  total_price: number;
  cart_id: string;
  created_on?: Date;
  last_modified?: Date;
}