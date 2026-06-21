import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Users, 
  IndianRupee, 
  Search, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import API from "../../services/api";

const Villages = () => {
  const [villages, setVillages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getVillages = async () => {
    try {
      const { data } = await API.get("/villages");
      setVillages(data.villages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVillages();
  }, []);

  const filteredVillages = villages.filter((village) =>
    village._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVillages = villages.length;
  const totalFarmers = villages.reduce((acc, curr) => acc + curr.farmerCount, 0);
  const totalDueAmount = villages.reduce((acc, curr) => acc + curr.totalDueAmount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Villages</h1>
          <p className="text-slate-700 mt-2">Manage and view farmers grouped by their villages</p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search villages..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-slate-700 text-sm font-medium">Total Villages</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalVillages}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-700 text-sm font-medium">Total Farmers</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalFarmers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-slate-700 text-sm font-medium">Total Due Amount</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{totalDueAmount.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Village Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVillages.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="inline-flex p-4 bg-gray-50 rounded-full text-slate-600 mb-4">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">No villages found</h3>
            <p className="text-slate-700 mt-2">Try adjusting your search term to find what you're looking for.</p>
          </div>
        ) : (
          filteredVillages.map((village, index) => (
            <Link
              key={index}
              to={`/villages/${encodeURIComponent(village._id)}`}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-green-100 group-hover:scale-110"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-600 text-white rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 truncate pr-8">
                    {village._id}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 flex items-center gap-2">
                      <Users size={16} /> Farmers
                    </span>
                    <span className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                      {village.farmerCount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 text-sm flex items-center gap-2">
                      <TrendingUp size={16} className="text-red-400" /> Total Due
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      ₹{village.totalDueAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-green-600 font-medium group-hover:text-green-700 transition-colors">
                  <span>View Farmers</span>
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Villages;