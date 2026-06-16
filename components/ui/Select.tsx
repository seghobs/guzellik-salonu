import React from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className = "", ...props }, ref) => {
    const selectStyles = `
      w-full px-4 py-3 bg-white border rounded-sm text-xs md:text-sm tracking-wide transition-all duration-300
      text-charcoal focus:outline-none focus:ring-4 hover:border-mauve/30 hover:bg-champagne/5 cursor-pointer appearance-none
      ${
        error
          ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/10"
          : "border-champagne/70 focus:border-mauve focus:ring-mauve/10"
      }
      ${className}
    `;

    return (
      <div className="w-full flex flex-col gap-1.5 relative">
        {label && (
          <label className="text-[10px] uppercase tracking-widest text-charcoal/80 font-bold font-body">
            {label}
          </label>
        )}
        <div className="relative">
          <select ref={ref} className={selectStyles} {...props}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-charcoal">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-xs text-rose-600 font-medium tracking-wide mt-0.5 animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
