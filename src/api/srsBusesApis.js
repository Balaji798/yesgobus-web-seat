import axios from "axios";

export const getSrsBuses = async (sourceCity, destinationCity, doj) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/busBooking/srcSchedules/${sourceCity}/${destinationCity}/${doj}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};


export const getSrsSeatLayout = async (schedule_id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/busBooking/srsSeatDetails/${schedule_id}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};