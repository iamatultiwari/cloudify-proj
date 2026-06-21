import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleDollarSign } from "lucide-react";
import InterestForm from "../../components/transactions/InterestForm";
import API from "../../services/api";
import toast from "react-hot-toast";

const InterestTransaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createInterest = async (formData) => {
    try {
      setLoading(true);
      await API.post("/transactions/interest", formData);
      toast.success("Interest Added Successfully");
      navigate("/transactions");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add interest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/transactions"
          className="p-3 bg-white border border-gray-200 rounded-2xl text-slate-800 hover:text-yellow-600 hover:border-yellow-200 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-yellow-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CircleDollarSign size={14} />
            <span>New Interest Entry</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Add Interest to Account</h1>
        </div>
      </div>

      <InterestForm onSubmit={createInterest} loading={loading} />
    </div>
  );
};

export default InterestTransaction;