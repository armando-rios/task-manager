import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon?:
    | "folder"
    | "check-circle"
    | "check"
    | "activity"
    | "users"
    | "clock"
    | "trending-up"
    | "zap";
  variant?: "default" | "primary";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const iconSvgs: Record<string, string> = {
  folder: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />`,
  "check-circle": `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`,
  check: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />`,
  activity: `<path stroke-linecap="round" stroke-linejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />`,
  users: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
  clock: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`,
  "trending-up": `<path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />`,
  zap: `<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
};

const trendColors = {
  up: "text-theme-success",
  down: "text-theme-error",
  neutral: "text-theme-subtext",
};

// Hook for counting animation
function useCountAnimation(endValue: number, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (endValue === 0) {
      setDisplayValue(0);
      return;
    }

    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(
        startValue + (endValue - startValue) * easeOut,
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return displayValue;
}

export function MetricCard({
  title,
  value,
  icon = "activity",
  variant = "default",
  trend,
  trendValue,
}: Props) {
  const isPrimary = variant === "primary";
  const iconSvg = iconSvgs[icon] || iconSvgs.activity;

  // For numeric values, use animated counting; otherwise display as-is
  const numericValue = typeof value === "number" ? value : parseFloat(value);
  const isNumeric = !isNaN(numericValue);
  const animatedValue = isNumeric ? useCountAnimation(numericValue) : null;

  const displayValue =
    isNumeric && animatedValue !== null ? animatedValue : value;

  return (
    <div
      className={`
        glass-panel p-2 rounded-lg transition-all duration-300
        ${
          isPrimary
            ? "border-theme-primary/30 hover:glow-border"
            : "hover:border-theme-surface-2"
        }
      `}
    >
      <div className="flex items-center gap-2">
        {/* Icon with glow */}
        <div
          className={`
            p-1 rounded shrink-0
            ${isPrimary ? "bg-theme-primary/15 glow-primary" : "bg-theme-surface-1"}
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 text-theme-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Value */}
          <p className="text-base font-bold text-theme-text tracking-tight leading-none">
            {displayValue}
          </p>

          {/* Title */}
          <p className="text-[9px] text-theme-subtext uppercase tracking-wider font-medium">
            {title}
          </p>

          {/* Optional trend */}
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-[10px] ${trendColors[trend]}`}
            >
              {trend === "up" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              )}
              {trend === "down" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
