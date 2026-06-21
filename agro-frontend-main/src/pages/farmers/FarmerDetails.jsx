import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import API from "../../services/api";

const FarmerDetails = () => {

  const { id } = useParams();

  const [farmer, setFarmer] =
    useState(null);

  const [ledger, setLedger] =
    useState([]);

  const getLedger = async () => {

    try {

      const { data } =
        await API.get(
          `/transactions/ledger/${id}`
        );

      setFarmer(data.farmer);

      setLedger(data.ledger);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLedger();
  }, []);

  return (
    <div>

      <div className="bg-white p-6 rounded-xl shadow mb-5">

        <h1 className="text-3xl font-bold">
          {farmer?.name}
        </h1>

        <p>
          Mobile:
          {farmer?.mobileNumber}
        </p>

        <p>
          Village:
          {farmer?.village}
        </p>

        <p className="text-red-500 font-bold text-xl">
          Due Amount:
          ₹ {farmer?.dueAmount}
        </p>

      </div>

      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-5">
          Ledger History
        </h2>

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
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {
              ledger?.map((item) => (

                <tr
                  key={item._id}
                  className="border-b"
                >

                  <td className="py-3 capitalize">
                    {item.type}
                  </td>

                  <td className="py-3">
                    ₹ {item.amount}
                  </td>

                  <td className="py-3">
                    {
                      new Date(
                        item.createdAt
                      ).toLocaleDateString()
                    }
                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default FarmerDetails;