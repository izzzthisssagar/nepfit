"use client";

import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  elevated?: boolean;
  gradient?: "primary" | "secondary" | "accent" | "dark" | "hero" | "none";
  onClick?: () => void;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6",
  xl: "p-6 sm:p-8",
};

const gradientStyles = {
  none: "",
  primary: "gradient-primary text-white border-0",
  secondary: "gradient-secondary text-white border-0",
  accent: "gradient-accent text-white border-0",
  dark: "gradient-dark text-white border-0",
  hero: "gradient-hero border-0",
};

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  elevated = false,
  gradient = "none",
  onClick,
}: CardProps) {
  const baseStyles = gradient === "none"
    ? "bg-white border border-neutral-100"
    : "";

  return (
    <div
      className={`
        rounded-2xl
        ${baseStyles}
        ${paddingStyles[padding]}
        ${gradientStyles[gradient]}
        ${elevated ? "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]" : "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)]"}
        ${hover ? "hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer" : "transition-shadow duration-300"}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
