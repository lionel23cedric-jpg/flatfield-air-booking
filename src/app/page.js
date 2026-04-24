export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-white p-10 shadow">
          <p className="text-sm font-semibold text-blue-700">
            Flatfield Air
          </p>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Book regional jet flights from Dairy Flat
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Search scheduled services from Dairy Flat Airport to Sydney,
            Rotorua, Great Barrier Island, the Chatham Islands, and Lake Tekapo.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/flights"
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Search flights
            </a>

            <a
              href="/my-bookings"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              My bookings
            </a>

            <a
              href="/cancel"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel booking
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}