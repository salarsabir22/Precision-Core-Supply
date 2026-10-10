import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { QuoteBasket } from "@/components/quote/QuoteBasket";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";

export const metadata: Metadata = {
  title: "Quote basket",
  description: "Review your selected products, set quantities and send one request for quotation.",
  robots: { index: false },
};

export default function QuotePage() {
  return (
    <Container className="py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quote basket" }]} />
      <PageHeader
        title="Your quote basket"
        intro="Review your items, set quantities, attach drawings or notes, and send everything in one request."
      />
      <QuoteBasket whatsappNumber={siteConfig.contact.whatsapp} />
    </Container>
  );
}
