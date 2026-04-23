import { COLORS } from "../../utils/helpers";

export default function StatusBadge({ status, dark }) {
  const m = {
    paid: { c: COLORS.paid, bg: "rgba(51,214,159,.07)" },
    pending: { c: COLORS.pending, bg: "rgba(255,143,0,.07)" },
    draft: {
      c: dark ? "#DFE3FA" : "#373B53",
      bg: dark ? "rgba(223,227,250,.06)" : "rgba(55,59,83,.06)",
    },
  };

  const { c, bg } = m[status] || m.draft;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 16px",
        borderRadius: 6,
        background: bg,
        color: c,
        fontWeight: 700,
        fontSize: 12,
        minWidth: 100,
        justifyContent: "center",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}