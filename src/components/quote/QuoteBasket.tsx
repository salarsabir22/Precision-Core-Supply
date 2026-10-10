"use client";

import Link from "next/link";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { brandName } from "@/lib/catalog";
import { basketWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { ContactFields, TextAreaField } from "../forms/fields";
import { ErrorBanner, SuccessPanel } from "../forms/Feedback";
import { FileField } from "../forms/FileField";
import { useSubmit } from "../forms/useSubmit";
import { BasketIcon, TrashIcon, WhatsAppIcon } from "../icons";
import { buttonClass } from "../shared";
import { useQuote } from "./QuoteProvider";

export function QuoteBasket({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, ready, remove, setQuantity, setNote, clear } = useQuote();
  const { state, formRef, sending, errors, submit } = useSubmit("/api/inquiry");

  if (state.status === "success") {
    return (
      <SuccessPanel reference={state.reference} title="Quote request sent">
        <Link href="/products" className={buttonClass("default")}>
          Continue browsing
        </Link>
      </SuccessPanel>
    );
  }

  if (!ready) {
    return (
      <p className="text-muted-foreground" role="status">
        Loading your quote…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center">
          <BasketIcon size={40} className="mx-auto text-muted-foreground" />
          <h2 className="mt-3 text-xl font-bold">Your quote basket is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Click “Add to Quote” on any product to build a list, then send everything to us in a single request.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/products" className={buttonClass("default")}>
              Browse products
            </Link>
            <Link href="/source" className={buttonClass("outline")}>
              Can’t find a part? Source it
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_26rem] lg:items-start">
      <section aria-labelledby="items-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="items-heading" className="text-lg font-bold">
            {items.length} {items.length === 1 ? "item" : "items"} in your quote
          </h2>
          <Button type="button" variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
            Clear all
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <BasketRow
              key={item.slug}
              item={item}
              onQuantity={(n) => setQuantity(item.slug, n)}
              onNote={(n) => setNote(item.slug, n)}
              onRemove={() => remove(item.slug)}
            />
          ))}
        </ul>
        <Link href="/products" className="mt-4 inline-block text-sm font-medium text-navy underline underline-offset-2">
          + Add more products
        </Link>
      </section>

      <Card className="lg:sticky lg:top-32">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Send your quote request</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await submit(e.currentTarget, {
                items: JSON.stringify(items.map(({ slug, quantity, note }) => ({ slug, quantity, note }))),
              });
              if (ok) clear();
            }}
            className="relative space-y-5"
          >
            {state.status === "error" && <ErrorBanner message={state.message} />}
            {errors.items && <ErrorBanner message={errors.items} />}
            <ContactFields errors={errors} />
            <TextAreaField
              label="Notes"
              name="message"
              placeholder="Delivery location, required timeline, certifications…"
              error={errors.message}
            />
            <FileField label="Attach drawings / documents" error={errors.files} />
            <Button type="submit" variant="dark" size="lg" disabled={sending} className="w-full">
              {sending ? "Sending…" : "Submit quote request"}
            </Button>
            <a
              href={whatsappLink(basketWhatsappMessage(items), whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("whatsapp", "default", "w-full")}
            >
              <WhatsAppIcon size={20} />
              Send list on WhatsApp instead
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function BasketRow({
  item,
  onQuantity,
  onNote,
  onRemove,
}: {
  item: ReturnType<typeof useQuote>["items"][number];
  onQuantity: (n: number) => void;
  onNote: (n: string) => void;
  onRemove: () => void;
}) {
  const qtyId = useId();
  const noteId = useId();
  return (
    <li>
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link href={`/products/${item.slug}`} className="font-semibold hover:underline">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                {brandName(item.brand)} · MPN <span className="font-mono text-foreground">{item.mpn}</span> · SKU{" "}
                <span className="font-mono">{item.sku}</span>
              </p>
            </div>
            <div className="flex items-end gap-3">
              <div>
                <Label htmlFor={qtyId} className="mb-1 text-xs text-muted-foreground">
                  Qty
                </Label>
                <Input
                  id={qtyId}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={item.quantity}
                  onChange={(e) => onQuantity(Number(e.target.value))}
                  className="w-24"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onRemove}
                aria-label={`Remove ${item.name}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <TrashIcon size={18} />
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <Label htmlFor={noteId} className="mb-1 text-xs text-muted-foreground">
              Note for this item (optional)
            </Label>
            <Input
              id={noteId}
              type="text"
              maxLength={500}
              value={item.note ?? ""}
              onChange={(e) => onNote(e.target.value)}
              placeholder="e.g. coil voltage, thread type, alternative acceptable"
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
