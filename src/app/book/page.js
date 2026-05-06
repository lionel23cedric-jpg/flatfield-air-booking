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

function LoadingCard({ text }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-blue-100" />
          <div>
            <p className="font-semibold text-slate-900">{text}</p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we prepare your booking details.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function BookPageContent() {
  const searchParams = useSearchParams();

  const flightId = searchParams.get("flightId");
  const seatsFromUrl = Number(searchParams.get("seats") || 1);

  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState(seatsFromUrl);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");
  const [loadingFlight, setLoadingFlight] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadFlight() {
      if (!flightId) {
        setMessage("No flight was selected.");
        setLoadingFlight(false);
        return;
      }

      const response = await fetch(`/api/flights?id=${flightId}`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load flight.");
        setLoadingFlight(false);
        return;
      }

      setFlight(data.flight);
      setLoadingFlight(false);
    }

    loadFlight();
  }, [flightId]);

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flightId,
        seats,
        firstName,
        lastName,
        email,
        phone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Booking failed.");
      setSubmitting(false);
      return;
    }

    window.location.href = `/invoice?reference=${data.booking.bookingReference}`;
  }

  if (loadingFlight) {
    return <LoadingCard text="Loading flight..." />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div
            className="relative bg-cover bg-center px-6 py-10 md:px-10 md:py-12"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.68)), url('https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-blue-100 ring-1 ring-white/30">
                Flatfield Air
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Complete your booking
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-blue-50">
                Review your selected flight, enter passenger information, and
                confirm your booking to receive an invoice.
              </p>
            </div>

            <a
              href="/flights"
              className="absolute right-6 top-6 rounded-xl bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow transition hover:bg-white"
            >
              Back to search
            </a>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700 shadow-sm">
            {message}
          </div>
        )}

        {flight && (
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
              <div className="bg-gradient-to-r from-blue-700 to-sky-600 px-6 py-6 text-white">
                <p className="text-sm font-semibold text-blue-100">
                  Selected flight
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {flight.fromName} to {flight.toName}
                </h2>

                <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/25">
                  {flight.flightNumber}
                </p>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Aircraft
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {flight.aircraft}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Departure
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatDateTime(
                          flight.departureTime,
                          flight.departureZone
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Arrival
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatDateTime(
                          flight.arrivalTime,
                          flight.arrivalZone
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Available seats
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {flight.availableSeats}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Price per seat
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatMoney(flight.priceCents)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-sm font-semibold text-blue-700">
                      Booking total
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {formatMoney(flight.priceCents * seats)}
                    </p>
                    <p className="mt-2 text-sm text-blue-700">
                      Based on {seats} seat{seats === 1 ? "" : "s"} selected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
            >
              <div className="mb-6">
                <p className="text-sm font-semibold text-blue-700">
                  Passenger information
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Passenger details
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Enter the contact details for this booking. The booking
                  reference will be shown on the invoice page after confirmation.
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    First name
                  </label>
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Last name
                  </label>
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={flight.availableSeats}
                    value={seats}
                    onChange={(event) => setSeats(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={submitting}
                >
                  {submitting
                    ? "Creating booking..."
                    : "Confirm booking and show invoice"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<LoadingCard text="Loading booking page..." />}>
      <BookPageContent />
    </Suspense>
  );
}