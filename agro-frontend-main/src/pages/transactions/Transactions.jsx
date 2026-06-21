import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CircleDollarSign, 
  History,
  TrendingUp,
  CreditCard,
  IndianRupee,
  CalendarDays,
  X
} from "lucide-react";
import API from "../../services/api";
import TransactionTable from "../../components/transactions/TransactionTable";
import toast from "react-hot-toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCredits: 0,
    totalPayments: 0
  });

  const getTransactions = async (filterType = "") => {
    try {
      setLoading(true);
      let url = "/transactions/history";
      if (filterType) url = `/transactions/search?type=${filterType}`;
      
      const { data } = await API.get(url);
      setTransactions(data.transactions);
      
      // Update stats only on initial full load
      if (!filterType) {
        const credits = data.transactions
          .filter(t => t.type === "credit" || t.type === "interest")
          .reduce((acc, curr) => acc + curr.amount, 0);
        const payments = data.transactions
          .filter(t => t.type === "payment")
          .reduce((acc, curr) => acc + curr.amount, 0);
        
        setStats({
          totalAmount: data.transactions.reduce((acc, curr) => acc + curr.amount, 0),
          totalCredits: credits,
          totalPayments: payments
        });
      }
    } catch (error) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const newType = e.target.value;
    setType(newType);
    getTransactions(newType);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Transactions</h1>
          <p className="text-slate-700 mt-2 font-medium">Record and track all financial entries</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/transactions/credit"
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            <ArrowUpRight size={18} />
            Credit Entry
          </Link>
          <Link
            to="/transactions/payment"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-green-100 active:scale-95"
          >
            <ArrowDownLeft size={18} />
            Payment Entry
          </Link>
          <Link
            to="/transactions/interest"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-yellow-100 active:scale-95"
          >
            <CircleDollarSign size={18} />
            Interest Entry
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <IndianRupee size={24} />
            </div>
            <TrendingUp size={20} className="text-blue-400 opacity-50" />
          </div>
          <p className="text-slate-700 text-sm font-bold uppercase tracking-wider">Total Volume</p>
          <h3 className="text-3xl font-black text-gray-800 mt-1">₹{stats.totalAmount.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <ArrowUpRight size={24} />
            </div>
          </div>
          <p className="text-slate-700 text-sm font-bold uppercase tracking-wider">Total Credits</p>
          <h3 className="text-3xl font-black text-red-600 mt-1">₹{stats.totalCredits.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <ArrowDownLeft size={24} />
            </div>
          </div>
          <p className="text-slate-700 text-sm font-bold uppercase tracking-wider">Total Payments</p>
          <h3 className="text-3xl font-black text-green-600 mt-1">₹{stats.totalPayments.toLocaleString()}</h3>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative group flex-1 w-full">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-600 transition-colors" size={20} />
          <select
            value={type}
            onChange={handleFilter}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50/50 appearance-none font-medium text-gray-700"
          >
            <option value="">All Transaction Types</option>
            <option value="credit">Credit Only</option>
            <option value="payment">Payment Only</option>
            <option value="interest">Interest Only</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
            <Plus size={16} className="rotate-45" />
          </div>
        </div>
        
        <button 
          onClick={() => { setType(""); getTransactions(); }}
          className="flex items-center gap-2 text-slate-600 hover:text-red-500 font-bold px-4 py-2 transition-colors"
        >
          <X size={18} />
          Clear Filters
        </button>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
          <p className="text-slate-700 font-medium">Fetching history...</p>
        </div>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
};

export default Transactions;