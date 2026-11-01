import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (refreshToken && config.headers) {
    config.headers["x-refresh-token"] = refreshToken;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const authHeader =
      response.headers["authorization"] ||
      (typeof response.headers?.get === "function" && response.headers.get("authorization"));

    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      const newToken = authHeader.split(" ")[1];
      localStorage.setItem("token", newToken);
    }

    const refreshHeader =
      response.headers["x-refresh-token"] ||
      (typeof response.headers?.get === "function" && response.headers.get("x-refresh-token"));

    if (refreshHeader && typeof refreshHeader === "string") {
      localStorage.setItem("refreshToken", refreshHeader);
    }

    return response;
  },
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    if (error.message === "Network Error") {
      return Promise.reject(
        new Error("Cannot connect to backend. Please ensure the server is running on port 8000.")
      );
    }
    return Promise.reject(error);
  }
);

export async function apiRequest(endpoint: string, method: string = "GET", body?: any) {
  try {
    const res = await apiClient.request({
      url: endpoint,
      method: method.toLowerCase(),
      data: body,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Request failed");
  }
}

export default apiClient;
