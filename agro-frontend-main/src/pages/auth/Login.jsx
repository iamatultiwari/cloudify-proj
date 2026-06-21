import { useState, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { Leaf, Mail, Lock, ShieldCheck, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData);
      toast.success("Authentication Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-10 md:px-6">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-[520px] sm:h-[520px] bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-[420px] sm:h-[420px] bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60"></div>

      <div className="relative w-full max-w-md px-4 py-8 sm:px-8 sm:py-10">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6 group hover:scale-110 transition-transform duration-500">
            <Leaf size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            AGRO<span className="text-emerald-600">ERP</span>
          </h1>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2">Enterprise Resource Planning</p>
        </div>

        {/* Authentication Console */}
        <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Portal</h2>
            <p className="text-slate-600 text-sm font-medium mt-1">Engage secure node authentication</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="email"
                  placeholder="admin"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-slate-50/50 text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Secure Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-slate-50/50 text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <ShieldCheck size={22} />
                  Authorize Access
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer Audit */}
        <p className="mt-12 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          Secured by AgroERP Cryptographic Gateway v8.0
        </p>
      </div>
    </div>
  );
};

export default Login;