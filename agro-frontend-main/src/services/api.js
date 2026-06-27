// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/v1",
// });

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// export default API;

import axios from "axios";

const API = axios.create({
  // Remove /v1 so it cleanly matches your backend route layout
  baseURL: "http://localhost:5000/api", 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;