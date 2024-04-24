import axiosInstance from "../utils/service";

const baseUrl = import.meta.env.VITE_BASE_URL;

const ADMIN_ENDPOINTS = {
  agentRegister: "api/agent/register",
  agentLogin: "api/agent/login",
  getBalance: "api/agent/getBalance",
  getAllBookings: "api/agent/getAllBookings",
  getAllRefunds: "api/agent/getAllBookingRefunds",
  approveAgent: "api/agent/approveAgent",
  rejectAgent: "api/agent/rejectAgent",
  getAllPendingAgents: "api/agent/getAllPendingAgents",
  getAgentPerfomanceReport: "api/agent/getAgentPerformanceReport",
  getAgentBookings: "api/agent/getAgentBookings",
  verifyAgentCode: "api/agent/verifyAgentCode",
  getAgentStats: "api/agent/agentStats",
  updateAgentTicketLimit: "api/agent/updateAgent",
  deactivateAgent: "api/agent/deactivateAgent",
};

// Register Agent
export const agentRegisterAPI = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/${ADMIN_ENDPOINTS.agentRegister}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering agent", error);
    throw error;
  }
};

// Agent Login
export const agentLoginAPI = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/${ADMIN_ENDPOINTS.agentLogin}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying credentials", error);
    throw error;
  }
};

//get balance
export const getBalanceAPI = async () => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.getBalance}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting balance", error);
    throw error;
  }
};

//get all bookings
export const getAllBookings = async (agentId, params) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.getAllBookings}/${agentId}?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting bookings", error);
    throw error;
  }
};

//get all bookings refund
export const getAllBookingRefund = async (agentId, params) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.getAllRefunds}/${agentId}?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting booking refunds", error);
    throw error;
  }
};

//approve agent
export const approveAgent = async (agentId) => {
  try {
    const response = await axiosInstance.patch(
      `${baseUrl}/${ADMIN_ENDPOINTS.approveAgent}/${agentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error approving agent", error);
    throw error;
  }
};

//reject agent
export const rejectAgent = async (agentId) => {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/${ADMIN_ENDPOINTS.rejectAgent}/${agentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting agent", error);
    throw error;
  }
};

//get pending agent request
export const getAllPendingAgents = async () => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.getAllPendingAgents}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting pending agents", error);
    throw error;
  }
};

//get agent performance report
export const getAgentPerfomanceReport = async (params) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.getAgentPerfomanceReport}?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting agent performance report", error);
    throw error;
  }
};

//get all agent booking
export const getAgentBookings = async (agentId, params) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.getAgentBookings}/${agentId}?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting agent bookings", error);
    throw error;
  }
};

//get all agent booking
export const verifyAgentCode = async (agentCode) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.verifyAgentCode}/${agentCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying agent code", error);
    throw error;
  }
};

//get agent stats
export const getAgentStats = async (agentId) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${ADMIN_ENDPOINTS.getAgentStats}/${agentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting agent stats", error);
    throw error;
  }
};

// Update agent ticket limit
export const updateAgentTicketLimitAPI = async (newLimit, agentId) => {
  try {
    const response = await axiosInstance.patch(
      `${baseUrl}/${ADMIN_ENDPOINTS.updateAgentTicketLimit}/${agentId}`,
      newLimit
    );
    return response.data;
  } catch (error) {
    console.error("Error updating agent ticket limit", error);
    throw error;
  }
};

//deactivate agent
export const deactivateAgent = async (agentId) => {
  try {
    const response = await axiosInstance.patch(
      `${baseUrl}/${ADMIN_ENDPOINTS.deactivateAgent}/${agentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deactivating agent", error);
    throw error;
  }
};
