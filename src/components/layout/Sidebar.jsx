export default function Sidebar({ onToggleDark }) {
  return (
    <aside className="w-20 h-screen bg-gray-900 text-white flex flex-col justify-between items-center py-6">
      <div className="font-bold">LOGO</div>

      <button
        onClick={onToggleDark}
        className="bg-gray-700 px-2 py-1 rounded"
      >
        ☀️
      </button>
    </aside>
  );
}