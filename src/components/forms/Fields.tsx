import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Alert } from "@/components/ui/Icons";
import styles from "./Forms.module.css";

type Base = { id: string; label: string; error?: string; hint?: string; required?: boolean; optionalText?: string };

function Shell({ id, label, error, hint, required, optionalText = "Optional", children }: Base & { children: ReactNode }) {
  return (
    <div className={styles.field} data-invalid={error ? true : undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.req} aria-hidden="true">
            *
          </span>
        ) : (
          <span className={styles.optional}>{optionalText}</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <Alert aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;

export function TextField({ id, label, error, hint, required, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        name={id}
        className={styles.control}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </Shell>
  );
}

export function TextArea({ id, label, error, hint, required, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        name={id}
        className={`${styles.control} ${styles.textarea}`}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </Shell>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  options,
  placeholder,
  ...rest
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder: string }) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <div className={styles.selectWrap}>
        <select
          id={id}
          name={id}
          className={`${styles.control} ${styles.select}`}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </Shell>
  );
}

/** Off-screen field that only bots fill in. */
export function Honeypot() {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function FormStatus({ tone, title, children }: { tone: "error" | "success" | "info"; title: string; children?: ReactNode }) {
  return (
    <div className={`${styles.status} ${styles[`status_${tone}`]}`} role={tone === "error" ? "alert" : "status"}>
      <p className={styles.statusTitle}>{title}</p>
      {children && <div className={styles.statusBody}>{children}</div>}
    </div>
  );
}
