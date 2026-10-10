"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "../shared";
import { TextAreaField, TextField } from "./fields";
import { ErrorBanner, SuccessPanel } from "./Feedback";
import { useSubmit } from "./useSubmit";

/**
 * General contact form. `compact` is the short variant used in the home hero;
 * the full variant (with company / country / subject) lives on the Contact page.
 */
export function ContactForm({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const { state, formRef, sending, errors, submit } = useSubmit("/api/contact");

  if (state.status === "success") {
    return (
      <div className={className}>
        <SuccessPanel reference={state.reference} title="Message sent" />
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
      className={cn("relative", className)}
    >
      <Card className="gap-0 rounded-lg border-border bg-white py-0 text-card-foreground shadow-sm">
        <CardContent className="space-y-5 px-5 py-6 sm:px-7 sm:py-8">
          <div>
            <h2 className={cn("text-navy", compact ? "text-xl" : "text-2xl")}>Send a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {compact
                ? "Part enquiry or question? We reply within one business day."
                : "Questions, part enquiries or anything else – we usually reply within one business day."}
            </p>
          </div>

          {state.status === "error" && <ErrorBanner message={state.message} />}

          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <TextField label="Full name" name="name" required autoComplete="name" error={errors.name} />
            {compact ? (
              <TextField
                label="Phone / WhatsApp"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Optional"
                error={errors.phone}
              />
            ) : (
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                error={errors.email}
              />
            )}

            {compact ? (
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                error={errors.email}
                className="sm:col-span-2"
              />
            ) : (
              <>
                <TextField
                  label="Phone / WhatsApp"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  hint="Optional – include country code"
                  error={errors.phone}
                />
                <TextField label="Company" name="company" autoComplete="organization" error={errors.company} />
                <TextField label="Country" name="country" autoComplete="country-name" error={errors.country} />
                <TextField label="Subject" name="subject" error={errors.subject} />
              </>
            )}

            <TextAreaField
              label="Message"
              name="message"
              required
              rows={compact ? 3 : 5}
              placeholder="Part number, brand, quantity or any question…"
              error={errors.message}
              className="sm:col-span-2"
            />
          </div>

          {/* Honeypot: real users never see or fill this. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Leave this field empty
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Button type="submit" size="lg" disabled={sending} className="w-full">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
