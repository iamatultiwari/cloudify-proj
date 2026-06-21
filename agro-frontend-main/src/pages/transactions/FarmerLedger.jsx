import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  IndianRupee, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CircleDollarSign,
  Calendar,
  CreditCard
} from "lucide-react";
import API from "../../services/api";

const FarmerLedger = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLedger = async () => {
    try {
      const { data } = await API.get(`/transactions/ledger/${id}`);
      setFarmer(data.farmer);
      setLedger(data.ledger);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLedger();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
        <p className="text-slate-700 font-medium">Loading ledger records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link
            to="/farmers"
            className="p-3 bg-white border border-gray-200 rounded-2xl text-slate-800 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-slate-700 text-sm mb-1 uppercase tracking-wider font-bold">
              <History size={14} />
              <span>Farmer Ledger</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{farmer?.name}</h1>
          </div>
        </div>
      </div>

      {/* Farmer Info Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 lg:col-span-1">
          <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Mobile Number</p>
            <p className="text-sm font-bold text-gray-700">{farmer?.mobileNumber}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 lg:col-span-1">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Village</p>
            <p className="text-sm font-bold text-gray-700">{farmer?.village}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 lg:col-span-1">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <IndianRupee size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Current Outstanding</p>
            <p className="text-lg font-black text-red-600">₹{farmer?.dueAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 lg:col-span-1 border-l-4 border-l-green-500">
          <div className="p-3 bg-gray-50 text-slate-800 rounded-2xl">
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase">Credit Limit</p>
            <p className="text-sm font-bold text-gray-700">₹{farmer?.creditLimit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-green-600" />
            Transaction History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-slate-700 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ledger?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-700 italic font-medium">
                    No ledger entries found for this farmer.
                  </td>
                </tr>
              ) : (
                ledger?.map((item) => (
                  <tr key={item._id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.type === "credit"
                          ? "bg-red-100 text-red-700"
                          : item.type === "payment"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.type === "credit" && <ArrowUpRight size={12} />}
                        {item.type === "payment" && <ArrowDownLeft size={12} />}
                        {item.type === "interest" && <CircleDollarSign size={12} />}
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-800">
                      <span className={item.type === "payment" ? "text-green-600" : "text-red-600"}>
                        {item.type === "payment" ? "-" : "+"} ₹{item.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                        <CreditCard size={14} className="text-slate-600" />
                        <span className="capitalize">{item.paymentMode || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Calendar size={14} className="text-slate-600" />
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 truncate max-w-[200px]" title={item.description}>
                        {item.description || "No notes available"}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerLedger;