import "./BusBooking.scss";
import BusBookingCard from "../components/BusBookingCard/BusBookingCard";
import { useEffect, useState } from "react";

import { Spin } from "antd";
import { useLocation } from "react-router-dom";
import { cityMapping } from "../utils/cityMapping";
import { getVrlBuses } from "../api/vrlBusesApis";
import { getSrsBuses } from "../api/srsBusesApis";
import { getBusBookingCardProps } from "../utils/BusBookingHelpers";

const BusBooking = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const [vrlBuses, setVrlBuses] = useState([]);
  const [srsBuses, setSrsBuses] = useState([]);
  const [srsBusesForFilter, setSrsBusesForFilter] = useState([]);

  //dates
  const date = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dates = [];

  for (let i = 0; i <= 6; i++) {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + i);
    const formattedDate = `${daysOfWeek[nextDate.getDay()]},${
      months[nextDate.getMonth()]
    }-${nextDate.getDate()}`;
    dates.push(formattedDate);
  }

  let currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  currentDate = `${year}-${month}-${day}`;

  const queryParams = new URLSearchParams(location.search);
  const bus_id = queryParams.get("bus_id")
  const sourceCity =
    queryParams.get("from") || localStorage.getItem("sourceCity");
  const destinationCity =
    queryParams.get("to") || localStorage.getItem("destinationCity");
  const storedDoj = localStorage.getItem("doj");
  const queryDate = queryParams.get("date");
  if (queryDate || storedDoj) {
    if (queryDate >= currentDate) {
      currentDate = queryDate;
    } else if (storedDoj >= currentDate) {
      currentDate = storedDoj;
    }
  }

  const [fromLocation, setFromLocation] = useState(sourceCity);
  const [toLocation, setToLocation] = useState(destinationCity);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sourceCity = queryParams.get("from");
    const destinationCity = queryParams.get("to");
    let currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    currentDate = `${year}-${month}-${day}`;
    let doj = currentDate;
    const storedDoj = localStorage.getItem("doj");
    const queryDate = queryParams.get("date");
    if (queryDate || storedDoj) {
      const queryDateObj = new Date(queryDate);
      const storedDojObj = new Date(storedDoj);
      const currDate = new Date();
      if (queryDateObj > currDate) {
        doj = queryDate;
      } else if (storedDojObj > currDate) {
        doj = storedDoj;
      }
    }
    if (sourceCity && destinationCity) {
      setFromLocation(sourceCity);
      setToLocation(destinationCity);
      setSelectedDate(doj);
    }
    handleSearch(fromLocation, toLocation, selectedDate);
  }, [location]);

  const handleSearch = async (
    sourceCity,
    destinationCity,
    doj,
    filters,
  ) => {
    setVrlBuses([]);
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

    if (
      sourceCity.trim().toLowerCase() === destinationCity.trim().toLowerCase()
    ) {
      alert("Source and destination cities cannot be the same.");
      return;
    }
    localStorage.setItem("sourceCity", sourceCity);
    localStorage.setItem("destinationCity", destinationCity);
    localStorage.setItem("doj", doj);
    setFromLocation(sourceCity);
    setToLocation(destinationCity);
    setSelectedDate(doj);

    let sourceCities = [];
    let destinationCities = [];
    if (sourceCity.trim().toLowerCase() in cityMapping) {
      const mapping = cityMapping[sourceCity.trim().toLowerCase()];
      sourceCities = mapping.sourceCity;
    } else {
      sourceCities.push(sourceCity);
    }
    if (destinationCity.trim().toLowerCase() in cityMapping) {
      const mapping = cityMapping[destinationCity.trim().toLowerCase()];
      destinationCities = mapping.sourceCity;
    } else {
      destinationCities.push(destinationCity);
    }
    let isFilter = false;

    if (
      filters &&
      (filters.busPartners.length > 0 ||
        filters.boardingPoints.length > 0 ||
        filters.droppingPoints.length > 0 ||
        (filters.minPrice && filters.maxPrice))
    ) {
      isFilter = true;
      let filteredBuses = srsBusesForFilter;
      if (filters.busPartners.length > 0) {
        filteredBuses = filteredBuses.filter((bus) =>
          filters?.busPartners
            .map((partner) => partner.toLowerCase())
            .includes(bus?.operator_service_name.toLowerCase())
        );
      }
      if (filters.boardingPoints.length > 0) {
        filteredBuses = filteredBuses.filter((bus) =>
          filters.boardingPoints.some((point) =>
            bus.boarding_stages.includes(point)
          )
        );
      }
      if (filters.droppingPoints.length > 0) {
        filteredBuses = filteredBuses.filter((bus) =>
          filters.droppingPoints.some((point) =>
            bus.dropoff_stages.includes(point)
          )
        );
      }
      if (filters.minPrice && filters.maxPrice) {
        setVrlBuses([]);
        filteredBuses = filteredBuses.filter((bus) => {
          const prices = bus.show_fare_screen
            .split("/")
            .map((price) => parseFloat(price));
          return prices.some(
            (price) => price >= filters.minPrice && price <= filters.maxPrice
          );
        });
      }
      const uniqueBusesSet = new Set(filteredBuses.map((bus) => bus.id));
      filteredBuses = Array.from(uniqueBusesSet, (id) =>
        filteredBuses.find((bus) => bus.id === id)
      );

      setSrsBuses(filteredBuses);
    } else {
      isFilter = false;
    }
    //vrl buses
    for (const sourceCity of sourceCities) {
      for (const destinationCity of destinationCities) {
        try {
          setLoading(true);
          const requestBody = {
            sourceCity: sourceCity.trim(),
            destinationCity: destinationCity.trim(),
            doj: doj,
          };
          const vrlResponse = await getVrlBuses(requestBody);
          if (Array.isArray(vrlResponse.data)) {
            const uniqueReferenceNumbersSet = new Set();
            const uniqueBusesArray = vrlResponse.data.filter((bus) => {
              if (!uniqueReferenceNumbersSet.has(bus.ReferenceNumber)) {
                uniqueReferenceNumbersSet.add(bus.ReferenceNumber);
                return true;
              }
              return false;
            });

            setVrlBuses((prevBuses) => {
              // extract a unique list of buses from combined bus list
              let newBuslist = [...prevBuses, ...uniqueBusesArray];
              const newUniqueBusListSet = new Set();
              const newUniqueBusList = newBuslist.filter((bus) => {
                if (!newUniqueBusListSet.has(bus.ReferenceNumber)) {
                  newUniqueBusListSet.add(bus.ReferenceNumber);
                  return true;
                }
                return false;
              });

              return [...newUniqueBusList];
            });
          } else {
            console.error("Invalid vrlResponse.data:", vrlResponse.data);
          }
        } catch (error) {
          console.log(error);
        }

        //srs buses
        try {
          if (isFilter === false) {
            const srsResponse = await getSrsBuses(
              sourceCity.trim(),
              destinationCity.trim(),
              doj
            );
          console.log(srsResponse)
            const filteredBuses = srsResponse.filter(
              (bus) => bus?.status === "New" || bus.status === "Update"
            );
            setSrsBuses((prevBuses) => [...prevBuses, ...filteredBuses]);
            setSrsBusesForFilter((prevFilteredBuses) => [
              ...prevFilteredBuses,
              ...filteredBuses,
            ]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    try {
      console.log("hii");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // get sortedData
  const busList = [...vrlBuses, ...srsBuses];
  const busData = busList.filter((item)=> {
    return item.id===Number(bus_id)})
  const sortedBusList = busList.slice(0,1)
  console.log(busData)
  return (
    <div className="busBooking">
      <div className="busBooking-container">
        <div className="right">
          <Spin spinning={loading}>
            <div className="wrapper">

              {sortedBusList?.map((bus) => {
                console.log(bus.type)
                const isVrl = bus.type === "vrl" ? true : false;
                const busProps = getBusBookingCardProps(
                  bus,
                  fromLocation,
                  toLocation,
                  selectedDate
                );

                return (
                  <div
                    className="bus-card-container"
                    key={isVrl ? bus?.ReferenceNumber : bus.id}
                  >
                    <BusBookingCard {...busProps} key={bus?.ReferenceNumber} />
                  </div>
                );
              })}
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default BusBooking;
