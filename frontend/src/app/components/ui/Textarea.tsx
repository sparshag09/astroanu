import { type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[#3D2F28] font-medium">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-[#FFFBF5] border-2 border-[#EFE6D6] rounded-lg
          text-[#3D2F28] placeholder:text-[#7A5B46]/50
          focus:border-[#C89B3C] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/20
          transition-all duration-300 resize-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
