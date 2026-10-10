"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { whatsappLink, sourcingWhatsappMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../icons";
import { buttonClass } from "../shared";
import { ContactFields, TextAreaField, TextField } from "./fields";
import { ErrorBanner, SuccessPanel } from "./Feedback";
import { FileField } from "./FileField";
import { useSubmit } from "./useSubmit";

export function SourcingForm({
  initialPart = "",
  whatsappNumber,
}: {
  initialPart?: string;
  whatsappNumber: string;
}) {
  const { state, formRef, sending, errors, submit } = useSubmit("/api/sourcing");

  if (state.status === "success") {
    return (
      <SuccessPanel reference={state.reference} title="Sourcing request sent">
        <Link href="/products" className={buttonClass("default")}>
          Browse products
        </Link>
      </SuccessPanel>
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
      className="relative"
    >
     <Card>
      <CardContent className="space-y-6 p-1 sm:p-3">
      {state.status === "error" && <ErrorBanner message={state.message} />}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-bold">What do you need?</legend>
        <TextField
          label="Part name / description"
          name="partName"
          required
          defaultValue={initialPart}
          placeholder="e.g. Hydraulic proportional valve, 24 V"
          error={errors.partName}
          className="sm:col-span-2"
        />
        <TextField label="Brand / Manufacturer" name="brand" error={errors.brand} />
        <TextField label="Part / Model number" name="partNumber" error={errors.partNumber} />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          min={1}
          inputMode="numeric"
          required
          defaultValue={1}
          error={errors.quantity}
        />
        <TextField
          label="Delivery deadline"
          name="deadline"
          type="date"
          hint="Optional – when do you need it by?"
          error={errors.deadline}
        />
        <TextAreaField
          label="Additional details"
          name="details"
          placeholder="Specifications, application, condition (new / used), compatible alternatives…"
          error={errors.details}
          className="sm:col-span-2"
        />
        <div className="sm:col-span-2">
          <FileField
            label="Technical drawings, datasheets or photos of the old part"
            error={errors.files}
          />
        </div>
      </fieldset>

      <div>
        <h2 className="mb-3 text-lg font-bold">Your details</h2>
        <ContactFields errors={errors} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" variant="dark" size="lg" disabled={sending} className="flex-1">
          {sending ? "Sending…" : "Submit sourcing request"}
        </Button>
        <a
          href={whatsappLink(sourcingWhatsappMessage(initialPart || undefined), whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("whatsapp", "lg")}
        >
          <WhatsAppIcon width={22} height={22} />
          WhatsApp us
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      </CardContent>
     </Card>
    </form>
  );
}
