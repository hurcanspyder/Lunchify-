// Single source of truth for API configuration
export const API_BASE_URL = "http://localhost:3001";
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};
