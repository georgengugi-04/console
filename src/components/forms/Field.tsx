import type { ReactNode } from "react";

export const inputClass =
  "w-full min-h-12 rounded-xl border border-field-line bg-field px-4 py-3 text-base text-fg placeholder:text-fg-muted transition-colors focus:border-brand focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[invalid=true]:border-danger";

type FieldProps = {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
};

/** Label + control + hint + inline error, wired with aria-describedby by the caller via `describedBy(id,...)`. */
export function Field({ id, label, error, hint, optional, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-semibold text-fg-2">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-fg-muted">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

/** Off-screen honeypot. Real people never see or fill it; bots usually do. */
export function Honeypot({ register }: { register: object }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}
