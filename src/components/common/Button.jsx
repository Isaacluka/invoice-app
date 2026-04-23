import { useState } from "react";
import { COLORS } from "../../utils/helpers";

export default function Button({
  variant = "primary",
  onClick,
  children,
  dark,
  disabled,
}) {
  const [h, setH] = useState(false);

  const s =
    {
      primary: { bg: h ? COLORS.purpleL : COLORS.purple, c: "#fff" },
      secondary: {
        bg: h ? (dark ? "#252945" : "#DFE3FA") : dark ? "#252945" : "#F9FAFE",
        c: h ? (dark ? "#fff" : COLORS.purple) : dark ? "#DFE3FA" : "#7E88C3",
      },
      draft: { bg: h ? "#0C0E16" : "#373B53", c: "#888EB0" },
      danger: { bg: h ? COLORS.dangerH : COLORS.danger, c: "#fff" },
    }[variant] || {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "14px 22px",
        borderRadius: 24,
        background: s.bg,
        color: s.c,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.25,
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}