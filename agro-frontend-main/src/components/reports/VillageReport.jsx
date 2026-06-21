const VillageReport = ({
  data,
}) => {

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-5">
        Village Report
      </h2>

      <div className="overflow-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Village
              </th>

              <th className="py-3 text-left">
                Total Farmers
              </th>

              <th className="py-3 text-left">
                Active Farmers
              </th>

              <th className="py-3 text-left">
                Total Due
              </th>

            </tr>

          </thead>

          <tbody>

            {
              data?.villages?.map(
                (item, index) => (

                  <tr
                    key={index}
                    className="border-b"
                  >

                    <td className="py-3 font-semibold">
                      {item._id}
                    </td>

                    <td className="py-3">
                      {item.totalFarmers}
                    </td>

                    <td className="py-3 text-green-600 font-bold">
                      {item.activeFarmers}
                    </td>

                    <td className="py-3 text-red-500 font-bold">
                      ₹ {item.totalDue}
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

export default VillageReport;