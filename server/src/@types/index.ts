import { Collection, ObjectId } from "mongodb";

export interface BookingsIndexMonth {
  [key: string]: boolean;
}
export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
  // KV index signature key - is a string and value - is another interface
  [key: string]: BookingsIndexYear;
}

export interface Booking {
  _id: ObjectId;
  listing: ObjectId;
  tenant: string;
  checkIn: string;
  checkOut: string;
}

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
}
export interface Listing {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  host: string;
  type: ListingType;
  address: string;
  country: string;
  admin: string;
  city: string;
  bookings: ObjectId[];
  bookingsIndex: BookingsIndex;
  price: number;
  numOfGuests: number;
}

export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string; // email
  walletId: string;
  income: number;
  bookings: ObjectId[];
  listings: ObjectId[];
}

export interface Database {
  bookings: Collection<Booking>;
  listings: Collection<Listing>;
  users: Collection<User>;
}

// Not reuseable
// const identity = (arg: number | string): number | string => {
//   return arg;
// };
// identity(5);
// identity("5");

// Reuseable
// const identity = <T>(arg: T): T => {
//     return arg;
// }
// // compiler inferrance
// identity(5);
// identity("5");
// // explicit
// identity<number>(5)
// identity<string>("5")
