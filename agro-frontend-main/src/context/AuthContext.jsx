import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET PROFILE

  const getProfile = async () => {
    try {
      const { data } = await API.get("/auth/profile");

      setUser(data.user);
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // CHECK TOKEN ON APP LOAD

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // LOGIN

  const login = async (formData) => {
    try {
      console.log("LOGIN DATA:", formData);

      const { data } = await API.post(
        "/auth/login",
        formData
      );

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("token", data.token);

      setUser(data.user);

      return data;
    } catch (error) {
      console.log(
        "LOGIN ERROR:",
        error.response?.data
      );

      throw error;
    }
  };

  // REGISTER

  const register = async (formData) => {
    try {
      const { data } = await API.post(
        "/auth/register",
        formData
      );

      return data;
    } catch (error) {
      console.log(
        "REGISTER ERROR:",
        error.response?.data
      );

      throw error;
    }
  };

  // LOGOUT

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;