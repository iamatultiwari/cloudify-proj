import { useEffect, useState } from "react";
import { 
  User, 
  IndianRupee, 
  FileText, 
  Percent,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import API from "../../services/api";

const InterestForm = ({ onSubmit, loading }) => {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [formData, setFormData] = useState({
    farmerId: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const getFarmers = async () => {
      try {
        const { data } = await API.get("/farmers");
        setFarmers(data.farmers);
      } catch (error) {
        console.log(error);
      }
    };
    getFarmers();
  }, []);

  const handleFarmerChange = (e) => {
    const farmerId = e.target.value;
    const farmer = farmers.find(f => f._id === farmerId);
    setSelectedFarmer(farmer);
    setFormData({ ...formData, farmerId });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.farmerId) return alert("Please select a farmer");
    onSubmit(formData);
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all shadow-sm bg-white";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer Selection */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
              <User size={20} className="text-yellow-600" />
              Farmer Details
            </h3>
            
            <div>
              <label className={labelClasses}>Select Farmer</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-600 transition-colors" size={18} />
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
              <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-100">
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Current Debt</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-yellow-800">₹{selectedFarmer.dueAmount.toLocaleString()}</span>
                  <span className="text-yellow-600 text-sm font-medium">due amount</span>
                </div>
              </div>
            )}
          </div>

          {/* Interest Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-yellow-600" />
              Interest Addition
            </h3>

            <div>
              <label className={labelClasses}>Interest Amount</label>
              <div className="relative group">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-600 transition-colors" size={18} />
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`${inputClasses} text-xl font-bold text-yellow-700`}
                  required
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
              <AlertCircle size={18} className="text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                Interest entry will increase the total due amount for this farmer. Make sure to double check the amount before saving.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <label className={labelClasses}>Notes / Reason for Interest</label>
          <div className="relative group">
            <FileText className="absolute left-3.5 top-4 text-slate-600 group-focus-within:text-yellow-600 transition-colors" size={18} />
            <textarea
              name="description"
              placeholder="e.g. Monthly interest for April 2024..."
              value={formData.description}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all shadow-sm bg-white min-h-[80px]"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.amount || formData.amount <= 0}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-4 rounded-2xl font-black transition-all shadow-xl shadow-yellow-100 disabled:opacity-50 active:scale-95"
          >
            {loading ? "Adding..." : "Add Interest Amount"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InterestForm;