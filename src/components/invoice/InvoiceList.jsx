import InvoiceItem from "./InvoiceItem";
import EmptyState from "./EmptyState";

export default function InvoiceList({ invoices, dark, isMobile, onSelect }) {
  if (invoices.length === 0) return <EmptyState dark={dark} />;

  return invoices.map((inv) => (
    <InvoiceItem
      key={inv.id}
      invoice={inv}
      dark={dark}
      isMobile={isMobile}
      onClick={() => onSelect(inv.id)}
    />
  ));
}