import React, { useState } from 'react';
import { PlusCircle, Wallet, MessageSquare } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const PaymentReceiptForm = ({ farmerId, onReceiptCreated }) => {
  const [receiptData, setReceiptData] = useState({
    amountPaid: '',
    paymentMode: 'cash',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Controls the messaging feature (True by default)
  const [sendAlerts, setSendAlerts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleProcessCollection = async (e) => {
    e.preventDefault();
    const amount = Number(receiptData.amountPaid);
    
    if (!farmerId) return toast.error("Please select a valid partner account first.");
    if (!amount || amount <= 0) return toast.error("Please enter a valid allocation amount.");

    try {
      setSubmitting(true);
      await API.post('/ledger/receipts/collect', {
        farmerId,
        amount,
        paymentMode: receiptData.paymentMode,
        remarks: receiptData.remarks,
        date: receiptData.date,
        dispatchNotification: sendAlerts 
      });
      
      toast.success(sendAlerts ? "Receipt logged & notification queued!" : "Payment collection recorded.");
      setReceiptData({ amountPaid: '', paymentMode: 'cash', remarks: '', date: new Date().toISOString().split('T')[0] });
      
      if (onReceiptCreated) onReceiptCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Collection submission denied.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleProcessCollection} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2 border-b border-slate-50 pb-3">
        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Wallet size={18} /></div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Log Late Payment Receipt</h3>
      </div>

      {/* Row 1: Amount and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Amount Collected (₹)</label>
          <input 
            type="number" step="any" required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-sm font-bold text-slate-800 outline-none focus:border-green-500"
            placeholder="0.00" value={receiptData.amountPaid}
            onChange={(e) => setReceiptData({...receiptData, amountPaid: e.target.value})}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Clearing Date</label>
          <input 
            type="date" required style={{ colorScheme: 'light' }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-green-500"
            value={receiptData.date} onChange={(e) => setReceiptData({...receiptData, date: e.target.value})}
          />
        </div>
      </div>

      {/* Row 2: Mode and Remarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Payment Channel</label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-green-500 uppercase cursor-pointer"
            value={receiptData.paymentMode} onChange={(e) => setReceiptData({...receiptData, paymentMode: e.target.value})}
          >
            <option value="cash">Spot Cash</option>
            <option value="upi">UPI / Digital Gateway</option>
            <option value="bank_transfer">Direct Bank Neft / Imps</option>
            <option value="cheque">Clearing Cheque Draft</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Audit Remarks</label>
          <input 
            type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-green-500"
            placeholder="e.g. Partially cleared outstanding balance"
            value={receiptData.remarks} onChange={(e) => setReceiptData({...receiptData, remarks: e.target.value})}
          />
        </div>
      </div>

      {/* Row 3: Automated Notifications Toggle Switch */}
      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100 my-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className={sendAlerts ? "text-green-600" : "text-slate-400"} />
          <div>
            <p className="text-[11px] font-black text-slate-700 uppercase">Ping Customer Alerts</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Automated WhatsApp + Email dispatch</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" className="sr-only peer" 
            checked={sendAlerts} 
            onChange={(e) => setSendAlerts(e.target.checked)} 
          />
          <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      <button
        type="submit" disabled={submitting || !farmerId}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <PlusCircle size={14} /> {submitting ? 'Committing...' : 'Authorize & Apply Receipt'}
      </button>
    </form>
  );
};

export default PaymentReceiptForm;