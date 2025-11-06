import axios from "axios";

const API = axios.create({
  baseURL: "https://slotswapper-m6h4.onrender.com/api", // backend base URL
});

// Authorization function
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
