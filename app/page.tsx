"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [meterTotal, setMeterTotal] = useState("0.00");
  const [shiftDate, setShiftDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tolls, setTolls] = useState("0.00");
  const [quotes, setQuotes] = useState("0.00");
  const [emes, setEmes] = useState("0.00");
  const [levy] = useState("5.50");
  const [dockets, setDockets] = useState("0.00");
  const [fuel, setFuel] = useState("0.00");
  const [eftpos, setEftpos] = useState("0.00");
  const [saveMessage, setSaveMessage] = useState("");
  const [reports, setReports] = useState<any[]>([]);

  const shiftTotal =
    (parseFloat(meterTotal) || 0) -
    (parseFloat(tolls) || 0) +
    (parseFloat(quotes) || 0) -
    (parseFloat(emes) || 0);

  const ownerHalf = shiftTotal / 2;

  const ownerAmount = ownerHalf + (parseFloat(levy) || 0);

  const payable =
    ownerAmount -
    (parseFloat(dockets) || 0) -
    (parseFloat(fuel) || 0) -
    (parseFloat(eftpos) || 0);

  const displayOwnerAmount =
    shiftTotal > 0 ? ownerAmount : 0;

  const displayDriverShare =
    shiftTotal > 0 ? shiftTotal - ownerAmount : 0;

  const displayPayable =
    shiftTotal > 0 ? payable : 0;

  const driverShare =
  shiftTotal > 0 ? ownerHalf - (parseFloat(levy) || 0) : 0;

  const ownerShare =
  shiftTotal > 0 ? ownerAmount : 0;

    function saveReport() {
      

  const now = new Date();

  const report = {
    id: now.toISOString(),
    createdAt: now.toISOString(),
    shiftDate,
    meterTotal,
    tolls,
    quotes,
    emes,
    shiftTotal,
    ownerHalf,
    levy,
    ownerAmount,
    dockets,
    fuel,
    eftpos,
    payable,
    driverShare,
    ownerShare,
  };

  const existingReports = JSON.parse(
    localStorage.getItem("driver-companion-reports") || "[]"
  );

  const updatedReports = [report, ...existingReports];

  localStorage.setItem(
    "driver-companion-reports",
    JSON.stringify(updatedReports)
  );

  setReports(updatedReports);

  setSaveMessage("Report saved");

  setTimeout(() => {
    setSaveMessage("");
  }, 3000);
  setMeterTotal("0.00");
  setTolls("0.00");
  setQuotes("0.00");
  setEmes("0.00");
  setDockets("0.00");
  setFuel("0.00");
  setEftpos("0.00");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2f2f30] via-[#2b2b2c] to-[#242425] p-5 text-zinc-100">
      <div className="mx-auto max-w-md space-y-5">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-zinc-100">
            Driver Companion
          </h1>

          <p className="text-sm font-medium tracking-[0.15em] text-zinc-400 uppercase">
            Shift Income Report Calculator
          </p>
        </div>

        <section className="space-y-3 rounded-2xl bg-[#3a3a3b] p-4">

          <label className="block">
            <span className="text-sm text-zinc-300">
              Shift Start Date
            </span>

            <input
              type="date"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#7b7b7c] bg-[#2f2f30] px-4 py-3 text-lg text-zinc-100 outline-none color-scheme-dark focus:border-[#b8b8ba]"
            />
          </label>
          
          <MoneyInput label="Meter Total" value={meterTotal} setValue={setMeterTotal} />
          <MoneyInput label="Less Tolls" value={tolls} setValue={setTolls} />
          <MoneyInput label="Plus Quotes" value={quotes} setValue={setQuotes} />
          <MoneyInput
                      label="Less Evasions or Meter Errors"
                      value={emes}
                      setValue={setEmes}
                    />
          <MoneyInput label="Less Owner Dockets" value={dockets} setValue={setDockets} />
          <MoneyInput label="Less Fuel Cash (if any)" value={fuel} setValue={setFuel} />
          <MoneyInput label="Less EFTPOS" value={eftpos} setValue={setEftpos} />
        </section>

        <section className="space-y-3 rounded-2xl bg-[#3a3a3b] p-4">
          <Result label="Shift Total" value={shiftTotal} />
          <div>
            <Result label="Owner 50%" value={displayOwnerAmount} />
            <p className="text-xs text-zinc-400">
              + $5.50 shift levy included
            </p>
          </div>
            <Result
              label="Driver Share"
              value={displayDriverShare}
            />

          <div
              className={`rounded-2xl border p-5 text-center ${
                displayPayable >= 0
                  ? "border-red-400/50 bg-red-500/10"
                  : "border-emerald-400/50 bg-emerald-500/10"
              }`}
            >

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">
              {displayPayable >= 0
                ? "Pay Into Envelope"
                : "Payable to Driver"}
            </p>

            <p className="mt-3 text-5xl font-black tracking-tight">
              {displayPayable >= 0 ? "+" : "-"}$
              {Math.abs(displayPayable).toFixed(2)}
            </p>

          {saveMessage && (
            <p className="mt-4 text-sm text-emerald-300">
              {saveMessage}
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={saveReport}
              className="w-full rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-2 text-center text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Save Report
            </button>

            <Link
              href="/reports"
              className="w-full rounded-xl border border-[#7b7b7c] bg-[#2f2f30] px-5 py-2 text-center text-sm font-semibold text-zinc-200 transition hover:bg-[#3a3a3b]"
            >
              Reports
            </Link>
          </div>

          </div>
        </section>

        <footer className="pb-4 pt-2 text-center text-xs text-zinc-400">
          Stephan Grimwood • Version 1.2 • May 2026
        </footer>

      </div>
    </main>
  );
}

function MoneyInput({
  label,
  value,
  setValue,
  disabled = false,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-300">{label}</span>
      <input
        type="number"
        step="0.01"
        value={value}
        disabled={disabled}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          const numberValue = parseFloat(e.target.value);

          if (!Number.isNaN(numberValue)) {
            setValue(numberValue.toFixed(2));
          }
        }}
        className="mt-1 w-full rounded-xl border border-[#7b7b7c] bg-[#2f2f30] px-4 py-3 text-lg outline-none focus:border-[#b8b8ba] disabled:opacity-60"
      />
    </label>
  );
}

function Result({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-lg">
      <span className="text-zinc-300">{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}