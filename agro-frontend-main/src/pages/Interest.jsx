import React, { useEffect, useState } from "react";
import axios from "axios";

const Interest = () => {

  const [interestHistory, setInterestHistory] =
    useState([]);

const [interestRate, setInterestRate] =
  useState(2);

const [newRate, setNewRate] =
  useState("");

  const token = localStorage.getItem("token");


  const updateInterestRate = async () => {
  try {

    await axios.put(
      "http://localhost:5000/api/settings",
      {
        monthlyInterestRate: newRate,
      },
      {
        headers: {
         Authorization: `Bearer ${token}`,
        },
      }
    );

    getSettings();

    setNewRate("");

    alert("Interest Updated");

  } catch (error) {

    console.log(error);
  }
};


  // ================= FETCH HISTORY =================

  const getInterestHistory = async () => {
    try {

      const response = await axios.get(
        "http://localhost:5000/api/transaction/interest-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInterestHistory(
        response.data.history
      );

    } catch (error) {

      console.log(error);
    }
  };

const getSettings = async () => {
  try {

    const response = await axios.get(
      "http://localhost:5000/api/settings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setInterestRate(
      response.data.settings.monthlyInterestRate
    );

  } catch (error) {

    console.log(error);
  }
};


 useEffect(() => {

  getInterestHistory();

  getSettings();

}, []);



  return (
    <div className="p-8 bg-[#F5F7FB] min-h-screen">

      {/* ================= PAGE TITLE ================= */}

      <div className="mb-8">

        <p className="tracking-[5px] text-green-500 text-sm font-semibold uppercase">
          System Intelligence
        </p>

        <h1 className="text-6xl font-bold text-[#081028] mt-2">
          Interest Overview
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Automatic overdue interest management system
        </p>
      </div>





      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* RATE */}

        <div className="bg-white rounded-3xl p-6 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-10 -mt-10"></div>

          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-2xl">
            %
          </div>

          <div className="mt-6">

            <p className="tracking-[4px] text-gray-500 uppercase text-sm font-semibold">
              Monthly Interest
            </p>

            <h2 className="text-5xl font-bold text-red-500 mt-2">
              {interestRate}%
            </h2>
<div className="mt-5 flex gap-3">

  <input
    type="number"
    placeholder="Update rate"
    value={newRate}
    onChange={(e) =>
      setNewRate(e.target.value)
    }
    className="border border-gray-200 rounded-2xl px-4 py-3 outline-none w-full"
  />

  <button
    onClick={updateInterestRate}
    className="bg-red-500 text-white px-5 rounded-2xl"
  >
    Save
  </button>
</div>
            <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-red-400 rounded-full"></div>
            </div>
          </div>
        </div>




        {/* STATUS */}

        <div className="bg-white rounded-3xl p-6 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10"></div>

          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-2xl">
            ✓
          </div>

          <div className="mt-6">

            <p className="tracking-[4px] text-gray-500 uppercase text-sm font-semibold">
              Auto Interest
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              Active
            </h2>

            <p className="text-gray-500 mt-2">
              Cron job checks overdue transactions daily.
            </p>
          </div>
        </div>




        {/* HISTORY */}

        <div className="bg-white rounded-3xl p-6 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-10 -mt-10"></div>

          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-2xl">
            ₹
          </div>

          <div className="mt-6">

            <p className="tracking-[4px] text-gray-500 uppercase text-sm font-semibold">
              Interest Records
            </p>

            <h2 className="text-5xl font-bold text-purple-600 mt-2">
              {interestHistory.length}
            </h2>

            <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-[80%] h-full bg-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>





      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-3xl p-6 mt-8">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-3xl font-bold text-[#081028]">
              Interest History
            </h2>

            <p className="text-gray-500 mt-1">
              Automatically generated interest records
            </p>
          </div>
        </div>



        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-100 text-left">

                <th className="pb-4 text-gray-400">
                  Farmer
                </th>

                <th className="pb-4 text-gray-400">
                  Amount
                </th>

                <th className="pb-4 text-gray-400">
                  Status
                </th>

                <th className="pb-4 text-gray-400">
                  Date
                </th>
              </tr>
            </thead>




            <tbody>

              {interestHistory.map((item) => (

                <tr
                  key={item._id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >

                  <td className="py-5 font-semibold text-[#081028]">
                    {item?.farmer?.name}
                  </td>

                  <td className="py-5 text-red-500 font-bold">
                    ₹{item.amount}
                  </td>

                  <td className="py-5">

                    <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm">
                      Added
                    </span>
                  </td>

                  <td className="py-5 text-gray-500">
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Interest;