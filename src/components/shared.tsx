import Link from "next/link";
import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Fragment, type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";

export { cn };

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

/** shadcn button styles for anything that isn't a <button> (e.g. next/link). */
export const buttonClass = (variant: ButtonVariant = "default", size: ButtonSize = "default", extra?: string) =>
  cn(buttonVariants({ variant, size }), extra);

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function PageHeader({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8 border-l-4 border-gold bg-card px-5 py-5 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">{title}</h1>
      {intro && <p className="mt-2 max-w-2xl text-muted-foreground">{intro}</p>}
      {children}
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink render={<Link href={item.href} />}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function SectionHeading({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-2 h-1 w-10 bg-gold" aria-hidden />
        <h2 className="text-2xl font-semibold tracking-tight text-navy">{title}</h2>
        {intro && <p className="mt-1 max-w-xl text-sm text-muted-foreground">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
