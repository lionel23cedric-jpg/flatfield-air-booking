"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function CancelPageContent() {
  const searchParams = useSearchParams();
  const referenceFromUrl = searchParams.get("reference") || "";

  const [bookingReference, setBookingReference] = useState(referenceFromUrl);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBookingReference(referenceFromUrl);
  }, [referenceFromUrl]);

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
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Flatfield Air
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Cancel booking
            </h1>
            <p className="mt-2 text-slate-600">
              Enter your booking reference to cancel a confirmed booking.
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
          onSubmit={handleCancel}
          className="rounded-3xl bg-white p-6 shadow"
        >
          <label className="text-sm font-semibold text-slate-700">
            Booking reference
          </label>

          <input
            value={bookingReference}
            onChange={(event) => setBookingReference(event.target.value)}
            placeholder="FF-123ABC"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
            required
          />

          <button
            type="submit"
            className="mt-5 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
            disabled={submitting}
          >
            {submitting ? "Cancelling..." : "Cancel booking"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 rounded-2xl p-4 ${
              success
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {success && (
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="/my-bookings"
              className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Check my bookings
            </a>

            <a
              href="/flights"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white"
            >
              Search flights again
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-100 px-6 py-10">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
            Loading cancellation page...
          </div>
        </main>
      }
    >
      <CancelPageContent />
    </Suspense>
  );
}