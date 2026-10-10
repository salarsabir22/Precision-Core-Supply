import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { buttonClass, Container, PageHeader } from "@/components/shared";

export default function NotFound() {
  return (
    <Container className="py-16">
      <PageHeader
        title="Page not found"
        intro="Search for a part number, or send a sourcing request if the item is not listed."
      />
      <SearchBar className="mt-6 max-w-xl" id="notfound-search" />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/products" className={buttonClass("default")}>
          Browse products
        </Link>
        <Link href="/source" className={buttonClass("outline")}>
          Source a part
        </Link>
      </div>
    </Container>
  );
}
