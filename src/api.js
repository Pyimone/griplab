import axios from "axios";

const api = axios.create({
  baseURL: "https://griplab-pi.vercel.app/api/",
});

export default api;