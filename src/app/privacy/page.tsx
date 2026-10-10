import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains how {siteConfig.name} handles personal information submitted through this website.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you provide in quote and sourcing forms (name, company, email, phone, country).</li>
        <li>The products, quantities, messages and files you submit with a request.</li>
        <li>Your quote basket, which is stored only in your browser until you submit it.</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        We use this information to respond to your inquiry, prepare quotations, source products and arrange delivery.
        We send you a confirmation email for each request.
      </p>
      <h2>Sharing</h2>
      <p>
        We may share request details with suppliers and freight partners only as needed to fulfil your request. We do
        not sell personal information.
      </p>
      <h2>Retention and your rights</h2>
      <p>
        You can ask us to access, correct or delete your information at any time by contacting{" "}
        <a href={`mailto:${siteConfig.contact.publicEmail}`} className="text-navy underline underline-offset-2">
          {siteConfig.contact.publicEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
