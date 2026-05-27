"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";

type Arrival = {
  flight: string;
  airline: string;
  from: string;
  scheduled: string;
  estimated: string;
  status: string;
};

type ArrivalDay = {
  day: string;
  date: string;
  airportDate: string;
  international: number;
  domestic: number;
  peakWindows: string[];
  arrivals: Arrival[];
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

function formatAirportDate(date: Date) {
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
  });
}

function isInternationalArrival(from: string) {
  const internationalPorts = [
    "Singapore",
    "Denpasar Bali",
    "Bali",
    "Tokyo",
    "Osaka",
    "Auckland",
    "Christchurch",
    "Port Moresby",
  ];

  return internationalPorts.some((port) =>
    from.toLowerCase().includes(port.toLowerCase())
  );
}

function getPeakWindows(arrivals: any[]) {
  const hourCounts: Record<string, number> = {};

  arrivals.forEach((arrival) => {
    const time = arrival.estimated || arrival.scheduled;
    const hour = Number(time?.split(":")[0]);

    if (isNaN(hour)) return;

    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const busyHours = Object.entries(hourCounts)
    .filter(([, count]) => count >= 3)
    .map(([hour]) => Number(hour))
    .sort((a, b) => a - b);

  if (busyHours.length === 0) {
    return null;
  }

  const startHour = busyHours[0];
  const endHour = busyHours[busyHours.length - 1] + 1;

  return `${String(startHour).padStart(2, "0")}:00 → ${String(endHour).padStart(2, "0")}:00`;
}

function getStartOfWeek(date: Date) {
  const copiedDate = new Date(date);
  const day = copiedDate.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  copiedDate.setDate(copiedDate.getDate() + difference);
  copiedDate.setHours(0, 0, 0, 0);

  return copiedDate;
}

const weekStart = getStartOfWeek(new Date());

const arrivalWeek: ArrivalDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day, index) => {
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + index);

  return {
    day,
    date: formatDate(date),
    airportDate: formatAirportDate(date),
    international: 0,
    domestic: 0,
    peakWindows: [],
    arrivals: [],
  };
});

export default function AirportArrivalsPage() {
  const router = useRouter();
    const [openDay, setOpenDay] = useState<string | null>(null);
    const [liveArrivals, setLiveArrivals] = useState<any[]>([]);
    useEffect(() => {
    async function loadArrivals() {
        const response = await fetch("/api/airport-arrivals");
        const data = await response.json();

        if (data.ok) {
        setLiveArrivals(data.arrivals);
        }
    }

    loadArrivals();

    const refreshTimer = setInterval(() => {
        loadArrivals();
    }, 60000);

    return () => clearInterval(refreshTimer);
    }, []);

    const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
        router.push("/driver-hub");
    },

    delta: 50,
    swipeDuration: 500,
    trackTouch: true,
    trackMouse: true,
    preventScrollOnSwipe: false,
    });

  return (

    <main 
    {...swipeHandlers}
    className="min-h-screen bg-gradient-to-b from-[#2f2f30] via-[#2b2b2c] to-[#242425] p-5 text-zinc-100">
      <div className="mx-auto max-w-md space-y-5">

        <section className="rounded-2xl border border-[#4a4a4b] bg-[#3a3a3b] p-4 shadow-lg">
          <h1 className="text-2xl font-semibold text-white">
            Airport Arrivals
          </h1>

          <p className="mt-2 text-sm text-zinc-300">
            Weekly inbound flight activity and peak arrival windows.
          </p>
        </section>

        <section className="space-y-3">
          {arrivalWeek.map((day) => {
            const isOpen = openDay === day.day;
            const matchingArrivals = liveArrivals.filter(
                (arrival) => arrival.date === day.airportDate
                );

            const internationalCount = matchingArrivals.filter((arrival) =>
                isInternationalArrival(arrival.from)
                ).length;

            const domesticCount = matchingArrivals.length - internationalCount;

            const peakWindows = getPeakWindows(matchingArrivals);

            return (
              <div
                key={day.day}
                className={`rounded-2xl border p-4 shadow-lg transition-colors ${
                    day.airportDate === formatAirportDate(new Date())
                    ? "border-amber-400/30 bg-[#3f3a32]"
                    : "border-[#4a4a4b] bg-[#3a3a3b]"
                }`}
                >
                <button
                  onClick={() => setOpenDay(isOpen ? null : day.day)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-lg font-semibold text-white">
                            {day.day}
                        </div>

                        <div className="text-sm font-medium text-zinc-300">
                            {day.date}
                        </div>
                    </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <div className="rounded-full bg-sky-500/10 px-2 py-1 text-sky-200">
                            Intl: {internationalCount}
                        </div>

                        <div className="rounded-full bg-[#2f2f30] px-2 py-1 text-zinc-300">
                            Domestic: {domesticCount}
                        </div>
                        </div>
                    </div>

                    <div className="pt-2 text-right text-sm text-zinc-300">
                      <div>Peak</div>
                      <div className="text-zinc-100">
                        {peakWindows ?? "No peak window"}
                      </div>
                    </div>
                  </div>
                </button>

                {isOpen && (
                <div className="mt-4 space-y-3">
                    {matchingArrivals.length === 0 ? (
                    <div className="rounded-xl border border-[#4a4a4b] bg-[#2f2f30] p-3 text-sm text-zinc-300">
                        No arrivals listed for this day.
                    </div>
                    ) : (
                        matchingArrivals.map((arrival) => (
                            <div
                            key={`${arrival.flight}-${arrival.scheduled}`}
                            className="rounded-xl border border-[#4a4a4b] bg-[#2f2f30] p-3"
                            >
                            <div className="flex justify-between gap-4">
                                <div className="font-semibold text-white">
                                {arrival.flight} - {arrival.airline}
                                </div>

                                <div className="text-right text-sm text-zinc-300">
                                {arrival.from}
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between gap-4 text-sm">
                                <div className="text-zinc-300">
                                {arrival.scheduled} →{" "}
                                {arrival.estimated || arrival.scheduled}
                                </div>

                               <div
                                className={`font-medium ${
                                    arrival.status === "Landed"
                                    ? "text-emerald-400"
                                    : arrival.status === "Delayed"
                                    ? "text-red-400"
                                    : "text-zinc-100"
                                }`}
                                >
                                {arrival.status}
                                </div>
                            </div>
                            </div>
                        ))
                    )}
                </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}