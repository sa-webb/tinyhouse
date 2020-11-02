import { Booking, Listing } from "../../../lib/types";

export interface ListingArgs {
  id: string;
}
export interface ListingsArgs {
  location: string | null;
  filter: ListingsFilter;
  limit: number;
  page: number;
}
export interface ListingsData {
  total: number;
  result: Listing[];
  region: string | null; 
}

export enum ListingsFilter {
  PRICE_LOW_TO_HIGH = "PRICE_LOW_TO_HIGH",
  PRICE_HIGH_TO_LOW = "PRICE_HIGH_TO_LOW",
}

export interface ListingsQuery {
  country?: string
  admin?: string
  city?: string
}
export interface ListingBookingsArgs {
  limit: number;
  page: number;
}

export interface ListingBookingsData {
  total: number;
  result: Booking[];
}
