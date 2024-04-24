import axiosInstance from "../utils/service";

export const getVrlBuses = async (args) => {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/busBooking/getVrlBusDetails`,
      args
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};