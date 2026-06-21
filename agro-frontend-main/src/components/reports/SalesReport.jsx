const SalesReport = ({
  data,
}) => {

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-5">
        Sales Report
      </h2>

      <div className="overflow-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Billing Type
              </th>

              <th className="py-3 text-left">
                Total Sales
              </th>

              <th className="py-3 text-left">
                Total Invoices
              </th>

            </tr>

          </thead>

          <tbody>

            {
              data?.billingTypeWiseSales?.map(
                (item) => (

                  <tr
                    key={item._id}
                    className="border-b"
                  >

                    <td className="py-3 capitalize">
                      {item._id}
                    </td>

                    <td className="py-3 font-bold text-green-600">
                      ₹ {item.totalSales}
                    </td>

                    <td className="py-3">
                      {item.totalInvoices}
                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

      <div className="mt-6 grid grid-cols-3 gap-5">

        <div className="bg-green-100 p-5 rounded-xl">

          <h3 className="text-lg font-semibold">
            Revenue
          </h3>

          <p className="text-2xl font-bold mt-2">
            ₹
            {
              data?.overallSales
                ?.totalRevenue || 0
            }
          </p>

        </div>

        <div className="bg-blue-100 p-5 rounded-xl">

          <h3 className="text-lg font-semibold">
            GST
          </h3>

          <p className="text-2xl font-bold mt-2">
            ₹
            {
              data?.overallSales
                ?.totalGST || 0
            }
          </p>

        </div>

        <div className="bg-yellow-100 p-5 rounded-xl">

          <h3 className="text-lg font-semibold">
            Invoices
          </h3>

          <p className="text-2xl font-bold mt-2">
            {
              data?.overallSales
                ?.totalInvoices || 0
            }
          </p>

        </div>

      </div>

    </div>
  );
};

export default SalesReport;