import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const login = async (id, password) => {
  const res = await api.post("/auth/admin/login", {
    employeeId: id,
    password,
  });
  return res.data;
};
