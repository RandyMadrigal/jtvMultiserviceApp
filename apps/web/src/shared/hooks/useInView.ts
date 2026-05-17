import { useCallback, useEffect, useState } from "react";

interface Options {
  threshold?: number;
  rootMargin?: string;
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = "0px",
}: Options = {}) {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  // Callback ref so the effect re-runs when a conditionally-rendered element mounts
  const ref = useCallback((el: T | null) => setNode(el), []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin]);

  return { ref, inView };
}
