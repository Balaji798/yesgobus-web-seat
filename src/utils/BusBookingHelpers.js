// Sort Partners -- Add VRL Travels to top
export function sortPartners(partnersList) {
  const sortKey = "VRL Travels";

  let sortedPartners = [...partnersList];
  let vrlIndex = sortedPartners?.indexOf(sortKey);
  //   console.log("VRL Index", vrlIndex);
  if (vrlIndex !== -1) {
    sortedPartners.splice(vrlIndex, 1);
    sortedPartners.unshift(sortKey);
    // console.log("VRL index present - sorted points", sortedPartners);
    return sortedPartners;
  } else {
    // console.log("VRL index not present - sorted points", sortedPartners);
    return sortedPartners;
  }
}

// Sort Buses
export function sortBuses(busList, sortData) {
  if (!sortData) return busList;

  let { ascending, sortBy } = sortData;
  let sortKey;
  switch (sortBy) {
    case "price":
      sortKey = { srs: "show_fare_screen", vrl: "lowestPrice" };
      break;

    default:
      break;
  }

  let copy = [...busList];

  copy.sort((a, b) => {
    let typeOfA = a.type;
    let typeOfB = b.type;
    let valueA = a[sortKey[typeOfA]];
    let valueB = b[sortKey[typeOfB]];

    if (sortBy === "price") {
      if (typeOfA === "srs") {
        valueA = +priceToDisplaySrs(valueA);
      }
      if (typeOfB === "srs") {
        valueB = +priceToDisplaySrs(valueB);
      }
    }

    // Comparison
    if (valueA < valueB) {
      return -1;
    }

    if (valueA > valueB) {
      return 1;
    }

    return 0;
  });

  if (!ascending) {
    return copy.reverse();
  }

  return copy;
}

// BusBookingCard props by provider
export function getBusBookingCardProps(
  bus,
  fromLocation,
  toLocation,
  selectedDate
) {
  const isVrl = bus.type === "vrl" ? true : false;

  if (isVrl) {
    return {
      key: bus?.ReferenceNumber,
      ReferenceNumber: bus?.ReferenceNumber,
      // inventoryType:bus.inventoryType,
      sourceCity: fromLocation,
      sourceCityId: bus?.FromCityId,
      destinationCity: toLocation,
      destinationCityId: bus?.ToCityId,
      doj: selectedDate,
      title: "VRL Travels",
      busName: "VRL Travels",
      busType: bus?.BusTypeName,
      rating: (Math.random() * 1 + 4).toFixed(1),
      noOfReviews: Math.floor(Math.random() * 101) + 37,
      pickUpLocation: bus?.FromCityName,
      pickUpTime: bus?.CityTime,
      reachLocation: bus?.ToCityName,
      reachTime: bus?.ArrivalTime,
      // calucalte total time
      travelTime: calculateVrlTravelTime(
        bus?.BookingDate,
        bus?.CityTime24,
        bus?.ApproxArrival
      ),
      seatsLeft: bus?.EmptySeats,
      // avlWindowSeats:bus?.avlWindowSeats,
      price: bus?.lowestPrice,
      allPrices: bus?.allPrices,
      // pickUpTimes:pickUpTimes,
      pickUpLocationOne: bus?.BoardingPoints,
      // pickUpLocationTwo:pickUpLocationTwo,
      // dropTimes:dropTimes,
      dropLocationOne: bus?.DroppingPoints,
      // dropLocationTwo:dropLocationTwo,
      backSeat: true,
      // cancellationPolicy:bus?.cancellationPolicy,
      fare: bus?.fares,
      isVrl: true,
      isBusAc: bus?.BusType === 0,
    };
  } else {
    return {
      key: bus?.id,
      scheduleId: bus?.id,
      // inventoryType:bus.inventoryType,
      sourceCity: fromLocation,
      sourceCityId: bus?.origin_id,
      destinationCity: toLocation,
      destinationCityId: bus?.destination_id,
      doj: selectedDate,
      title: bus?.operator_service_name,
      busName: bus?.operator_service_name,
      busType: bus?.bus_type,
      rating: (Math.random() * 1 + 4).toFixed(1),
      noOfReviews: Math.floor(Math.random() * 101) + 37,
      pickUpLocation: fromLocation,
      pickUpTime: bus?.dep_time,
      reachLocation: toLocation,
      reachTime: bus?.arr_time,
      // calucalte total time
      travelTime: bus?.duration,
      seatsLeft: bus?.available_seats,
      // avlWindowSeats:bus?.avlWindowSeats,
      price: priceToDisplaySrs(bus?.show_fare_screen),
      // pickUpTimes:pickUpTimes,
      pickUpLocationOne: bus?.boarding_stages,
      // pickUpLocationTwo:pickUpLocationTwo,
      // dropTimes:dropTimes,
      dropLocationOne: bus?.dropoff_stages,
      // dropLocationTwo:dropLocationTwo,
      backSeat: true,
      // cancellationPolicy:bus?.cancellationPolicy,
      fare: bus?.show_fare_screen,
      isSrs: true,
    };
  }
}

// Helper functions
const priceToDisplaySrs = (fare) => {
  //   if (!fare) return 0;

  const prices = fare.split("/");
  if (prices.length === 1) {
    return prices[0];
  } else {
    const minPrice = Math.min(...prices).toFixed(2);
    // console.log("minPrice is", minPrice);
    return minPrice;
  }
};

function calculateVrlTravelTime(bookingDate, pickupTime, arrivalTime) {
  // const currentDate = new Date();
  const departureTime = `${bookingDate} ${pickupTime}`;
  const departureDateTime = new Date(
    departureTime.replace(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/, "$2/$1/$3 $4:$5")
  );

  // const [hours, minutes, seconds] = pickupTime.split(":");
  // currentDate.setHours(hours);
  // currentDate.setMinutes(minutes);
  // currentDate.setSeconds(seconds || 0);

  const arrivalDateTime = new Date(
    arrivalTime.replace(
      /(\d+)-(\d+)-(\d+) (\d+):(\d+) ([APMapm]{2})/,
      "$2/$1/$3 $4:$5 $6"
    )
  );
  // console.log(departureDateTime, arrivalDateTime);
  const timeDifference = arrivalDateTime - departureDateTime;

  const travelTimeInMinutes = timeDifference / (1000 * 60);
  return formatTravelTime(parseInt(travelTimeInMinutes));
}

const formatTravelTime = (durationInMins) => {
  const hours = Math.floor(durationInMins / 60);
  const minutes = durationInMins % 60;
  const formattedHours =
    hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
  const formattedMinutes =
    minutes > 0 ? `${minutes.toString().padStart(2, "0")}` : "00";
  return `${formattedHours}${formattedMinutes}`;
};
