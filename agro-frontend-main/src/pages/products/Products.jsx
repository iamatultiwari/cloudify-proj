import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calendar, 
  Package, 
  Boxes,
  ArrowRight,
  TrendingUp,
  X
} from "lucide-react";
import API from "../../services/api";
import ProductTable from "../../components/products/ProductsTable";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    expired: 0
  });
  const [activeFilter, setActiveFilter] = useState("all");

  const getProducts = async (filter = "all") => {
    try {
      setLoading(true);
      let url = "/products";
      if (filter === "low-stock") url = "/products/low-stock";
      if (filter === "expired") url = "/products/expired";
      
      const { data } = await API.get(url);
      setProducts(data.products);
      
      if (filter === "all") {
        const lowStockData = data.products.filter(p => p.quantity <= p.lowStockThreshold).length;
        const expiredData = data.products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date()).length;
        setStats({
          total: data.totalProducts,
          lowStock: lowStockData,
          expired: expiredData
        });
      }
    } catch (error) {
      toast.error("Failed to fetch product inventory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Permanent deletion of this inventory record?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Inventory record purged");
      getProducts(activeFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Purge operation failed");
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) {
      getProducts(activeFilter);
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get(`/products/search?keyword=${keyword}`);
      setProducts(data.products);
    } catch (error) {
      toast.error("Intelligence search failed");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setKeyword("");
    getProducts(activeFilter);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const cardStyles = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-500",
        shadow: "shadow-emerald-500/10",
        accent: "text-emerald-600",
        accentBg: "bg-emerald-500",
        accentText: "text-white",
        line: "bg-emerald-500",
      },
      amber: {
        bg: "bg-amber-50",
        border: "border-amber-500",
        shadow: "shadow-amber-500/10",
        accent: "text-amber-600",
        accentBg: "bg-amber-500",
        accentText: "text-white",
        line: "bg-amber-500",
      },
      rose: {
        bg: "bg-rose-50",
        border: "border-rose-500",
        shadow: "shadow-rose-500/10",
    },
  };

  useEffect(() => {
    getProducts(activeFilter);
  }, [activeFilter]);

  return (
    <div className="space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-10 h-0.5 bg-emerald-600"></span>
            Inventory Control
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Asset <span className="text-emerald-600">Catalogue</span>
          </h1>
          <p className="text-slate-600 mt-4 font-medium max-w-xl">
            Centralized monitoring of agro-assets, chemicals, and equipment inventory levels.
          </p>
        </div>

        <Link
          to="/products/add"
          className="btn-primary flex items-center gap-3 self-start group"
        >
          <Plus size={20} />
          Append Inventory
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Analytical Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "all", label: "Global Stock", value: stats.total, icon: <Boxes size={22} />, color: "emerald" },
          { id: "low-stock", label: "Critical Levels", value: stats.lowStock, icon: <AlertTriangle size={22} />, color: "amber" },
          { id: "expired", label: "Depleted Assets", value: stats.expired, icon: <Calendar size={22} />, color: "rose" }
        ].map(card => {
          const style = cardStyles[card.color];
          const isActive = activeFilter === card.id;
          return (
            <button 
              key={card.id}
              onClick={() => setActiveFilter(card.id)}
              className={`p-8 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${isActive ? `bg-white ${style.border} shadow-2xl ${style.shadow}` : "bg-white border-transparent shadow-premium hover:border-slate-100"}`}>
              <div className="relative z-10 flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${isActive ? style.accentBg + ' ' + style.accentText : style.bg + ' ' + style.accent}`}>
                  {card.icon}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{card.label}</p>
                  <h3 className={`text-4xl font-black ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{card.value}</h3>
                </div>
              </div>
              {isActive && (
                <div className={`${style.line} absolute bottom-0 left-0 w-full h-1`}></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Operational Console */}
      <div className="premium-card p-4 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative group flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Query inventory by nomenclature or taxonomic category..."
            className="input-field pl-12 pr-12"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </form>
        
        <button 
          onClick={handleSearch}
          className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-3.5 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95 whitespace-nowrap"
        >
          Execute Analysis
        </button>
      </div>

      {/* Repository Section */}
      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-4xl border border-slate-100 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-6"></div>
            <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Synchronizing Local Buffer...</p>
          </div>
        ) : (
          <ProductTable products={products} deleteProduct={deleteProduct} />
        )}
      </div>
    </div>
  );
};

export default Products;