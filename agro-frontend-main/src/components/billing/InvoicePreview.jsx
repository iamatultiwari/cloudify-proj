import React from 'react';
import { ShieldCheck, Leaf, MapPin, Phone, Receipt } from 'lucide-react';

const InvoicePreview = ({ formData, farmers, productsList, summary }) => {
  const selectedFarmer = farmers.find(f => f._id === formData.farmerId);
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

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
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <p className="text-[10px] font-bold text-slate-600 uppercase mt-2 tracking-widest">{currentDate}</p>
          </div>
        </div>

        {/* Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-50">
          <div>
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Billed To</h3>
            {selectedFarmer ? (
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{selectedFarmer.name}</p>
                <p className="text-sm text-slate-700">{selectedFarmer.village}</p>
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
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{formData.billingType} RATE</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {formData.billingType === 'credit' ? 'Due within 30 days' : 'Paid in Cash'}
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
                if (formData.billingType === "credit") rate = p.creditRate;
                else if (formData.billingType === "cash") rate = p.cashRate;
                else if (formData.billingType === "wholesale") rate = p.wholesaleRate;

                return (
                  <tr key={idx}>
                    <td className="py-4 text-sm font-bold text-gray-800">{p.productName}</td>
                    <td className="py-4 text-center text-sm text-slate-700 font-medium">{item.quantity}</td>
                    <td className="py-4 text-right text-sm text-slate-700 font-medium">₹{rate.toLocaleString()}</td>
                    <td className="py-4 text-right text-sm font-bold text-gray-800">₹{(rate * item.quantity).toLocaleString()}</td>
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
              <span className="text-sm font-bold text-gray-800">₹{summary.subTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">GST (Tax)</span>
              <span className="text-sm font-bold text-gray-800">₹{summary.totalGST.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-100 my-1"></div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-green-600 uppercase tracking-widest">Total</span>
              <span className="text-xl font-black text-gray-900">₹{summary.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 flex items-center gap-3 p-4 bg-green-50/50 rounded-2xl border border-green-100">
          <ShieldCheck size={20} className="text-green-600 shrink-0" />
          <p className="text-[10px] font-bold text-green-800 leading-relaxed uppercase tracking-tight">
            This is a computer-generated document. No signature required. 
            All sales are final as per our terms & conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
