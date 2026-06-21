import {
  LayoutDashboard,
  Users,
  Boxes,
  Receipt,
  CreditCard,
  BarChart3,
  MapPinned,
  Settings,
  LogOut,
  Leaf,
  Percent,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={22} />,
  },
  {
    name: "Farmers",
    path: "/farmers",
    icon: <Users size={22} />,
  },
  {
    name: "Inventory",
    path: "/products",
    icon: <Boxes size={22} />,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: <CreditCard size={22} />,
  },

  // NEW INTEREST SECTION
  {
    name: "Interest",
    path: "/interest",
    icon: <Percent size={22} />,
  },

  {
    name: "Billing",
    path: "/billing",
    icon: <Receipt size={22} />,
  },
  {
    name: "Ledger",
    path: "/invoices",
    icon: <BarChart3 size={22} />,
  },
  {
    name: "Villages",
    path: "/villages",
    icon: <MapPinned size={22} />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings size={22} />,
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-2xl flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out md:w-[280px] md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-3 p-8 md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf size={24} className="text-white" />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-1">
              AGRO<span className="text-emerald-500">ERP</span>
            </h1>

            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Premium Enterprise
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 p-2 text-slate-300 transition-colors hover:border-emerald-500 hover:text-white md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">
          Main Menu
        </p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
              
              ${
                isActive
                  ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/10 font-bold"
                  : "text-slate-600 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "scale-110" : ""
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-sm tracking-wide">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile/Action Section */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-slate-600 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />

          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;