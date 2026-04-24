import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Passenger from "@/models/Passenger";
import Flight from "@/models/Flight";
import Booking from "@/models/Booking";

function createBookingReference() {
  const code = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FF-${code}`;
}

function formatBooking(booking) {
  const passenger = booking.passenger;
  const flight = booking.flight;

  return {
    id: booking._id.toString(),
    bookingReference: booking.bookingReference,
    seats: booking.seats,
    totalPriceCents: booking.totalPriceCents,
    status: booking.status,
    createdAt: booking.createdAt,

    passenger: {
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      email: passenger.email,
      phone: passenger.phone,
    },

    flight: {
      id: flight._id.toString(),
      flightNumber: flight.flightNumber,
      fromCode: flight.fromCode,
      fromName: flight.fromName,
      toCode: flight.toCode,
      toName: flight.toName,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      departureZone: flight.departureZone,
      arrivalZone: flight.arrivalZone,
      aircraft: flight.aircraft,
      capacity: flight.capacity,
      bookedSeats: flight.bookedSeats,
      priceCents: flight.priceCents,
    },
  };
}

export async function POST(request) {
  await connectDB();

  const body = await request.json();

  const flightId = body.flightId;
  const seats = Number(body.seats || 1);
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();

  if (!flightId || !firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "Please complete all required passenger details." },
      { status: 400 }
    );
  }

  if (seats < 1) {
    return NextResponse.json(
      { error: "Seats must be at least 1." },
      { status: 400 }
    );
  }

  const session = await mongoose.startSession();

  try {
    let savedBooking;

    await session.withTransaction(async () => {
      const flight = await Flight.findById(flightId).session(session);

      if (!flight) {
        throw new Error("Flight not found.");
      }

      const availableSeats = flight.capacity - flight.bookedSeats;

      if (availableSeats < seats) {
        throw new Error("This flight does not have enough available seats.");
      }

      const passenger = await Passenger.findOneAndUpdate(
        { email },
        {
          firstName,
          lastName,
          email,
          phone,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          session,
        }
      );

      let bookingReference = createBookingReference();

      while (await Booking.exists({ bookingReference }).session(session)) {
        bookingReference = createBookingReference();
      }

      const totalPriceCents = flight.priceCents * seats;

      const bookings = await Booking.create(
        [
          {
            bookingReference,
            passenger: passenger._id,
            flight: flight._id,
            seats,
            totalPriceCents,
            status: "confirmed",
          },
        ],
        { session }
      );

      await Flight.updateOne(
        { _id: flight._id },
        { $inc: { bookedSeats: seats } },
        { session }
      );

      savedBooking = bookings[0];
    });

    const fullBooking = await Booking.findById(savedBooking._id)
      .populate("passenger")
      .populate("flight");

    return NextResponse.json({
      booking: formatBooking(fullBooking),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message || "Failed to create booking." },
      { status: 400 }
    );
  } finally {
    session.endSession();
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Booking reference is required." },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({
      bookingReference: reference.trim().toUpperCase(),
    })
      .populate("passenger")
      .populate("flight");

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      booking: formatBooking(booking),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load booking." },
      { status: 500 }
    );
  }
}