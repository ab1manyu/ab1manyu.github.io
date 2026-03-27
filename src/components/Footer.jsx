import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isLocked = location.pathname === '/kai';

  return (
    <footer className={`border-t border-defense-border bg-black py-8 ${isLocked ? 'fixed bottom-0 w-full z-50' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-xs text-gray-600">
          SYS_ID: 2026-PORTFOLIO<br />
          LOC: UNKNOWN
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#333] rounded-full"></div>
          <div className="w-2 h-2 bg-[#333] rounded-full"></div>
          <div className="w-2 h-2 bg-defense-accent rounded-full"></div>
        </div>
        <div className="font-mono text-xs text-gray-600 text-right">
          &copy; 2026 UYNAMI<br />
          ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}
