import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  ShoppingCart, 
  Plus, 
  Receipt, 
  IndianRupee, 
  Calculator,
  ShieldCheck,
  Building2
} from "lucide-react";
import API from "../../services/api";
import ProductRow from "../../components/invoices/ProductRow";
import toast from "react-hot-toast";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmerId: "",
    billingType: "cash", // Maps to Retail Cash
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

  const getFarmers = async () => {
    try {
      const { data } = await API.get("/farmers");
      setFarmers(data.farmers);
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProductsList(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFarmers();
    getProducts();
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
        
        // Dynamic conditional checks evaluating all 4 matrix tiers from legacy system
        if (formData.billingType === "cash") {
          rate = p.cashRate || 0; // Cash Price-Retail
        } else if (formData.billingType === "credit") {
          rate = p.creditRate || 0; // Credit Price-Retail
        } else if (formData.billingType === "wholesale") {
          rate = p.wholesaleRate || 0; // Cash Price-Wholesale
        } else if (formData.billingType === "wholesale_credit") {
          rate = p.creditWholesaleRate || 0; // Credit Price-Wholesale
        }

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
      toast.success("Invoice Created Successfully");
      navigate("/invoices");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    } finally {
      loading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 text-sm appearance-none cursor-pointer";
  const labelClasses = "block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1";

  // Helper helper config to style the context shield badge cleanly
  const getBillingBadgeProps = () => {
    if (formData.billingType.includes("credit")) {
      return {
        wrapper: "bg-rose-50 border-rose-100 text-rose-700",
        text: "This handles custom outstanding deferred limits and will modify ledger records."
      };
    }
    return {
      wrapper: "bg-emerald-50 border-emerald-100 text-emerald-700",
      text: "This processes as an immediate settlement direct transaction point."
    };
  };

  const badgeProps = getBillingBadgeProps();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          to="/invoices"
          className="p-3 bg-white border border-gray-200 rounded-2xl text-slate-800 hover:text-green-600 hover:border-green-200 transition-all shadow-sm w-fit"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Receipt size={14} />
            <span>New Billing</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Generate Invoice</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Invoice Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            {/* Farmer & Billing Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 sm:mb-10">
              <div>
                <label className={labelClasses}>Select Farmer</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-600 transition-colors" size={18} />
                  <select
                    value={formData.farmerId}
                    onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                    className={inputClasses}
                    required
                  >
                    <option value="">Choose Farmer</option>
                    {farmers?.map((f) => (
                      <option key={f._id} value={f._id}>{f.name} ({f.village || "No Area Location"})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Billing Type Matrix</label>
                <div className="relative group">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-600 transition-colors" size={18} />
                  <select
                    value={formData.billingType}
                    onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="cash">Retail - Cash Price</option>
                    <option value="credit">Retail - Credit Price</option>
                    <option value="wholesale">Wholesale - Cash Price</option>
                    <option value="wholesale_credit">Wholesale - Credit Price</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Selection Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-green-600" />
                  Product Selection
                </h3>
                <button
                  type="button"
                  onClick={addProductRow}
                  className="flex items-center justify-center sm:justify-start gap-2 text-green-600 font-bold text-sm hover:bg-green-50 px-4 py-2 rounded-xl transition-all border border-green-100 sm:border-none"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-left">
                  <thead>
                    <tr className="text-slate-600 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100 whitespace-nowrap">
                      <th className="py-4 px-2 min-w-[200px]">Product Name</th>
                      <th className="py-4 px-2 min-w-[100px]">Rate</th>
                      <th className="py-4 px-2 min-w-[100px]">Qty</th>
                      <th className="py-4 px-2 min-w-[100px]">Tax</th>
                      <th className="py-4 px-2 text-right min-w-[120px]">Amount</th>
                      <th className="py-4 px-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.products.map((item, index) => (
                      <ProductRow
                        key={index}
                        product={{ ...item, productsList }}
                        index={index}
                        handleChange={handleProductChange}
                        removeProduct={removeProductRow}
                        billingType={formData.billingType}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary & Action */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 sticky top-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-2">
              <Calculator size={22} className="text-green-600" />
              Invoice Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium text-sm">Subtotal</span>
                <span className="font-bold text-gray-800">₹{summary.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium text-sm">Total Tax (GST)</span>
                <span className="font-bold text-gray-800">₹{summary.totalGST.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="h-px bg-gray-50 w-full my-6"></div>
              
              <div className="flex justify-between items-center">
                <span className="font-black text-gray-800">Grand Total</span>
                <div className="flex flex-col items-end">
                  <span className="text-2xl sm:text-3xl font-black text-green-700">₹{summary.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Inclusive of all taxes</span>
                </div>
              </div>
            </div>

            <div className={`mt-8 sm:mt-10 p-4 rounded-2xl flex items-start gap-3 border ${badgeProps.wrapper}`}>
              <ShieldCheck size={20} className="shrink-0 mt-0.5" />
              <div className="text-xs font-bold leading-relaxed">
                Billing configuration set to <span className="uppercase font-black">{formData.billingType.replace('_', ' ')}</span>. {badgeProps.text}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || summary.grandTotal <= 0}
              className="w-full mt-6 sm:mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl shadow-green-100 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? "Generating..." : (
                <>
                  <Building2 size={20} />
                  Confirm & Generate Bill
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;