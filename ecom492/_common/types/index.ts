import type { ObjectId } from "mongodb";

export type data = {
  _id: string | ObjectId;
  name: string;
  description: string;
  quantity: number;
  average_rating: number;
  units_sold: number;
  user_id: string;
  discount: number;
  price: string;
  images: string[];
  category: string;
  brand: string;
};

export type insertionData = {
  name: string;
  description: string;
  quantity: number;
  average_rating: number;
  units_sold: number;
  user_id: string;
  discount: number;
  price: string;
  images: string[];
  category: string;
  brand: string;
};

export interface ProductCardProps {
  _id: string;
  name: string;
  images: string[];
  average_rating: number;
  price: string;
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
  category?: string;
  user_id?: string;
}

export interface userProductData {
  _id: string;
  name: string;
  price: string;
  category: string;
  quantity: number;
  average_rating: number;
}
