import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  IndianRupee, 
  Search, 
  User, 
  Phone, 
  ShieldCheck,
  ChevronRight,
  MapPin
} from "lucide-react";
import API from "../../services/api";

const VillageDetails = () => {
  const { villageName } = useParams();
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getVillageFarmers = async () => {
    try {
      const { data } = await API.get(`/villages/${villageName}/farmers`);
      setFarmers(data.farmers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVillageFarmers();
  }, [villageName]);

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.mobileNumber.includes(searchTerm)
  );

  const totalDue = farmers.reduce((acc, curr) => acc + curr.dueAmount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link
            to="/villages"
            className="p-3 bg-white border border-gray-200 rounded-2xl text-slate-800 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-slate-700 text-sm mb-1">
              <MapPin size={14} />
              <span>Village Profile</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{villageName}</h1>
          </div>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-green-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search farmers..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-700 text-sm font-medium">Village Farmers</p>
              <h3 className="text-2xl font-bold text-gray-800">{farmers.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="text-slate-700 text-sm font-medium">Village Total Due</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{totalDue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-green-600" />
            Farmer List
          </h2>
          <span className="text-sm text-slate-700 font-medium">
            Showing {filteredFarmers.length} results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-slate-700 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Farmer Name</th>
                <th className="px-6 py-4 font-semibold">Contact Details</th>
                <th className="px-6 py-4 font-semibold">Due Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFarmers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-700">
                    No farmers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredFarmers.map((farmer) => (
                  <tr key={farmer._id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                          {farmer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                            {farmer.name}
                          </div>
                          <div className="text-xs text-slate-600 font-medium uppercase tracking-tighter">
                            ID: {farmer._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-800">
                          <Phone size={14} className="text-slate-600" />
                          {farmer.mobileNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-red-600">
                        <IndianRupee size={14} />
                        {farmer.dueAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        farmer.status === "active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-slate-800"
                      }`}>
                        {farmer.status === "active" && <ShieldCheck size={12} />}
                        {farmer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/farmers/${farmer._id}`}
                        className="inline-flex items-center gap-1 text-green-600 font-bold hover:text-green-700 transition-colors text-sm"
                      >
                        Details
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VillageDetails;
