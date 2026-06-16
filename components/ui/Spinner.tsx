import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullPage?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
  fullPage = false,
}) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-mauve border-r-transparent border-b-rose-dust border-l-transparent ${sizes[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Yükleniyor...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-ivory/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};
