import { useState, useEffect } from "react";
import { Save, Loader2, Package, Tag, Hash, IndianRupee, Percent, Calendar, AlertTriangle, Activity, Database, TrendingUp, ShieldCheck } from "lucide-react";

const ProductForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    quantity: "",
    purchasePrice: "",
    creditRate: "",
    cashRate: "",
    wholesaleRate: "",
    gstRate: "0",
    expiryDate: "",
    lowStockThreshold: "10",
    status: "available",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        productName: initialData.productName || "",
        category: initialData.category || "",
        quantity: initialData.quantity || "",
        purchasePrice: initialData.purchasePrice || "",
        creditRate: initialData.creditRate || "",
        cashRate: initialData.cashRate || "",
        wholesaleRate: initialData.wholesaleRate || "",
        gstRate: initialData.gstRate || "0",
        expiryDate: initialData.expiryDate ? initialData.expiryDate.split("T")[0] : "",
        lowStockThreshold: initialData.lowStockThreshold || "10",
        status: initialData.status || "available",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const labelClasses = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2.5 ml-1";
  const inputContainerClasses = "relative group";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="premium-card p-10 space-y-12 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Basic Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Core Logistics</h3>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Inventory Metadata</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className={labelClasses}>Product Nomenclature</label>
              <div className={inputContainerClasses}>
                <Package className={iconClasses} size={18} />
                <input
                  type="text"
                  name="productName"
                  placeholder="Asset Designation"
                  value={formData.productName}
                  onChange={handleChange}
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Taxonomic Category</label>
              <div className={inputContainerClasses}>
                <Tag className={iconClasses} size={18} />
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Bio-Fertilizers, Precision Pesticides"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Volume Balance</label>
                <div className={inputContainerClasses}>
                  <Hash className={iconClasses} size={18} />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Critical Threshold</label>
                <div className={inputContainerClasses}>
                  <AlertTriangle className={iconClasses} size={18} />
                  <input
                    type="number"
                    name="lowStockThreshold"
                    placeholder="10"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Expiration Node</label>
                <div className={inputContainerClasses}>
                  <Calendar className={iconClasses} size={18} />
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="input-field pl-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Operational Integrity</label>
                <div className={inputContainerClasses}>
                  <Activity className={iconClasses} size={18} />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field pl-12 appearance-none font-bold"
                  >
                    <option value="available">Available</option>
                    <option value="out_of_stock">Depleted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Fiscal Indices</h3>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Pricing & Taxation Matrix</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className={labelClasses}>Acquisition Cost</label>
              <div className={inputContainerClasses}>
                <ShieldCheck className={iconClasses} size={18} />
                <input
                  type="number"
                  name="purchasePrice"
                  placeholder="0.00"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Spot Cash Rate</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    name="cashRate"
                    placeholder="0.00"
                    value={formData.cashRate}
                    onChange={handleChange}
                    className="input-field pl-12 font-bold text-emerald-600"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Deferred Credit Rate</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    name="creditRate"
                    placeholder="0.00"
                    value={formData.creditRate}
                    onChange={handleChange}
                    className="input-field pl-12 font-bold text-amber-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Wholesale Index</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    name="wholesaleRate"
                    placeholder="0.00"
                    value={formData.wholesaleRate}
                    onChange={handleChange}
                    className="input-field pl-12 font-bold text-blue-600"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>GST Protocol (%)</label>
                <div className={inputContainerClasses}>
                  <Percent className={iconClasses} size={18} />
                  <input
                    type="number"
                    name="gstRate"
                    placeholder="0"
                    value={formData.gstRate}
                    onChange={handleChange}
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary min-w-[280px] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <Save size={24} />
              Synchronize Registry
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;