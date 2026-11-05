import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 8000,
});

export async function fetchTestMessage() {
  const response = await api.get("/api/test");
  return response.data;
}

export async function createStudent(studentData) {
  const response = await api.post("/api/students", studentData);
  return response.data;
}

export default api;
