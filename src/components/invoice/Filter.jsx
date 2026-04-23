import { useState, useRef, useEffect } from "react";

export default function Filter({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (status) => {
    if (selected.includes(status)) {
      onChange(selected.filter(s => s !== status));
    } else {
      onChange([...selected, status]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="font-bold">
        Filter
      </button>

      {open && (
        <div className="absolute bg-white shadow-lg p-4 rounded-lg mt-2">
          {["draft", "pending", "paid"].map((s) => (
            <label key={s} className="flex gap-2">
              <input
                type="checkbox"
                checked={selected.includes(s)}
                onChange={() => toggle(s)}
              />
              {s}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}