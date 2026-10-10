"use client";

import { useId, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "../shared";

type Common = { label: string; error?: string; hint?: string; className?: string };

/** Label + control + hint + error, wired together for assistive tech. */
function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: Common & { id: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5">
        {label}
        {required && <span className="text-destructive" aria-hidden="true"> *</span>}
      </Label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

const describe = (id: string, hint?: string, error?: string) =>
  [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;

export function TextField({
  label,
  error,
  hint,
  className,
  ...input
}: Common & Omit<ComponentProps<"input">, "className">) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={input.required} hint={hint} error={error} className={className}>
      <Input
        {...input}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, hint, error)}
        className={cn(input.readOnly && "bg-muted text-muted-foreground")}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  className,
  ...input
}: Common & Omit<ComponentProps<"textarea">, "className">) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={input.required} hint={hint} error={error} className={className}>
      <Textarea
        rows={4}
        {...input}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe(id, hint, error)}
      />
    </FieldShell>
  );
}

/** Customer details shared by every form, plus an off-screen honeypot for bots. */
export function ContactFields({ errors }: { errors: Record<string, string> }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="sr-only">Your details</legend>
      <TextField label="Full name" name="name" required autoComplete="name" error={errors.name} />
      <TextField label="Company" name="company" autoComplete="organization" error={errors.company} />
      <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
      <TextField
        label="Phone / WhatsApp"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        hint="Include country code"
        error={errors.phone}
      />
      <TextField label="Country" name="country" autoComplete="country-name" error={errors.country} className="sm:col-span-2" />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    </fieldset>
  );
}
