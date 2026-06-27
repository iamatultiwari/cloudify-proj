import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Edit3 } from "lucide-react";
import API from "../../services/api";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";

const PrintInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [companySettings, setCompanySettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef(null);

  // ================= FETCH METADATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoiceRes, settingsRes] = await Promise.all([
        API.get(`/invoices/print/${id}`),
        API.get("/settings")
      ]);

      setInvoice(invoiceRes.data.printableInvoice);
      
      if (Array.isArray(settingsRes.data)) {
        setCompanySettings(settingsRes.data[0]);
      } else {
        setCompanySettings(settingsRes.data);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError(err.response?.data?.message || "Failed to load configuration metadata records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // ================= CALCULATION RECONCILIATION ENGINE =================
  const recalculateInvoiceTotals = (updatedProducts) => {
    let subTotal = 0;
    let totalGST = 0;

    const processedProducts = updatedProducts.map((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.selectedRate) || 0;
      const gstRate = Number(item.gstRate) || 0;

      const totalAmount = Number((qty * rate).toFixed(2));
      const baseRate = Number((rate / (1 + gstRate / 100)).toFixed(2));
      const lineGST = Number((totalAmount * gstRate / (100 + gstRate)).toFixed(2));

      subTotal += (totalAmount - lineGST);
      totalGST += lineGST;

      return {
        ...item,
        totalAmount,
        selectedRate: rate
      };
    });

    setInvoice((prev) => ({
      ...prev,
      products: processedProducts,
      subTotal: Number(subTotal.toFixed(2)),
      totalGST: Number(totalGST.toFixed(2)),
      grandTotal: Number((subTotal + totalGST).toFixed(2))
    }));
  };

  // ================= HANDLERS FOR FIELD MUTATIONS =================
  const handleProductRowChange = (index, field, value) => {
    const updatedProducts = [...invoice.products];
    updatedProducts[index][field] = value;

    if (["quantity", "selectedRate", "gstRate"].includes(field)) {
      recalculateInvoiceTotals(updatedProducts);
    } else {
      setInvoice((prev) => ({ ...prev, products: updatedProducts }));
    }
  };

  const handleTopLevelChange = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleFarmerChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      farmer: { ...prev.farmer, [field]: value }
    }));
  };

  const handleCompanyChange = (field, value) => {
    setCompanySettings((prev) => ({ ...prev, [field]: value }));
  };

  // ================= PRINT ENGINE =================
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice?.invoiceNumber || "Tax_Invoice",
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-slate-700 font-bold tracking-wide animate-pulse">
        Loading Document Visual Layers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-rose-600 font-black text-lg">
        {error}
      </div>
    );
  }

  const halfGstOutput = (invoice?.totalGST / 2 || 0).toFixed(2);

  return (
    <div className="p-4 md:p-8 bg-slate-100 min-h-screen">
      {/* ================= ACTIONS LAYER ================= */}
      <div className="mb-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-all"
        >
          <ArrowLeft size={16} /> Back to Terminal
        </button>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-xs text-slate-500 font-medium hidden md:block flex-1 text-right">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            Interactive Form Layer Active. Click text fields directly to override production data.
          </div>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/10 font-bold transition-all text-sm uppercase tracking-wider"
          >
            <Printer size={16} /> Print Document
          </button>
        </div>
      </div>

      {/* ================= PRINT HOUSING ================= */}
      <div ref={printRef} className="w-full max-w-5xl mx-auto bg-white p-6 print:p-0 text-black text-xs font-sans uppercase">
        
        <style dangerouslySetInnerHTML={{__html: `
          @page { size: portrait; margin: 4mm; }
          .invoice-box { border: 2px solid #000; width: 100%; box-sizing: border-box; }
          .border-b-dark { border-bottom: 1px solid #000; }
          .border-r-dark { border-right: 1px solid #000; }
          th, td { border-right: 1px solid #000; border-bottom: 1px solid #000; font-size: 11px !important; padding: 5px 6px !important; vertical-align: top; }
          th:last-child, td:last-child { border-right: none; }
          .inline-editable { background: transparent; border: none; width: 100%; font-family: inherit; font-size: inherit; font-weight: inherit; color: inherit; padding: 0; text-transform: uppercase; margin: 0; outline: none; }
          @media screen {
            .inline-editable:hover { background-color: #f8fafc; box-shadow: 0 0 0 1px #cbd5e1; border-radius: 2px; }
            .inline-editable:focus { background-color: #fff; box-shadow: 0 0 0 2px #10b981; border-radius: 2px; }
          }
          @media print {
            .invoice-box { border-width: 2px !important; }
            input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            input[type="number"] { -moz-appearance: textfield; }
          }
        `}} />

        <div className="invoice-box">
          {/* ================= COMPACT LOGISTICAL HEADER ================= */}
          <div className="text-center py-2 border-b-dark bg-slate-50/50">
            <input 
              className="inline-editable text-center text-2xl font-black tracking-wider font-serif mb-1"
              value={companySettings?.companyName || ""}
              onChange={(e) => handleCompanyChange("companyName", e.target.value)}
              placeholder="Company Name"
            />
            <input 
              className="inline-editable text-center text-[11px] font-semibold text-slate-800"
              value={companySettings?.address || ""}
              onChange={(e) => handleCompanyChange("address", e.target.value)}
              placeholder="Company Address"
            />
            <div className="flex justify-center items-center gap-1 text-[11px] font-semibold mt-0.5">
              <span>Mobile:</span>
              <input 
                className="inline-editable w-40 text-left font-bold"
                value={companySettings?.mobileNumber || companySettings?.mobile || ""}
                onChange={(e) => handleCompanyChange("mobileNumber", e.target.value)}
                placeholder="Mobile Record Number"
              />
            </div>
          </div>

          {/* ================= COMPLIANCE & PROTOCOL TRACKS ================= */}
          <div className="grid grid-cols-4 text-[10px] font-bold border-b-dark bg-white divide-x divide-black">
            <div className="p-1.5 pl-2 flex gap-1">
              <span className="shrink-0">GSTIN:</span>
              <input className="inline-editable font-normal" value={companySettings?.gstin || ""} onChange={(e) => handleCompanyChange("gstin", e.target.value)} />
            </div>
            <div className="p-1.5 pl-2 flex gap-1">
              <span className="shrink-0">SEEDS-LIC:</span>
              <input className="inline-editable font-normal" value={companySettings?.seedsLicence || companySettings?.seedsLicenceNo || ""} onChange={(e) => handleCompanyChange("seedsLicence", e.target.value)} />
            </div>
            <div className="p-1.5 pl-2 flex gap-1">
              <span className="shrink-0">PEST-LIC:</span>
              <input className="inline-editable font-normal" value={companySettings?.pestLicence || companySettings?.pestLicenceNo || ""} onChange={(e) => handleCompanyChange("pestLicence", e.target.value)} />
            </div>
            <div className="p-1.5 pl-2 flex gap-1">
              <span className="shrink-0">FERT-LIC:</span>
              <input className="inline-editable font-normal" value={companySettings?.fertLicence || companySettings?.fertLicenceNo || ""} onChange={(e) => handleCompanyChange("fertLicence", e.target.value)} />
            </div>
          </div>

          {/* ================= TRANS-PARTNER DETAILS ================= */}
          <div className="grid grid-cols-12 border-b-dark divide-x divide-black items-stretch text-[11px]">
            <div className="col-span-5 p-2 space-y-1">
              <div className="flex gap-1">
                <span className="shrink-0 font-bold">CLIENT:</span>
                <input className="inline-editable font-black" value={invoice?.farmer?.name || ""} onChange={(e) => handleFarmerChange("name", e.target.value)} />
              </div>
              <div className="flex gap-1">
                <span className="shrink-0">ADDRESS:</span>
                <input className="inline-editable" value={invoice?.farmer?.address || invoice?.farmer?.village || ""} onChange={(e) => handleFarmerChange("address", e.target.value)} />
              </div>
              <div className="flex gap-1">
                <span className="shrink-0">MOB.NO:</span>
                <input className="inline-editable font-medium" value={invoice?.farmer?.mobileNumber || ""} onChange={(e) => handleFarmerChange("mobileNumber", e.target.value)} />
              </div>
              <div className="flex gap-1">
                <span className="shrink-0">GSTIN:</span>
                <input className="inline-editable" value={invoice?.farmer?.gstin || ""} onChange={(e) => handleFarmerChange("gstin", e.target.value)} />
              </div>
            </div>
            
            <div className="col-span-3 flex flex-col justify-center items-center bg-slate-50/40 p-2">
              <h2 className="text-base font-black tracking-widest text-center border-b border-black/20 pb-0.5 mb-1 w-full">TAX INVOICE</h2>
              <input 
                className="inline-editable text-center font-bold text-slate-700"
                value={invoice?.invoiceNumber || ""}
                onChange={(e) => handleTopLevelChange("invoiceNumber", e.target.value)}
              />
            </div>

            <div className="col-span-4 p-2 pl-4 flex flex-col justify-center space-y-2">
              <div className="flex items-center gap-1">
                <span className="shrink-0 font-bold">DATE:</span>
                <input 
                  type="date" 
                  className="inline-editable font-bold text-slate-800" 
                  value={invoice?.createdAt ? new Date(invoice.createdAt).toISOString().split('T')[0] : ""} 
                  onChange={(e) => handleTopLevelChange("createdAt", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="shrink-0 font-bold">DUE DATE:</span>
                <input 
                  type="date" 
                  className="inline-editable font-bold text-rose-700" 
                  value={invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ""} 
                  onChange={(e) => handleTopLevelChange("dueDate", e.target.value)}
                  placeholder="N/A"
                />
              </div>
            </div>
          </div>

          {/* ================= PRODUCTS TRANS-MATRIX TABLE ================= */}
          <table className="w-full text-left border-collapse border-none">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black border-b-dark tracking-wider">
                <th className="w-[4%] text-center">NO</th>
                <th className="w-[26%]">PARTICULARS</th>
                <th className="w-[10%]">BATCH</th>
                <th className="w-[10%]">MFR NAME</th>
                <th className="w-[10%]">EXPIRY</th>
                <th className="w-[8%]">PACKING</th>
                <th className="w-[6%] text-center">QTY</th>
                <th className="w-[8%] text-right">BASE RATE</th>
                <th className="w-[8%] text-right">INCL RATE</th>
                <th className="w-[10%] text-right">TOTAL AMT</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.products?.map((item, index) => {
                const itemGst = item?.gstRate || 0;
                const baseRate = (item?.selectedRate / (1 + itemGst / 100)).toFixed(2);

                return (
                  <tr key={item._id || index} className="align-top text-[11px] hover:bg-slate-50/50">
                    <td className="text-center font-bold text-slate-400">{index + 1}</td>
                    <td className="font-bold">
                      <input 
                        className="inline-editable font-bold" 
                        value={item?.product?.productName || ""} 
                        onChange={(e) => {
                          const updated = [...invoice.products];
                          updated[index].product = { ...updated[index].product, productName: e.target.value };
                          setInvoice({ ...invoice, products: updated });
                        }}
                      />
                    </td>
                    <td>
                      <input className="inline-editable text-slate-700" value={item?.batchNumber || item?.product?.batchNumber || ""} onChange={(e) => handleProductRowChange(index, "batchNumber", e.target.value)} />
                    </td>
                    <td>
                      <input className="inline-editable text-slate-600 text-[10px]" value={item?.manufacturer || item?.product?.manufacturer || ""} onChange={(e) => handleProductRowChange(index, "manufacturer", e.target.value)} />
                    </td>
                    <td>
                      <input 
                        type="date" 
                        className="inline-editable text-slate-700 text-[10px]" 
                        value={item?.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ""} 
                        onChange={(e) => handleProductRowChange(index, "expiryDate", e.target.value)} 
                      />
                    </td>
                    <td>
                      <input className="inline-editable" value={item?.packingUnit || item?.product?.packing || ""} onChange={(e) => handleProductRowChange(index, "packingUnit", e.target.value)} />
                    </td>
                    <td className="text-center font-black">
                      <input type="number" className="inline-editable text-center font-black" value={item?.quantity || 0} onChange={(e) => handleProductRowChange(index, "quantity", e.target.value)} />
                    </td>
                    <td className="text-right font-mono text-slate-500">{baseRate}</td>
                    <td className="text-right font-mono font-bold">
                      <input type="number" className="inline-editable text-right font-bold" value={item?.selectedRate || 0} onChange={(e) => handleProductRowChange(index, "selectedRate", e.target.value)} />
                    </td>
                    <td className="text-right font-mono font-black pr-1">{item?.totalAmount?.toFixed(2)}</td>
                  </tr>
                );
              })}

              {/* Grid Pad Layer */}
              {[...Array(Math.max(0, 6 - (invoice?.products?.length || 0)))].map((_, i) => (
                <tr key={`blank-${i}`} className="h-7 print:h-6">
                  <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= DISCIPLINED FISCAL SUMMARY CONSOLE ================= */}
          <div className="grid grid-cols-12 divide-x divide-black border-t border-black text-[11px]">
            
            {/* Left Ledger Segment */}
            <div className="col-span-7 flex flex-col justify-between divide-y divide-black">
              <div className="grid grid-cols-4 divide-x divide-black items-center">
                <div className="p-2 font-bold bg-slate-50 col-span-1">WORDS:</div>
                <div className="p-2 col-span-3 font-semibold tracking-wide italic normal-case">
                  <input className="inline-editable normal-case italic" value={invoice?.amountInWords || ""} onChange={(e) => handleTopLevelChange("amountInWords", e.value)} placeholder="Amount in words calculated automatically" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 divide-x divide-black items-center">
                <div className="p-2 font-bold bg-slate-50 col-span-1">LEDGER BAL:</div>
                <div className="p-2 col-span-3 font-black text-slate-900 flex items-center gap-1 text-xs">
                  <input 
                    type="number" 
                    className="inline-editable w-32 font-black" 
                    value={invoice?.farmer?.pendingBalance || 0} 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setInvoice(prev => ({ ...prev, farmer: { ...prev.farmer, pendingBalance: val } }));
                    }} 
                  />
                  <span>DR (DEBIT DEFERRAL)</span>
                </div>
              </div>

              {/* Notice Section */}
              <div className="p-2 text-[9px] leading-relaxed font-semibold bg-white text-slate-800 normal-case font-serif">
                <textarea 
                  className="inline-editable normal-case font-serif leading-relaxed resize-none h-16"
                  value={invoice?.termsAndConditions || "NOTICE:- 1) Please check the goods before accepting. 2) Goods once delivered will not be taken back. 3) The items on this invoice are selected by choice with comprehensive advisory. Adverse metrics arising from deployment errors fall exclusively onto the deployment controller."}
                  onChange={(e) => handleTopLevelChange("termsAndConditions", e.target.value)}
                />
              </div>

              <div className="p-2 pt-6 grid grid-cols-2 font-black items-end">
                <div className="border-t border-black/40 pt-1 w-44 text-center text-[10px]">CUSTOMER SIGNATURE</div>
                <div className="text-right pr-2 flex items-center justify-flex-end gap-1">
                  <span className="font-normal text-slate-500">METHOD:</span>
                  <input className="inline-editable font-black border-b border-black w-24 text-center" value={invoice?.billingType || ""} onChange={(e) => handleTopLevelChange("billingType", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Calculations Panel */}
            <div className="col-span-5 flex flex-col justify-between font-bold divide-y divide-black text-[11px] bg-slate-50/30">
              <div className="flex justify-between items-center p-2 px-4">
                <span className="text-slate-600 font-semibold">SUB-TOTAL RECONCILIATION :</span>
                <span className="font-mono text-xs">₹{invoice?.subTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 px-4">
                <span className="text-slate-600 font-semibold">SGST REVENUE OUTPUT :</span>
                <span className="font-mono text-xs">₹{halfGstOutput}</span>
              </div>
              <div className="flex justify-between items-center p-2 px-4">
                <span className="text-slate-600 font-semibold">CGST REVENUE OUTPUT :</span>
                <span className="font-mono text-xs">₹{halfGstOutput}</span>
              </div>
              <div className="flex justify-between items-center p-2 px-4 bg-white">
                <span className="text-emerald-700 font-bold">CASH LIQUIDATION DEPOSIT :</span>
                <div className="flex items-center font-mono text-xs text-emerald-800 font-black">
                  <span>₹</span>
                  <input 
                    type="number" 
                    className="inline-editable w-24 font-mono font-black text-right" 
                    value={invoice?.paidAmount || 0} 
                    onChange={(e) => handleTopLevelChange("paidAmount", Number(e.target.value))} 
                  />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 px-4 bg-slate-900 text-white font-black">
                <span className="tracking-wider text-xs">NET AGGREGATE PAYABLE :</span>
                <span className="font-mono text-lg font-black text-emerald-400">₹{invoice?.grandTotal?.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice;