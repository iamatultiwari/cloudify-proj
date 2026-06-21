import { Link } from "react-router-dom";
import { 
  Eye, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar,
  Package,
  Boxes,
  IndianRupee,
  Activity
} from "lucide-react";

const ProductsTable = ({ products, deleteProduct }) => {
  return (
    <div className="premium-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Product Nomenclature</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Asset Volume</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Pricing Indices</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Integrity Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-right">Administrative</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products?.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                      <Package size={32} />
                    </div>
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No assets detected</p>
                  </div>
                </td>
              </tr>
            ) : (
              products?.map((product) => {
                const isLowStock = product.quantity <= product.lowStockThreshold;
                const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
                
                return (
                  <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-2 group-hover:scale-110 transition-transform ${
                          isLowStock ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          {product.productName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">{product.productName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-lg">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`text-xl font-black tracking-tight ${isLowStock ? "text-rose-600" : "text-slate-800"}`}>
                          {product.quantity.toLocaleString()}
                        </span>
                        {isLowStock && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
                            <AlertTriangle size={12} />
                            Critical
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Metric Units Available</p>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
                          <IndianRupee size={12} className="text-emerald-500" />
                          {product.cashRate.toLocaleString()}
                          <span className="text-[10px] font-bold text-slate-600 uppercase ml-1">Spot</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                          <IndianRupee size={10} />
                          {product.creditRate.toLocaleString()}
                          <span className="text-[10px] font-bold uppercase ml-1 tracking-tighter">Deferred</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border self-start ${
                          product.status === "available" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          <Activity size={12} />
                          {product.status}
                        </span>
                        
                        {product.expiryDate && (
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold tracking-tighter ${isExpired ? "text-rose-600" : "text-slate-600"}`}>
                            <Calendar size={12} />
                            EXP: {new Date(product.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="View Intelligence"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/products/edit/${product._id}`}
                          className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                          title="Modify Entry"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Purge Entry"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;