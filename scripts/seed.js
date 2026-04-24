require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Please check .env.local or environment variables.");
  process.exit(1);
}

const airports = {
  NZNE: {
    code: "NZNE",
    name: "Dairy Flat Airport",
    zone: "Pacific/Auckland",
  },
  YSSY: {
    code: "YSSY",
    name: "Sydney Airport",
    zone: "Australia/Sydney",
  },
  NZRO: {
    code: "NZRO",
    name: "Rotorua Airport",
    zone: "Pacific/Auckland",
  },
  NZGB: {
    code: "NZGB",
    name: "Claris Airport",
    zone: "Pacific/Auckland",
  },
  NZCI: {
    code: "NZCI",
    name: "Tuuta Airport",
    zone: "Pacific/Chatham",
  },
  NZTL: {
    code: "NZTL",
    name: "Lake Tekapo Airport",
    zone: "Pacific/Auckland",
  },
};

const aircraft = {
  SJ30I: {
    name: "SyberJet SJ30i",
    capacity: 6,
  },
  SF50_A: {
    name: "Cirrus SF50 Jet",
    capacity: 4,
  },
  SF50_B: {
    name: "Cirrus SF50 Jet",
    capacity: 4,
  },
  HONDA_A: {
    name: "HondaJet Elite",
    capacity: 5,
  },
  HONDA_B: {
    name: "HondaJet Elite",
    capacity: 5,
  },
};

const weeklyRoutes = [
  ["FF101", "NZNE", "YSSY", [5], "10:30", 210, "SJ30I", 185000],
  ["FF102", "YSSY", "NZNE", [7], "15:30", 230, "SJ30I", 185000],

  ["FF201", "NZNE", "NZRO", [1, 2, 3, 4, 5], "07:20", 45, "SF50_A", 28000],
  ["FF202", "NZRO", "NZNE", [1, 2, 3, 4, 5], "08:30", 50, "SF50_A", 28000],
  ["FF203", "NZNE", "NZRO", [1, 2, 3, 4, 5], "16:45", 45, "SF50_A", 30000],
  ["FF204", "NZRO", "NZNE", [1, 2, 3, 4, 5], "18:00", 50, "SF50_A", 30000],

  ["FF301", "NZNE", "NZGB", [1, 3, 5], "09:10", 35, "SF50_B", 22000],
  ["FF302", "NZGB", "NZNE", [2, 4, 6], "09:40", 40, "SF50_B", 22000],

  ["FF401", "NZNE", "NZCI", [2, 5], "11:00", 135, "HONDA_A", 95000],
  ["FF402", "NZCI", "NZNE", [3, 6], "12:30", 150, "HONDA_A", 95000],

  ["FF501", "NZNE", "NZTL", [1], "10:00", 105, "HONDA_B", 72000],
  ["FF502", "NZTL", "NZNE", [2], "13:00", 120, "HONDA_B", 72000],
];

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: String,
    fromCode: String,
    fromName: String,
    toCode: String,
    toName: String,
    departureTime: Date,
    arrivalTime: Date,
    departureZone: String,
    arrivalZone: String,
    aircraft: String,
    capacity: Number,
    bookedSeats: Number,
    priceCents: Number,
  },
  {
    timestamps: true,
  }
);

const Flight = mongoose.models.Flight || mongoose.model("Flight", FlightSchema);

function getNextDateForDay(startDate, targetDay) {
  let date = startDate;

  while (date.weekday !== targetDay) {
    date = date.plus({ days: 1 });
  }

  return date;
}

function buildFlightDate(baseDate, timeText, zone) {
  const [hour, minute] = timeText.split(":").map(Number);

  return DateTime.fromObject(
    {
      year: baseDate.year,
      month: baseDate.month,
      day: baseDate.day,
      hour,
      minute,
    },
    {
      zone,
    }
  );
}

async function seedFlights() {
  await mongoose.connect(MONGODB_URI);

  console.log("Connected to MongoDB.");

  await Flight.deleteMany({});
  console.log("Old flights removed.");

  const start = DateTime.now().setZone("Pacific/Auckland").startOf("day");
  const numberOfWeeks = 12;
  const flights = [];

  for (let week = 0; week < numberOfWeeks; week++) {
    const weekStart = start.plus({ weeks: week });

    for (const route of weeklyRoutes) {
      const [
        flightPrefix,
        fromCode,
        toCode,
        days,
        departureClock,
        durationMinutes,
        aircraftKey,
        priceCents,
      ] = route;

      for (const day of days) {
        const fromAirport = airports[fromCode];
        const toAirport = airports[toCode];
        const plane = aircraft[aircraftKey];

        const flightDate = getNextDateForDay(weekStart, day);
        const departure = buildFlightDate(
          flightDate,
          departureClock,
          fromAirport.zone
        );
        const arrival = departure.plus({ minutes: durationMinutes }).setZone(
          toAirport.zone
        );

        const dateCode = departure.toFormat("yyyyLLdd");
        const flightNumber = `${flightPrefix}-${dateCode}`;

        flights.push({
          flightNumber,
          fromCode,
          fromName: fromAirport.name,
          toCode,
          toName: toAirport.name,
          departureTime: departure.toJSDate(),
          arrivalTime: arrival.toJSDate(),
          departureZone: fromAirport.zone,
          arrivalZone: toAirport.zone,
          aircraft: plane.name,
          capacity: plane.capacity,
          bookedSeats: 0,
          priceCents,
        });
      }
    }
  }

  await Flight.insertMany(flights);

  console.log(`Inserted ${flights.length} flights.`);
  console.log("Seed complete.");

  await mongoose.disconnect();
}

seedFlights().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});