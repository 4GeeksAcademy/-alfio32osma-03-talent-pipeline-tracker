"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  paramName?: string;
  debounceMs?: number;
};

export default function GlobalSearchInput({
  className,
  placeholder = "Buscar candidatos...",
  ariaLabel = "Buscar candidatos",
  paramName = "q",
  debounceMs = 250,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentValue = searchParams.get(paramName) ?? "";
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value === currentValue) return;

      const params = new URLSearchParams(Array.from(searchParams.entries()));
      const trimmedValue = value.trim();

      if (trimmedValue) {
        params.set(paramName, trimmedValue);
      } else {
        params.delete(paramName);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, currentValue, searchParams, paramName, pathname, router, debounceMs]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={className}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoComplete="off"
    />
  );
}
