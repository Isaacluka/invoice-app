import { useEffect, useState } from "react";
import { useInvoiceContext } from "./context/InvoiceContext";
import { useInvoices } from "./hooks/useInvoices";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import InvoicePage from "./pages/InvoicePage";
import InvoiceForm from "./components/invoice/InvoiceForm";

const useBreakpoint = () => {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    return window.innerWidth < 640
      ? "mobile"
      : window.innerWidth < 1024
      ? "tablet"
      : "desktop";
  });

  useEffect(() => {
    const h = () =>
      setBp(
        window.innerWidth < 640
          ? "mobile"
          : window.innerWidth < 1024
          ? "tablet"
          : "desktop"
      );
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return bp;
};

const GlobalStyle = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'League Spartan',sans-serif;background:${dark ? "#141625" : "#F8F8FB"};color:${dark ? "#fff" : "#0C0E16"};min-height:100vh;transition:background .3s,color .3s;}
    input,select,textarea{font-family:'League Spartan',sans-serif;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-thumb{background:${dark ? "#252945" : "#DFE3FA"};border-radius:3px;}
    *{transition:background-color .2s,color .2s,border-color .2s;}
  `}</style>
);

export default function App() {
  const bp = useBreakpoint();

  const {
    dark,
    setDark,
    invoices,
    view,
    selectedId,
    showForm,
    setShowForm,
    editInvoice,
    setEditInvoice,
    filter,
    handleSave,
  } = useInvoiceContext();

  const { selected, filtered } = useInvoices(invoices, selectedId, filter);

  return (
    <>
      <GlobalStyle dark={dark} />

      <Layout dark={dark} toggleDark={() => setDark((d) => !d)} bp={bp}>
        {view === "list" ? (
          <Home bp={bp} invoices={filtered} />
        ) : (
          <InvoicePage bp={bp} invoice={selected} />
        )}
      </Layout>

      {showForm && (
        <InvoiceForm
          dark={dark}
          bp={bp}
          onClose={() => {
            setShowForm(false);
            setEditInvoice(null);
          }}
          onSave={handleSave}
          editInvoice={editInvoice}
        />
      )}
    </>
  );
}