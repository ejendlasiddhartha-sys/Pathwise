import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://pathwise-rj24.vercel.app"
    : "http://localhost:8000");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export async function fetchTestMessage() {
  const response = await api.get("/api/test");
  return response.data;
}

export async function createStudent(studentData) {
  const response = await api.post("/api/students", studentData);
  return response.data;
}

export async function updateStudent(studentId, studentData) {
  const response = await api.put(`/api/students/${studentId}`, studentData);
  return response.data;
}

export async function getStudent(studentId) {
  const response = await api.get(`/api/students/${studentId}`);
  return response.data;
}

export async function getRecommendations(studentId, targetCareerId = null) {
  const url = targetCareerId
    ? `/api/students/${studentId}/recommendations?target_career_id=${encodeURIComponent(target_careerId)}`
    : `/api/students/${studentId}/recommendations`;
  const response = await api.get(url);
  return response.data;
}

export async function refreshRecommendations(studentId, payload = {}) {
  const response = await api.post(`/api/students/${studentId}/recommendations/refresh`, payload);
  return response.data;
}

export default api;
