export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200">
          <div
            className="relative bg-cover bg-center px-8 py-12 md:px-12 md:py-16"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.68), rgba(14, 165, 233, 0.25)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="grid gap-10 md:grid-cols-[1.35fr_0.65fr] md:items-center">
              <div>
                <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-blue-100 ring-1 ring-white/30">
                  Flatfield Air
                </p>

                <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
                  Book regional jet flights from Dairy Flat
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50 md:text-lg">
                  Search scheduled services from Dairy Flat Airport to Sydney,
                  Rotorua, Great Barrier Island, the Chatham Islands, and Lake
                  Tekapo.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="/flights"
                    className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
                  >
                    Search flights
                  </a>

                  <a
                    href="/my-bookings"
                    className="rounded-2xl bg-white/95 px-6 py-3 font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    My bookings
                  </a>

                  <a
                    href="/cancel"
                    className="rounded-2xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    Cancel booking
                  </a>
                </div>
              </div>

              <div className="rounded-3xl bg-white/15 p-5 text-white shadow-2xl ring-1 ring-white/25 backdrop-blur">
                <p className="text-sm font-semibold text-blue-100">
                  Fleet highlight
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Small aircraft. Direct routes.
                </h2>

                <div className="mt-5 space-y-3 text-sm text-blue-50">
                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                    <p className="font-semibold text-white">SyberJet SJ30i</p>
                    <p className="mt-1">Prestige Sydney service · 6 seats</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                    <p className="font-semibold text-white">Cirrus SF50 Jets</p>
                    <p className="mt-1">Rotorua and Great Barrier services</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                    <p className="font-semibold text-white">HondaJet Elite</p>
                    <p className="mt-1">Chatham Islands and Lake Tekapo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-white p-6 md:grid-cols-3">
            <a
              href="/flights"
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white shadow">
                ✈
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Search scheduled flights
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose a route and date range to find available flights,
                especially for less frequent services.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-700 group-hover:text-blue-600">
                Start searching →
              </p>
            </a>

            <a
              href="/my-bookings"
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow">
                📄
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                View my bookings
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter a passenger email address to fetch all scheduled flights
                linked to that passenger.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-700 group-hover:text-blue-600">
                Manage bookings →
              </p>
            </a>

            <a
              href="/cancel"
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl text-white shadow">
                ×
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Cancel a booking
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use your unique booking reference to cancel an existing
                confirmed booking.
              </p>

              <p className="mt-4 text-sm font-semibold text-red-700 group-hover:text-red-600">
                Cancel safely →
              </p>
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-blue-700">Sydney</p>
            <p className="mt-1 text-sm text-slate-600">
              Weekly prestige service
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-blue-700">Rotorua</p>
            <p className="mt-1 text-sm text-slate-600">
              Twice every weekday
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-blue-700">
              Great Barrier
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Three services weekly
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-blue-700">
              Chatham Islands
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Twice weekly service
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}