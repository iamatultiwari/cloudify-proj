import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet, Receipt, CreditCard, Scale } from 'lucide-react';
import API from '../../services/api'; 
import toast from 'react-hot-toast';

const AccountDisplay = ({ farmerId, refreshTrigger }) => {
  const [ledger, setLedger] = useState({ transactions: [], summary: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomerLedger = async () => {
      if (!farmerId) return;
      try {
        setLoading(true);
        const res = await API.get(`/ledger/${farmerId}/ledger`);
        setLedger(res.data);
      } catch (err) {
        toast.error("Failed to load account ledger.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerLedger();
  }, [farmerId, refreshTrigger]);

  if (!farmerId) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium italic">
        Select a transaction partner to pull financial ledger streams.
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Reconciling Balance Sheets...</div>;

  const { lifetimeBilled = 0, totalPaid = 0, outstandingBalance = 0 } = ledger.summary;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-2">
          <div className="flex justify-between items-center opacity-60 text-xs font-black tracking-widest uppercase">
            <span>Lifetime Billed</span>
            <ArrowUpRight size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-black font-mono">₹{lifetimeBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-black tracking-widest uppercase">
            <span>Total Collected</span>
            <ArrowDownLeft size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600">₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className={`p-6 rounded-3xl shadow-sm space-y-2 border ${outstandingBalance > 0 ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex justify-between items-center text-slate-500 text-xs font-black tracking-widest uppercase">
            <span>Current Outstanding</span>
            <Scale size={16} className="text-amber-600" />
          </div>
          <p className={`text-2xl font-black font-mono ${outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
            ₹{outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            <span className="text-[10px] font-black ml-1 uppercase">{outstandingBalance > 0 ? 'DR' : 'CR'}</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Wallet size={16} className="text-green-600" /> Statement History Log
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-black uppercase">Live Logs</span>
        </div>

        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="p-4">Execution Date</th>
                <th className="p-4">Reference ID / Voucher</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Debit (Billed)</th>
                <th className="p-4 text-right">Credit (Paid)</th>
                <th className="p-4 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
              {ledger.transactions.map((tx, idx) => (
                <tr key={tx._id || idx} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-4 whitespace-nowrap font-semibold">
                    {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 font-mono font-bold uppercase text-slate-900">{tx.referenceNumber}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      tx.type === 'invoice' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {tx.type === 'invoice' ? <Receipt size={10} /> : <CreditCard size={10} />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-rose-600">{tx.type === 'invoice' ? `₹${tx.amount.toFixed(2)}` : '—'}</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-600">{tx.type === 'receipt' ? `₹${tx.amount.toFixed(2)}` : '—'}</td>
                  <td className="p-4 text-right font-mono font-black text-slate-900">₹{tx.runningBalance.toFixed(2)}</td>
                </tr>
              ))}
              {ledger.transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400 italic font-medium">No transactions on record.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountDisplay;