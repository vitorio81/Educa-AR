import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json", // Adicione isso aqui
  },
});

// REQUEST → adiciona token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@EducaAR:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE → trata token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("@EducaAR:token");
      localStorage.removeItem("@EducaAR:user");

      // dispara evento global
      window.dispatchEvent(new Event("logout"));
    }

    return Promise.reject(error);
  },
);

export default api;
