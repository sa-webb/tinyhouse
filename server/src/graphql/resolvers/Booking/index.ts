import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { Stripe } from "../../../lib/api/Stripe";
import { Booking, BookingsIndex, Database, Listing } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { CreateBookingArgs } from "./types";

const millisecondsPerDay = 86400000;

const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear();
    const m = dateCursor.getUTCMonth();
    const d = dateCursor.getUTCDate();

    if (!newBookingsIndex[y]) {
      newBookingsIndex[y] = {};
    }

    if (!newBookingsIndex[y][m]) {
      newBookingsIndex[y][m] = {};
    }

    if (!newBookingsIndex[y][m][d]) {
      newBookingsIndex[y][m][d] = true;
    } else {
      throw new Error(
        "selected dates can't overlap dates that have already been booked"
      );
    }

    dateCursor = new Date(dateCursor.getTime() + millisecondsPerDay);
  }

  return newBookingsIndex;
};

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: (
      booking: Booking,
      // eslint-disable-next-line @typescript-eslint/ban-types
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    tenant: (booking: Booking, _args: {}, { db }: { db: Database }) => {
      return db.users.findOne({ _id: booking.tenant });
    },
  },
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {

      try {
        const { id, source, checkIn, checkOut } = input;

        // eslint-disable-next-line prefer-const
        let viewer = await authorize(db, req);

        if (!viewer) {
          throw new Error("Cannot find viewer");
        }

        const listing = await db.listings.findOne({
          _id: new ObjectId(id),
        });

        if (!listing) {
          throw new Error("Cannot lookup listing");
        }

        if (listing.host === (await viewer)._id) {
          throw new Error("User cannot book their");
        }

        const today = new Date();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate.getTime() > today.getTime() + 90 * millisecondsPerDay) {
          throw new Error(
            "check in date can't be more than 90 days from today"
          );
        }

        if (
          checkOutDate.getTime() >
          today.getTime() + 90 * millisecondsPerDay
        ) {
          throw new Error(
            "check out date can't be more than 90 days from today"
          );
        }

        if (checkOutDate < checkInDate) {
          throw new Error("check out date can't be before check in date");
        }
        const bookingsIndex = resolveBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );
        const totalPrice =
          listing.price *
          ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);

        const host = await db.users.findOne({
          _id: listing.host,
        });

        if (!host || !host.walletId) {
          throw new Error(
            "the host either can't be found or is not connected with Stripe"
          );
        }
        await Stripe.charge(totalPrice, source, host.walletId);

        const insertRes = await db.bookings.insertOne({
          _id: new ObjectId(),
          listing: listing._id,
          tenant: (await viewer)._id,
          checkIn,
          checkOut,
        });

        const insertedBooking: Booking = insertRes.ops[0];

        await db.users.updateOne(
          { _id: host._id },
          { $inc: { income: totalPrice } }
        );

        await db.users.updateOne(
          { _id: (await viewer)._id },
          { $push: { bookings: insertedBooking._id } }
        );

        await db.listings.updateOne(
          { _id: listing._id },
          {
            $set: { bookingsIndex },
            $push: { bookings: insertedBooking._id },
          }
        );

        return insertedBooking;
      } catch (error) {
        throw new Error("Cannot create booking");
      }
    },
  },
};
