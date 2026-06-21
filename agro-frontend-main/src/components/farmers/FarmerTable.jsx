import { Link } from "react-router-dom";
import { Eye, Edit3, Trash2, MapPin, Phone, User, IndianRupee } from "lucide-react";

const FarmerTable = ({
  farmers,
  deleteFarmer,
}) => {
  return (
    <div className="premium-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Farmer Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Contact & Region</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Financial Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Activity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {farmers?.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                      <User size={32} />
                    </div>
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No records available</p>
                  </div>
                </td>
              </tr>
            ) : (
              farmers?.map((farmer) => (
                <tr
                  key={farmer._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-lg border-2 border-emerald-100/50 group-hover:scale-110 transition-transform">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">{farmer.name}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">ID: {farmer._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Phone size={14} className="text-slate-600" />
                        {farmer.mobileNumber}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                        <MapPin size={12} className="text-emerald-500" />
                        {farmer.village}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`text-lg font-black tracking-tight flex items-center gap-1 ${farmer.dueAmount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                        <IndianRupee size={16} />
                        {farmer.dueAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Outstanding Due</span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${
                      farmer.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${farmer.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {farmer.status}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <Link
                        to={`/farmers/${farmer._id}`}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="View Intelligence"
                      >
                        <Eye size={18} />
                      </Link>

                      <Link
                        to={`/farmers/edit/${farmer._id}`}
                        className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                        title="Edit Profile"
                      >
                        <Edit3 size={18} />
                      </Link>

                      <button
                        onClick={() => deleteFarmer(farmer._id)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Retire Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmerTable;