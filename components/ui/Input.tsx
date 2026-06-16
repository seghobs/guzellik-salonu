import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, multiline = false, className = "", rows = 4, ...props }, ref) => {
    const inputStyles = `
      w-full px-4 py-3 bg-white border rounded-sm text-xs md:text-sm tracking-wide transition-all duration-300
      placeholder-charcoal/40 text-charcoal focus:outline-none focus:ring-4 hover:border-mauve/30 hover:bg-champagne/5
      ${
        error
          ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/10"
          : "border-champagne/70 focus:border-mauve focus:ring-mauve/10"
      }
      ${className}
    `;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-bold font-body">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            className={inputStyles}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputStyles}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <span className="text-xs text-rose-600 font-medium tracking-wide mt-0.5 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
