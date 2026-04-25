import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userAPI = {
  register: (userData) => api.post("/users/register", userData),
};

export const quizAPI = {
  submitQuiz: (quizData) => api.post("/quiz/submit", quizData),
  getResultsTable: () => api.get("/quiz/results"),
};

export default api;
