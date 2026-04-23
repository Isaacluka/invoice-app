import { useState } from "react";
import { addDays, calcTotal, TERMS, fmtMoney, COLORS } from "../../utils/helpers";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import StatusBadge from "./StatusBadge";
import Modal from "../common/Modal";

export default function InvoiceDetail({
  invoice,
  dark,
  onBack,
  onEdit,
  onDelete,
  onMarkPaid,
  bp,
}) {
  const [showDel, setShowDel] = useState(false);

  const total = calcTotal(invoice.items);
  const due = addDays(invoice.invoiceDate, TERMS[invoice.paymentTerms] || 30);
  const isMobile = bp === "mobile";

  const card = {
    background: dark ? "#1E2139" : "#fff",
    borderRadius: 8,
    padding: isMobile ? 24 : 40,
    marginBottom: 24,
    boxShadow: dark ? "none" : "0 10px 10px -10px rgba(72,84,159,.1)",
  };

  const lbl = { fontSize: 12, color: dark ? "#DFE3FA" : "#7E88C3", marginBottom: 8 };
  const val = { fontSize: 14, fontWeight: 700, color: dark ? "#fff" : "#0C0E16" };

  const actions = (
    <>
      <Button variant="secondary" dark={dark} onClick={onEdit}>
        Edit
      </Button>
      <Button variant="danger" dark={dark} onClick={() => setShowDel(true)}>
        Delete
      </Button>
      {invoice.status !== "paid" && (
        <Button variant="primary" dark={dark} onClick={onMarkPaid}>
          Mark as Paid
        </Button>
      )}
    </>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "24px 24px 120px" : "48px 24px" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 32,
          color: dark ? "#fff" : "#0C0E16",
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M6 1L2 5l4 4" stroke={COLORS.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Go back
      </button>

      <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: dark ? "#DFE3FA" : "#858BB2" }}>Status</span>
          <StatusBadge status={invoice.status} dark={dark} />
        </div>
        {!isMobile && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: dark ? "#fff" : "#0C0E16", marginBottom: 4 }}>
              <span style={{ color: "#7E88C3" }}>#</span>
              {invoice.id}
            </div>
            <div style={{ fontSize: 12, color: dark ? "#DFE3FA" : "#7E88C3" }}>{invoice.description}</div>
          </div>

          <div style={{ textAlign: isMobile ? "left" : "right", fontSize: 11, color: dark ? "#DFE3FA" : "#7E88C3", lineHeight: 1.8 }}>
            <div>{invoice.billFrom.street}</div>
            <div>{invoice.billFrom.city}</div>
            <div>{invoice.billFrom.postCode}</div>
            <div>{invoice.billFrom.country}</div>
          </div>
        </div>

        {isMobile ? (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              <div>
                <div style={lbl}>Invoice Date</div>
                <div style={val}>{formatDate(invoice.invoiceDate)}</div>

                <div style={{ ...lbl, marginTop: 24 }}>Payment Due</div>
                <div style={val}>{formatDate(due)}</div>
              </div>

              <div>
                <div style={lbl}>Bill To</div>
                <div style={val}>{invoice.billTo.name}</div>

                <div style={{ fontSize: 11, color: dark ? "#DFE3FA" : "#7E88C3", lineHeight: 1.8, marginTop: 8 }}>
                  <div>{invoice.billTo.street}</div>
                  <div>{invoice.billTo.city}</div>
                  <div>{invoice.billTo.postCode}</div>
                  <div>{invoice.billTo.country}</div>
                </div>
              </div>
            </div>

            <div>
              <div style={lbl}>Sent to</div>
              <div style={val}>{invoice.billTo.email}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={lbl}>Invoice Date</div>
              <div style={val}>{formatDate(invoice.invoiceDate)}</div>

              <div style={{ ...lbl, marginTop: 24 }}>Payment Due</div>
              <div style={val}>{formatDate(due)}</div>
            </div>

            <div>
              <div style={lbl}>Bill To</div>
              <div style={val}>{invoice.billTo.name}</div>

              <div style={{ fontSize: 11, color: dark ? "#DFE3FA" : "#7E88C3", lineHeight: 1.8, marginTop: 8 }}>
                <div>{invoice.billTo.street}</div>
                <div>{invoice.billTo.city}</div>
                <div>{invoice.billTo.postCode}</div>
                <div>{invoice.billTo.country}</div>
              </div>
            </div>

            <div>
              <div style={lbl}>Sent to</div>
              <div style={val}>{invoice.billTo.email}</div>
            </div>
          </div>
        )}

        <div style={{ background: dark ? "#252945" : "#F9FAFE", borderRadius: "8px 8px 0 0", padding: isMobile ? "16px 20px" : "24px 32px" }}>
          {isMobile ? (
            invoice.items.map((item, i) => {
              const t = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0);
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < invoice.items.length - 1 ? 16 : 0 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: dark ? "#fff" : "#0C0E16" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: dark ? "#888EB0" : "#7E88C3", marginTop: 4 }}>
                      {item.qty} x £ {parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: dark ? "#fff" : "#0C0E16" }}>
                    £ {t.toFixed(2)}
                  </span>
                </div>
              );
            })
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 100px", marginBottom: 24 }}>
                {["Item Name", "QTY.", "Price", "Total"].map((h, i) => (
                  <span key={h} style={{ fontSize: 11, color: dark ? "#DFE3FA" : "#7E88C3", textAlign: i > 0 ? "right" : "left" }}>
                    {h}
                  </span>
                ))}
              </div>

              {invoice.items.map((item, i) => {
                const t = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0);
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 100px", marginBottom: i < invoice.items.length - 1 ? 16 : 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: dark ? "#fff" : "#0C0E16" }}>{item.name}</span>
                    <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: dark ? "#DFE3FA" : "#7E88C3" }}>{item.qty}</span>
                    <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: dark ? "#DFE3FA" : "#7E88C3" }}>
                      £ {parseFloat(item.price).toFixed(2)}
                    </span>
                    <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: dark ? "#fff" : "#0C0E16" }}>
                      £ {t.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div style={{ background: dark ? "#0C0E16" : "#373B53", borderRadius: "0 0 8px 8px", padding: isMobile ? "20px" : "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#fff" }}>Amount Due</span>
          <span style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#fff" }}>
            £ {fmtMoney(total)}
          </span>
        </div>
      </div>

      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: dark ? "#1E2139" : "#fff", padding: "16px 24px", display: "flex", gap: 8, justifyContent: "flex-end", boxShadow: "0 -8px 24px rgba(0,0,0,.1)", zIndex: 50 }}>
          {actions}
        </div>
      )}

      {showDel && (
        <Modal
          id={invoice.id}
          dark={dark}
          onCancel={() => setShowDel(false)}
          onConfirm={onDelete}
        />
      )}
    </div>
  );
}