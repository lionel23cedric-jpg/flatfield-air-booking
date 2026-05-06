"use client";

import Link from "next/link";
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
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div
            className="relative bg-cover bg-center px-6 py-10 md:px-10 md:py-12"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.68)), url('https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-blue-100 ring-1 ring-white/30">
                Flatfield Air
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                My bookings
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-blue-50">
                Search by passenger email address to view upcoming bookings,
                invoices, and booking status.
              </p>
            </div>

            <Link
              href="/"
              className="absolute right-6 top-6 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow transition hover:bg-white"
            >
              Home
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        >
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-700">
              Booking lookup
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Find passenger bookings
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Enter the same email address used when the booking was created.
            </p>
          </div>

          <label className="text-sm font-semibold text-slate-700">
            Passenger email
          </label>

          <div className="mt-2 flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-800 shadow-sm">
            {message}
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Search results
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                {bookings.length} booking
                {bookings.length === 1 ? "" : "s"} found
              </h2>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Booking reference
                    </p>
                    <p className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                      {booking.bookingReference}
                    </p>
                  </div>

                  <span
                    className={
                      booking.status === "confirmed"
                        ? "inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
                        : "inline-flex w-fit rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700"
                    }
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {booking.flight.fromName} to {booking.flight.toName}
                    </h3>

                    <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Flight
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {booking.flight.flightNumber}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Aircraft
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {booking.flight.aircraft}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Passenger
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {booking.passenger.firstName}{" "}
                          {booking.passenger.lastName}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Seats
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {booking.seats}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full rounded-3xl border border-blue-100 bg-blue-50 p-5 md:max-w-sm">
                    <p className="text-sm font-semibold text-blue-700">
                      Schedule
                    </p>

                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-semibold">Depart:</span>{" "}
                      {formatDateTime(
                        booking.flight.departureTime,
                        booking.flight.departureZone
                      )}
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-semibold">Arrive:</span>{" "}
                      {formatDateTime(
                        booking.flight.arrivalTime,
                        booking.flight.arrivalZone
                      )}
                    </p>

                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {formatMoney(booking.totalPriceCents)}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/invoice?reference=${booking.bookingReference}`}
                        className="rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-4 py-2 font-semibold text-white shadow transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-sky-700"
                      >
                        View invoice
                      </Link>

                      {booking.status === "confirmed" && (
                        <Link
                          href={`/cancel?reference=${booking.bookingReference}`}
                          className="rounded-xl border border-red-200 bg-white px-4 py-2 font-semibold text-red-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50"
                        >
                          Cancel
                        </Link>
                      )}
                    </div>
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