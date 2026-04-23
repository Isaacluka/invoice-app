import { COLORS } from "../../utils/helpers";

export default function Select({ label, id, value, onChange, options, dark }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: dark ? "#888EB0" : "#7E88C3",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          style={{
            background: dark ? "#1E2139" : "#fff",
            border: `1px solid ${dark ? "#252945" : "#DFE3FA"}`,
            borderRadius: 4,
            padding: "14px 16px",
            fontSize: 12,
            fontWeight: 700,
            color: dark ? "#fff" : "#0C0E16",
            width: "100%",
            appearance: "none",
            cursor: "pointer",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.purple)}
          onBlur={(e) =>
            (e.target.style.borderColor = dark ? "#252945" : "#DFE3FA")
          }
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        <svg
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
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
      </div>
    </div>
  );
}