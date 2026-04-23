export default function Button({ children, variant = "primary", ...props }) {
  const base =
    "px-5 py-3 rounded-full text-sm font-bold transition-all";

  const styles = {
    primary: "bg-purple-600 text-white hover:bg-purple-500",
    secondary:
      "bg-gray-100 text-gray-600 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-400",
  };

  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}