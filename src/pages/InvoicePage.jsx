import { useInvoiceContext } from "../context/InvoiceContext";
import InvoiceDetail from "../components/invoice/InvoiceDetail";

export default function InvoicePage({ bp, invoice }) {
  const { dark, setView, setSelectedId, handleEdit, handleDelete, handleMarkPaid } =
    useInvoiceContext();

  if (!invoice) return null;

  return (
    <InvoiceDetail
      invoice={invoice}
      dark={dark}
      bp={bp}
      onBack={() => {
        setView("list");
        setSelectedId(null);
      }}
      onEdit={() => handleEdit(invoice)}
      onDelete={handleDelete}
      onMarkPaid={handleMarkPaid}
    />
  );
}