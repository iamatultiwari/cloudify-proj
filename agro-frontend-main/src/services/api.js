import axios from "axios";

// Add /api to the end of your base URL
const API = axios.create({
  baseURL: "https://cloudify-proj-backend.onrender.com/api", 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;