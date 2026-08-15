"use client";

import { useEffect, useState } from "react";

/**
 * Circular countdown timer. Starts at `seconds`, counts down once per
 * second, and switches from warning amber to incorrect/red once time
 * is running low. Calls onExpire when it hits zero.
 */
export default function CountdownTimer({
  seconds,
  size = 80,
  onExpire,
}: {
  seconds: number;
  size?: number;
  onExpire?: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onExpire]);

  const fraction = Math.max(timeLeft, 0) / seconds;
  const offset = circumference - fraction * circumference;
  const isLow = timeLeft <= Math.ceil(seconds * 0.2);

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 100 100"
        width={size}
        height={size}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-disabled"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={isLow ? "var(--color-incorrect)" : "var(--color-warning)"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className={`font-display font-bold ${isLow ? "text-incorrect animate-pulse" : "text-text"}`}
        style={{ fontSize: size * 0.32 }}
      >
        {Math.max(timeLeft, 0)}
      </span>
    </div>
  );
}
