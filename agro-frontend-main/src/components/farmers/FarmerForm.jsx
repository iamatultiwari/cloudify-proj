// import { useState } from "react";
// import { User, Phone, Mail, MapPin, CreditCard, Shield, Home, Building2, Save, Activity } from "lucide-react";

// const FarmerForm = ({
//   initialData = {},
//   onSubmit,
//   loading,
// }) => {
//   const [formData, setFormData] = useState({
//     name: initialData.name || "",
//     mobileNumber: initialData.mobileNumber || "",
//     email: initialData.email || "", // Integrated explicit email state definition
//     village: initialData.village || "",
//     address: initialData.address || "",
//     aadhaarNumber: initialData.aadhaarNumber || "",
//     creditLimit: initialData.creditLimit || "",
//     status: initialData.status || "active",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const labelClasses = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2.5 ml-1";
//   const inputContainerClasses = "relative group";
//   const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors";

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="premium-card p-10 space-y-10 relative overflow-hidden"
//     >
//       {/* Decorative background */}
//       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10"></div>

//       <div className="flex items-center gap-4 mb-4">
//         <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
//           <Building2 size={24} />
//         </div>
//         <div>
//           <h2 className="text-xl font-black text-slate-900 tracking-tight">Farmer Profile</h2>
//           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Registration Database Entry</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Full Name */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Full Name</label>
//           <div className={inputContainerClasses}>
//             <User className={iconClasses} size={18} />
//             <input
//               type="text"
//               name="name"
//               placeholder="Legal Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="input-field pl-12"
//               required
//             />
//           </div>
//         </div>

//         {/* Mobile Identity */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Mobile Identity</label>
//           <div className={inputContainerClasses}>
//             <Phone className={iconClasses} size={18} />
//             <input
//               type="text"
//               name="mobileNumber"
//               placeholder="+91 XXXXX XXXXX"
//               value={formData.mobileNumber}
//               onChange={handleChange}
//               className="input-field pl-12"
//               required
//             />
//           </div>
//         </div>

//         {/* Email Routing Address Field */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Email Address</label>
//           <div className={inputContainerClasses}>
//             <Mail className={iconClasses} size={18} />
//             <input
//               type="email"
//               name="email"
//               placeholder="customer@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               className="input-field pl-12"
//               required
//             />
//           </div>
//         </div>

//         {/* Village Node */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Village Node</label>
//           <div className={inputContainerClasses}>
//             <MapPin className={iconClasses} size={18} />
//             <input
//               type="text"
//               name="village"
//               placeholder="Regional Sector"
//               value={formData.village}
//               onChange={handleChange}
//               className="input-field pl-12"
//               required
//             />
//           </div>
//         </div>

//         {/* Aadhaar Identity Verification */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Aadhaar Number</label>
//           <div className={inputContainerClasses}>
//             <Shield className={iconClasses} size={18} />
//             <input
//               type="text"
//               name="aadhaarNumber"
//               placeholder="XXXX XXXX XXXX"
//               value={formData.aadhaarNumber}
//               onChange={handleChange}
//               className="input-field pl-12"
//               required
//             />
//           </div>
//         </div>

//         {/* Credit Threshold */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Credit Threshold</label>
//           <div className={inputContainerClasses}>
//             <CreditCard className={iconClasses} size={18} />
//             <input
//               type="number"
//               name="creditLimit"
//               placeholder="Max Credit Exposure"
//               value={formData.creditLimit}
//               onChange={handleChange}
//               className="input-field pl-12"
//             />
//           </div>
//         </div>

//         {/* Operational Status Select Structure */}
//         <div className="space-y-2 md:col-span-2">
//           <label className={labelClasses}>Operational Status</label>
//           <div className={inputContainerClasses}>
//             <Activity className={iconClasses} size={18} />
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="input-field pl-12 appearance-none cursor-pointer"
//             >
//               <option value="active">Active Protocol</option>
//               <option value="inactive">Suspended</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Geographical Text Area Address */}
//       <div className="space-y-2">
//         <label className={labelClasses}>Geographical Address</label>
//         <div className={inputContainerClasses}>
//           <Home className="absolute left-4 top-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
//           <textarea
//             name="address"
//             placeholder="Complete physical location details..."
//             value={formData.address}
//             onChange={handleChange}
//             className="input-field pl-12 h-32 py-4 resize-none"
//             required
//           />
//         </div>
//       </div>

//       {/* Commit Changes Actions Module */}
//       <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
//         {/* Instant Notification Control Buttons */}
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             disabled={loading || !formData.email}
//             onClick={() => onSubmit({ ...formData, triggerAction: "email_only" })}
//             className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
//           >
//             <Mail size={14} />
//             Send Email
//           </button>

//           <button
//             type="button"
//             disabled={loading || !formData.mobileNumber}
//             onClick={() => onSubmit({ ...formData, triggerAction: "whatsapp_only" })}
//             className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
//           >
//             <Phone size={14} />
//             Send WhatsApp
//           </button>
//         </div>

//         {/* Primary Form Submission Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
//         >
//           {loading ? (
//             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//           ) : (
//             <>
//               <Save size={20} />
//               Commit Changes
//             </>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default FarmerForm;


// import { useState } from "react";
// import { User, Phone, Mail, MapPin, CreditCard, Shield, Home, Building2, Save, Activity } from "lucide-react";

// const FarmerForm = ({ initialData = {}, onSubmit, loading }) => {
//   const [formData, setFormData] = useState({
//     name: initialData.name || "",
//     mobileNumber: initialData.mobileNumber || "",
//     email: initialData.email || "",
//     village: initialData.village || "",
//     district: initialData.district || "", // Added District state
//     address: initialData.address || "",
//     aadhaarNumber: initialData.aadhaarNumber || "",
//     creditLimit: initialData.creditLimit || "",
//     status: initialData.status || "active",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const labelClasses = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2.5 ml-1";
//   const inputContainerClasses = "relative group";
//   const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors";

//   return (
//     <form onSubmit={handleSubmit} className="premium-card p-10 space-y-10 relative overflow-hidden bg-white shadow-xl rounded-2xl">
//       <div className="flex items-center gap-4 mb-4">
//         <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
//           <Building2 size={24} />
//         </div>
//         <div>
//           <h2 className="text-xl font-black text-slate-900 tracking-tight">Farmer Profile</h2>
//           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Registration & Actions</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Row 1 */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Full Name</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-3" required />
//         </div>
//         <div className="space-y-2">
//           <label className={labelClasses}>Mobile Identity</label>
//           <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border rounded-lg p-3" required />
//         </div>
        
//         {/* Row 2 */}
//         <div className="space-y-2">
//           <label className={labelClasses}>Email Address</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg p-3" required />
//         </div>
//         <div className="space-y-2">
//           <label className={labelClasses}>Village Node</label>
//           <input type="text" name="village" value={formData.village} onChange={handleChange} className="w-full border rounded-lg p-3" required />
//         </div>

//         {/* Row 3 - Added District */}
//         <div className="space-y-2">
//           <label className={labelClasses}>District</label>
//           <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border rounded-lg p-3" required />
//         </div>
//         <div className="space-y-2">
//           <label className={labelClasses}>Aadhaar Number</label>
//           <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className="w-full border rounded-lg p-3" required />
//         </div>
//       </div>

//       {/* Address */}
//       <div className="space-y-2">
//         <label className={labelClasses}>Geographical Address</label>
//         <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-3 h-32" required />
//       </div>

//       {/* Action Buttons Section */}
//       <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
//         {/* Send Email Action */}
//         <button
//           type="button"
//           onClick={() => onSubmit({ ...formData, action: "email" })}
//           className="flex items-center gap-2 px-6 py-3 bg-sky-50 text-sky-700 font-bold rounded-xl hover:bg-sky-100 transition-all"
//         >
//           <Mail size={18} /> Send Email
//         </button>

//         {/* Send WhatsApp Action */}
//         <button
//           type="button"
//           onClick={() => onSubmit({ ...formData, action: "whatsapp" })}
//           className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-all"
//         >
//           <Phone size={18} /> Send WhatsApp
//         </button>

//         {/* Primary Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="ml-auto flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
//         >
//           <Save size={18} /> {loading ? "Saving..." : "Commit Changes"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default 

import { useState } from "react";
import { Phone, Mail, Building2, Save } from "lucide-react";
import { toast } from "react-hot-toast"; // Assuming you use react-hot-toast

const FarmerForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    mobileNumber: initialData.mobileNumber || "",
    email: initialData.email || "",
    village: initialData.village || "",
    district: initialData.district || "",
    address: initialData.address || "",
    aadhaarNumber: initialData.aadhaarNumber || "",
    creditLimit: initialData.creditLimit || "",
    status: initialData.status || "active",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to check if mandatory fields are filled before sending email/whatsapp
  const validateQuickActions = () => {
    if (!formData.name || !formData.email || !formData.mobileNumber) {
      toast.error("Please fill Name, Email, and Mobile to use quick actions.");
      return false;
    }
    return true;
  };

  const handleQuickAction = (actionType) => {
    if (validateQuickActions()) {
      // Passes the data to the parent with an 'action' property
      onSubmit({ ...formData, action: actionType });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default submit for "Commit Changes"
    onSubmit({ ...formData, action: "save" });
  };

  const labelClasses = "block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2.5 ml-1";

  return (
    <form onSubmit={handleSubmit} className="premium-card p-10 space-y-10 relative bg-white shadow-xl rounded-2xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
          <Building2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Farmer Profile</h2>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Registration & Actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className={labelClasses}>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-3" required />
        </div>
        <div className="space-y-2">
          <label className={labelClasses}>Mobile Identity</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border rounded-lg p-3" required />
        </div>
        <div className="space-y-2">
          <label className={labelClasses}>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg p-3" required />
        </div>
        <div className="space-y-2">
          <label className={labelClasses}>Village Node</label>
          <input type="text" name="village" value={formData.village} onChange={handleChange} className="w-full border rounded-lg p-3" required />
        </div>
        <div className="space-y-2">
          <label className={labelClasses}>District</label>
          <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border rounded-lg p-3" required />
        </div>
        <div className="space-y-2">
          <label className={labelClasses}>[Aadhaar Redacted]</label>
          <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className="w-full border rounded-lg p-3" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>Geographical Address</label>
        <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-3 h-32" required />
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => handleQuickAction("email")}
          className="flex items-center gap-2 px-6 py-3 bg-sky-50 text-sky-700 font-bold rounded-xl hover:bg-sky-100 transition-all"
        >
          <Mail size={18} /> Send Email
        </button>

        <button
          type="button"
          onClick={() => handleQuickAction("whatsapp")}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-all"
        >
          <Phone size={18} /> Send WhatsApp
        </button>

        <button
          type="submit"
          disabled={loading}
          className="ml-auto flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
        >
          <Save size={18} /> {loading ? "Saving..." : "Commit Changes"}
        </button>
      </div>
    </form>
  );
};

export default FarmerForm;