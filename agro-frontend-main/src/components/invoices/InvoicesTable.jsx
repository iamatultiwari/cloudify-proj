import { Link } from "react-router-dom";
import { 
  Eye, 
  Printer, 
  Calendar, 
  User, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  Receipt,
  IndianRupee,
  ChevronRight
} from "lucide-react";

const InvoiceTable = ({ invoices }) => {
  return (
    <div className="premium-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Billing Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Counterparty</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Fiscal Protocol</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Transaction Value</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Status & Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices?.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                      <Receipt size={32} />
                    </div>
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No billing records</p>
                  </div>
                </td>
              </tr>
            ) : (
              invoices?.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-black text-xs">
                        INV
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tighter group-hover:text-emerald-600 transition-colors">
                          #{invoice.invoiceNumber}
                        </p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Document ID</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                        <User size={14} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">{invoice.farmer?.name}</p>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      invoice.billingType === "credit"
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : invoice.billingType === "cash"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      <CreditCard size={12} />
                      {invoice.billingType}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1">
                        <IndianRupee size={16} className="text-emerald-500" />
                        {invoice.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Total Liability</span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        invoice.paymentStatus === "paid"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                      }`}>
                        {invoice.paymentStatus === "paid" ? <ShieldCheck size={10} /> : <AlertCircle size={10} />}
                        {invoice.paymentStatus}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                        <Calendar size={12} className="text-slate-600" />
                        {new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <Link
                        to={`/invoices/${invoice._id}`}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="View Intelligence"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/invoices/print/${invoice._id}`}
                        className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                        title="Print Physical Copy"
                      >
                        <Printer size={18} />
                      </Link>
                    </div>
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

export default InvoiceTable;
