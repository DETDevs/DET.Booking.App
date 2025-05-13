export const Footer = () => (
    <footer className="flex items-center justify-between h-10 px-4 text-xs text-gray-500 bg-white border-t">
      <span>© {new Date().getFullYear()} DET Titans Devs</span>
      <span>{import.meta.env.VITE_APP_VERSION}</span>
    </footer>
  );
  