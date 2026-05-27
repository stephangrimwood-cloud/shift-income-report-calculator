"use client";

import { useState } from "react";
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
    international: 0,
    domestic: 0,
    peakWindows: [],
    arrivals: [],
  };
});

export default function AirportArrivalsPage() {
  const router = useRouter();
    const [openDay, setOpenDay] = useState<string | null>(null);

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

            return (
              <div
                key={day.day}
                className="rounded-2xl border border-[#4a4a4b] bg-[#3a3a3b] p-4 shadow-lg"
              >
                <button
                  onClick={() => setOpenDay(isOpen ? null : day.day)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {day.day} {day.date}
                      </div>

                      <div className="mt-1 text-sm text-zinc-300">
                        Intl: {day.international} | Domestic: {day.domestic}
                      </div>
                    </div>

                    <div className="text-right text-sm text-zinc-300">
                      <div>Peak</div>
                      <div className="text-zinc-100">
                        {day.peakWindows.join(", ")}
                      </div>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-3">
                    {day.arrivals.length === 0 ? (
                      <div className="rounded-xl border border-[#4a4a4b] bg-[#2f2f30] p-3 text-sm text-zinc-300">
                        No detailed arrivals added yet.
                      </div>
                    ) : (
                      day.arrivals.map((arrival) => (
                        <div
                          key={arrival.flight}
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
                              {arrival.scheduled} → {arrival.estimated}
                            </div>

                            <div className="font-medium text-zinc-100">
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