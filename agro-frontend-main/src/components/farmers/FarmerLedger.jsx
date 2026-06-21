import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API from "../../services/api";

const FarmerLedger = () => {

  const { id } =
    useParams();

  const [ledgerData,
    setLedgerData] =
    useState(null);

  const getLedger =
    async () => {

      try {

        const { data } =
          await API.get(
            `/transactions/ledger/${id}`
          );

        setLedgerData(data);

      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    getLedger();
  }, []);

  return (
    <div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h1 className="text-3xl font-bold">
          Farmer Ledger
        </h1>

        <p className="mt-3 text-lg">

          Farmer:
          <span className="font-bold ml-2">
            {
              ledgerData?.farmer
                ?.name
            }
          </span>

        </p>

        <p className="mt-2 text-red-500 text-xl font-bold">

          Due Amount:
          ₹
          {
            ledgerData?.dueAmount
          }

        </p>

      </div>

      <div className="bg-white p-5 rounded-xl shadow overflow-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Type
              </th>

              <th className="py-3 text-left">
                Amount
              </th>

              <th className="py-3 text-left">
                Description
              </th>

              <th className="py-3 text-left">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {
              ledgerData?.ledger?.map(
                (item) => (

                  <tr
                    key={item._id}
                    className="border-b"
                  >

                    <td className="py-3 capitalize">

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm
                        ${
                          item.type ===
                          "credit"
                            ? "bg-red-500"
                            : item.type ===
                              "payment"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {item.type}
                      </span>

                    </td>

                    <td className="py-3 font-bold">
                      ₹
                      {item.amount}
                    </td>

                    <td className="py-3">
                      {
                        item.description
                      }
                    </td>

                    <td className="py-3">
                      {
                        new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      }
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

export default FarmerLedger;