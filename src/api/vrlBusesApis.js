import axios from "axios";

export const getVrlBuses = async (args) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/busBooking/getVrlBusDetails`,
      args
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};