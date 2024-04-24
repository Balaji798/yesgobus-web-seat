import { useEffect, useState } from "react";
import "./BusBookingCard.scss";
import Seats from "../Seats/Seats";
import { Spin } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { getSrsSeatLayout } from "../../api/srsBusesApis";
import axiosInstance from "../../utils/service";

const BusBookingCard = ({
  allPrices,
  seatsLeft,
  pickUpLocationOne,
  dropLocationOne,
  fare,
  isVrl = false,
  scheduleId,
  isSrs = false,
  tripId
}) => {
  //console.log(scheduleId)
  const [showSeats, setShowSeats] = useState(false);
  const [seatDetails, setSeatDetails] = useState([]);
  const [seatLoading, setSeatLoading] = useState(false);

  useEffect(()=>{
    fetchSeatData()
  },[])
  // srs seat layout
  const seatTypes = {
    SS: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    SL: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    LB: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    UB: {
      width: 2,
      length: 2,
      z_index: 1,
    },
    BS: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    PB: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    NPB: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    SLB: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    SUB: {
      width: 2,
      length: 2,
      z_index: 1,
    },
    SST: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    NA: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    ST: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    DLB: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    DUB: {
      width: 2,
      length: 2,
      z_index: 1,
    },
    WSS: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    WST: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    WLB: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    WUB: {
      width: 2,
      length: 2,
      z_index: 1,
    },
    WSL: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    WSU: {
      width: 1,
      length: 1,
      z_index: 1,
    },
    BU: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    EC: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    "SEMI CAMA": {
      width: 2,
      length: 2,
      z_index: 0,
    },
    "SALON CAMA": {
      width: 2,
      length: 2,
      z_index: 0,
    },
    CLASICO: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    EJECUTIVO: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    PREMIUM: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    SC: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    CO: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    EX: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    SP: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    SALON: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    "SALON MIXTO": {
      width: 1,
      length: 1,
      z_index: 0,
    },
    SEMICAMA: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    CAMA: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    COMUN: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    "COMUN CON AIRE": {
      width: 1,
      length: 1,
      z_index: 0,
    },
    SCA: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    SX: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    BLACK: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    PULLMAN: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    CA: {
      width: 1,
      length: 1,
      z_index: 0,
    },
    XP: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    "PREMIUM PROMO": {
      width: 1,
      length: 1,
      z_index: 0,
    },
    "SALON CAMA PROMO": {
      width: 2,
      length: 2,
      z_index: 0,
    },
    "SEMICAMA PROMO": {
      width: 2,
      length: 2,
      z_index: 0,
    },
    "CAMA VIP": {
      width: 2,
      length: 2,
      z_index: 0,
    },
    "Cama Ejecutivo": {
      width: 1,
      length: 1,
      z_index: 0,
    },
    "Cama Suite": {
      width: 2,
      length: 2,
      z_index: 0,
    },
    BJ: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    EJ: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    SU: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    BT: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    SJ: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    LS: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    "SUITE CAMA": {
      width: 2,
      length: 2,
      z_index: 0,
    },
    COMPARTIDO: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    EXCLUSIVO: {
      width: 2,
      length: 2,
      z_index: 0,
    },
    "SEMI EXCLUSIVO": {
      width: 2,
      length: 2,
      z_index: 0,
    },
  };

  // Function to parse the coach_details string
  function parseCoachDetails(coachDetails) {
    const rows = coachDetails?.split(",");
    const seatLayout = [];

    rows.forEach((row, rowIndex) => {
      const columns = row?.split("-");
      columns.forEach((column, columnIndex) => {
        const seats = column?.split("|");
        const isValid = seats[0].match(/[A-Z0-9.]+/g);
        if (isValid) {
          if (seats[0] !== ".DOOR") {
            seatLayout.push({
              seatName: seats[0],
              row: rowIndex + 1,
              column: columnIndex + 1,
              // berth: seatTypes[seats[1]],
              z_index: seatTypes[seats[1]]?.z_index || 0,
              width: seatTypes[seats[1]]?.width || 1,
              length: seatTypes[seats[1]]?.length || 1,
            });
          }
        }
      });
    });

    return seatLayout;
  }

  // Function to parse the available string
  function parseAvailable(available) {
    const seatObject = {};
    available?.split(",").forEach((seatInfo) => {
      const [seatName, fare] = seatInfo?.split("|");
      seatObject[seatName.trim()] = parseFloat(fare);
    });

    return seatObject;
  }

  const errorToast = (error) => {
    if (error.response) {
      toast.error(`Server Error: ${error.response.status}`, {
        duration: 2000,
        position: "top-center",
        style: {
          background: "red",
          color: "white",
        },
      });
      console.error("Server Error:", error.response.data);
      setSeatLoading(false);
    } else if (error.request) {
      toast.error("Network Error: Unable to connect to the server", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "red",
          color: "white",
        },
      });
      setSeatLoading(false);
      console.error("Network Error:", error.request);
    } else {
      toast.error("An unexpected error occurred", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  };
  const fetchSeatSellerSeats = async () => {
    let seatData = [];
    try {
   
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL
        }/busBooking/getSeatLayout/${tripId}`
      );
      seatData = response.data?.seats;
      const availableSeats = seatData?.filter(
        (seat) => seat.available === "true"
      );
      setAvailableSeats(availableSeats?.length);
      setSeatDetails(seatData);
      setSeatLoading(false);
      setShowSeats(!showSeats);
    } catch (error) {
      errorToast(error);
      console.log(error.message);
      setSeatLoading(false);
    }
  };
  //fetch srs seats
  const fetchSrsSeats = async () => {
    try {
      const seatsResponse = await getSrsSeatLayout(scheduleId);
      let coach_details = seatsResponse.result.bus_layout?.coach_details;
      let available = seatsResponse.result.bus_layout?.available;
      let available_gst = seatsResponse.result.bus_layout?.available_gst;
      let ladies_seats =
        seatsResponse.result.bus_layout?.ladies_seats?.split(",");
      let gents_seats = seatsResponse.result.bus_layout?.gents_seats?.split(",");
      let ladies_booked_seats =
        seatsResponse.result.bus_layout?.ladies_booked_seats?.split(",");
      let gents_booked_seats =
        seatsResponse.result.bus_layout?.gents_booked_seats?.split(",");
      let boarding_stages = seatsResponse.result.bus_layout?.boarding_stages;
      let dropoff_stages = seatsResponse.result.bus_layout?.dropoff_stages;

      const boardingPointlocationsAndTimes = boarding_stages
        ?.split("~")
        .map((entry) => {
          const [bpId, time, address, land_mark, number, bpName] =
            entry?.split("|");
          return { bpId, bpName, time, number };
        });
      const droppingPointlocationsAndTimes = dropoff_stages
        ?.split("~")
        .map((entry) => {
          const [bpId, time, address, land_mark, contact, bpName] =
            entry?.split("|");
          return { bpId, bpName, time };
        });

      const parsedCoachDetails = parseCoachDetails(coach_details);
      const parsedAvailable = parseAvailable(available);
      const parsedAvailable_gst = parseAvailable(available_gst);

      setSeatDetails({
        coach_details: parsedCoachDetails,
        available: parsedAvailable,
        available_gst: parsedAvailable_gst,
        ladies_seats,
        gents_seats,
        ladies_booked_seats,
        gents_booked_seats,
        boardingPointlocationsAndTimes,
        droppingPointlocationsAndTimes,
        isAcBus: seatsResponse.result.is_ac_bus,
      });
      setSeatLoading(false);
      setShowSeats(!showSeats);
    } catch (error) {
      errorToast(error);
      console.error(error.message);
      setSeatLoading(false);
    }
  };

  const fetchSeatData = async () => {
    if (!showSeats === false) {
      localStorage.removeItem("isSrs");
      localStorage.removeItem("scheduleId");
      localStorage.removeItem("bookingDetails");
      setShowSeats(!showSeats);
      return;
    }
    setSeatLoading(true);
    if (isSrs) {
      localStorage.setItem("isSrs", true);
      localStorage.setItem("scheduleId", scheduleId);
      await fetchSrsSeats();
    } else if (!isVrl && !isSrs) {
      await fetchSeatSellerSeats();
    }
  };

  const [vrlPickupLocations, setVrlPickupLocations] = useState(false);
  const [vrlDropLocations, setVrlDropLocations] = useState(false);

  useEffect(() => {
    if (isVrl) {
      const boardingPointlocationsAndTimes = pickUpLocationOne
        ?.split("#")
        .map((entry) => {
          const [bpId, bpName, time, number] = entry?.split("|");
          return { bpId, bpName, time, number };
        });
      const droppingPointlocationsAndTimes = dropLocationOne
        ?.split("#")
        .map((entry) => {
          const [bpId, bpName, time] = entry?.split("|");
          return { bpId, bpName, time };
        });
      setVrlPickupLocations(boardingPointlocationsAndTimes);
      setVrlDropLocations(droppingPointlocationsAndTimes);
    }

  }, []);

  const convertSrsFare = (fare) => {
    if (!fare) {
      return [];
    }
    const fareComponents = fare?.split("/");
    const uniqueFares = fareComponents.reduce((acc, fare) => {
      if (fare && !acc.includes(fare)) {
        acc.push(fare);
      }
      return acc;
    }, []);
    return uniqueFares;
  };

  const convertSeatSellerFare = (fare) => {
    const fareArray = Array.isArray(fare) ? fare : [fare];
    const basePricesArray = fareArray.map(details => parseFloat(details.baseFare).toFixed(2));
    return basePricesArray;
  };


  useEffect(() => {
    const handleSeatSelectionHistory = async () => {
      const id = localStorage.getItem("scheduleId");
       if (isSrs) {
        if (id.toString() === scheduleId.toString()) {
          await fetchSrsSeats();
        }
      }
    }
    handleSeatSelectionHistory();
  }, [ isSrs, isVrl, scheduleId])

  return (
    <div className={`BusBookingCard ${showSeats && "bg-lightgrey"}`}>
      <div className="cardContainer">
        {seatLoading && (
          <Spin
            spinning={seatLoading}
            className="loading_seats"
          />
        )}
      </div>
      {(showSeats && seatsLeft && seatDetails) && (
        <Seats
          pickUpLocationOne={
            isVrl
              ? vrlPickupLocations
              : isSrs
                ? seatDetails.boardingPointlocationsAndTimes
                : Array.isArray(pickUpLocationOne)
                  ? pickUpLocationOne
                  : [pickUpLocationOne]
          }
          dropLocationOne={
            isVrl
              ? vrlDropLocations
              : isSrs
                ? seatDetails.droppingPointlocationsAndTimes
                : Array.isArray(dropLocationOne)
                  ? dropLocationOne
                  : [dropLocationOne]
          }
          seatDetails={seatDetails}
          fare={isVrl ? allPrices : isSrs ? convertSrsFare(fare) : convertSeatSellerFare(fare)}
          isVrl={isVrl}
          isSrs={isSrs}
          tripId={tripId}
        />
      )}
      <Toaster />
    </div>
  );
};

export default BusBookingCard;
