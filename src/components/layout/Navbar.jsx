export default function Navbar({ onToggleDark }) {
  return (
    <nav className="h-16 bg-gray-900 text-white flex justify-between items-center px-6">
      <h1 className="font-bold">Invoice App</h1>

      <button
        onClick={onToggleDark}
        className="bg-gray-700 px-4 py-2 rounded"
      >
        Toggle Theme
      </button>
    </nav>
  );
}