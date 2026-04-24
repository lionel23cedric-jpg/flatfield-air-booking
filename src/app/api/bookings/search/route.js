import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Passenger from "@/models/Passenger";
import Booking from "@/models/Booking";

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
      priceCents: flight.priceCents,
    },
  };
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = String(searchParams.get("email") || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Please enter a passenger email address." },
        { status: 400 }
      );
    }

    const passenger = await Passenger.findOne({ email });

    if (!passenger) {
      return NextResponse.json({
        bookings: [],
      });
    }

    const bookings = await Booking.find({
      passenger: passenger._id,
    })
      .populate("passenger")
      .populate("flight")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      bookings: bookings.map(formatBooking),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load passenger bookings." },
      { status: 500 }
    );
  }
}