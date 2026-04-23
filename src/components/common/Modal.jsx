import { useEffect, useRef } from "react";
import Button from "./Button";

export default function Modal({ id, dark, onCancel, onConfirm }) {
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", h);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 500,
        padding: 24,
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: dark ? "#252945" : "#fff",
          borderRadius: 8,
          padding: 48,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 10px 20px rgba(0,0,0,.25)",
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 12,
            color: dark ? "#fff" : "#0C0E16",
          }}
        >
          Confirm Deletion
        </h2>

        <p
          style={{
            fontSize: 13,
            color: dark ? "#DFE3FA" : "#888EB0",
            marginBottom: 24,
            lineHeight: 1.7,
          }}
        >
          Are you sure you want to delete invoice #{id}? This action cannot be
          undone.
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="secondary" dark={dark} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" dark={dark} onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}