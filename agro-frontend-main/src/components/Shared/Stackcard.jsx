import React from "react";

const StatCard = ({ title, amount, colorClass, type }) => {
  return (
    <div className="bg-white border border-gray-300 rounded p-4 shadow-sm flex flex-col justify-between">
      <span className="text-gray-500 font-bold tracking-tight text-[10px] uppercase">{title}</span>
      <div className="flex items-baseline justify-between mt-2">
        <span className={`text-xl font-black font-mono ${colorClass}`}>
          ₹{Number(amount).toFixed(2)}
        </span>
        <span className="text-[10px] text-gray-400 font-bold">{type}</span>
      </div>
    </div>
  );
};

export default StatCard;