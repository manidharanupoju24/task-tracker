"use client";

import { useState, useEffect, useRef } from "react";

const PHASES = {
  work: { label: "Focus", duration: 25 * 60, color: "#7c3aed" },
  break: { label: "Break", duration: 5 * 60, color: "#10b981" },
};

type Phase = keyof typeof PHASES;

function playBeep() {
  try {
    const ctx = new AudioContext();
    const beeps = [0, 0.3, 0.6];
    beeps.forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
    });
  } catch {}
}

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(PHASES.work.duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = PHASES[phase].duration;
  const color = PHASES[phase].color;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playBeep();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  function switchPhase(p: Phase) {
    setIsRunning(false);
    setPhase(p);
    setTimeLeft(PHASES[p].duration);
  }

  function reset() {
    setIsRunning(false);
    setTimeLeft(PHASES[phase].duration);
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // SVG clock face
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 68;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * r;
  const progress = timeLeft / total;
  const dashoffset = circumference * (1 - progress);

  // Tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % 5 === 0;
    const inner = r - (isMajor ? 10 : 5);
    const outer = r - 1;
    return {
      x1: cx + inner * Math.cos(angle),
      y1: cy + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy + outer * Math.sin(angle),
      isMajor,
    };
  });

  // Second hand angle
  const secondAngle = ((60 - (timeLeft % 60)) / 60) * 2 * Math.PI - Math.PI / 2;
  const handLength = r - 16;

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white rounded-2xl p-4 shadow-sm">
      {/* Phase tabs */}
      <div className="flex gap-1 mb-4">
        {(Object.keys(PHASES) as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => switchPhase(p)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${
              phase === p
                ? "text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600 bg-slate-100"
            }`}
            style={phase === p ? { backgroundColor: PHASES[p].color } : {}}
          >
            {PHASES[p].label}
          </button>
        ))}
      </div>

      {/* Analog clock face */}
      <div className="flex justify-center mb-3">
        <svg width={size} height={size}>
          {/* Outer ring background */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />

          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: isRunning ? "stroke-dashoffset 1s linear" : "none" }}
          />

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1}
              x2={t.x2} y2={t.y2}
              stroke={t.isMajor ? "#94a3b8" : "#cbd5e1"}
              strokeWidth={t.isMajor ? 2 : 1}
            />
          ))}

          {/* Center dot */}
          <circle cx={cx} cy={cy} r={3} fill={color} />

          {/* Second hand */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + handLength * Math.cos(secondAngle)}
            y2={cy + handLength * Math.sin(secondAngle)}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Digital time in center */}
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fontWeight="600"
            fill="#1e293b"
            fontFamily="monospace"
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="#94a3b8"
            fontFamily="sans-serif"
          >
            {PHASES[phase].label.toUpperCase()}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning((v) => !v)}
          className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
          style={{ backgroundColor: color }}
        >
          {isRunning ? "Pause" : timeLeft === total ? "Start" : "Resume"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          ↺
        </button>
      </div>
    </div>
  );
}
