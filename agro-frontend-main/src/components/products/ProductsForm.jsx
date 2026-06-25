
import { useState, useEffect } from "react";
import { 
  Save, 
  Loader2, 
  Package, 
  Tag, 
  Hash, 
  IndianRupee, 
  Percent, 
  Calendar, 
  AlertTriangle, 
  Activity, 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Barcode 
} from "lucide-react";

const ProductForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    // Core Logistics Fields
    productName: "",
    manufacturer: "",
    category: "",
    packingSize: "",
    packingUnit: "KG",
    batchNo: "",
    godown: "Shop",
    quantity: "",
    lowStockThreshold: "10",
    expiryDate: "",
    hsnCode: "",
    status: "available",

    // Fiscal Indices Fields
    purchasePrice: "",          // Base Price Before Tax
    purchasePriceWithGst: "",   // Legacy: Purchase Price with GST
    gstRate: "0",
    mrp: "",
    cashRate: "",               // Cash Price - Retail
    creditRate: "",             // Credit Price - Retail
    wholesaleRate: "",          // Cash Price - Wholesale
    creditWholesaleRate: "",    // Credit Price - Wholesale
    barCode: ""
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        productName: initialData.productName || "",
        manufacturer: initialData.manufacturer || "",
        category: initialData.category || "",
        packingSize: initialData.packingSize || "",
        packingUnit: initialData.packingUnit || "KG",
        batchNo: initialData.batchNo || "",
        godown: initialData.godown || "Shop",
        quantity: initialData.quantity || "",
        lowStockThreshold: initialData.lowStockThreshold || "10",
        expiryDate: initialData.expiryDate ? initialData.expiryDate.split("T")[0] : "",
        hsnCode: initialData.hsnCode || "",
        status: initialData.status || "available",
        purchasePrice: initialData.purchasePrice || "",
        purchasePriceWithGst: initialData.purchasePriceWithGst || "",
        gstRate: initialData.gstRate || "0",
        mrp: initialData.mrp || "",
        cashRate: initialData.cashRate || "",
        creditRate: initialData.creditRate || "",
        wholesaleRate: initialData.wholesaleRate || "",
        creditWholesaleRate: initialData.creditWholesaleRate || "",
        barCode: initialData.barCode || ""
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
        
        {/* =========================================================
            LEFT COLUMN: CORE LOGISTICS (INVENTORY METADATA)
           ========================================================= */}
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
            {/* Product Name */}
            <div className="space-y-2">
              <label className={labelClasses}>Product Nomenclature</label>
              <div className={inputContainerClasses}>
                <Package className={iconClasses} size={18} />
                <input
                  type="text"
                  name="productName"
                  placeholder="Asset Designation (e.g. Rogar)"
                  value={formData.productName}
                  onChange={handleChange}
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Manufacturer */}
            <div className="space-y-2">
              <label className={labelClasses}>Manufacturer</label>
              <div className={inputContainerClasses}>
                <Layers className={iconClasses} size={18} />
                <input
                  type="text"
                  name="manufacturer"
                  placeholder="Production Entity (e.g. Tata)"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Category & Packing Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Taxonomic Category</label>
                <div className={inputContainerClasses}>
                  <Tag className={iconClasses} size={18} />
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. PESTICIDE"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Packing Metric</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="packingSize"
                    placeholder="100"
                    value={formData.packingSize}
                    onChange={handleChange}
                    className="input-field w-full"
                  />
                  <select
                    name="packingUnit"
                    value={formData.packingUnit}
                    onChange={handleChange}
                    className="input-field max-w-[85px] px-2 font-bold bg-slate-50 text-center"
                  >
                    <option value="KG">KG</option>
                    <option value="GM">GM</option>
                    <option value="ML">ML</option>
                    <option value="LTR">LTR</option>
                    <option value="NOS">NOS</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Batch & Godown */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Batch Assignment</label>
                <div className={inputContainerClasses}>
                  <Hash className={iconClasses} size={18} />
                  <input
                    type="text"
                    name="batchNo"
                    placeholder="Batch Identifier Number"
                    value={formData.batchNo}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Storage Depository (Godown)</label>
                <div className={inputContainerClasses}>
                  <MapPin className={iconClasses} size={18} />
                  <select
                    name="godown"
                    value={formData.godown}
                    onChange={handleChange}
                    className="input-field pl-12 appearance-none font-bold"
                  >
                    <option value="Shop">Shop</option>
                    <option value="Godown A">Godown A</option>
                    <option value="Godown B">Godown B</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Volume Balance & Threshold */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Volume Balance (Opening Stock)</label>
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

            {/* Expiration & Operational Integrity */}
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

            {/* HSN Code Field */}
            <div className="space-y-2">
              <label className={labelClasses}>HSN Tariff Code Designation</label>
              <div className={inputContainerClasses}>
                <Hash className={iconClasses} size={18} />
                <input
                  type="text"
                  name="hsnCode"
                  placeholder="Tariff Code Classification Structure"
                  value={formData.hsnCode}
                  onChange={handleChange}
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: FISCAL INDICES (PRICING & TAXATION)
           ========================================================= */}
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
            {/* Purchase Price & Price With GST Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Acquisition Cost (Base)</label>
                <div className={inputContainerClasses}>
                  <ShieldCheck className={iconClasses} size={18} />
                  <input
                    type="number"
                    step="0.01"
                    name="purchasePrice"
                    placeholder="Purchase Price"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Purchase Cost (With GST)</label>
                <div className={inputContainerClasses}>
                  <ShieldCheck className={iconClasses} size={18} />
                  <input
                    type="number"
                    step="0.01"
                    name="purchasePriceWithGst"
                    placeholder="Total Price inc. Tax"
                    value={formData.purchasePriceWithGst}
                    onChange={handleChange}
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>

            {/* GST Protocol & MRP */}
            <div className="grid grid-cols-2 gap-6">
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

              <div className="space-y-2">
                <label className={labelClasses}>Maximum Retail Price (MRP)</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    step="0.01"
                    name="mrp"
                    placeholder="0.00"
                    value={formData.mrp}
                    onChange={handleChange}
                    className="input-field pl-12 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Retail Pricing Rates */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Spot Cash Rate (Retail)</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    step="0.01"
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
                <label className={labelClasses}>Deferred Credit Rate (Retail)</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    step="0.01"
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

            {/* Wholesale Pricing Rates */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClasses}>Wholesale Index (Cash)</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    step="0.01"
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
                <label className={labelClasses}>Wholesale Credit Index</label>
                <div className={inputContainerClasses}>
                  <IndianRupee className={iconClasses} size={18} />
                  <input
                    type="number"
                    step="0.01"
                    name="creditWholesaleRate"
                    placeholder="0.00"
                    value={formData.creditWholesaleRate}
                    onChange={handleChange}
                    className="input-field pl-12 font-bold text-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Universal BarCode Registry */}
            <div className="space-y-2">
              <label className={labelClasses}>Universal BarCode Registry</label>
              <div className={inputContainerClasses}>
                <Barcode className={iconClasses} size={18} />
                <input
                  type="text"
                  name="barCode"
                  placeholder="Scan or enter barcode entry matrix"
                  value={formData.barCode}
                  onChange={handleChange}
                  className="input-field pl-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Submission Action Row */}
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