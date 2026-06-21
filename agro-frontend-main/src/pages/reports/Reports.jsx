import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

import SalesReport from "../../components/reports/SalesReport";
import FarmerDueReport from "../../components/reports/FarmerDueReport";
import StockReport from "../../components/reports/StockReport";
import VillageReport from "../../components/reports/VillageReport";

import SalesChart from "../../components/dashboard/SalesChart";
import TransactionChart from "../../components/dashboard/TransactionChart";
import CategoryChart from "../../components/dashboard/CategoryChart";

import { BarChart3, TrendingUp, PieChart, MapPin, ClipboardList, ShieldCheck } from "lucide-react";

const Reports = () => {
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

  const getSalesReport = async () => {
    try {
      const { data } = await API.get("/reports/sales");
      setSalesData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFarmerDueReport = async () => {
    try {
      const { data } = await API.get("/reports/farmer-due");
      setFarmerDueData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStockReport = async () => {
    try {
      const { data } = await API.get("/reports/stock");
      setStockData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getVillageReport = async () => {
    try {
      const { data } = await API.get("/reports/village");
      setVillageData(data);
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };

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
    <div className="space-y-16 pb-20">
      {/* Global Header */}
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
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-premium">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Registry Sync</p>
            <p className="text-sm font-bold text-emerald-600">Active Node</p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <BarChart3 size={24} />
          </div>
        </div>
      </div>

      {/* Reports Section Grid */}
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

        {/* Advanced Visualization */}
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
    </div>
  );
};

export default Reports;