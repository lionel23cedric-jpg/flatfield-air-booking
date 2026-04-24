import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { connectDB } from "@/lib/mongodb";
import Flight from "@/models/Flight";
import { airports } from "@/data/timetable";

function flightToJson(flight) {
  return {
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
    availableSeats: flight.capacity - flight.bookedSeats,
    priceCents: flight.priceCents,
  };
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const seats = Number(searchParams.get("seats") || 1);

    if (id) {
      const flight = await Flight.findById(id);

      if (!flight) {
        return NextResponse.json(
          { error: "Flight not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        flight: flightToJson(flight),
      });
    }

    if (!from || !to || !date) {
      return NextResponse.json(
        { error: "Please provide from, to, and date." },
        { status: 400 }
      );
    }

    if (seats < 1) {
      return NextResponse.json(
        { error: "Seats must be at least 1." },
        { status: 400 }
      );
    }

    const fromAirport = airports[from];

    if (!fromAirport) {
      return NextResponse.json(
        { error: "Invalid departure airport." },
        { status: 400 }
      );
    }

    const startOfDay = DateTime.fromISO(date, {
      zone: fromAirport.zone,
    }).startOf("day");

    const endOfDay = startOfDay.plus({ days: 1 });

    const flights = await Flight.find({
      fromCode: from,
      toCode: to,
      departureTime: {
        $gte: startOfDay.toJSDate(),
        $lt: endOfDay.toJSDate(),
      },
      $expr: {
        $gte: [{ $subtract: ["$capacity", "$bookedSeats"] }, seats],
      },
    }).sort({ departureTime: 1 });

    return NextResponse.json({
      flights: flights.map(flightToJson),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to search flights." },
      { status: 500 }
    );
  }
}