import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Receipt, 
  IndianRupee, 
  AlertCircle, 
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import API from "../../services/api";
import InvoiceTable from "../../components/invoices/InvoicesTable";
import toast from "react-hot-toast";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0
  });

  const getInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/invoices");
      setInvoices(data.invoices);
      
      const total = data.invoices.reduce((acc, curr) => acc + curr.grandTotal, 0);
      const pending = data.invoices
        .filter(inv => inv.paymentStatus === "pending")
        .reduce((acc, curr) => acc + curr.grandTotal, 0);
      const paid = data.invoices
        .filter(inv => inv.paymentStatus === "paid")
        .reduce((acc, curr) => acc + curr.grandTotal, 0);

      setStats({
        totalAmount: total,
        pendingAmount: pending,
        paidAmount: paid
      });
    } catch (error) {
      toast.error("Failed to load invoice registry");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cardStyles = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      badgeBg: "bg-emerald-50/50",
      badgeText: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
      ring: "bg-emerald-500",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      badgeBg: "bg-amber-50/50",
      badgeText: "text-amber-600",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
      ring: "bg-amber-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      badgeBg: "bg-blue-50/50",
      badgeText: "text-blue-600",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      ring: "bg-blue-500",
    },
  };

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <div className="space-y-10">
      {/* Financial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-10 h-0.5 bg-emerald-600"></span>
            Fiscal Management
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Invoice <span className="text-emerald-600">Registry</span>
          </h1>
          <p className="text-slate-600 mt-4 font-medium max-w-xl">
            Comprehensive audit log of all financial transactions, billing events, and payment reconciliation.
          </p>
        </div>

        <Link
          to="/billing"
          className="btn-primary flex items-center gap-3 self-start group"
        >
          <Plus size={20} />
          Initialize Billing
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Financial Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Gross Invoiced", value: stats.totalAmount, icon: <IndianRupee size={22} />, color: "emerald", trend: "Total Volume" },
          { label: "Account Receivables", value: stats.pendingAmount, icon: <AlertCircle size={22} />, color: "amber", trend: "Pending Action" },
          { label: "Settled Capital", value: stats.paidAmount, icon: <ShieldCheck size={22} />, color: "blue", trend: "Reconciled" }
        ].map((card, idx) => {
          const style = cardStyles[card.color];
          return (
            <div key={idx} className="premium-card p-8 group overflow-hidden relative">
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 ${style.ring}`}></div>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${style.iconBg} ${style.iconText} border ${style.border} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 ${style.badgeBg} ${style.badgeText} rounded-lg`}>
                  {card.trend}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{card.label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  ₹{card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registry Table */}
      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-4xl border border-slate-100 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-6"></div>
            <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing Fiscal Database...</p>
          </div>
        ) : (
          <InvoiceTable invoices={invoices} />
        )}
      </div>
    </div>
  );
};

export default Invoices;