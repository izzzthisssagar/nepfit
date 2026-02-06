"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  animated?: boolean;
}

const colorStyles = {
  primary: "bg-primary-500",
  secondary: "bg-secondary-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max,
  label,
  showValue = true,
  size = "md",
  color = "primary",
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  // Determine color based on percentage if not specified
  const autoColor = percentage < 50 ? "danger" : percentage < 80 ? "warning" : "success";
  const barColor = color === "primary" ? colorStyles[autoColor] : colorStyles[color];

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-neutral-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-neutral-500">
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor} ${
            animated ? "progress-bar" : ""
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
