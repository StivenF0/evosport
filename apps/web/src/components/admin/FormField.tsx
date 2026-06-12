import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
