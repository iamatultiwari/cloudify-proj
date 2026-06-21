import { useState } from "react";

import { User, Phone, MapPin, CreditCard, Shield, Home, Building2, Save, Activity } from "lucide-react";

const FarmerForm = ({
  initialData = {},
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    mobileNumber: initialData.mobileNumber || "",
    village: initialData.village || "",
    address: initialData.address || "",
    aadhaarNumber: initialData.aadhaarNumber || "",
    creditLimit: initialData.creditLimit || "",
    status: initialData.status || "active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const labelClasses = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2.5 ml-1";
  const inputContainerClasses = "relative group";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="premium-card p-10 space-y-10 relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
          <Building2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Farmer Profile</h2>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Registration Database Entry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className={labelClasses}>Full Name</label>
          <div className={inputContainerClasses}>
            <User className={iconClasses} size={18} />
            <input
              type="text"
              name="name"
              placeholder="Legal Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Mobile Identity</label>
          <div className={inputContainerClasses}>
            <Phone className={iconClasses} size={18} />
            <input
              type="text"
              name="mobileNumber"
              placeholder="+91 XXXXX XXXXX"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Village Node</label>
          <div className={inputContainerClasses}>
            <MapPin className={iconClasses} size={18} />
            <input
              type="text"
              name="village"
              placeholder="Regional Sector"
              value={formData.village}
              onChange={handleChange}
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Aadhaar Number</label>
          <div className={inputContainerClasses}>
            <Shield className={iconClasses} size={18} />
            <input
              type="text"
              name="aadhaarNumber"
              placeholder="XXXX XXXX XXXX"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              className="input-field pl-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Credit Threshold</label>
          <div className={inputContainerClasses}>
            <CreditCard className={iconClasses} size={18} />
            <input
              type="number"
              name="creditLimit"
              placeholder="Max Credit Exposure"
              value={formData.creditLimit}
              onChange={handleChange}
              className="input-field pl-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Operational Status</label>
          <div className={inputContainerClasses}>
            <Activity className={iconClasses} size={18} />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field pl-12 appearance-none"
            >
              <option value="active">Active Protocol</option>
              <option value="inactive">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Geographical Address</label>
        <div className={inputContainerClasses}>
          <Home className="absolute left-4 top-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <textarea
            name="address"
            placeholder="Complete physical location details..."
            value={formData.address}
            onChange={handleChange}
            className="input-field pl-12 h-32 py-4 resize-none"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full md:w-auto flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={20} />
              Commit Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FarmerForm;