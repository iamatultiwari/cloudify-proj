import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Boxes,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ChartPie,
  Banknote,
  ShieldCheck,
} from "lucide-react";

import API from "../../services/api";

import StatCard from "../../components/common/StatCard";
import SalesChart from "../../components/dashboard/SalesChart";
import CategoryChart from "../../components/dashboard/CategoryChart";
import TransactionChart from "../../components/dashboard/TransactionChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalFarmers: 0,
    totalProducts: 0,
    totalSales: 0,
    pendingPayments: 0,
    overdueBills: 0,
    lowStockAlerts: 0,
    recentTransactions: [],
  });
  const [analytics, setAnalytics] = useState({
    monthlySales: [],
    transactionTypes: [],
    categoryStock: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const [summaryRes, analyticsRes] = await Promise.all([
          API.get("/reports/dashboard"),
          API.get("/reports/charts"),
        ]);

        setSummary(summaryRes.data.dashboard || summary);
        setAnalytics(analyticsRes.data || analytics);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-slate-600 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Enterprise Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center max-w-2xl mx-auto my-20">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-black text-red-900 mb-2 tracking-tight">System Link Failure</h2>
        <p className="text-red-700 font-medium mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-500/20">
          Attempt Re-link
        </button>
      </div>
    );
  }

  const salesChartData =
    analytics.monthlySales?.map((item) => ({
      month:
        MONTHS[item._id?.month - 1] ||
        `M${item._id?.month}`,
      sales: item.totalSales,
    })) || [];

  const transactionChartData =
    analytics.transactionTypes?.map((item) => ({
      name: item._id,
      value: item.totalAmount,
    })) || [];

  const categoryChartData =
    analytics.categoryStock?.map((item) => ({
      name: item._id,
      quantity: item.totalQuantity,
    })) || [];

  const stats = [
    {
      title: "Active Farmers",
      value: summary.totalFarmers,
      icon: <Users size={24} />,
      color: "text-blue-600",
      trend: "+12%"
    },
    {
      title: "Inventory Items",
      value: summary.totalProducts,
      icon: <Boxes size={24} />,
      color: "text-emerald-600",
      trend: "+4%"
    },
    {
      title: "Total Revenue",
      value: `₹${summary.totalSales.toLocaleString()}`,
      icon: <IndianRupee size={24} />,
      color: "text-purple-600",
      trend: "+28%"
    },
    {
      title: "Outstanding Due",
      value: `₹${summary.pendingPayments.toLocaleString()}`,
      icon: <AlertTriangle size={24} />,
      color: "text-red-600",
    },
    {
      title: "Overdue Bills",
      value: summary.overdueBills,
      icon: <ShieldCheck size={24} />,
      color: "text-amber-600",
    },
    {
      title: "Low Stock Items",
      value: summary.lowStockAlerts,
      icon: <Banknote size={24} />,
      color: "text-slate-600",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-10 h-0.5 bg-emerald-600"></span>
            System Intelligence
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
            Enterprise <span className="text-emerald-600">Overview</span>
          </h1>
          <p className="text-slate-600 mt-4 font-medium text-lg max-w-xl leading-relaxed">
            Global operational snapshot and real-time analytical reporting from your agricultural nodes.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-premium">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Health</p>
            <p className="text-sm font-bold text-emerald-600">Operational</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} className="text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Analytical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            trend={item.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 premium-card p-8">
          <SalesChart data={salesChartData} />
        </div>
        <div className="premium-card p-8">
          <CategoryChart data={categoryChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card p-8">
          <TransactionChart data={transactionChartData} />
        </div>
        <div className="premium-card p-8">
          <RecentTransactions transactions={summary.recentTransactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
