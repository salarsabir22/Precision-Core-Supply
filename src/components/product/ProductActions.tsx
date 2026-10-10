"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brandName } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { productWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { ContactFields, TextAreaField, TextField } from "../forms/fields";
import { ErrorBanner, SuccessPanel } from "../forms/Feedback";
import { FileField } from "../forms/FileField";
import { useSubmit } from "../forms/useSubmit";
import { WhatsAppIcon } from "../icons";
import { AddToQuoteButton } from "../quote/AddToQuoteButton";

const toQty = (v: string) => Math.min(1_000_000, Math.max(1, Math.floor(Number(v)) || 1));

export function ProductActions({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const qtyId = useId();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={qtyId} className="mb-1.5">
          Quantity
        </Label>
        <Input
          id={qtyId}
          type="number"
          min={1}
          max={1000000}
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(toQty(e.target.value))}
          className="w-32"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="dark" size="lg" onClick={() => setOpen(true)}>
          Inquire / Request a Quote
        </Button>
        <AddToQuoteButton product={product} quantity={quantity} size="lg" />
      </div>

      <Button
        variant="whatsapp"
        size="lg"
        className="w-full"
        nativeButton={false}
        render={
          <a
            href={whatsappLink(productWhatsappMessage(product), whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <WhatsAppIcon size={22} />
        Chat on WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </Button>

      <InquiryDialog
        product={product}
        quantity={quantity}
        onQuantity={setQuantity}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

function InquiryDialog({
  product,
  quantity,
  onQuantity,
  open,
  onOpenChange,
}: {
  product: Product;
  quantity: number;
  onQuantity: (n: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, formRef, sending, errors, submit, reset } = useSubmit("/api/inquiry");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next && state.status === "success") reset();
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Request a quote</DialogTitle>
          <DialogDescription>
            Product details are filled in for you. Tell us how to reach you and we’ll reply with pricing and lead time.
          </DialogDescription>
        </DialogHeader>

        {state.status === "success" ? (
          <SuccessPanel reference={state.reference} title="Inquiry sent">
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </SuccessPanel>
        ) : (
          <form
            ref={formRef}
            noValidate
            className="relative space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              void submit(e.currentTarget, { items: JSON.stringify([{ slug: product.slug, quantity }]) });
            }}
          >
            {state.status === "error" && <ErrorBanner message={state.message} />}

            <fieldset className="grid gap-4 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2">
              <legend className="px-1 text-sm font-semibold">Product (auto-filled)</legend>
              <TextField label="Product" value={product.name} readOnly className="sm:col-span-2" />
              <TextField label="Brand" value={brandName(product.brand)} readOnly />
              <TextField label="SKU" value={product.sku} readOnly />
              <TextField label="Manufacturer Part Number (MPN)" value={product.mpn} readOnly />
              <TextField
                label="Quantity required"
                type="number"
                min={1}
                inputMode="numeric"
                value={quantity}
                onChange={(e) => onQuantity(toQty(e.target.value))}
              />
            </fieldset>

            <ContactFields errors={errors} />
            <TextAreaField
              label="Message"
              name="message"
              placeholder="Application, delivery location, required certifications…"
              error={errors.message}
            />
            <FileField error={errors.files} />

            <Button type="submit" size="lg" variant="dark" disabled={sending} className="w-full">
              {sending ? "Sending…" : "Send inquiry"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
