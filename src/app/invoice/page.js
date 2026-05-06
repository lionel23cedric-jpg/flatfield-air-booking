"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

function LoadingCard({ text }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-blue-100" />
          <div>
            <p className="font-semibold text-slate-900">{text}</p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we load your booking invoice.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function InvoicePageContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("Loading invoice...");

  useEffect(() => {
    async function loadBooking() {
      if (!reference) {
        setMessage("No booking reference was provided.");
        return;
      }

      const response = await fetch(`/api/bookings?reference=${reference}`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load invoice.");
        return;
      }

      setBooking(data.booking);
      setMessage("");
    }

    loadBooking();
  }, [reference]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div
            className="relative bg-cover bg-center px-6 py-10 md:px-10 md:py-12"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.68)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-blue-100 ring-1 ring-white/30">
                Flatfield Air
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Booking invoice
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-blue-50">
                Your booking confirmation, passenger details, flight schedule,
                and payment summary are shown below.
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

        {message && (
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-blue-100" />
              <div>
                <p className="font-semibold text-slate-900">{message}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Check that the booking reference is correct.
                </p>
              </div>
            </div>
          </div>
        )}

        {booking && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="bg-gradient-to-r from-blue-700 to-sky-600 px-6 py-6 text-white md:px-8">
              <p className="text-sm font-semibold text-blue-100">
                Booking confirmed
              </p>

              <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Reference: {booking.bookingReference}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm text-blue-50">
                    Please keep this reference. It can be used to check your
                    booking or cancel it later.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/25">
                  Status: {booking.status}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
                  <p className="text-sm font-semibold text-blue-700">
                    Passenger
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {booking.passenger.firstName} {booking.passenger.lastName}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {booking.passenger.email}
                    </p>

                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {booking.passenger.phone || "No phone provided"}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-100">
                  <p className="text-sm font-semibold text-blue-700">
                    Flight
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {booking.flight.fromName} to {booking.flight.toName}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Flight number:</span>{" "}
                      {booking.flight.flightNumber}
                    </p>

                    <p>
                      <span className="font-semibold">Aircraft:</span>{" "}
                      {booking.flight.aircraft}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Departure
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatDateTime(
                      booking.flight.departureTime,
                      booking.flight.departureZone
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Arrival
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {formatDateTime(
                      booking.flight.arrivalTime,
                      booking.flight.arrivalZone
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Seats
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {booking.seats}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      Payment summary
                    </p>

                    <p className="mt-1 text-sm text-blue-800">
                      Total price for this confirmed booking.
                    </p>
                  </div>

                  <p className="text-4xl font-bold text-slate-900">
                    {formatMoney(booking.totalPriceCents)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
                Keep your booking reference safe. You will need it if you want
                to cancel this booking later.
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/my-bookings"
                  className="rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-sky-700"
                >
                  View my bookings
                </Link>

                <Link
                  href="/cancel"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Cancel a booking
                </Link>

                <Link
                  href="/flights"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Search another flight
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<LoadingCard text="Loading invoice..." />}>
      <InvoicePageContent />
    </Suspense>
  );
}