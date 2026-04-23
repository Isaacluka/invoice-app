export const generateId = () => {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    L[Math.floor(Math.random() * 26)] +
    L[Math.floor(Math.random() * 26)] +
    String(Math.floor(Math.random() * 9000) + 1000)
  );
};

export const addDays = (d, n) => {
  if (!d) return "";

  const x = new Date(d);
  if (isNaN(x.getTime())) return "";

  x.setDate(x.getDate() + n);
  return x.toISOString().split("T")[0];
};

export const calcTotal = (items) =>
  items.reduce(
    (s, i) => s + (parseFloat(i.price) || 0) * (parseInt(i.qty) || 0),
    0
  );

export const fmtMoney = (n) =>
  n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const TERMS = {
  "Net 1 Day": 1,
  "Net 7 Days": 7,
  "Net 14 Days": 14,
  "Net 30 Days": 30,
};

export const COLORS = {
  purple: "#7C5DFA",
  purpleL: "#9277FF",
  danger: "#EC5757",
  dangerH: "#FF9797",
  paid: "#33D69F",
  pending: "#FF8F00",
};