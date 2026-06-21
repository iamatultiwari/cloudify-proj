import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit3, 
  Package, 
  Tag, 
  Hash, 
  IndianRupee, 
  Percent, 
  Calendar, 
  AlertTriangle,
  History,
  ShieldCheck,
  TrendingUp,
  Boxes
} from "lucide-react";
import API from "../../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-4xl border border-slate-100 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-6"></div>
        <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Retrieving Asset Intelligence...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="premium-card p-20 text-center max-w-2xl mx-auto my-20">
        <Package size={80} className="mx-auto text-slate-100 mb-6" />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Record Nullified</h2>
        <p className="text-slate-600 mt-4 font-medium leading-relaxed">The requested inventory node does not exist in the current registry or has been purged from the database.</p>
        <Link to="/products" className="btn-primary mt-10 inline-flex items-center gap-3">
          <ArrowLeft size={20} />
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isLowStock = product.quantity <= product.lowStockThreshold;
  const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();

  const infoCards = [
    { label: "Inventory Balance", value: product.quantity, icon: <Hash size={20} />, color: isLowStock ? "text-rose-600" : "text-slate-900", bgColor: isLowStock ? "bg-rose-50" : "bg-emerald-50", subtitle: "Metric Units" },
    { label: "Taxonomic Class", value: product.category, icon: <Tag size={20} />, color: "text-slate-900", bgColor: "bg-blue-50", subtitle: "Global Category" },
    { label: "Spot Cash Index", value: `₹${product.cashRate.toLocaleString()}`, icon: <IndianRupee size={20} />, color: "text-emerald-600", bgColor: "bg-emerald-50/50", subtitle: "Immediate Liquidity" },
    { label: "Deferred Credit", value: `₹${product.creditRate.toLocaleString()}`, icon: <IndianRupee size={20} />, color: "text-amber-600", bgColor: "bg-amber-50", subtitle: "Ledger Valuation" },
    { label: "Wholesale Index", value: `₹${product.wholesaleRate.toLocaleString()}`, icon: <TrendingUp size={20} />, color: "text-blue-600", bgColor: "bg-blue-50", subtitle: "Bulk Acquisition" },
    { label: "GST Protocol", value: `${product.gstRate}%`, icon: <Percent size={20} />, color: "text-slate-600", bgColor: "bg-slate-50", subtitle: "Fiscal Taxation" },
    { label: "Acquisition Cost", value: `₹${product.purchasePrice.toLocaleString()}`, icon: <ShieldCheck size={20} />, color: "text-slate-900", bgColor: "bg-slate-900/5", subtitle: "Capital Outlay" },
    { label: "Alert Threshold", value: product.lowStockThreshold, icon: <AlertTriangle size={20} />, color: "text-amber-600", bgColor: "bg-amber-50/50", subtitle: "Critical Level" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link
            to="/products"
            className="group p-5 bg-white border border-slate-100 rounded-3xl text-slate-600 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-xl transition-all"
          >
            <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
              <span className="w-10 h-0.5 bg-emerald-600"></span>
              Inventory Analytics
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">{product.productName}</h1>
          </div>
        </div>

        <Link
          to={`/products/edit/${product._id}`}
          className="btn-primary flex items-center gap-3 self-start shadow-emerald-500/10 px-10 py-5"
        >
          <Edit3 size={22} />
          Modify Registry
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Intelligence Matrix */}
        <div className="lg:col-span-2 space-y-10">
          <div className="premium-card p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>
            
            <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
              Asset Technical Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {infoCards.map((card, index) => (
                <div key={index} className="flex items-center gap-5 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-premium transition-all duration-300 group">
                  <div className={`p-4 rounded-2xl ${card.bgColor} ${card.color} group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{card.label}</p>
                    <p className={`text-2xl font-black tracking-tight ${card.color}`}>{card.value}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Monitoring */}
        <div className="space-y-8">
          <div className="premium-card p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8">System Health</h3>
            
            <div className="space-y-6">
              <div className={`p-6 rounded-[2rem] flex items-center justify-between border ${product.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                <div className="flex items-center gap-4 font-black uppercase tracking-widest text-xs">
                  <div className={`p-2 rounded-xl ${product.status === 'available' ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
                    {product.status === 'available' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <span>{product.status}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${product.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              </div>

              {isLowStock && product.quantity > 0 && (
                <div className="p-6 rounded-[2rem] bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-4 font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/5">
                  <div className="p-2 rounded-xl bg-amber-500 text-white">
                    <AlertTriangle size={20} />
                  </div>
                  <span>Low Stock Warning engaged</span>
                </div>
              )}

              <div className={`p-8 rounded-[2rem] border-2 relative overflow-hidden ${isExpired ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100 shadow-premium'}`}>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Lifecycle Expiration</p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-3 rounded-2xl ${isExpired ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span className={`text-xl font-black tracking-tight ${isExpired ? 'text-rose-600' : 'text-slate-900'}`}>
                      {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Infinity Registry"}
                    </span>
                    {isExpired && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1 animate-bounce">Node Expired</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Analytics Card */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <TrendingUp size={40} className="mb-6 text-emerald-500 opacity-50" />
            <h4 className="text-xl font-black text-white mb-6 tracking-tight">Yield Intelligence</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Spot Profit</span>
                <span className="text-lg font-black text-emerald-400">₹{(product.cashRate - product.purchasePrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Deferred Margin</span>
                <span className="text-lg font-black text-amber-400">₹{(product.creditRate - product.purchasePrice).toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">Analytical projections based on current market indices and acquisition metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
