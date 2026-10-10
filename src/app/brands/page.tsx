import type { Metadata } from "next";
import { BrandDirectory } from "@/components/product/BrandMark";
import { Breadcrumbs, Container, PageHeader } from "@/components/shared";
import { brands } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Brands",
  description: "Brands of precision measuring tools and instruments we supply and source.",
};

export default function BrandsPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Brands" }]} />
      <PageHeader
        title="Brands we supply"
        intro="Genuine products from leading manufacturers. Don’t see your brand? We can source it."
      />
      <BrandDirectory brands={brands} />
    </Container>
  );
}
