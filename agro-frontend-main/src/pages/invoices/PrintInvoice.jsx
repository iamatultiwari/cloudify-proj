import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useParams } from "react-router-dom";

import API from "../../services/api";

import { useReactToPrint } from "react-to-print";

const PrintInvoice = () => {

  const { id } = useParams();

  const [invoice, setInvoice] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const printRef = useRef(null);

  // ================= FETCH INVOICE =================

  const getInvoice = async () => {

    try {

      const { data } =
        await API.get(
          `/invoices/print/${id}`
        );

      setInvoice(
        data.printableInvoice
      );

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Invoice not found"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    getInvoice();

  }, [id]);

  // ================= PRINT =================

  const handlePrint =
    useReactToPrint({

      contentRef: printRef,

      documentTitle:
        invoice?.invoiceNumber ||
        "Invoice",

    });

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-[40vh] py-20 text-xl font-semibold">
        Loading Invoice...
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {

    return (
      <div className="flex justify-center items-center min-h-[40vh] py-20 text-red-600 text-xl font-bold">
        {error}
      </div>
    );
  }

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      {/* ================= BUTTON ================= */}

      <div className="mb-5">

        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Print Invoice
        </button>

      </div>

      {/* ================= PRINT AREA ================= */}

      <div
        ref={printRef}
        className="w-full max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-lg"
      >

        {/* ================= HEADER ================= */}

        <div className="flex justify-between border-b pb-6">

          <div>

            <h1 className="text-4xl font-bold text-green-700">
              AGRO ERP
            </h1>

            <p className="mt-2 text-slate-800">
              Agro Management System
            </p>

            <p className="text-slate-800">
              Indore, Madhya Pradesh
            </p>

          </div>

          <div className="text-right">

            <h2 className="text-3xl font-bold">
              INVOICE
            </h2>

            <p className="mt-2">
              <span className="font-semibold">
                Invoice No:
              </span>{" "}
              {
                invoice?.invoiceNumber
              }
            </p>

            <p>
              <span className="font-semibold">
                Date:
              </span>{" "}
              {
                new Date(
                  invoice?.createdAt
                ).toLocaleDateString()
              }
            </p>

          </div>

        </div>

        {/* ================= FARMER DETAILS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">

          <div>

            <h2 className="text-xl font-bold mb-3">
              Farmer Details
            </h2>

            <p>
              <span className="font-semibold">
                Name:
              </span>{" "}
              {
                invoice?.farmer?.name
              }
            </p>

            <p>
              <span className="font-semibold">
                Mobile:
              </span>{" "}
              {
                invoice?.farmer
                  ?.mobileNumber
              }
            </p>

            <p>
              <span className="font-semibold">
                Village:
              </span>{" "}
              {
                invoice?.farmer
                  ?.village
              }
            </p>

            <p>
              <span className="font-semibold">
                Address:
              </span>{" "}
              {
                invoice?.farmer
                  ?.address
              }
            </p>

          </div>

          <div>

            <h2 className="text-xl font-bold mb-3">
              Billing Details
            </h2>

            <p>
              <span className="font-semibold">
                Billing Type:
              </span>{" "}
              <span className="capitalize">
                {
                  invoice?.billingType
                }
              </span>
            </p>

            <p>
              <span className="font-semibold">
                Payment Status:
              </span>{" "}
              <span className="capitalize">
                {
                  invoice?.paymentStatus
                }
              </span>
            </p>

          </div>

        </div>

        {/* ================= PRODUCT TABLE ================= */}

        <div className="mt-10 overflow-x-auto">

          <table className="w-full border border-gray-300">

            <thead className="bg-green-100">

              <tr>

                <th className="border p-3 text-left">
                  Product
                </th>

                <th className="border p-3 text-left">
                  Qty
                </th>

                <th className="border p-3 text-left">
                  Rate
                </th>

                <th className="border p-3 text-left">
                  GST
                </th>

                <th className="border p-3 text-left">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {
                invoice?.products?.map(
                  (item) => (

                    <tr
                      key={item._id}
                    >

                      <td className="border p-3">
                        {
                          item?.product
                            ?.productName
                        }
                      </td>

                      <td className="border p-3">
                        {
                          item?.quantity
                        }
                      </td>

                      <td className="border p-3">
                        ₹
                        {
                          item?.selectedRate
                        }
                      </td>

                      <td className="border p-3">
                        {
                          item?.gstRate
                        }%
                      </td>

                      <td className="border p-3 font-semibold">
                        ₹
                        {
                          item?.totalAmount
                        }
                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

        {/* ================= TOTALS ================= */}

        <div className="mt-10 flex justify-center md:justify-end">

          <div className="w-full max-w-sm bg-gray-50 p-5 rounded-lg border">

            <div className="flex justify-between mb-4">

              <span className="font-medium">
                Sub Total
              </span>

              <span>
                ₹
                {
                  invoice?.subTotal
                }
              </span>

            </div>

            <div className="flex justify-between mb-4">

              <span className="font-medium">
                GST
              </span>

              <span>
                ₹
                {
                  invoice?.totalGST
                }
              </span>

            </div>

            <div className="flex justify-between text-2xl font-bold border-t pt-4 text-green-700">

              <span>
                Grand Total
              </span>

              <span>
                ₹
                {
                  invoice?.grandTotal
                }
              </span>

            </div>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-16 text-center text-slate-700">

          <p>
            Thank You For Your Purchase
          </p>

          <p className="mt-1">
            Agro ERP Management System
          </p>

        </div>

      </div>

    </div>
  );
};

export default PrintInvoice;