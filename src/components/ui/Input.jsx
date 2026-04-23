export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        {...props}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}