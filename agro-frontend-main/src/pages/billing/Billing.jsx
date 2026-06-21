import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  ShoppingCart, 
  Plus, 
  Receipt, 
  Trash2,
  Calculator,
  Building2,
  ChevronRight
} from "lucide-react";
import API from "../../services/api";
import toast from "react-hot-toast";
import InvoicePreview from "../../components/billing/InvoicePreview";

const Billing = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmerId: "",
    billingType: "cash",
    products: [
      {
        product: "",
        quantity: 1,
      },
    ],
  });

  const [summary, setSummary] = useState({
    subTotal: 0,
    totalGST: 0,
    grandTotal: 0
  });

  const getData = async () => {
    try {
      const [farmerRes, productRes] = await Promise.all([
        API.get("/farmers"),
        API.get("/products")
      ]);
      setFarmers(farmerRes.data.farmers);
      setProductsList(productRes.data.products);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [formData, productsList]);

  const calculateTotals = () => {
    let sub = 0;
    let gst = 0;

    formData.products.forEach(item => {
      const p = productsList.find(prod => prod._id === item.product);
      if (p) {
        let rate = 0;
        if (formData.billingType === "credit") rate = p.creditRate;
        else if (formData.billingType === "cash") rate = p.cashRate;
        else if (formData.billingType === "wholesale") rate = p.wholesaleRate;

        const lineTotal = rate * (item.quantity || 0);
        const lineGST = (lineTotal * (p.gstRate || 0)) / 100;
        
        sub += lineTotal;
        gst += lineGST;
      }
    });

    setSummary({
      subTotal: sub,
      totalGST: gst,
      grandTotal: sub + gst
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: "", quantity: 1 }],
    });
  };

  const removeProductRow = (index) => {
    if (formData.products.length === 1) return;
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farmerId) return toast.error("Please select a farmer");
    if (formData.products.some(p => !p.product)) return toast.error("Please select products for all rows");

    try {
      setLoading(true);
      const payload = {
        farmerId: formData.farmerId,
        billingType: formData.billingType,
        products: formData.products.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
        })),
      };

      await API.post("/invoices", payload);
      toast.success("Invoice Generated Successfully");
      navigate("/invoices");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "input-field pl-12 pr-4 py-4 font-bold text-slate-700 appearance-none";
  const labelClasses = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1";

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
            <span className="w-10 h-0.5 bg-emerald-600"></span>
            Transactional Module
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Billing <span className="text-emerald-600">Center</span>
          </h1>
          <p className="text-slate-600 mt-4 font-medium max-w-xl leading-relaxed">
            Execute precision billing operations with real-time fiscal verification and inventory reconciliation.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-premium">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Operator Node</p>
            <p className="text-sm font-bold text-slate-900">Primary Alpha</p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Receipt size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left: Input Console */}
        <div className="xl:col-span-7">
          <div className="premium-card p-10 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Farmer & Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClasses}>Farmer Identity</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <select
                      value={formData.farmerId}
                      onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                      className={inputClasses}
                      required
                    >
                      <option value="">Select Target Farmer</option>
                      {farmers?.map((f) => (
                        <option key={f._id} value={f._id}>{f.name} — {f.village}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClasses}>Billing Protocol</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <select
                      value={formData.billingType}
                      onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}
                      className={inputClasses}
                    >
                      <option value="cash">Spot Cash Sale</option>
                      <option value="credit">Credit (Baki Ledger)</option>
                      <option value="wholesale">Bulk Wholesale Rate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Inventory Interface */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 group-hover:scale-110 transition-transform">
                      <ShoppingCart size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Line Items</h3>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Inventory Matrix</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addProductRow}
                    className="flex items-center gap-2 bg-slate-900 text-white hover:bg-emerald-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 active:scale-95"
                  >
                    <Plus size={16} />
                    Insert Column
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.products.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 p-8 bg-slate-50/50 rounded-4xl border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-premium transition-all group">
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Asset Nomenclature</label>
                        <select
                          value={item.product}
                          onChange={(e) => handleProductChange(index, "product", e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                        >
                          <option value="">Select Product</option>
                          {productsList?.map((p) => (
                            <option key={p._id} value={p._id}>{p.productName} ({p.quantity} Units)</option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full md:w-36 space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Volume</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                          min="1"
                        />
                      </div>

                      <div className="flex items-end pb-1">
                        <button
                          type="button"
                          onClick={() => removeProductRow(index)}
                          className="p-3.5 text-slate-600 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 border border-transparent rounded-2xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Section */}
              <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Calculator size={22} className="text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold leading-relaxed max-w-[280px]">
                    Automatic calculation engine engaged. Values include dynamic taxation and protocol-based pricing indices.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || summary.grandTotal <= 0}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white py-5 px-8 rounded-[2rem] font-black text-lg md:text-xl transition-all shadow-2xl shadow-emerald-500/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-4 group"
                >
                  {loading ? "Engaging API..." : (
                    <>
                      <Building2 size={24} />
                      Commit Transaction
                      <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Real-time Visualizer */}
        <div className="xl:col-span-5 h-full">
          <InvoicePreview 
            formData={formData} 
            farmers={farmers} 
            productsList={productsList} 
            summary={summary} 
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
