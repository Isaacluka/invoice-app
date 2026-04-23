import Button from "../ui/Button";
import { useInvoices } from "../../context/InvoiceContext";
import { calcTotal } from "../../utils/helpers";

export default function InvoiceDetail({ invoice, onBack }) {
  const { dispatch } = useInvoices();

  const total = calcTotal(invoice.items);

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="mb-6">← Back</button>

      <div className="bg-white p-6 rounded-lg">
        <h2 className="font-bold text-lg mb-4">#{invoice.id}</h2>

        <p>{invoice.description}</p>

        <div className="mt-6">
          <p className="font-bold">Total: £{total}</p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() =>
              dispatch({ type: "DELETE_INVOICE" })
            }
            variant="danger"
          >
            Delete
          </Button>

          <Button
            onClick={() =>
              dispatch({
                type: "UPDATE_INVOICE",
                payload: { ...invoice, status: "paid" }
              })
            }
          >
            Mark as Paid
          </Button>
        </div>
      </div>
    </div>
  );
}