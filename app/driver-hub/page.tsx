"use client";

import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";

export default function DriverHubPage() {
  const router = useRouter();
  const swipeHandlers = useSwipeable({
        onSwipedRight: () => {
            router.push("/reports");
        },

        trackTouch: true,
        preventScrollOnSwipe: false,
        });

  return (
    <main
        {...swipeHandlers}
        className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100"
        >
      <div className="mx-auto max-w-md space-y-4">
        <button
          onClick={() => router.push("/reports")}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Back to Reports
        </button>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
          <h1 className="text-2xl font-semibold text-amber-400">
            Driver Hub
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Useful tools and planning information for your shift.
          </p>
        </section>

        <button
          onClick={() => router.push("/airport-arrivals")}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 text-left shadow-lg hover:border-amber-400"
        >
          <div className="text-lg font-semibold text-slate-100">
            Airport Arrivals
          </div>
          <div className="mt-1 text-sm text-slate-400">
            View weekly arrival activity and peak inbound windows.
          </div>
        </button>
      </div>
    </main>
  );
}