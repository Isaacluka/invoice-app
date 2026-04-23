import { useState } from "react";
import { useInvoices } from "../../context/InvoiceContext";
import InvoiceListItem from "./InvoiceListItem";
import InvoiceDetail from "./InvoiceDetail";
import InvoiceForm from "./InvoiceForm";
import EmptyState from "./EmptyState";
import Filter from "./Filter";

export default function InvoicePage() {
  const { state, dispatch } = useInvoices();
  const { invoices, selectedId, filter } = state;

  const [showForm, setShowForm] = useState(false);

  const filtered =
    filter.length === 0
      ? invoices
      : invoices.filter(i => filter.includes(i.status));

  const selected = invoices.find(i => i.id === selectedId);

  if (selected) {
    return (
      <InvoiceDetail
        invoice={selected}
        onBack={() => dispatch({ type: "SET_SELECTED", payload: null })}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between mb-6">
        <Filter
          selected={filter}
          onChange={(f) =>
            dispatch({ type: "SET_FILTER", payload: f })
          }
        />

        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-full"
        >
          New Invoice
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        filtered.map(inv => (
          <InvoiceListItem
            key={inv.id}
            invoice={inv}
            onClick={() =>
              dispatch({ type: "SET_SELECTED", payload: inv.id })
            }
          />
        ))
      )}

      {showForm && <InvoiceForm onClose={() => setShowForm(false)} />}
    </div>
  );
}