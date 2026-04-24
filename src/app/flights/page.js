"use client";

import { useState } from "react";

const airportOptions = [
  { code: "NZNE", name: "Dairy Flat Airport" },
  { code: "YSSY", name: "Sydney Airport" },
  { code: "NZRO", name: "Rotorua Airport" },
  { code: "NZGB", name: "Claris Airport" },
  { code: "NZCI", name: "Tuuta Airport" },
  { code: "NZTL", name: "Lake Tekapo Airport" },
];

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
  const [date, setDate] = useState(today);
  const [seats, setSeats] = useState(1);
  const [flights, setFlights] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setFlights([]);

    const query = new URLSearchParams({
      from,
      to,
      date,
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
      setMessage("No available flights found for this route and date.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Flatfield Air
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Search flights
            </h1>
            <p className="mt-2 text-slate-600">
              Choose a route, travel date, and number of seats.
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Home
          </a>
        </div>

        <form
          onSubmit={handleSearch}
          className="grid gap-4 rounded-3xl bg-white p-6 shadow md:grid-cols-5"
        >
          <div>
            <label className="text-sm font-semibold text-slate-700">
              From
            </label>
            <select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              {airportOptions.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.name} ({airport.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">To</label>
            <select
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              {airportOptions.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.name} ({airport.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
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
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-amber-800">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="rounded-3xl bg-white p-6 shadow"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
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

                  <a
                    href={`/book?flightId=${flight.id}&seats=${seats}`}
                    className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-800"
                  >
                    Book this flight
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}