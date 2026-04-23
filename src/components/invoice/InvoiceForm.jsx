// src/components/invoice/InvoiceForm.jsx
import { useEffect, useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { COLORS, TERMS } from "../../utils/helpers";

export default function InvoiceForm({ dark, onClose, onSave, editInvoice, bp }) {
  const isEdit = !!editInvoice;

  const empty = {
    billFrom: { street: "", city: "", postCode: "", country: "" },
    billTo: { name: "", email: "", street: "", city: "", postCode: "", country: "" },
    invoiceDate: new Date().toISOString().split("T")[0],
    paymentTerms: "Net 30 Days",
    description: "",
    items: [],
  };

  const [form, setForm] = useState(
    isEdit
      ? {
          billFrom: { ...editInvoice.billFrom },
          billTo: { ...editInvoice.billTo },
          invoiceDate: editInvoice.invoiceDate,
          paymentTerms: editInvoice.paymentTerms,
          description: editInvoice.description,
          items: editInvoice.items.map((i) => ({ ...i })),
        }
      : empty
  );

  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);

  const isMobile = bp === "mobile";
  const isDesktop = bp === "desktop";

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const sf = (sec, k, v) =>
    setForm((f) => ({
      ...f,
      [sec]: { ...f[sec], [k]: v },
    }));

  const validate = () => {
    const e = {};

    if (!form.billTo.name) e["billTo.name"] = "can't be empty";

    if (!form.billTo.email) e["billTo.email"] = "can't be empty";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.billTo.email))
      e["billTo.email"] = "invalid";

    if (!form.billFrom.street) e["billFrom.street"] = "can't be empty";

    if (!form.description) e["description"] = "can't be empty";

    if (form.items.length === 0) e["items"] = "Add at least one item";

    form.items.forEach((item, i) => {
      if (!item.name) e[`i${i}n`] = "can't be empty";
      if (!item.qty || item.qty <= 0) e[`i${i}q`] = "!";
      if (item.price < 0) e[`i${i}p`] = "!";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    onSave({ ...form, status: isEdit ? editInvoice.status : "pending" });
  };

  const handleDraft = () => {
    onSave({ ...form, status: "draft" });
  };

  // Mobile: full-page; Tablet/Desktop: drawer
  const containerStyle = isMobile
    ? {
        position: "fixed",
        inset: 0,
        background: dark ? "#141625" : "#F8F8FB",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }
    : {
        position: "fixed",
        left: isDesktop ? 80 : 0,
        top: isDesktop ? 0 : 72,
        bottom: 0,
        width: isDesktop ? "min(616px,calc(100vw - 80px))" : "min(616px,80vw)",
        background: dark ? "#141625" : "#F8F8FB",
        boxShadow: "10px 0 60px rgba(0,0,0,.3)",
        transform: visible ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .3s ease",
        display: "flex",
        flexDirection: "column",
        zIndex: 300,
        borderRadius: "0 20px 20px 0",
      };

  const hPad = isMobile ? "24px 24px 0" : isDesktop ? "56px 56px 0" : "32px 56px 0";
  const bPad = isMobile ? "24px" : "32px 56px";

  const itemRows = form.items.map((item, i) => {
    const tot = (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0);

    return (
      <div key={i} style={{ marginBottom: 20 }}>
        <Input
          label="Item Name"
          id={`iname${i}`}
          dark={dark}
          value={item.name}
          error={errors[`i${i}n`]}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              items: f.items.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
            }))
          }
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "72px 1fr 80px 24px",
            gap: 12,
            marginTop: 12,
            alignItems: "end",
          }}
        >
          <Input
            label="Qty."
            id={`qty${i}`}
            type="number"
            dark={dark}
            value={item.qty}
            min="1"
            error={errors[`i${i}q`]}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                items: f.items.map((x, j) => (j === i ? { ...x, qty: e.target.value } : x)),
              }))
            }
          />

          <Input
            label="Price"
            id={`pr${i}`}
            type="number"
            dark={dark}
            value={item.price}
            min="0"
            step="0.01"
            error={errors[`i${i}p`]}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                items: f.items.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)),
              }))
            }
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: dark ? "#888EB0" : "#7E88C3", fontWeight: 500 }}>
              Total
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#888EB0", paddingTop: 14 }}>
              {tot.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() =>
              setForm((f) => ({
                ...f,
                items: f.items.filter((_, j) => j !== i),
              }))
            }
            aria-label="Remove item"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0 14px",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
              <path
                d="M11.583 3.556h-2.334V2.667C9.25 1.194 8.284 0 7 0H6C4.716 0 3.75 1.194 3.75 2.667v.889H1.417C.634 3.556 0 4.19 0 4.972v.695c0 .35.284.639.633.639h11.734c.35 0 .633-.288.633-.64v-.694c0-.782-.634-1.416-1.417-1.416zM4.917 2.667C4.917 1.894 5.402 1.111 6 1.111h1c.598 0 1.083.783 1.083 1.556v.889H4.917v-.889zM1.917 6.667l.917 7.555c.1.878.783 1.556 1.583 1.556H8.75c.8 0 1.483-.678 1.583-1.556l.917-7.555H1.917z"
                fill="#888EB0"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  });

  const footerBtns = !isEdit ? (
    <>
      <Button variant="secondary" dark={dark} onClick={handleClose}>
        Discard
      </Button>
      <div style={{ flex: 1 }} />
      <Button variant="draft" dark={dark} onClick={handleDraft}>
        Save as Draft
      </Button>
      <Button variant="primary" dark={dark} onClick={handleSend}>
        Save &amp; Send
      </Button>
    </>
  ) : (
    <>
      <div style={{ flex: 1 }} />
      <Button variant="secondary" dark={dark} onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" dark={dark} onClick={handleSend}>
        Save Changes
      </Button>
    </>
  );

  return (
    <>
      {!isMobile && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            opacity: visible ? 1 : 0,
            transition: "opacity .3s",
            zIndex: 299,
          }}
          aria-hidden="true"
        />
      )}

      <div style={containerStyle} role="dialog" aria-modal="true">
        <div style={{ padding: hPad, flexShrink: 0 }}>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
              color: dark ? "#fff" : "#0C0E16",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path
                d="M6 1L2 5l4 4"
                stroke={COLORS.purple}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Go back
          </button>

          <h1 style={{ fontSize: 24, fontWeight: 700 }}>
            {isEdit ? (
              <>
                <span style={{ color: "#7E88C3" }}>#</span>
                {editInvoice.id}
              </>
            ) : (
              "New Invoice"
            )}
          </h1>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: bPad }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.purple, marginBottom: 20 }}>
            Bill From
          </p>

          <div style={{ display: "grid", gap: 18, marginBottom: 32 }}>
            <Input
              label="Street Address"
              id="fs"
              dark={dark}
              value={form.billFrom.street}
              error={errors["billFrom.street"]}
              onChange={(e) => sf("billFrom", "street", e.target.value)}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input
                label="City"
                id="fc"
                dark={dark}
                value={form.billFrom.city}
                onChange={(e) => sf("billFrom", "city", e.target.value)}
              />
              <Input
                label="Post Code"
                id="fp"
                dark={dark}
                value={form.billFrom.postCode}
                onChange={(e) => sf("billFrom", "postCode", e.target.value)}
              />
            </div>

            <Input
              label="Country"
              id="fcountry"
              dark={dark}
              value={form.billFrom.country}
              onChange={(e) => sf("billFrom", "country", e.target.value)}
            />
          </div>

          <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.purple, marginBottom: 20 }}>
            Bill To
          </p>

          <div style={{ display: "grid", gap: 18, marginBottom: 32 }}>
            <Input
              label="Client's Name"
              id="tn"
              dark={dark}
              value={form.billTo.name}
              error={errors["billTo.name"]}
              onChange={(e) => sf("billTo", "name", e.target.value)}
            />

            <Input
              label="Client's Email"
              id="te"
              type="email"
              placeholder="e.g. email@example.com"
              dark={dark}
              value={form.billTo.email}
              error={errors["billTo.email"]}
              onChange={(e) => sf("billTo", "email", e.target.value)}
            />

            <Input
              label="Street Address"
              id="ts"
              dark={dark}
              value={form.billTo.street}
              onChange={(e) => sf("billTo", "street", e.target.value)}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input
                label="City"
                id="tcc"
                dark={dark}
                value={form.billTo.city}
                onChange={(e) => sf("billTo", "city", e.target.value)}
              />
              <Input
                label="Post Code"
                id="tpc"
                dark={dark}
                value={form.billTo.postCode}
                onChange={(e) => sf("billTo", "postCode", e.target.value)}
              />
            </div>

            <Input
              label="Country"
              id="tcountry"
              dark={dark}
              value={form.billTo.country}
              onChange={(e) => sf("billTo", "country", e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
            <Input
              label="Invoice Date"
              id="date"
              type="date"
              dark={dark}
              value={form.invoiceDate}
              disabled={isEdit}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  invoiceDate: e.target.value,
                }))
              }
            />

            <Select
              label="Payment Terms"
              id="terms"
              dark={dark}
              value={form.paymentTerms}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  paymentTerms: e.target.value,
                }))
              }
              options={Object.keys(TERMS)}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <Input
              label="Project Description"
              id="desc"
              placeholder="e.g. Graphic Design Service"
              dark={dark}
              value={form.description}
              error={errors["description"]}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <p style={{ fontSize: 18, fontWeight: 700, color: "#777F98", marginBottom: 16 }}>
            Item List
          </p>

          {errors["items"] && (
            <p style={{ color: COLORS.danger, fontSize: 12, marginBottom: 12 }}>
              {errors["items"]}
            </p>
          )}

          {itemRows}

          <button
            onClick={() =>
              setForm((f) => ({
                ...f,
                items: [...f.items, { name: "", qty: 1, price: 0 }],
              }))
            }
            style={{
              width: "100%",
              padding: 14,
              background: dark ? "#252945" : "#F9FAFE",
              border: "none",
              borderRadius: 24,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              color: dark ? "#888EB0" : "#7E88C3",
              marginBottom: 8,
            }}
          >
            + Add New Item
          </button>

          {Object.keys(errors).length > 0 && (
            <p style={{ color: COLORS.danger, fontSize: 11, marginTop: 12, fontWeight: 500 }}>
              - All fields must be added
            </p>
          )}

          {isMobile && (
            <div style={{ display: "flex", gap: 8, marginTop: 24, paddingBottom: 32 }}>
              {footerBtns}
            </div>
          )}
        </div>

        {!isMobile && (
          <div
            style={{
              padding: "20px 56px",
              background: dark ? "#141625" : "#F8F8FB",
              boxShadow: "0 -8px 24px rgba(0,0,0,.08)",
              display: "flex",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {footerBtns}
          </div>
        )}
      </div>
    </>
  );
}