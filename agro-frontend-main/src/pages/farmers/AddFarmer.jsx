// import { useState } from "react";

// import FarmerForm from "../../components/farmers/FarmerForm";

// import API from "../../services/api";

// import toast from "react-hot-toast";

// import { useNavigate } from "react-router-dom";

// const AddFarmer = () => {

//   const navigate = useNavigate();

//   const [loading, setLoading] =
//     useState(false);

//   const addFarmer = async (
//     formData
//   ) => {

//     try {

//       setLoading(true);

//       await API.post(
//         "/farmers",
//         formData
//       );

//       toast.success(
//         "Farmer Added Successfully"
//       );

//       navigate("/farmers");

//     } catch (error) {

//       toast.error(
//         error.response?.data?.message
//       );

//     } finally {

//       setLoading(false);

//     }
//   };

//   return (
//     <div>

//       <h1 className="text-3xl font-bold mb-5">
//         Add Farmer
//       </h1>

//       <FarmerForm
//         onSubmit={addFarmer}
//         loading={loading}
//       />

//     </div>
//   );
// };

// export default AddFarmer;


// import { useState } from "react";
// import FarmerForm from "../../components/farmers/FarmerForm";
// import API from "../../services/api";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const AddFarmer = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const addFarmer = async (formData) => {
//     console.log("Data received in AddFarmer:", formData);
//     try {
//       setLoading(true);

//       // 1. Handle Quick Actions (Email / WhatsApp)
//       if (formData.action === "email") {
//         console.log("Triggering Email Service for:", formData.email);
//         // Replace with your actual email API endpoint
//         await API.post("/notifications/send-email", formData);
//         toast.success("Email sent successfully!");
//         return; // Stop here, do not save to DB yet
//       }

//       if (formData.action === "whatsapp") {
//         console.log("Triggering WhatsApp Service for:", formData.mobileNumber);
//         // Replace with your actual WhatsApp API endpoint
//         await API.post("/notifications/send-whatsapp", formData);
//         toast.success("WhatsApp message sent!");
//         return; // Stop here
//       }

//       // 2. Handle "Commit Changes" (Standard Save)
//       // Note: We remove the 'action' field before saving to DB if it's not needed in the model
//       const { action, ...dataToSave } = formData;
      
//       await API.post("/farmers", dataToSave);

//       toast.success("Farmer Added Successfully");
//       navigate("/farmers");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Operation Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-5">Add Farmer</h1>
//       <FarmerForm onSubmit={addFarmer} loading={loading} />
//     </div>
//   );
// };

// export default AddFarmer;
import { useState } from "react";
import FarmerForm from "../../components/farmers/FarmerForm";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddFarmer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const addFarmer = async (formData) => {
    console.log("Data received in AddFarmer:", formData);

    try {
      setLoading(true);

      // Remove action field before saving
      const { action, ...dataToSave } = formData;

      // Save farmer
      const response = await API.post("/farmers", dataToSave);

      console.log("Farmer Added:", response.data);

      toast.success("Farmer Added Successfully");

      // Registration email is automatically sent from backend

      navigate("/farmers");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to add farmer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">
        Add Farmer
      </h1>

      <FarmerForm
        onSubmit={addFarmer}
        loading={loading}
      />
    </div>
  );
};

export default AddFarmer;