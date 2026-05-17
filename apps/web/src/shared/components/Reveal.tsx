import { type ReactNode } from "react";
import { useInView } from "@/shared/hooks/useInView";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  zoom?: boolean;
}

export function Reveal({ children, className = "", delay = 0, zoom = false }: RevealProps) {
  const { ref, inView } = useInView();
  const animation = zoom
    ? "animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
    : "animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both";

  return (
    <div
      ref={ref}
      className={`${inView ? animation : "opacity-0"} ${className}`}
      style={inView && delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
