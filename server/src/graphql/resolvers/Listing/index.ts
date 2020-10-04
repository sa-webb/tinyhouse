import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, Listing } from "../../../@types";

export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: undefined,
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    },
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteRes = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deleteRes.value) {
        throw new Error("failed to deleted listing");
      }

      return deleteRes.value;
    },
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString()
  }
};
