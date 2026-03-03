import axios from "axios";

const API_BASE_URL = "http://localhost:9090/api";

// ============================================
// 🔓 PUBLIC ENDPOINTS
// ============================================

/**
 * Register a new team
 * POST /api/teams/register
 */
export const registerTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/teams/register`, teamData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get team details by ID
 * GET /api/teams/{teamId}
 */
export const getTeamDetails = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a team by ID
 * DELETE /api/teams/{teamId}
 */
export const deleteTeam = async (teamId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get team score
 * GET /api/teams/{teamId}/score
 */
export const getTeamScore = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/score`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get leaderboard
 * GET /api/leaderboard
 */
export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// 🔐 ADMIN AUTH ENDPOINTS
// ============================================

/**
 * Admin signup
 * POST /api/auth/admin/signup
 */
export const adminSignup = async (signupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/signup`, signupData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin login
 * POST /api/auth/admin/login
 */
export const adminLogin = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, loginData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminRole", response.data.role);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// 🧑‍💼 ADMIN TEAM SELECTION ENDPOINTS
// ============================================

/**
 * Get all teams (admin only)
 * GET /api/admin/teams
 */
export const getAllTeams = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get team details for admin (includes all members and marks)
 * GET /api/admin/teams/{teamId}
 */
export const getAdminTeamDetails = async (teamId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/teams/${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// ✏️ ADMIN EVALUATION ENDPOINTS
// ============================================

/**
 * Submit marks for a student
 * PUT /api/admin/students/{studentId}/evaluate
 */
export const submitStudentMarks = async (studentId, marksData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/admin/students/${studentId}/evaluate`,
      marksData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get student evaluation details
 * GET /api/admin/students/{studentId}
 */
export const getStudentEvaluation = async (studentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/students/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// 🔒 OPTIONAL - TEAM LOCKING ENDPOINTS
// ============================================

/**
 * Lock team to prevent re-editing
 * PUT /api/admin/teams/{teamId}/lock
 */
export const lockTeam = async (teamId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/admin/teams/${teamId}/lock`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// 🏠 OPTIONAL - HOME PAGE ENDPOINTS
// ============================================

/**
 * Get home page statistics
 * GET /api/home/stats
 */
export const getHomeStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/home/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get token from localStorage
 */
export const getToken = () => localStorage.getItem("token");

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => !!getToken();

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminRole");
};
