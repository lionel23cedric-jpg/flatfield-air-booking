"use client";

import { useState } from "react";

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

export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setBookings([]);

    const query = new URLSearchParams({
      email,
    });

    const response = await fetch(`/api/bookings/search?${query.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not load bookings.");
      setLoading(false);
      return;
    }

    setBookings(data.bookings);

    if (data.bookings.length === 0) {
      setMessage("No bookings were found for this email address.");
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
              My bookings
            </h1>
            <p className="mt-2 text-slate-600">
              Enter a passenger email address to view booked flights.
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
          className="rounded-3xl bg-white p-6 shadow"
        >
          <label className="text-sm font-semibold text-slate-700">
            Passenger email
          </label>

          <div className="mt-2 flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-6 py-2 font-semibold text-white hover:bg-blue-800"
              disabled={loading}
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
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-3xl bg-white p-6 shadow"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    Reference: {booking.bookingReference}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {booking.flight.fromName} to {booking.flight.toName}
                  </h2>

                  <p className="mt-2 text-slate-600">
                    Flight: {booking.flight.flightNumber}
                  </p>

                  <p className="text-slate-600">
                    Aircraft: {booking.flight.aircraft}
                  </p>

                  <p className="text-slate-600">
                    Passenger: {booking.passenger.firstName}{" "}
                    {booking.passenger.lastName}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    Status: {booking.status}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="font-semibold text-slate-900">
                    Depart:{" "}
                    {formatDateTime(
                      booking.flight.departureTime,
                      booking.flight.departureZone
                    )}
                  </p>

                  <p className="mt-1 text-slate-600">
                    Arrive:{" "}
                    {formatDateTime(
                      booking.flight.arrivalTime,
                      booking.flight.arrivalZone
                    )}
                  </p>

                  <p className="mt-2 text-slate-600">
                    Seats: {booking.seats}
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatMoney(booking.totalPriceCents)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 md:justify-end">
                    <a
                      href={`/invoice?reference=${booking.bookingReference}`}
                      className="rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                    >
                      View invoice
                    </a>

                    {booking.status === "confirmed" && (
                      <a
                        href={`/cancel?reference=${booking.bookingReference}`}
                        className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
                      >
                        Cancel
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}