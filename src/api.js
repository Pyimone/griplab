import axios from "axios";

const api = axios.create({
  baseURL: "https://griplab-ge8y4fker-fuffu.vercel.app/api",
});

export default api;