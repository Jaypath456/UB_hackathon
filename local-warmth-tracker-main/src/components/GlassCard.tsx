import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl backdrop-blur-xl border transition-all duration-300",
          "bg-white/10 border-white/20",
          variant === "elevated" && "shadow-medium hover:shadow-soft",
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
