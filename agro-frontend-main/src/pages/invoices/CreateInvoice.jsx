
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Receipt, User, Percent, Layers, AlertTriangle } from "lucide-react";

const CreateInvoice = () => {
  // --- STATE MANAGEMENT ---
  const [farmers, setFarmers] = useState([]);
  const [productsPool, setProductsPool] = useState([]);
  
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  const [billingType, setBillingType] = useState("cash");
  const [dueDate, setDueDate] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([
    { product: "", quantity: 1, selectedRate: 0, gstRate: 0, totalAmount: 0 }
  ]);

  const [financials, setFinancials] = useState({ subTotal: 0, totalGST: 0, grandTotal: 0 });
  const [uiFeedback, setUiFeedback] = useState({ loading: false, error: null, success: null });

  // --- FETCH INITIAL DROPDOWN DATA ---
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [farmersRes, productsRes] = await Promise.all([
          axios.get("/api/v1/farmers"),
          axios.get("/api/v1/products")
        ]);
        if (farmersRes.data?.success) setFarmers(farmersRes.data.farmers);
        if (productsRes.data?.success) setProductsPool(productsRes.data.products);
      } catch (err) {
        console.error("Initialization error:", err);
        setUiFeedback(prev => ({ ...prev, error: "Failed to load master registry list data." }));
      }
    };
    fetchDropdownData();
  }, []);

  // --- RE-CALCULATE FINANCIAL LEDGER DATA ---
  useEffect(() => {
    let computedSubTotal = 0;
    let computedTotalGST = 0;

    const updatedItems = invoiceItems.map(item => {
      if (!item.product) return item;

      const matchedProduct = productsPool.find(p => p._id === item.product);
      if (!matchedProduct) return item;

      // Pure 4-tier client side matrix selection matching backend expectations
      let rate = 0;
      if (billingType === "cash") rate = matchedProduct.cashRate || 0;
      else if (billingType === "credit") rate = matchedProduct.creditRate || 0;
      else if (billingType === "wholesale") rate = matchedProduct.wholesaleRate || 0;
      else if (billingType === "wholesale_credit") rate = matchedProduct.creditWholesaleRate || 0;

      const itemTotalRaw = rate * Number(item.quantity || 0);
      const itemGstRaw = (itemTotalRaw * (matchedProduct.gstRate || 0)) / 100;
      const finalLineAmount = itemTotalRaw + itemGstRaw;

      computedSubTotal += itemTotalRaw;
      computedTotalGST += itemGstRaw;

      return {
        ...item,
        selectedRate: rate,
        gstRate: matchedProduct.gstRate || 0,
        totalAmount: Number(finalLineAmount.toFixed(2))
      };
    });

    // Deep comparison wrapper block to prevent infinite render looping
    const arraysMatch = JSON.stringify(invoiceItems) === JSON.stringify(updatedItems);
    if (!arraysMatch) {
      setInvoiceItems(updatedItems);
    }

    setFinancials({
      subTotal: Number(computedSubTotal.toFixed(2)),
      totalGST: Number(computedTotalGST.toFixed(2)),
      grandTotal: Number((computedSubTotal + computedTotalGST).toFixed(2))
    });
  }, [billingType, invoiceItems, productsPool]);

  // --- DYNAMIC ITEM EVENT HANDLERS ---
  const handleItemRowChange = (index, field, value) => {
    const values = [...invoiceItems];
    values[index][field] = value;
    setInvoiceItems(values);
  };

  const addNewLineItemRow = () => {
    setInvoiceItems([
      ...invoiceItems,
      { product: "", quantity: 1, selectedRate: 0, gstRate: 0, totalAmount: 0 }
    ]);
  };

  const removeLineItemRow = (index) => {
    if (invoiceItems.length === 1) return;
    const filteredRows = invoiceItems.filter((_, idx) => idx !== index);
    setInvoiceItems(filteredRows);
  };

  // --- SUBMIT TRANSACTION TO API BACKEND ---
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setUiFeedback({ loading: true, error: null, success: null });

    // Client-side execution guards
    if (!selectedFarmerId) {
      return setUiFeedback({ loading: false, error: "Please select a target farmer profile.", success: null });
    }
    const cleanProductsPayload = invoiceItems.filter(item => item.product !== "");
    if (cleanProductsPayload.length === 0) {
      return setUiFeedback({ loading: false, error: "Invoice must contain at least one valid line item product assignment.", success: null });
    }

    const compiledPayload = {
      farmerId: selectedFarmerId,
      billingType,
      products: cleanProductsPayload.map(i => ({ product: i.product, quantity: Number(i.quantity) })),
      ...(billingType.includes("credit") && dueDate && { dueDate })
    };

    try {
      const response = await axios.post("/api/v1/invoices/create", compiledPayload);
      if (response.data?.success) {
        setUiFeedback({ loading: false, error: null, success: "Invoice processed and ledger recorded cleanly!" });
        // Clean out state boundaries completely
        setSelectedFarmerId("");
        setBillingType("cash");
        setDueDate("");
        setInvoiceItems([{ product: "", quantity: 1, selectedRate: 0, gstRate: 0, totalAmount: 0 }]);
      }
    } catch (err) {
      console.error("Submission Failure Context:", err);
      setUiFeedback({
        loading: false,
        error: err.response?.data?.message || "Critical runtime fault execution failure during save actions.",
        success: null
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        
        {/* Component Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Receipt className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white tracking-wide">Generate Farmer Invoice Transaction</h1>
          </div>
          <span className="text-emerald-100 font-medium text-sm px-3 py-1 bg-emerald-800/40 rounded-full border border-emerald-500/30">
            Enterprise Module
          </span>
        </div>

        {/* Dynamic Context Feedback Alerts */}
        {uiFeedback.error && (
          <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-center space-x-3 text-red-700">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm font-medium">{uiFeedback.error}</p>
          </div>
        )}
        {uiFeedback.success && (
          <div className="m-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-700 text-sm font-medium">
            {uiFeedback.success}
          </div>
        )}

        <form onSubmit={handleFormSubmission} className="p-6 space-y-8">
          
          {/* SECTION A: REGISTRY PROFILE METRICS AND METADATA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <User className="h-4 w-4 mr-1 text-slate-500" /> Select Farmer Profile
              </label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2.5 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">-- Choose Profile Record --</option>
                {farmers.map((farmer) => (
                  <option key={farmer._id} value={farmer._id}>
                    {farmer.name} ({farmer.village || "No Village Profile Data"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                <Layers className="h-4 w-4 mr-1 text-slate-500" /> Billing Category Matrix
              </label>
              <select
                value={billingType}
                onChange={(e) => setBillingType(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2.5 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="cash">Cash Settlement (Standard Rate)</option>
                <option value="credit">Deferred Credit (Premium Rate)</option>
                <option value="wholesale">Bulk Wholesale (Discounted Cash)</option>
                <option value="wholesale_credit">Bulk Wholesale Credit (Mixed Terms)</option>
              </select>
            </div>

            {billingType.includes("credit") && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ledger Maturity Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* SECTION B: LINE ITEM DYNAMIC DATA ENTRY LOOP */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Line Item Inventories Allocation</h2>
            <div className="space-y-3">
              {invoiceItems.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  
                  <div className="w-full md:flex-1">
                    <select
                      value={item.product}
                      onChange={(e) => handleItemRowChange(index, "product", e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2 bg-white text-sm focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">-- Choose Stock Allocation --</option>
                      {productsPool.map((prod) => (
                        <option key={prod._id} value={prod._id}>
                          {prod.productName} (Avail: {prod.quantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full md:w-28">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemRowChange(index, "quantity", e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-emerald-500 text-center"
                      required
                    />
                  </div>

                  <div className="w-full md:w-32 bg-white border border-slate-200 p-2 rounded text-sm text-center text-slate-600 font-medium">
                    Rate: ₹{item.selectedRate || 0}
                  </div>

                  <div className="w-full md:w-24 bg-white border border-slate-200 p-2 rounded text-sm text-center text-slate-600 font-medium flex items-center justify-center">
                    <Percent className="h-3 w-3 mr-0.5 text-slate-400" /> {item.gstRate || 0}%
                  </div>

                  <div className="w-full md:w-36 bg-emerald-50 border border-emerald-200 p-2 rounded text-sm text-center text-emerald-800 font-bold">
                    ₹{item.totalAmount || 0}
                  </div>

                  {invoiceItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItemRow(index)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors flex-shrink-0 mx-auto md:mx-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addNewLineItemRow}
              className="mt-3 inline-flex items-center space-x-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 hover:bg-emerald-50 rounded transition-all"
            >
              <Plus className="h-4 w-4" /> <span>Add Another Row Item</span>
            </button>
          </div>

          <hr className="border-slate-200" />

          {/* SECTION C: FINAL SETTLEMENT SUMMATION VIEW LEDGER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-500 space-y-1">
              <p className="font-bold uppercase tracking-wider text-slate-600 mb-1">System Architecture Guards Check</p>
              <p>• Selecting Credit structures shifts payment flags automatically to "Pending".</p>
              <p>• Stock changes run within transactional boundaries to prevent database locks.</p>
              <p>• Precision numeric parameters resolve floating calculations inside currency displays.</p>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3.5 border border-slate-800">
              <div className="flex justify-between text-sm text-slate-400 font-medium">
                <span>Aggregate Subtotal</span>
                <span>₹{financials.subTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400 font-medium">
                <span>Accumulated GST Breakdown</span>
                <span>+ ₹{financials.totalGST}</span>
              </div>
              <hr className="border-slate-800" />
              <div className="flex justify-between items-center text-lg font-bold text-emerald-400">
                <span>Grand Total Payable</span>
                <span className="text-2xl">₹{financials.grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={uiFeedback.loading}
              className={`px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide text-sm rounded-lg shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                uiFeedback.loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {uiFeedback.loading ? "Processing Ledger Writes..." : "Commit Invoice Configuration"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;