import React, { useState } from 'react';
import AccountDisplay from '../components/billing/AccountDisplay';
import PaymentReceiptForm from '../components/billing/PaymentReceiptForm';

const LedgerDesk = ({ farmers = [] }) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReceiptProcessed = () => {
    // Forces AccountDisplay statement logs to reload values instantly
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Financial Ledger Desk</h1>
          <p className="text-xs text-slate-500 font-medium">Manage credit statements and process collection vouchers.</p>
        </div>
        <select 
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-green-500 cursor-pointer max-w-xs w-full uppercase"
          value={selectedFarmerId}
          onChange={(e) => setSelectedFarmerId(e.target.value)}
        >
          <option value="">-- Choose Account Partner --</option>
          {farmers.map(f => (
            <option key={f._id} value={f._id}>{f.name} ({f.village || 'No Village'})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <PaymentReceiptForm 
            farmerId={selectedFarmerId} 
            onReceiptCreated={handleReceiptProcessed} 
          />
        </div>
        <div className="lg:col-span-2">
          <AccountDisplay 
            farmerId={selectedFarmerId} 
            refreshTrigger={refreshTrigger} 
          />
        </div>
      </div>
    </div>
  );
};

export default LedgerDesk;