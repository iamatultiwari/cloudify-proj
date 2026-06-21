import { useEffect, useState } from "react";
import { 
  User, 
  IndianRupee, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2, 
  Package,
  AlertCircle,
  ShieldCheck,
  PlusCircle,
  ShoppingCart
} from "lucide-react";
import API from "../../services/api";

const CreditForm = ({ onSubmit, loading }) => {
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [formData, setFormData] = useState({
    farmerId: "",
    amount: 0,
    description: "",
    dueDate: "",
    products: [] // { product: id, quantity: n, price: p }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmersRes, productsRes] = await Promise.all([
          API.get("/farmers"),
          API.get("/products")
        ]);
        setFarmers(farmersRes.data.farmers);
        setProducts(productsRes.data.products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFarmerChange = (e) => {
    const farmerId = e.target.value;
    const farmer = farmers.find(f => f._id === farmerId);
    setSelectedFarmer(farmer);
    setFormData({ ...formData, farmerId });
  };

  const addProductToOrder = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: "", quantity: 1, price: 0 }]
    });
  };

  const removeProductFromOrder = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    calculateTotal(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    
    if (field === "product") {
      const product = products.find(p => p._id === value);
      if (product) {
        updatedProducts[index].price = product.creditRate;
      }
    }
    
    calculateTotal(updatedProducts);
  };

  const calculateTotal = (updatedProducts) => {
    const total = updatedProducts.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
    setFormData({ ...formData, products: updatedProducts, amount: total });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.farmerId) return alert("Please select a farmer");
    onSubmit(formData);
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm bg-white";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Farmer & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
              <User size={20} className="text-red-500" />
              Farmer Selection
            </h3>

            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Select Farmer</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                  <select
                    name="farmerId"
                    value={formData.farmerId}
                    onChange={handleFarmerChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">Choose Farmer</option>
                    {farmers?.map((f) => (
                      <option key={f._id} value={f._id}>{f.name} ({f.village})</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedFarmer && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">Current Due:</span>
                    <span className="font-bold text-red-600">₹{selectedFarmer.dueAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">Credit Limit:</span>
                    <span className="font-bold text-gray-700">₹{selectedFarmer.creditLimit.toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] bg-red-100 w-full"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">Remaining:</span>
                    <span className={`font-bold ${selectedFarmer.creditLimit - selectedFarmer.dueAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{(selectedFarmer.creditLimit - selectedFarmer.dueAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className={labelClasses}>Due Date (Optional)</label>
                <div className="relative group">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Products & Amount */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart size={20} className="text-red-500" />
                Credit Products
              </h3>
              <button
                type="button"
                onClick={addProductToOrder}
                className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                <PlusCircle size={18} />
                Add Product
              </button>
            </div>

            <div className="flex-1 space-y-4">
              {formData.products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-3xl text-slate-600">
                  <Package size={48} className="opacity-20 mb-2" />
                  <p className="font-medium text-sm">No products added yet</p>
                  <p className="text-xs">Or you can enter a direct amount below</p>
                </div>
              ) : (
                formData.products.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                    <div className="col-span-5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase ml-1 mb-1 block">Product</label>
                      <select
                        value={item.product}
                        onChange={(e) => handleProductChange(index, "product", e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p._id} value={p._id} disabled={p.quantity <= 0}>
                            {p.productName} ({p.quantity} left)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase ml-1 mb-1 block">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] font-bold text-slate-600 uppercase ml-1 mb-1 block">Price</label>
                      <div className="relative">
                        <IndianRupee size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleProductChange(index, "price", parseFloat(e.target.value))}
                          className="w-full pl-6 pr-2 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end pb-1">
                      <button
                        type="button"
                        onClick={() => removeProductFromOrder(index)}
                        className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className={labelClasses}>Credit Amount</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                      className={`${inputClasses} font-black text-xl text-red-600`}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Notes / Description</label>
                  <div className="relative group">
                    <FileText className="absolute left-3.5 top-4 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                    <textarea
                      name="description"
                      placeholder="Enter transaction details..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm bg-white min-h-[50px] text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || formData.amount <= 0}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-red-100 disabled:opacity-50 active:scale-95"
                >
                  {loading ? "Processing..." : "Confirm Credit Entry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreditForm;