import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { SourcingForm } from "@/components/forms/SourcingForm";
import { CheckIcon } from "@/components/icons";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";

export const metadata: Metadata = {
  title: "Source a part – custom import request",
  description:
    "Can’t find the part you need? We source and import precision measuring tools and instruments worldwide. Send us the details.",
};

export default async function SourcePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { part } = await searchParams;
  const initialPart = (Array.isArray(part) ? part[0] : part)?.slice(0, 200) ?? "";

  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Source a part" }]} />
      <PageHeader title="Source a part / custom import request" intro={siteConfig.sourcing.intro} />

      <div className="grid items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="order-2 space-y-6 bg-navy p-5 text-white lg:sticky lg:top-40 lg:order-1">
          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-gold">How it works</h2>
            <ol className="space-y-4">
              {siteConfig.sourcing.steps.map((s, i) => (
                <li key={s.title}>
                  <p className="font-semibold">
                    {String(i + 1).padStart(2, "0")} {s.title}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-gold">Import</h2>
            <ul className="space-y-2 text-sm">
              {siteConfig.sourcing.capabilities.map((c) => (
                <li key={c} className="flex gap-2">
                  <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold" />
                  <span className="text-white/80">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="order-1 lg:order-2">
          <SourcingForm initialPart={initialPart} whatsappNumber={siteConfig.contact.whatsapp} />
        </div>
      </div>
    </Container>
  );
}
