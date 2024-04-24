import axios from "axios";
//import axiosInstance from "../utils/service";

export const getSrsBuses = async (sourceCity, destinationCity, doj) => {
  try {
    console.log(sourceCity, destinationCity, doj)
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/busBooking/getSrsSchedules/${sourceCity}/${destinationCity}/${doj}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};


export const getSrsSeatLayout = async (schedule_id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/busBooking/getSrsSeatDetails/${schedule_id}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};