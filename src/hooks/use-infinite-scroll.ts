import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(options.onIntersect);

  useEffect(() => {
    callbackRef.current = options.onIntersect;
  }, [options.onIntersect]);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        callbackRef.current();
      }
    },
    []
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || options.enabled === false) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold: options.threshold ?? 0,
      rootMargin: options.rootMargin ?? "100px",
      root: options.root ?? null,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [observerCallback, options.threshold, options.rootMargin, options.root, options.enabled]);

  return { sentinelRef };
}
