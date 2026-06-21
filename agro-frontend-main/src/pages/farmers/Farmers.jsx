import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

import FarmerTable from "../../components/farmers/FarmerTable";

import toast from "react-hot-toast";

import { Link } from "react-router-dom";

import {
  Plus,
  Search,
  Users,
  Filter,
  ArrowRight
} from "lucide-react";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const getFarmers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/farmers");
      setFarmers(data.farmers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFarmer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this farmer profile?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/farmers/${id}`);
      toast.success("Farmer profile removed successfully");
      getFarmers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove farmer");
    }
  };

  const searchFarmer = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/farmers/search?keyword=${keyword}`);
      setFarmers(data.farmers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFarmers();
  }, []);

  return (
    <div className="space-y-10">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-10 h-0.5 bg-emerald-600"></span>
            Farmer Relations
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Manage <span className="text-emerald-600">Farmers</span>
          </h1>
          <p className="text-slate-600 mt-2 font-medium">Directory of registered agricultural partners and producers.</p>
        </div>

        <Link
          to="/farmers/add"
          className="btn-primary flex items-center gap-3 self-start group"
        >
          <Plus size={20} />
          Register New Farmer
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Advanced Filter Bar */}
      <div className="premium-card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name, village, or mobile identity..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchFarmer()}
            className="input-field pl-12"
          />
        </div>
        
        <button
          onClick={searchFarmer}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95 whitespace-nowrap"
        >
          Execute Search
        </button>

        <button className="p-3 border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest px-6">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Results Section */}
      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-4xl border border-slate-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Retrieving Records...</p>
          </div>
        ) : (
          <FarmerTable
            farmers={farmers}
            deleteFarmer={deleteFarmer}
          />
        )}
      </div>
    </div>
  );
};

export default Farmers;