import { useEffect, useRef, useState } from "react";
import { COLORS } from "../../utils/helpers";

export default function Filter({ dark, selected, onChange, mobile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (o) =>
    onChange(selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          fontWeight: 700,
          color: dark ? "#fff" : "#0C0E16",
        }}
      >
        {mobile ? "Filter" : "Filter by status"}
        <svg
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
        >
          <path
            d="M1 1l4.5 4.5L10 1"
            stroke={COLORS.purple}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 16px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: dark ? "#252945" : "#fff",
            borderRadius: 8,
            padding: 24,
            boxShadow: "0 10px 20px rgba(0,0,0,.25)",
            zIndex: 50,
            minWidth: 192,
          }}
        >
          {["draft", "pending", "paid"].map((o, i) => (
            <label
              key={o}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                marginBottom: i < 2 ? 16 : 0,
                fontSize: 12,
                fontWeight: 700,
                color: dark ? "#fff" : "#0C0E16",
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: COLORS.purple,
                  cursor: "pointer",
                }}
              />
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}