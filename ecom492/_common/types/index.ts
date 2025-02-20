import { z } from "zod";

export type item_data = {
  item_name: string;
  item_description: string;
  item_attributes: {
    [key: string]: string;
  };
  dimension_unit: string;
  length: number;
  width: number;
  height: number;
  weight_unit: string;
  item_weight: number;
  item_quantity: number;
  average_rating: number;
  units_sold: number;
  user_id: string;
  item_discount: number;
  item_price: number;
  item_image: string[];
};

export interface ProductCardProps {
  _id: string;
  item_name: string;
  item_image: string[];
  average_rating: number;
  item_price: number;
  item_quantity: number;
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
  item_name: string;
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
  item_name: string;
  item_price: number;
  category: string[];
  item_quantity: number;
  average_rating: number;
}