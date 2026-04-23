export default function Select({ label, options = [], ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{label}</label>

      <select
        {...props}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}