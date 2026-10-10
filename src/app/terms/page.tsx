import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Inquiries & Quotations" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Inquiries & Quotations">
      <h2>Inquiries</h2>
      <p>
        Submitting a quote request or sourcing request on this website is an invitation for {siteConfig.name} to
        provide a quotation. It is not an order and does not create a binding contract.
      </p>
      <h2>Quotations</h2>
      <ul>
        <li>Quotations are valid for the period stated on the quotation.</li>
        <li>Prices and availability are subject to change by manufacturers and suppliers until an order is confirmed.</li>
        <li>Lead times for imported goods are estimates and depend on suppliers, freight and customs clearance.</li>
      </ul>
      <h2>Product information</h2>
      <p>
        Specifications, images and documents are provided for guidance. Please confirm critical specifications with us
        before ordering.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${siteConfig.contact.publicEmail}`} className="text-navy underline underline-offset-2">
          {siteConfig.contact.publicEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
