import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon } from "../icons";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
      <AlertDescription className="text-destructive">{message}</AlertDescription>
    </Alert>
  );
}

export function SuccessPanel({
  reference,
  title,
  children,
}: {
  reference: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Card role="status">
      <CardContent className="py-6 text-center sm:py-10">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-success/10 text-success">
          <CheckIcon size={26} />
        </span>
        <h2 className="mt-4 text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-muted-foreground">
          Your reference is <strong className="font-mono text-foreground">{reference}</strong>. A confirmation email is
          on its way and our sales team will reply shortly.
        </p>
        {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
      </CardContent>
    </Card>
  );
}
