import { useInvoiceContext } from "../context/InvoiceContext";
import Filter from "../components/invoice/Filter";
import InvoiceList from "../components/invoice/InvoiceList";
import { COLORS } from "../utils/helpers";

export default function Home({ bp, invoices }) {
  const { dark, setShowForm, setEditInvoice, filter, setFilter, setView, setSelectedId } =
    useInvoiceContext();

  const isMobile = bp === "mobile";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isMobile ? 32 : 48 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: dark ? "#fff" : "#0C0E16", letterSpacing: -0.5 }}>
            Invoices
          </h1>
          <p style={{ fontSize: 12, color: dark ? "#DFE3FA" : "#888EB0", marginTop: 4 }}>
            {invoices.length === 0
              ? "No invoices"
              : `There are ${invoices.length} total invoice${invoices.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 32 }}>
          <Filter dark={dark} selected={filter} onChange={setFilter} mobile={isMobile} />

          <button
            onClick={() => {
              setEditInvoice(null);
              setShowForm(true);
            }}
            style={{
              background: COLORS.purple,
              border: "none",
              borderRadius: 24,
              padding: isMobile ? "8px 12px 8px 8px" : "8px 16px 8px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              fontFamily: "League Spartan,sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.purpleL)}
            onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.purple)}
          >
            <span style={{ width: 32, height: 32, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 0v11M0 5.5h11" stroke={COLORS.purple} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            {isMobile ? "New" : "New Invoice"}
          </button>
        </div>
      </div>

      <InvoiceList
        invoices={invoices}
        dark={dark}
        isMobile={isMobile}
        onSelect={(id) => {
          setSelectedId(id);
          setView("detail");
        }}
      />
    </div>
  );
}