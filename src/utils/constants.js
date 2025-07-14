const API_BASE_URL = '/api'

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
  },
  // Resource endpoints
  PROJECTS: `${API_BASE_URL}/projects`,
  TASKS: `${API_BASE_URL}/tasks`,
}
