import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CircleDollarSign, 
  Calendar, 
  User, 
  CreditCard,
  FileText
} from "lucide-react";

const TransactionTable = ({ transactions }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <History size={18} className="text-green-600" />
          Recent Transactions
        </h2>
        <span className="text-sm text-slate-700 font-medium uppercase tracking-tight">
          Total {transactions?.length || 0} Entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-slate-700 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Farmer</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment Mode</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions?.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <FileText size={48} className="opacity-20" />
                    <p className="font-medium">No transactions found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions?.map((item) => (
                <tr key={item._id} className="hover:bg-green-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-slate-700">
                        <User size={18} />
                      </div>
                      <div className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                        {item.farmer?.name}
                      </div>
                    </div>
                  </td>
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
                    <p className="text-xs text-slate-600 truncate max-w-[150px]" title={item.description}>
                      {item.description || "No description"}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Import History icon from lucide-react if missing or use fallback
import { History } from "lucide-react";

export default TransactionTable;