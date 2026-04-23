import { useMemo } from "react";

export const useInvoices = (invoices, selectedId, filter) => {
  const selected = useMemo(
    () => invoices.find((i) => i.id === selectedId),
    [invoices, selectedId]
  );

  const filtered = useMemo(() => {
    if (filter.length === 0) return invoices;
    return invoices.filter((i) => filter.includes(i.status));
  }, [invoices, filter]);

  return { selected, filtered };
};