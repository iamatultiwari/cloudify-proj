import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Leaf,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

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

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-10">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2"></div>

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative w-full max-w-md">

        <div className="flex flex-col items-center mb-10">

          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-xl mb-5">
            <Leaf size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-black">
            AGRO<span className="text-emerald-600">ERP</span>
          </h1>

          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mt-2">
            Enterprise Resource Planning
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Access Portal
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Login to continue
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Authorize Access
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center">

            <p className="text-slate-600 text-sm mb-4">
              New User?
            </p>

            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white py-3 rounded-2xl font-bold transition-all"
            >
              <UserPlus size={18} />
              Create New Account
            </Link>

          </div>

        </div>

        <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-500 mt-8">
          Secured by AgroERP v8.0
        </p>

      </div>
    </div>
  );
};

export default Login;