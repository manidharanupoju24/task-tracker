"use client";

import { useState, useEffect } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState<Date>(new Date());
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    fetch("https://worldtimeapi.org/api/ip")
      .then((r) => r.json())
      .then((data) => { if (data.timezone) setTimezone(data.timezone); })
      .catch(() => {}); // fallback to browser timezone

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(time);

  const tzShort = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  }).formatToParts(time).find((p) => p.type === "timeZoneName")?.value ?? "";

  const dateStr = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(time);

  return (
    <div className="text-center">
      <div className="font-mono text-xl font-bold text-slate-700 tracking-tight">{timeStr}</div>
      <div className="text-xs text-slate-400 mt-0.5">{dateStr} · {tzShort}</div>
    </div>
  );
}
