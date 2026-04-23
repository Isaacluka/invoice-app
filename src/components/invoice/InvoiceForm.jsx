import { useState } from "react";
import Button from "../ui/Button";
import { useInvoices } from "../../context/InvoiceContext";
import { generateId } from "../../utils/helpers";

export default function InvoiceForm({ onClose }) {
  const { dispatch } = useInvoices();

  const [form, setForm] = useState({
    name: "",
    amount: "",
  });

  const handleSubmit = () => {
    dispatch({
      type: "ADD_INVOICE",
      payload: {
        id: generateId(),
        billTo: { name: form.name },
        items: [{ price: form.amount, qty: 1 }],
        status: "pending",
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="font-bold mb-4">New Invoice</h2>

        <input
          placeholder="Client Name"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Amount"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  );
}