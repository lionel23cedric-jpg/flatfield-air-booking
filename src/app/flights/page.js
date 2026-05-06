"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const airportOptions = [
  { code: "NZNE", name: "Dairy Flat Airport" },
  { code: "YSSY", name: "Sydney Airport" },
  { code: "NZRO", name: "Rotorua Airport" },
  { code: "NZGB", name: "Claris Airport" },
  { code: "NZCI", name: "Tuuta Airport" },
  { code: "NZTL", name: "Lake Tekapo Airport" },
];
const routeOptions = [
  {
    from: "NZNE",
    to: "YSSY",
    note: "Friday mid-morning only",
  },
  {
    from: "YSSY",
    to: "NZNE",
    note: "Sunday mid-afternoon only",
  },
  {
    from: "NZNE",
    to: "NZRO",
    note: "Twice every weekday: early morning and late afternoon",
  },
  {
    from: "NZRO",
    to: "NZNE",
    note: "Twice every weekday: morning and evening returns",
  },
  {
    from: "NZNE",
    to: "NZGB",
    note: "Monday, Wednesday, and Friday mornings",
  },
  {
    from: "NZGB",
    to: "NZNE",
    note: "Tuesday, Thursday, and Saturday mornings",
  },
  {
    from: "NZNE",
    to: "NZCI",
    note: "Tuesday and Friday departures",
  },
  {
    from: "NZCI",
    to: "NZNE",
    note: "Wednesday and Saturday returns",
  },
  {
    from: "NZNE",
    to: "NZTL",
    note: "Monday departures only",
  },
  {
    from: "NZTL",
    to: "NZNE",
    note: "Tuesday returns only",
  },
];

function getAirportName(code) {
  return airportOptions.find((airport) => airport.code === code)?.name || code;
}

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDateTime(value, zone) {
  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: zone,
  }).format(new Date(value));
}

export default function FlightsPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [from, setFrom] = useState("NZNE");
  const [to, setTo] = useState("NZRO");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [seats, setSeats] = useState(1);
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const availableDestinations = useMemo(
    () => routeOptions.filter((route) => route.from === from),
    [from]
  );

  const currentTo = availableDestinations.some((route) => route.to === to)
    ? to
    : availableDestinations[0]?.to || "";

  const selectedRoute = routeOptions.find(
    (route) => route.from === from && route.to === currentTo
  );
  async function handleSearch(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setFlights([]);

    const query = new URLSearchParams({
      from,
      to: currentTo,
      startDate,
      endDate,
      seats: String(seats),
    });

    const response = await fetch(`/api/flights?${query.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not search flights.");
      setLoading(false);
      return;
    }

    setFlights(data.flights);

    if (data.flights.length === 0) {
      setMessage("No available flights found for this route and date range. Try widening the date range or check the route guidance above.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div
            className="relative bg-cover bg-center px-6 py-10 md:px-10 md:py-14"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(30, 64, 175, 0.62)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-blue-100 ring-1 ring-white/30">
                Flatfield Air
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Find your next flight
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-blue-50">
                Search real scheduled services from Dairy Flat Airport, including
                infrequent regional and international routes.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 ring-1 ring-white/25">
                  Weekly Sydney service
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 ring-1 ring-white/25">
                  Regional NZ routes
                </span>
                <span className="rounded-full bg-white/15 px-4 py-2 ring-1 ring-white/25">
                  Small luxury jets
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="absolute right-6 top-6 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow hover:bg-white"
            >
              Home
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="grid gap-4 rounded-3xl bg-white/95 p-6 shadow-xl ring-1 ring-slate-200 md:grid-cols-6"
        >
          <div>
            <label className="text-sm font-semibold text-slate-700">
              From
            </label>
            <select
              value={from}
              onChange={(event) => {
                const nextFrom = event.target.value;
                const firstDestination = routeOptions.find((route) => route.from === nextFrom
                )?.to;
                setFrom(nextFrom);
                setTo(firstDestination || "");
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {airportOptions
                .filter((airport) =>
                  routeOptions.some((route) => route.from === airport.code)
                )
                .map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">To</label>
            <select
              value={currentTo}
              onChange={(event) => setTo(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {availableDestinations.map((route) => (
                <option key={`${route.from}-${route.to}`} value={route.to}>
                  {getAirportName(route.to)} ({route.to})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              From date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => {
                const nextStartDate = event.target.value;
                setStartDate(nextStartDate);

                if (endDate < nextStartDate) {
                  setEndDate(nextStartDate);
                }
              }}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              To date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Seats
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search flights"}
            </button>
          </div>
        </form>
        <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50/80 p-5 text-sm text-blue-950 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-700 px-3 py-2 text-white shadow">
              ✈
            </div>

            <div>
              <p className="font-bold">
                Route guidance: {getAirportName(from)} to {getAirportName(currentTo)}
              </p>

              <p className="mt-1 text-blue-800">
                {selectedRoute?.note || "Choose a departure and destination."}
              </p>

              <p className="mt-2 text-xs text-blue-700">
                Tip: use a wider date range for routes that only operate once or twice per week.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-amber-800">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                    {flight.flightNumber}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {flight.fromName} to {flight.toName}
                  </h2>

                  <p className="mt-2 text-slate-600">
                    Aircraft: {flight.aircraft}
                  </p>

                  <p className="mt-1 text-slate-600">
                    Available seats: {flight.availableSeats}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="font-semibold text-slate-900">
                    Depart:{" "}
                    {formatDateTime(
                      flight.departureTime,
                      flight.departureZone
                    )}
                  </p>

                  <p className="mt-1 text-slate-600">
                    Arrive:{" "}
                    {formatDateTime(flight.arrivalTime, flight.arrivalZone)}
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatMoney(flight.priceCents)} per seat
                  </p>

                  <Link
                    href={`/book?flightId=${flight.id}&seats=${seats}`}
                    className="mt-4 inline-block rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Book this flight
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}