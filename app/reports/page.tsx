"use client";

import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SplashScreen from "@/app/components/SplashScreen";

type Report = {
  id: string;
  createdAt: string;
  shiftDate?: string;
  shiftStart?: string;
  shiftEnd?: string;
  meterTotal: string;
  tolls: string;
  quotes: string;
  emes: string;
  shiftTotal: number;
  ownerHalf: number;
  levy: string;
  ownerAmount: number;
  dockets: string;
  fuel: string;
  eftpos: string;
  payable: number;
  driverShare?: number;
  ownerShare?: number;
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function money(value: number | undefined | null) {
  return `$${(value ?? 0).toFixed(2)}`;
}

function calculateShiftDuration(start?: string, end?: string) {
  if (!start || !end) return "";

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  let startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;

  // Handles overnight shifts
  if (endTotal < startTotal) {
    endTotal += 24 * 60;
  }

  const diff = endTotal - startTotal;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m worked`;
}

function signedMoney(value: number | undefined | null) {
  const safeValue = value ?? 0;

  if (safeValue <= 0) {
    return `-$${Math.abs(safeValue).toFixed(2)}`;
  }

  return `+$${safeValue.toFixed(2)}`;
}

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-AU");
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function ReportsPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [openDate, setOpenDate] = useState<string | null>(null);

  const swipeHandlers = useSwipeable({
  onSwipedRight: () => {
    router.push("/");
  },

  onSwipedLeft: () => {
    router.push("/driver-hub");
  },

  delta: 50,
  swipeDuration: 500,
  trackTouch: true,
  trackMouse: true,
  preventScrollOnSwipe: false,
});

  const weekStart = getMonday(new Date());
  const weekDates = weekDays.map((day, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    const isoDate = toLocalDateKey(date);

    return {
      day,
      date,
      isoDate,
    };
  });

  //useEffect(() => {
  //const timer = setTimeout(() => {
   // setShowSplash(false);
  //}, 3000);

  //return () => clearTimeout(timer);
//}, []);

  useEffect(() => {
    const savedReports = JSON.parse(
      localStorage.getItem("driver-companion-reports") || "[]"
    );

    setReports(savedReports);
  }, []);

  const weeklyGross = weekDates.reduce((total, weekDay) => {
    const dayReports = reports.filter((report) => {
      const reportDate = report.shiftDate || report.createdAt.split("T")[0];
      return reportDate === weekDay.isoDate;
    });

    const dayTotal = dayReports.reduce((sum, report) => {
      const driverShare =
        report.driverShare ??
        report.ownerHalf - (parseFloat(report.levy) || 0);

      return sum + driverShare;
    }, 0);

    return total + dayTotal;
  }, 0);

  function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

  const gstEstimate = weeklyGross * 0.1;
  const estimatedRemaining = weeklyGross - gstEstimate;

  function deleteReport(reportId: string) {
  const updatedReports = reports.filter((report) => report.id !== reportId);

  setReports(updatedReports);

  localStorage.setItem(
    "driver-companion-reports",
    JSON.stringify(updatedReports)
  );

}

  if (showSplash) {
    return <SplashScreen />;
  }

  return <SplashScreen />;

  return (
    <main
  {...swipeHandlers}
  className="min-h-screen bg-gradient-to-b from-[#2f2f30] via-[#2b2b2c] to-[#242425] p-5 text-zinc-100">
      <div className="mx-auto max-w-md space-y-5">
      <section className="rounded-2xl bg-[#3a3a3b] p-4">
          <h1 className="text-3xl font-bold">Weekly Reports</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Week: {formatDate(weekDates[0].date)} -{" "}
            {formatDate(weekDates[6].date)}
          </p>
        </section>

        <section className="space-y-3 rounded-2xl bg-[#3a3a3b] p-4">
          {weekDates.map((weekDay) => {
            const dayReports = reports.filter((report) => {
              const reportDate =
                report.shiftDate || report.createdAt.split("T")[0];

              return reportDate === weekDay.isoDate;
            });

            const dayTotal = dayReports.reduce((sum, report) => {
              const driverShare =
                report.driverShare ??
                report.ownerHalf - (parseFloat(report.levy) || 0);

              return sum + driverShare;
            }, 0);

            const isOpen = openDate === weekDay.isoDate;

            return (
              <div
                key={weekDay.isoDate}
                className="rounded-xl border border-[#4a4a4b] bg-[#2f2f30] p-4"
              >
                <button
                  onClick={() =>
                    setOpenDate(isOpen ? null : weekDay.isoDate)
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">
                        {formatDate(weekDay.date)}
                      </p>

                      <p className="mt-1 text-xl font-bold text-zinc-100">
                        {weekDay.day}
                      </p>
                    </div>

                    <p className="text-2xl font-black text-emerald-300">
                      {money(dayTotal)}
                    </p>
                  </div>
                </button>

                {isOpen && dayReports.length > 0 && (
                  <div className="mt-4 space-y-4 border-t border-[#4a4a4b] pt-4">
                    {dayReports.map((report) => {
                      const driverShare =
                        report.driverShare ??
                        report.ownerHalf - (parseFloat(report.levy) || 0);

                        const ownerShare =
                        report.ownerShare ??
                        report.ownerHalf + (parseFloat(report.levy) || 0);

                      return (

                        <div
                          key={report.id}
                          className="rounded-xl bg-[#242425] p-4 text-sm"
                        >
                          <p className="mb-4 font-semibold text-zinc-200">
                            {formatDate(parseLocalDate(report.shiftDate || report.createdAt.split("T")[0]))} •{" "}
                            {parseLocalDate(
                              report.shiftDate || report.createdAt.split("T")[0]
                            ).toLocaleDateString("en-AU", {
                              weekday: "long",
                            })}
                          </p>

                          {report.shiftStart && report.shiftEnd && (
                            <div className="mb-4 flex justify-between text-sm text-zinc-400">
                                <span>
                                Shift: {report.shiftStart} - {report.shiftEnd}
                                </span>

                                <span>
                                {calculateShiftDuration(report.shiftStart, report.shiftEnd)}
                                </span>
                            </div>
                            )}

                          <ReceiptRow
                            label="Meter Total"
                            value={money(parseFloat(report.meterTotal) || 0)}
                            underline
                            />
                          <ReceiptRow label="Less Tolls" value={signedMoney(-(parseFloat(report.tolls) || 0))} />
                          <ReceiptRow label="Plus Quotes" value={`+$${(parseFloat(report.quotes) || 0).toFixed(2)}`} />
                          <ReceiptRow label="Less Evasions / Errors" value={signedMoney(-(parseFloat(report.emes) || 0))} underline />

                          <ReceiptRow
                            label="Shift Total"
                            value={money(report.shiftTotal)}
                            underline
                            />

                          <ReceiptRow label="Owner 50%" value={money(report.ownerHalf)} />

                            <ReceiptRow
                            label="Plus Shift Levy"
                            value={signedMoney(parseFloat(report.levy) || 0)}
                            underline
                            />

                            <ReceiptRow
                            label="Owner Amount"
                            value={money(ownerShare)}
                            underline
                            />

                          <ReceiptRow label="Less Owner Dockets" value={signedMoney(-(parseFloat(report.dockets) || 0))} />
                          <ReceiptRow label="Less Fuel Cash" value={signedMoney(-(parseFloat(report.fuel) || 0))} />
                          <ReceiptRow
                            label="Less EFTPOS"
                            value={signedMoney(-(parseFloat(report.eftpos) || 0))}
                            underline
                            />

                            <div className="pt-3">
                            <ReceiptRow
                                label="Settlement"
                                value={signedMoney(report.payable)}
                                doubleUnderline
                                strong
                            />
                            </div>

                          <p className="mt-2 text-right text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                            {report.payable >= 0
                              ? "Pay Into Envelope"
                              : "Payable to Driver"}
                          </p>

                          <div className="mt-5 border-t border-[#4a4a4b] pt-4">
                            <ReceiptRow label="Driver Share" value={money(driverShare)} />
                            <ReceiptRow label="Owner Share" value={money(ownerShare)} />
                          </div>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="mt-4 w-full rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                            >
                            Delete Report
                            </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <section className="space-y-4 rounded-2xl bg-[#3a3a3b] p-4">
          <SummaryRow label="Weekly Gross Earnings" value={money(weeklyGross)} highlight />
          <SummaryRow label="Estimated GST 10%" value={money(gstEstimate)} warning />

          <div className="border-t border-[#4a4a4b] pt-4">
            <SummaryRow label="Estimated Remaining" value={money(estimatedRemaining)} strong />
          </div>
        </section>

        <footer className="pb-4 pt-2 text-center text-xs text-zinc-400">
          Stephan Grimwood • Version 1.2 • May 2026
        </footer>
      </div>
    </main>
  );
}

function ReceiptRow({
  label,
  value,
  underline = false,
  doubleUnderline = false,
  strong = false,
  spacer = false,
}: {
  label: string;
  value: string;
  underline?: boolean;
  doubleUnderline?: boolean;
  strong?: boolean;
  spacer?: boolean;
}) {
  return (
    <div className={`${spacer ? "mt-4" : "mt-2"} grid grid-cols-[1fr_110px] gap-4`}>
      <span className="text-zinc-300">{label}</span>

      <span
        className={`text-right tabular-nums ${
          strong ? "font-semibold text-zinc-100" : "text-zinc-200"
        } ${
          underline
            ? "border-b border-zinc-400 pb-1.5"
            : doubleUnderline
            ? "border-b-4 border-double border-zinc-300 pb-1"
            : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
  warning = false,
  strong = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between text-lg">
      <span className="text-zinc-300">{label}</span>

      <span
        className={`font-bold tabular-nums ${
          highlight
            ? "text-emerald-300"
            : warning
            ? "text-red-300"
            : strong
            ? "text-zinc-100"
            : "text-zinc-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}