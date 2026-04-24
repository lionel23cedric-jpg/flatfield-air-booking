"use client";

import { Suspense, useEffect, useState } from "react";
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
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Flatfield Air
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Booking invoice
            </h1>
          </div>

          <a
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Home
          </a>
        </div>

        {message && (
          <div className="rounded-3xl bg-white p-8 shadow">{message}</div>
        )}

        {booking && (
          <div className="rounded-3xl bg-white p-8 shadow">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-sm font-semibold text-blue-700">
                Booking confirmed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Reference: {booking.bookingReference}
              </h2>

              <p className="mt-2 text-slate-600">
                Please keep this reference for checking or cancelling your
                booking.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-bold text-slate-900">Passenger</h3>
                <p className="mt-2 text-slate-700">
                  {booking.passenger.firstName} {booking.passenger.lastName}
                </p>
                <p className="text-slate-700">{booking.passenger.email}</p>
                <p className="text-slate-700">
                  {booking.passenger.phone || "No phone provided"}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Flight</h3>
                <p className="mt-2 text-slate-700">
                  {booking.flight.flightNumber}
                </p>
                <p className="text-slate-700">
                  {booking.flight.fromName} to {booking.flight.toName}
                </p>
                <p className="text-slate-700">{booking.flight.aircraft}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-slate-700">
                <span className="font-semibold">Depart:</span>{" "}
                {formatDateTime(
                  booking.flight.departureTime,
                  booking.flight.departureZone
                )}
              </p>

              <p className="mt-2 text-slate-700">
                <span className="font-semibold">Arrive:</span>{" "}
                {formatDateTime(
                  booking.flight.arrivalTime,
                  booking.flight.arrivalZone
                )}
              </p>

              <p className="mt-2 text-slate-700">
                <span className="font-semibold">Seats:</span> {booking.seats}
              </p>

              <p className="mt-4 text-2xl font-bold text-slate-900">
                Total paid: {formatMoney(booking.totalPriceCents)}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Status: {booking.status}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/my-bookings"
                className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                View my bookings
              </a>

              <a
                href="/cancel"
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel a booking
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
export default function InvoicePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-100 px-6 py-10">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
            Loading invoice...
          </div>
        </main>
      }
    >
      <InvoicePageContent />
    </Suspense>
  );
}