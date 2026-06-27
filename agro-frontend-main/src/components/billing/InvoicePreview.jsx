import React, { useState, useEffect } from 'react';
import { ShieldCheck, Leaf, MapPin, Phone, Receipt } from 'lucide-react';

const InvoicePreview = ({ formData, farmers, productsList, summary }) => {
  const selectedFarmer = farmers.find(f => f._id === formData.farmerId);
  
  // Track date changes locally to force instant visual updates even if the parent state delays
  const initialDateString = formData.createdAt 
    ? new Date(formData.createdAt).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
    
  const [localDate, setLocalDate] = useState(initialDateString);

  // Keep local date synchronized if the parent form resets or changes externally
  useEffect(() => {
    if (formData.createdAt) {
      setLocalDate(new Date(formData.createdAt).toISOString().split('T')[0]);
    }
  }, [formData.createdAt]);

  // Safe localized due date extraction formatting
  const formatDueDate = (dateString) => {
    if (!dateString) return "Pending Selected Date";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full sticky top-8">
      {/* Invoice Header Decoration */}
      <div className="bg-green-600 h-3 w-full"></div>
      
      <div className="p-8 flex-1 flex flex-col">
        {/* Brand & Meta */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-50 rounded-xl">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">AGRO<span className="text-green-600">ERP</span></h1>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} /> Central Mandi, Indore (M.P.)
              </p>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                <Phone size={10} /> +91 98765 43210
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-gray-900 mb-1">INVOICE</h2>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live Screen Preview</p>
            
            {/* Cleaned & Responsive Editable Date Layout */}
            <div className="text-[11px] font-black text-slate-600 uppercase mt-2 tracking-widest flex items-center justify-end gap-1.5">
              <span className="text-slate-400">DATE:</span>
              <input 
                type="date" 
                className="bg-slate-50 border border-slate-200 text-right font-black text-slate-800 uppercase outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 rounded-xl px-2 py-1 cursor-pointer transition-all"
                style={{ colorScheme: 'light' }}
                value={localDate} 
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setLocalDate(selectedValue); // Instant component re-render

                  // Bubble up modifications to parent state handler if available
                  if (typeof formData.setFieldValue === 'function') {
                    formData.setFieldValue("createdAt", selectedValue);
                  } else if (typeof formData.onChange === 'function') {
                    formData.onChange({ target: { name: 'createdAt', value: selectedValue } });
                  } else {
                    // Raw fallback mutation
                    formData.createdAt = selectedValue;
                    if (typeof summary?.recalculate === 'function') summary.recalculate();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-50">
          <div>
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Billed To</h3>
            {selectedFarmer ? (
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{selectedFarmer.name}</p>
                <p className="text-sm text-slate-700">{selectedFarmer.village || selectedFarmer.address}</p>
                <p className="text-sm text-slate-700">{selectedFarmer.mobileNumber}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-300 italic">Select a farmer to see details</p>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Payment Info</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full mb-2">
              <Receipt size={12} className="text-green-600" />
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                {formData.billingType?.replace("_", " ")} Tier
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {formData.billingType?.includes('credit') 
                ? `Due: ${formatDueDate(formData.dueDate)}` 
                : 'Paid Spot / Immediate'}
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 text-left text-[10px] font-black text-slate-600 uppercase tracking-widest">Description</th>
                <th className="py-4 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">Qty</th>
                <th className="py-4 text-right text-[10px] font-black text-slate-600 uppercase tracking-widest">Price</th>
                <th className="py-4 text-right text-[10px] font-black text-slate-600 uppercase tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {formData.products.map((item, idx) => {
                const p = productsList.find(prod => prod._id === item.product);
                if (!p) return null;
                
                let rate = 0;
                if (formData.billingType === "cash") rate = p.cashRate || 0;
                else if (formData.billingType === "credit") rate = p.creditRate || 0;
                else if (formData.billingType === "wholesale") rate = p.wholesaleRate || 0;
                else if (formData.billingType === "wholesale_credit") rate = p.creditWholesaleRate || 0;

                const qty = Number(item.quantity) || 0;

                return (
                  <tr key={idx}>
                    <td className="py-4 text-sm font-bold text-gray-800">{p.productName}</td>
                    <td className="py-4 text-center text-sm text-slate-700 font-medium">{qty}</td>
                    <td className="py-4 text-right text-sm text-slate-700 font-medium">₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 text-right text-sm font-bold text-gray-800">₹{(rate * qty).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              })}
              {formData.products.filter(i => i.product).length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-sm text-gray-300 italic">No products added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex flex-col gap-3 max-w-xs w-full ml-auto">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Subtotal</span>
              <span className="text-sm font-bold text-gray-800">₹{summary.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">GST (Tax)</span>
              <span className="text-sm font-bold text-gray-800">₹{summary.totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="h-px bg-gray-100 my-1"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-green-600 uppercase tracking-widest">Total</span>
              <span className="text-xl font-black text-gray-900">₹{summary.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 flex items-center gap-3 p-4 bg-green-50/50 rounded-2xl border border-green-100">
          <ShieldCheck size={20} className="text-green-600 shrink-0" />
          <p className="text-[10px] font-bold text-green-800 leading-relaxed uppercase tracking-tight">
            This is a real-time ledger preview projection map. 
            Final tax distribution matrices calculate directly on commit hook execution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;