import { useEffect, useState } from "react";
import API from "../../services/api";

// Existing Report Imports
import SalesReport from "../../components/reports/SalesReport";
import FarmerDueReport from "../../components/reports/FarmerDueReport";
import StockReport from "../../components/reports/StockReport";
import VillageReport from "../../components/reports/VillageReport";

// Visual Charts Imports
import SalesChart from "../../components/dashboard/SalesChart";
import TransactionChart from "../../components/dashboard/TransactionChart";
import CategoryChart from "../../components/dashboard/CategoryChart";

// Asset Icons
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  MapPin, 
  ClipboardList, 
  ShieldCheck, 
  BookOpen, 
  RefreshCw 
} from "lucide-react";

const Reports = () => {
  // ================= STATE METRIC ARRAYS =================
  const [activeTab, setActiveTab] = useState("analytics"); // Toggle views: 'analytics' | 'daybook'
  const [salesData, setSalesData] = useState({});
  const [farmerDueData, setFarmerDueData] = useState({});
  const [stockData, setStockData] = useState({});
  const [villageData, setVillageData] = useState({});
  const [chartData, setChartData] = useState({
    monthlySales: [],
    transactionTypes: [],
    categoryStock: [],
  });
  const [loading, setLoading] = useState(true);

  // ================= DAY BOOK EXCLUSIVE STATE MATRICES =================
  const [dayBookDate, setDayBookDate] = useState(new Date().toISOString().split("T")[0]);
  const [dayBookTransactions, setDayBookTransactions] = useState([]);
  const [dayBookSummary, setDayBookSummary] = useState({
    openingBalance: 0,
    totalInward: 0,
    totalOutward: 0,
    closingBalance: 0,
  });
  const [dayBookLoading, setDayBookLoading] = useState(false);

  // ================= CORE DATA API RETRIEVAL LOOPS =================
  const getSalesReport = async () => {
    try {
      const { data } = await API.get("/reports/sales");
      setSalesData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getFarmerDueReport = async () => {
    try {
      const { data } = await API.get("/reports/farmer-due");
      setFarmerDueData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getStockReport = async () => {
    try {
      const { data } = await API.get("/reports/stock");
      setStockData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getVillageReport = async () => {
    try {
      const { data } = await API.get("/reports/village");
      setVillageData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCharts = async () => {
    try {
      const { data } = await API.get("/reports/charts");
      setChartData({
        monthlySales: data.monthlySales?.map((item) => ({
          month: item._id?.month,
          totalSales: item.totalSales,
        })) || [],
        transactionTypes: data.transactionTypes?.map((item) => ({
          type: item._id,
          totalAmount: item.totalAmount,
        })) || [],
        categoryStock: data.categoryStock?.map((item) => ({
          category: item._id,
          totalQuantity: item.totalQuantity,
        })) || [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ================= DAY BOOK API DATA RETRIEVAL =================
  const fetchDayBookLogs = async () => {
    try {
      setDayBookLoading(true);
      const { data } = await API.get(`/transactions/daybook?date=${dayBookDate}`);
      setDayBookTransactions(data.transactions || []);
      setDayBookSummary(data.summary || {
        openingBalance: data.openingBalance || 0,
        totalInward: data.totalInward || 0,
        totalOutward: data.totalOutward || 0,
        closingBalance: data.closingBalance || 0
      });
    } catch (error) {
      console.error("Daybook error:", error);
    } finally {
      setDayBookLoading(false);
    }
  };

  // Run Global Dashboard Metric Queries on Mount
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      await Promise.all([
        getSalesReport(),
        getFarmerDueReport(),
        getStockReport(),
        getVillageReport(),
        getCharts(),
      ]);
      setLoading(false);
    };
    loadReports();
  }, []);

  // Sync Daybook logs whenever target query context adjustments take place
  useEffect(() => {
    if (activeTab === "daybook") {
      fetchDayBookLogs();
    }
  }, [dayBookDate, activeTab]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-4xl border border-slate-100 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-6"></div>
        <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Assembling Analytical Matrices...</p>
      </div>
    );
  }

  const SectionHeader = ({ title, subtitle, icon: Icon }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
        <Icon size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Global Header Layout Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-10 h-0.5 bg-emerald-600"></span>
            Business Intelligence
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Analytical <span className="text-emerald-600">Reports</span>
          </h1>
          <p className="text-slate-600 mt-4 font-medium max-w-xl">
            Deep-dive operational insights and cross-sector performance metrics generated from real-time enterprise data.
          </p>
        </div>
        
        {/* VIEW TAB CONTROLLER METRIC TOGGLES */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "analytics"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 size={16} />
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab("daybook")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "daybook"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen size={16} />
            Live Day Book
          </button>
        </div>
      </div>

      {/* ================= CONDITIONALLY RENDER INTERCHANGEABLE CONTENT SUB-PANELS ================= */}
      {activeTab === "analytics" ? (
        <div className="space-y-20">
          {/* Sales Performance */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Sales Performance" subtitle="Revenue Optimization Index" icon={TrendingUp} />
            <div className="premium-card p-2 bg-slate-50/50">
              <SalesReport data={salesData} />
            </div>
          </div>

          {/* Financial Exposure */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <SectionHeader title="Financial Exposure" subtitle="Account Receivables Registry" icon={ClipboardList} />
            <div className="premium-card p-2 bg-slate-50/50">
              <FarmerDueReport data={farmerDueData} />
            </div>
          </div>

          {/* Asset Audit */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <SectionHeader title="Asset Audit" subtitle="Inventory Balance Sheet" icon={ShieldCheck} />
              <div className="premium-card p-2 bg-slate-50/50">
                <StockReport data={stockData} />
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <SectionHeader title="Regional Distribution" subtitle="Village Node Density" icon={MapPin} />
              <div className="premium-card p-2 bg-slate-50/50">
                <VillageReport data={villageData} />
              </div>
            </div>
          </div>

          {/* Advanced Visual Charts Engine */}
          <div className="space-y-12">
            <SectionHeader title="Visual Intelligence" subtitle="Graphical Analytical Models" icon={PieChart} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="premium-card p-10">
                <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  Temporal Sales Velocity
                </h3>
                <SalesChart data={chartData.monthlySales} />
              </div>

              <div className="premium-card p-10">
                <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                  Transactional Archetypes
                </h3>
                <TransactionChart data={chartData.transactionTypes} />
              </div>
            </div>

            <div className="premium-card p-10">
              <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Inventory Taxonomic Distribution
              </h3>
              <CategoryChart data={chartData.categoryStock} />
            </div>
          </div>
        </div>
      ) : (
        /* ================= INLINE LIVE DAY BOOK WORKSPACE LAYER ================= */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-premium">
            <div className="flex items-center gap-3">
              <input 
                type="date"
                value={dayBookDate}
                onChange={(e) => setDayBookDate(e.target.value)}
                className="border border-slate-200 p-2 rounded-xl text-sm font-bold font-mono focus:outline-none focus:border-emerald-500 bg-slate-50"
              />
              <button 
                onClick={fetchDayBookLogs}
                disabled={dayBookLoading}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all disabled:opacity-50"
                title="Force Reload Logs"
              >
                <RefreshCw size={16} className={dayBookLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Quick Summary Strip Box Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full sm:w-auto text-left">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl min-w-[120px]">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Opening Bal</p>
                <p className="text-sm font-mono font-black text-slate-800">₹{dayBookSummary.openingBalance.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl min-w-[120px]">
                <p className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Inward (+)</p>
                <p className="text-sm font-mono font-black text-emerald-600">₹{dayBookSummary.totalInward.toFixed(2)}</p>
              </div>
              <div className="bg-red-50/50 border border-red-100 p-3 rounded-2xl min-w-[120px]">
                <p className="text-[9px] font-black text-red-700 uppercase tracking-wider">Outward (-)</p>
                <p className="text-sm font-mono font-black text-red-600">₹{dayBookSummary.totalOutward.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl min-w-[120px]">
                <p className="text-[9px] font-black text-blue-700 uppercase tracking-wider">Net Closing</p>
                <p className="text-sm font-mono font-black text-blue-800">₹{dayBookSummary.closingBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Interactive Ledger Board Data Matrix */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase">Transactions Audit Register Ledger</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase font-mono">{dayBookDate}</span>
            </div>

            <div className="overflow-x-auto">
              {dayBookLoading ? (
                <div className="text-center py-20 font-bold text-slate-500 tracking-wider">Synchronizing Internal General Ledger Records...</div>
              ) : dayBookTransactions.length === 0 ? (
                <div className="text-center py-20 font-medium text-slate-400 italic normal-case">No transactions recorded on this specific day index block.</div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-black tracking-wider text-slate-600 border-b border-slate-200">
                      <th className="p-4 text-center w-[5%]">No</th>
                      <th className="p-4 w-[15%]">Voucher Ref / Inv</th>
                      <th className="p-4 w-[10%]">Archetype</th>
                      <th className="p-4 w-[30%]">Party / Account Details</th>
                      <th className="p-4 w-[20%] text-right">Inward (Cr)</th>
                      <th className="p-4 w-[20%] text-right">Outward (Dr)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {dayBookTransactions.map((item, idx) => (
                      <tr key={item._id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-4 font-mono font-bold text-slate-900 uppercase">
                          {item.voucherNo || item.invoiceNumber || item._id?.substring(18).toUpperCase()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                            item.type === "credit" || item.type === "Receipt"
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {item.type || "Debit"}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900 uppercase">{item.farmer?.name || item.customerName || "General Counter Cash Sale"}</p>
                          {item.farmer?.village && <p className="text-[10px] text-slate-400 font-normal">Village: {item.farmer.village}</p>}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-green-600">
                          {item.type === "credit" || item.type === "Receipt" ? `₹${item.amount.toFixed(2)}` : "-"}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-red-600">
                          {item.type === "debit" || item.type === "Sales" || item.type === "Invoice" ? `₹${item.amount.toFixed(2)}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;