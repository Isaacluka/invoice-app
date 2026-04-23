import { useState } from "react";
import { addDays, calcTotal, COLORS, TERMS, fmtMoney } from "../../utils/helpers";
import { formatDate } from "../../utils/formatDate";
import StatusBadge from "./StatusBadge";

export default function InvoiceItem({ invoice, dark, onClick, isMobile }) {
  const [h, setH] = useState(false);
  const total = calcTotal(invoice.items);
  const due = addDays(invoice.invoiceDate, TERMS[invoice.paymentTerms] || 30);

  if (isMobile) {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          background: dark ? "#1E2139" : "#fff",
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
          cursor: "pointer",
          border: `1px solid ${h ? COLORS.purple : "transparent"}`,
          boxShadow: dark ? "none" : "0 10px 10px -10px rgba(72,84,159,.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 12, color: dark ? "#fff" : "#0C0E16" }}>
            <span style={{ color: "#7E88C3" }}>#</span>
            {invoice.id}
          </span>
          <span style={{ fontSize: 12, color: dark ? "#DFE3FA" : "#858BB2" }}>
            {invoice.billTo.name || "—"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, color: dark ? "#DFE3FA" : "#888EB0", marginBottom: 6 }}>
              Due {formatDate(due)}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: dark ? "#fff" : "#0C0E16" }}>
              £ {fmtMoney(total)}
            </div>
          </div>
          <StatusBadge status={invoice.status} dark={dark} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: dark ? "#1E2139" : "#fff",
        borderRadius: 8,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        marginBottom: 16,
        border: `1px solid ${h ? COLORS.purple : "transparent"}`,
        boxShadow: dark ? "none" : "0 10px 10px -10px rgba(72,84,159,.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32, flex: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: dark ? "#fff" : "#0C0E16", minWidth: 72 }}>
          <span style={{ color: "#7E88C3" }}>#</span>
          {invoice.id}
        </span>

        <span style={{ fontSize: 12, color: dark ? "#DFE3FA" : "#888EB0", minWidth: 100 }}>
          Due {formatDate(due)}
        </span>

        <span style={{ fontSize: 12, color: dark ? "#DFE3FA" : "#858BB2" }}>
          {invoice.billTo.name || "—"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: dark ? "#fff" : "#0C0E16", minWidth: 100, textAlign: "right" }}>
          £ {fmtMoney(total)}
        </span>

        <StatusBadge status={invoice.status} dark={dark} />

        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path
            d="M1 1l4 4-4 4"
            stroke={COLORS.purple}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}