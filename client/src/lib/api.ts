import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smart-leads-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const fieldErrors = data?.errors?.fieldErrors;

    if (fieldErrors && typeof fieldErrors === "object") {
      const messages = Object.entries(fieldErrors)
        .flatMap(([field, value]) => (Array.isArray(value) ? value.map((message) => `${field}: ${message}`) : []))
        .join(", ");

      if (messages) {
        return messages;
      }
    }

    return data?.message ?? error.message;
  }

  return "Something went wrong";
};
