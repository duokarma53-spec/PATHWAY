import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Grid({ children, className, ...props }: GridProps) {
  return (
    <div className={cn("grid-system", className)} {...props}>
      {children}
    </div>
  );
}