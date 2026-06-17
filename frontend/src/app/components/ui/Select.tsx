import { type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[#3D2F28] font-medium">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 bg-[#FFFBF5] border-2 border-[#EFE6D6] rounded-lg
          text-[#3D2F28]
          focus:border-[#C89B3C] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/20
          transition-all duration-300 cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
