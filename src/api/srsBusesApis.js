import axiosInstance from "../utils/service";

export const getSrsBuses = async (sourceCity, destinationCity, doj) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getSrsSchedules/${sourceCity}/${destinationCity}/${doj}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const getSrsBuseFilters = async (sourceCity, destinationCity, doj) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getSrsFilters?sourceCity=${sourceCity}&destinationCity=${destinationCity}&doj=${doj}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const getSrsSeatLayout = async (schedule_id) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getSrsSeatDetails/${schedule_id}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const getSrsAvailability = async (schedule_id) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getSrsAvailability/${schedule_id}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const srsBlockSeat = async (schedule_id, args) => {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getSrsBlockSeat/${schedule_id}`,
      args
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

//pass pnr number receviced from block seat response
export const srsConfirmBooking = async (ticket_number) => {
  try {
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/srsConfirmBooking/${ticket_number}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const getSrsCanCancelDetails = async (ticket_number, seat_names) => {
  try {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/getSrsCanCancelDetails/${ticket_number}/${seat_names}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};

export const srsCancelBooking = async (bookingId, ticket_number, seat_names, refundData, isAgent) => {
  try {
    let cancelTicketResponse = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/api/busBooking/srsCancelBooking/${ticket_number}/${seat_names}`
    );
    if (!cancelTicketResponse.data.result) {
      throw new Error(cancelTicketResponse.response.message);
    } else if (cancelTicketResponse.data.result) {
      cancelTicketResponse = cancelTicketResponse.data.result.cancel_ticket;
      refundData.amount = parseFloat(cancelTicketResponse.refund_amount);
      if (!isAgent) {
        const { data: refundResponse } = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/api/payment/refundPayment`, refundData);
      }
      // if (refundResponse) {
      const updateDetails = {
        bookingStatus: "cancelled",
        totalRefundAmount: cancelTicketResponse.refund_amount,
        // cancelChargesPercentage: cancelTicketResponse.cancelChargesPercentage,
        cancellationCharges: cancelTicketResponse.cancellation_charges,
      }
      const { data: updateBookingResponse } = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL}/api/busBooking/updateBooking/${bookingId}`, updateDetails);
      // send mail
      const mailBody = {
        fullName: updateBookingResponse?.data.customerName,
        sourceCity: updateBookingResponse?.data.sourceCity,
        destinationCity: updateBookingResponse?.data.destinationCity,
        seats: updateBookingResponse?.data.selectedSeats,
        amount: updateBookingResponse?.data.totalAmount,
        pickUpLocation: updateBookingResponse?.data.boardingPoint,
        opPNR: updateBookingResponse?.data.opPNR,
        doj: formatDate(updateBookingResponse?.data.doj),
        to: updateBookingResponse?.data.customerEmail,
      }
      const sendMail = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL
        }/api/busBooking/sendCancelTicketEmail`,
        mailBody
      );

      //send sms
      const messageBody = {
        fullName: updateBookingResponse?.data.customerName,
        sourceCity: updateBookingResponse?.data.sourceCity,
        destinationCity: updateBookingResponse?.data.destinationCity,
        seats: updateBookingResponse?.data.selectedSeats,
        amount: updateBookingResponse?.data.totalAmount,
        pickUpLocation: updateBookingResponse?.data.boardingPoint,
        opPNR: updateBookingResponse?.data.opPNR,
        doj: formatDate(updateBookingResponse?.data.doj),
        to: updateBookingResponse?.data.customerPhone,
      }
      const sendMessage = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL
        }/api/busBooking/sendCancelTicketMessage`,
        messageBody,
      );

      return updateBookingResponse;
      // }
    }
  } catch (error) {
    throw error.message;
  }
};