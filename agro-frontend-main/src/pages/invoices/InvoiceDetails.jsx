import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../services/api";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInvoice = async () => {
      try {
        const { data } = await API.get(`/invoices/${id}`);
        setInvoice(data.invoice);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getInvoice();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading invoice...</div>;
  }

  if (!invoice) {
    return (
      <div className="text-center py-10">
        Invoice not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invoice Details</h1>
          <p className="text-slate-800 mt-2">
            Invoice #{invoice.invoiceNumber}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/invoices"
            className="bg-slate-200 text-slate-900 px-4 py-2 rounded-lg"
          >
            Back to Invoices
          </Link>

          <Link
            to={`/invoices/print/${invoice._id}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Print Invoice
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <h2 className="text-lg font-semibold mb-2">Farmer</h2>
            <p>{invoice.farmer?.name}</p>
            <p className="text-sm text-slate-700">{invoice.farmer?.village}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Billing</h2>
            <p className="capitalize">{invoice.billingType}</p>
            <p className="mt-2">
              Status: <span className="font-semibold capitalize">{invoice.paymentStatus}</span>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Totals</h2>
            <p>Sub Total: ₹ {invoice.subTotal}</p>
            <p>Total GST: ₹ {invoice.totalGST}</p>
            <p className="font-bold mt-2">Grand Total: ₹ {invoice.grandTotal}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3">Product</th>
                <th className="py-3">Qty</th>
                <th className="py-3">Rate</th>
                <th className="py-3">GST</th>
                <th className="py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.products?.map((item) => (
                <tr key={item._id || item.product?._id} className="border-b">
                  <td className="py-3">{item.product?.productName || item.product}</td>
                  <td className="py-3">{item.quantity}</td>
                  <td className="py-3">₹ {item.selectedRate}</td>
                  <td className="py-3">{item.gstRate}%</td>
                  <td className="py-3">₹ {item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
