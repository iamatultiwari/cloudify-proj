import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <div className="flex min-h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />
        )}

        <main className="flex-1 min-h-screen flex flex-col md:ml-[280px] transition-all duration-300">
          <div className="p-4 md:p-8 space-y-8 flex-1">
            <div className="flex items-center justify-between gap-4 md:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm shadow-slate-200 transition-colors hover:border-emerald-500 hover:text-emerald-600"
              >
                <Menu size={20} />
              </button>
              <div className="font-bold text-lg text-slate-900">Agro ERP</div>
            </div>

            <Navbar />

            <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
              {children}
            </div>
          </div>

          {/* Footer Branding */}
          <footer className="px-4 md:px-8 py-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-t border-slate-100 bg-white/50">
            <span>© 2026 Agro ERP Enterprise</span>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
