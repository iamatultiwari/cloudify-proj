const StockReport = ({
  data,
}) => {

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          Stock Report
        </h2>

        <div className="bg-blue-100 px-5 py-3 rounded-xl">

          <span className="font-semibold">
            Stock Value:
          </span>

          <span className="text-blue-700 font-bold ml-2">
            ₹
            {
              data?.totalStockValue || 0
            }
          </span>

        </div>

      </div>

      <div className="overflow-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Product
              </th>

              <th className="py-3 text-left">
                Category
              </th>

              <th className="py-3 text-left">
                Quantity
              </th>

              <th className="py-3 text-left">
                Purchase Price
              </th>

              <th className="py-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {
              data?.products?.map(
                (product) => (

                  <tr
                    key={product._id}
                    className="border-b"
                  >

                    <td className="py-3 capitalize">
                      {
                        product.productName
                      }
                    </td>

                    <td className="py-3 capitalize">
                      {
                        product.category
                      }
                    </td>

                    <td className="py-3 font-bold">
                      {product.quantity}
                    </td>

                    <td className="py-3">
                      ₹
                      {
                        product.purchasePrice
                      }
                    </td>

                    <td className="py-3">

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm
                        ${
                          product.status ===
                          "available"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {product.status}
                      </span>

                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default StockReport;