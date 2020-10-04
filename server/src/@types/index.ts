import { Collection, ObjectId } from "mongodb";

export interface Listing {
  _id: ObjectId;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
  numOfBeds: number;
  numOfBaths: number;
  rating: number;
}

export interface Database {
  listings: Collection<Listing>;
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
