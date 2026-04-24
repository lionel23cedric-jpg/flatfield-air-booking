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
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
          Loading flight...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Flatfield Air
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Complete your booking
            </h1>
            <p className="mt-2 text-slate-600">
              Check the flight details and enter passenger information.
            </p>
          </div>

          <a
            href="/flights"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Back to search
          </a>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700">
            {message}
          </div>
        )}

        {flight && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow">
              <p className="text-sm font-semibold text-blue-700">
                {flight.flightNumber}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {flight.fromName} to {flight.toName}
              </h2>

              <div className="mt-5 space-y-3 text-slate-700">
                <p>
                  <span className="font-semibold">Aircraft:</span>{" "}
                  {flight.aircraft}
                </p>

                <p>
                  <span className="font-semibold">Depart:</span>{" "}
                  {formatDateTime(flight.departureTime, flight.departureZone)}
                </p>

                <p>
                  <span className="font-semibold">Arrive:</span>{" "}
                  {formatDateTime(flight.arrivalTime, flight.arrivalZone)}
                </p>

                <p>
                  <span className="font-semibold">Available seats:</span>{" "}
                  {flight.availableSeats}
                </p>

                <p>
                  <span className="font-semibold">Price per seat:</span>{" "}
                  {formatMoney(flight.priceCents)}
                </p>

                <p className="text-xl font-bold text-slate-900">
                  Total: {formatMoney(flight.priceCents * seats)}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white p-6 shadow"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Passenger details
              </h2>

              <div className="mt-5 grid gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    First name
                  </label>
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
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
                    max={flight.availableSeats}
                    value={seats}
                    onChange={(event) => setSeats(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
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
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-100 px-6 py-10">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
            Loading booking page...
          </div>
        </main>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}