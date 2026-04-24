import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Flight from "@/models/Flight";

export async function POST(request) {
  await connectDB();

  const body = await request.json();
  const bookingReference = String(body.bookingReference || "")
    .trim()
    .toUpperCase();

  if (!bookingReference) {
    return NextResponse.json(
      { error: "Booking reference is required." },
      { status: 400 }
    );
  }

  const session = await mongoose.startSession();

  try {
    let cancelledBooking;

    await session.withTransaction(async () => {
      const booking = await Booking.findOne({ bookingReference }).session(
        session
      );

      if (!booking) {
        throw new Error("Booking not found.");
      }

      if (booking.status === "cancelled") {
        throw new Error("This booking has already been cancelled.");
      }

      await Booking.updateOne(
        { _id: booking._id },
        { $set: { status: "cancelled" } },
        { session }
      );

      await Flight.updateOne(
        { _id: booking.flight },
        { $inc: { bookedSeats: -booking.seats } },
        { session }
      );

      cancelledBooking = booking;
    });

    return NextResponse.json({
      message: "Booking cancelled successfully.",
      bookingReference: cancelledBooking.bookingReference,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message || "Failed to cancel booking." },
      { status: 400 }
    );
  } finally {
    session.endSession();
  }
}