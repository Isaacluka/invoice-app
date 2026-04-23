import { createContext, useContext, useEffect, useState } from "react";
import { generateId } from "../utils/helpers";

const SAMPLE = [
  {
    id: "RT3080",
    status: "paid",
    invoiceDate: "2021-08-01",
    paymentTerms: "Net 30 Days",
    description: "Graphic Design",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "Jensen Huang",
      email: "jensenh@mail.com",
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    items: [
      { name: "Banner Design", qty: 1, price: 156 },
      { name: "Email Design", qty: 2, price: 200 },
    ],
  },
  {
    id: "XM9141",
    status: "pending",
    invoiceDate: "2021-08-21",
    paymentTerms: "Net 30 Days",
    description: "Graphic Design",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "Alex Grim",
      email: "alexgrim@mail.com",
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    items: [
      { name: "Banner Design", qty: 1, price: 156 },
      { name: "Email Design", qty: 2, price: 200 },
    ],
  },
  {
    id: "RG0314",
    status: "paid",
    invoiceDate: "2021-09-01",
    paymentTerms: "Net 30 Days",
    description: "Website Redesign",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "John Morrison",
      email: "jm@myco.com",
      street: "79 Park Lane",
      city: "Manchester",
      postCode: "M1 7LT",
      country: "United Kingdom",
    },
    items: [{ name: "Website Redesign", qty: 1, price: 14002.33 }],
  },
  {
    id: "RT2080",
    status: "pending",
    invoiceDate: "2021-09-12",
    paymentTerms: "Net 30 Days",
    description: "Logo Redesign",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "Alysa Werner",
      email: "alysa@email.co.uk",
      street: "63 Warwick Road",
      city: "Carlisle",
      postCode: "CA20 2TU",
      country: "United Kingdom",
    },
    items: [{ name: "Logo Redesign", qty: 1, price: 102.04 }],
  },
  {
    id: "AA1449",
    status: "pending",
    invoiceDate: "2021-09-14",
    paymentTerms: "Net 30 Days",
    description: "Re-branding",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "Mellisa Clarke",
      email: "mellisa.clarke@exampleco.com",
      street: "46 Abbey Row",
      city: "Cambridge",
      postCode: "CB5 6EG",
      country: "United Kingdom",
    },
    items: [
      { name: "Brand Guidelines", qty: 1, price: 1666 },
      { name: "Logo Design", qty: 1, price: 1500 },
      { name: "Business Cards", qty: 1, price: 866.33 },
    ],
  },
  {
    id: "TY9141",
    status: "pending",
    invoiceDate: "2021-10-01",
    paymentTerms: "Net 30 Days",
    description: "UI/UX Design",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "Thomas Wayne",
      email: "thomas@dc.com",
      street: "3964 Queens Lane",
      city: "Gotham",
      postCode: "60457",
      country: "United States",
    },
    items: [
      { name: "Design System", qty: 1, price: 3155.91 },
      { name: "Prototype", qty: 1, price: 3000 },
    ],
  },
  {
    id: "FV2353",
    status: "draft",
    invoiceDate: "2021-11-12",
    paymentTerms: "Net 30 Days",
    description: "Logo Re-design",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "Anita Wainwright",
      email: "",
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [{ name: "Logo Redesign", qty: 1, price: 3102.04 }],
  },
];

const InvoiceContext = createContext(null);

export const InvoiceProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const s = localStorage.getItem("invoices");
      return s ? JSON.parse(s) : SAMPLE;
    } catch {
      return SAMPLE;
    }
  });

  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem("invoices", JSON.stringify(invoices));
    } catch {}
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  const handleSave = (data) => {
    if (editInvoice) {
      setInvoices((p) =>
        p.map((inv) =>
          inv.id === editInvoice.id ? { ...inv, ...data } : inv
        )
      );
    } else {
      setInvoices((p) => [...p, { id: generateId(), ...data }]);
    }
    setShowForm(false);
    setEditInvoice(null);
  };

  const handleDelete = () => {
    setInvoices((p) => p.filter((i) => i.id !== selectedId));
    setView("list");
    setSelectedId(null);
  };

  const handleMarkPaid = () =>
    setInvoices((p) =>
      p.map((i) => (i.id === selectedId ? { ...i, status: "paid" } : i))
    );

  const handleEdit = (invoice) => {
    setEditInvoice(invoice);
    setShowForm(true);
  };

  return (
    <InvoiceContext.Provider
      value={{
        dark,
        setDark,
        invoices,
        setInvoices,
        view,
        setView,
        selectedId,
        setSelectedId,
        showForm,
        setShowForm,
        editInvoice,
        setEditInvoice,
        filter,
        setFilter,
        handleSave,
        handleDelete,
        handleMarkPaid,
        handleEdit,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoiceContext must be used inside InvoiceProvider");
  return ctx;
};