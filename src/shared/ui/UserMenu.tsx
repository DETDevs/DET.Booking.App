import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100"
      >
        <img
          src="/avatar.jpg"
          alt="avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-sm font-medium">Edwin T</span>
          <span className="text-xs text-gray-500">Admin</span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Profile
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Settings
          </a>
          <button
            onClick={() => {/* logout logic */}}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
