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
    const startDate = searchParams.get("startDate") || searchParams.get("date");
    const endDate = searchParams.get("endDate") || startDate;
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

    if (!from || !to || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Please provide from, to, start date, and end date." },
        { status: 400 }
      );
    }
    if (from === to) {
      return NextResponse.json(
        { error: "Departure and destination airports must be different." },
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
    const toAirport = airports[to];

    if (!toAirport) {
      return NextResponse.json(
        { error: "Invalid destination airport." },
        { status: 400 }
      );
    }

    const startOfRange = DateTime.fromISO(startDate, {
      zone: fromAirport.zone,
    }).startOf("day");

    const endOfRange = DateTime.fromISO(endDate, {
      zone: fromAirport.zone,
    })
      .startOf("day")
      .plus({ days: 1 });

    if (!startOfRange.isValid || !endOfRange.isValid) {
      return NextResponse.json(
        { error: "Please provide valid dates." },
        { status: 400 }
      );
    }

    if (endOfRange <= startOfRange) {
      return NextResponse.json(
        { error: "End date must be on or after start date." },
        { status: 400 }
      );
    }

    const flights = await Flight.find({
      fromCode: from,
      toCode: to,
      departureTime: {
        $gte: startOfRange.toJSDate(),
        $lt: endOfRange.toJSDate(),
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