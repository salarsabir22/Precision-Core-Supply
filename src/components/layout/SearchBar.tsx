import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "../icons";
import { cn } from "../shared";

/** Plain GET form: works without JavaScript and is fully keyboard accessible. */
export function SearchBar({
  defaultValue,
  className,
  size = "md",
  autoFocus,
  id = "site-search",
  tone = "default",
}: {
  defaultValue?: string;
  className?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  id?: string;
  tone?: "default" | "on-dark";
}) {
  const lg = size === "lg";
  const onDark = tone === "on-dark";
  return (
    <form action="/search" role="search" className={cn("flex w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Search by part number, brand or product name
      </label>
      <Input
        id={id}
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Manufacturer part number, make or name"
        className={cn(
          "rounded-r-none border-r-0 text-base",
          lg ? "h-12 px-4" : "h-10 md:text-sm",
          onDark ? "border-transparent bg-white text-navy placeholder:text-muted-foreground" : "bg-card",
        )}
      />
      <Button
        type="submit"
        variant="default"
        size={lg ? "lg" : "default"}
        className={cn(
          "rounded-l-none",
          lg ? "h-12 px-5" : "h-10",
          onDark ? "bg-gold text-navy hover:bg-gold/90" : "bg-blue text-white hover:bg-blue/90",
        )}
      >
        <SearchIcon size={18} />
        <span className={lg ? "" : "sr-only sm:not-sr-only"}>Search</span>
      </Button>
    </form>
  );
}
