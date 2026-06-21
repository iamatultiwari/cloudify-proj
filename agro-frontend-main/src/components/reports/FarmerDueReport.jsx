const FarmerDueReport = ({
  data,
}) => {

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          Farmer Due Report
        </h2>

        <div className="bg-red-100 px-5 py-3 rounded-xl">

          <span className="font-semibold">
            Total Due:
          </span>

          <span className="text-red-600 font-bold ml-2">
            ₹
            {
              data?.totalPendingDue || 0
            }
          </span>

        </div>

      </div>

      <div className="overflow-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Farmer
              </th>

              <th className="py-3 text-left">
                Village
              </th>

              <th className="py-3 text-left">
                Mobile
              </th>

              <th className="py-3 text-left">
                Due Amount
              </th>

              <th className="py-3 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {
              data?.farmers?.map(
                (farmer) => (

                  <tr
                    key={farmer._id}
                    className="border-b"
                  >

                    <td className="py-3">
                      {farmer.name}
                    </td>

                    <td className="py-3">
                      {farmer.village}
                    </td>

                    <td className="py-3">
                      {
                        farmer.mobileNumber
                      }
                    </td>

                    <td className="py-3 font-bold text-red-500">
                      ₹
                      {
                        farmer.dueAmount
                      }
                    </td>

                    <td className="py-3">

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm
                        ${
                          farmer.status ===
                          "active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {farmer.status}
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

export default FarmerDueReport;