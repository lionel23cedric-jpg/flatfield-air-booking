"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoadingCard({ text }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-red-100" />
          <div>
            <p className="font-semibold text-slate-900">{text}</p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we prepare the cancellation page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function CancelPageContent() {
  const searchParams = useSearchParams();
  const referenceFromUrl = searchParams.get("reference") || "";

  const [bookingReference, setBookingReference] = useState(referenceFromUrl);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);



  async function handleCancel(event) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setSuccess(false);

    const response = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingReference }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not cancel booking.");
      setSuccess(false);
      setSubmitting(false);
      return;
    }

    setMessage(data.message);
    setSuccess(true);
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div
            className="relative bg-cover bg-center px-6 py-10 md:px-10 md:py-12"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15, 23, 42, 0.92), rgba(127, 29, 29, 0.62)), url('https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-red-100 ring-1 ring-white/30">
                Flatfield Air
              </p>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Cancel booking
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-red-50">
                Enter your booking reference to cancel a confirmed booking. Once
                cancelled, the seats will be released back to availability.
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

        <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div className="mb-6">
            <p className="text-sm font-semibold text-red-700">
              Cancellation request
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Find booking by reference
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Use the unique booking reference shown on your invoice. Example:
              FF-123ABC.
            </p>
          </div>

          <form onSubmit={handleCancel}>
            <label className="text-sm font-semibold text-slate-700">
              Booking reference
            </label>

            <input
              value={bookingReference}
              onChange={(event) => setBookingReference(event.target.value)}
              placeholder="FF-123ABC"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 shadow-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
              required
            />

            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              Please check the reference carefully before cancelling. This
              action changes the booking status and releases the reserved seats.
            </div>

            <button
              type="submit"
              className="mt-5 rounded-xl bg-gradient-to-r from-red-700 to-rose-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:from-red-800 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Cancelling..." : "Cancel booking"}
            </button>
          </form>
        </div>

        {message && (
          <div
            className={`mt-6 rounded-2xl border p-4 shadow-sm ${success
              ? "border-green-100 bg-green-50 text-green-800"
              : "border-red-100 bg-red-50 text-red-700"
              }`}
          >
            <p className="font-semibold">
              {success ? "Booking cancelled" : "Cancellation failed"}
            </p>
            <p className="mt-1 text-sm">{message}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/my-bookings"
              className="rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-sky-700"
            >
              Check my bookings
            </Link>

            <Link
              href="/flights"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Search flights again
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<LoadingCard text="Loading cancellation page..." />}>
      <CancelPageContent />
    </Suspense>
  );
}