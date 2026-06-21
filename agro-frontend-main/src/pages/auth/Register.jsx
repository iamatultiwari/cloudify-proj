import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // For a single-user system, registration is disabled
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 px-4 py-10 font-sans">
      <p className="text-slate-600 font-bold">Redirecting...</p>
    </div>
  );
};

export default Register;