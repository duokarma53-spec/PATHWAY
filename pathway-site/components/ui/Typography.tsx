import { cn } from "@/lib/utils";

export function Eyebrow({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("font-sans text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-gold", className)} {...props}>
      {children}
    </p>
  );
}

export function Heading({ children, className, as: Component = "h2", ...props }: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
  return (
    <Component className={cn("font-serif text-text-primary", className)} {...props}>
      {children}
    </Component>
  );
}

export function BodyText({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-text-secondary leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}