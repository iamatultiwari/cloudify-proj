import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CategoryChart = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow text-center text-slate-700 border border-slate-100 w-full overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold mb-5">Category Stock</h2>
        <p className="text-sm">No category stock data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow border border-slate-100 w-full overflow-hidden">

      <h2 className="text-lg sm:text-xl font-bold mb-5 text-slate-800">
        Category Stock
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={data}
        >

          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="quantity"
            fill="#16a34a"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default CategoryChart;