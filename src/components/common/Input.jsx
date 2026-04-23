import { COLORS } from "../../utils/helpers";

export default function Input({ label, id, error, dark, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label
          htmlFor={id}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: error ? COLORS.danger : dark ? "#888EB0" : "#7E88C3",
          }}
        >
          {label}
        </label>
        {error && (
          <span style={{ fontSize: 10, color: COLORS.danger, fontWeight: 500 }}>
            {error}
          </span>
        )}
      </div>

      <input
        id={id}
        {...props}
        style={{
          background: dark ? "#1E2139" : "#fff",
          border: `1px solid ${
            error ? COLORS.danger : dark ? "#252945" : "#DFE3FA"
          }`,
          borderRadius: 4,
          padding: "14px 16px",
          fontSize: 12,
          fontWeight: 700,
          color: dark ? "#fff" : "#0C0E16",
          outline: "none",
          width: "100%",
        }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.purple)}
        onBlur={(e) =>
          (e.target.style.borderColor = error
            ? COLORS.danger
            : dark
            ? "#252945"
            : "#DFE3FA")
        }
      />
    </div>
  );
}