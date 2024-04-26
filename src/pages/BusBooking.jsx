import "./BusBooking.scss";
import BusBookingCard from "../components/BusBookingCard/BusBookingCard";
import { useEffect, useState } from "react";

import { Spin } from "antd";
import { useLocation } from "react-router-dom";
import { getSrsBuses } from "../api/srsBusesApis";
import { getBusBookingCardProps } from "../utils/BusBookingHelpers";

const BusBooking = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [srsBuses, setSrsBuses] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const bus_id = queryParams.get("bus_id");
  const sourceCity = queryParams.get("from");
  const destinationCity = queryParams.get("to");
  const queryDate = queryParams.get("date");

  useEffect(() => {
    handleSearch(sourceCity, destinationCity, queryDate);
  }, [location]);

  const handleSearch = async (sourceCity, destinationCity, doj) => {
    setSrsBuses([]);
    if (
      sourceCity === null ||
      sourceCity === undefined ||
      sourceCity === "" ||
      sourceCity === "null"
    ) {
      sourceCity = "Mysore";
    }
    if (
      destinationCity === null ||
      destinationCity === undefined ||
      destinationCity === "" ||
      destinationCity === "null"
    ) {
      destinationCity = "Bangalore";
    }

    //srs buses
    try {
      const srsResponse = await getSrsBuses(
        sourceCity.trim(),
        destinationCity.trim(),
        doj
      );
      const filteredBuses = srsResponse.filter(
        (bus) => bus?.status === "New" || bus.status === "Update"
      );
      if (filteredBuses.length > 0) {
        setSrsBuses(filteredBuses);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const busData = srsBuses.filter((item) => {
    return item.id === Number(bus_id);
  });
  const sortedBusList = busData.slice(0, 1);
  return (
    <Spin spinning={loading}>
        {sortedBusList?.map((bus) => {
          console.log(bus.type);
          const busProps = getBusBookingCardProps(
            bus,
            sourceCity,
            destinationCity,
            queryDate
          );

          return (
            <div className="bus-card-container" style={{width:"100%"}} key={bus.id}>
              <BusBookingCard {...busProps} key={bus?.ReferenceNumber} />
            </div>
          );
        })}
    </Spin>
  );
};

export default BusBooking;
