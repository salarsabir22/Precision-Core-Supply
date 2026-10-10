import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { SourcingForm } from "@/components/forms/SourcingForm";
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
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Source a part" }]} />
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <div>
          <PageHeader title="Source a part" intro={siteConfig.sourcing.intro} />
          <SourcingForm initialPart={initialPart} whatsappNumber={siteConfig.contact.whatsapp} />
        </div>
        <aside className="text-sm lg:sticky lg:top-32">
          <h2 className="font-sans text-sm font-medium text-navy">How it works</h2>
          <ol className="mt-4 space-y-4">
            {siteConfig.sourcing.steps.map((s) => (
              <li key={s.title}>
                <p className="font-medium text-navy">{s.title}</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <h2 className="mt-8 font-sans text-sm font-medium text-navy">Import</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {siteConfig.sourcing.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </aside>
      </div>
    </Container>
  );
}
