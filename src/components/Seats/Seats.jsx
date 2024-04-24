import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  available,
  booked,
  driver,
  ladiesavailable,
  ladiesbooked,
  selectedFill,
  singleavailable,
  singlebooked,
  singleladiesavailable,
  singleladiesbooked,
  singleselected,
} from "../../assets/busbooking";
import SeatLegend from "../SeatLegend/SeatLegend";
import "./Seats.scss";
import Button from "../Button/Button";

const Seats = ({
  dropLocationOne,
  seatDetails,
  fare,
  isVrl,
  isSrs,
  tripId
}) => {
  const navigate = useNavigate();
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);
  const [selectedTab, setSelectedTab] = useState("seats");
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fareArray = Array.isArray(fare) ? fare : [fare];
    setPrices(fareArray);
  }, [fare]);


  const [bookingDetails, setBookingDetails] = useState({
    boardingPoint: {
      bpId: "",
      bpName: "",
      address: "",
      time: "",
      number: "",
    },
    droppingPoint: {
      bpId: "",
      bpName: "",
      address: "",
      time: "",
    },
    selectedSeats: [],
    seatFares: [],
    seatTaxes: [],
    seatTotalFares: [],
    ladiesSeat: [],
    fare: 0,
    serviceTax: 0,
    operatorTax: 0,
    totalFare: 0,
  });
  const seatSelectionHandler = (
    seatId,
    fare,
    serviceTax,
    operatorTax,
    totalFare,
    isLadiesSeat
  ) => {
    const roundToDecimal = (value, decimalPlaces) =>
      Number(value.toFixed(decimalPlaces));

    return setBookingDetails((prev) => {
      let newSelected = [...prev.selectedSeats];
      let newFare = roundToDecimal(parseFloat(prev.fare), 2);
      let newTax = roundToDecimal(parseFloat(prev.serviceTax), 2);
      let newOperatorTax = roundToDecimal(parseFloat(prev.operatorTax), 2);
      let newTotalFare = roundToDecimal(parseFloat(prev.totalFare), 2);
      let newSeatFares = [...prev.seatFares];
      let newSeatTaxes = [...prev.seatTaxes];
      let newSeatTotalFares = [...prev.seatTotalFares];
      let newLadiesSeat = [...prev.ladiesSeat];

      const seatIndex = newSelected.indexOf(seatId);

      if (seatIndex === -1) {
        if (newSelected.length < 5) {
          newSelected.push(seatId);
          newFare += roundToDecimal(parseFloat(fare), 2);
          newTax += roundToDecimal(parseFloat(serviceTax), 2);
          newOperatorTax += roundToDecimal(parseFloat(operatorTax), 2);
          newTotalFare += roundToDecimal(parseFloat(totalFare), 2);
          newSeatFares.push(roundToDecimal(parseFloat(fare), 2));
          newSeatTaxes.push(roundToDecimal(parseFloat(serviceTax), 2));
          newSeatTotalFares.push(roundToDecimal(parseFloat(totalFare), 2));
          newLadiesSeat.push(isLadiesSeat);
        } else {
          alert("Maximum 5 seats are allowed.");
        }
      } else {
        newSelected.splice(seatIndex, 1);
        newFare -= roundToDecimal(parseFloat(fare), 2);
        newTax -= roundToDecimal(parseFloat(serviceTax), 2);
        newOperatorTax -= roundToDecimal(parseFloat(operatorTax), 2);
        newTotalFare -= roundToDecimal(parseFloat(totalFare), 2);
        newSeatFares.splice(seatIndex, 1);
        newSeatTaxes.splice(seatIndex, 1);
        newSeatTotalFares.splice(seatIndex, 1);
        newLadiesSeat.splice(seatIndex, 1);
      }

      const updatedBookingDetails = {
        ...prev,
        selectedSeats: newSelected,
        fare: roundToDecimal(parseFloat(newFare), 2),
        serviceTax: roundToDecimal(parseFloat(newTax), 2),
        operatorTax: roundToDecimal(parseFloat(newOperatorTax), 2),
        totalFare: roundToDecimal(parseFloat(newTotalFare), 2),
        seatFares: newSeatFares,
        seatTaxes: newSeatTaxes,
        seatTotalFares: newSeatTotalFares,
        ladiesSeat: newLadiesSeat,
      };

      localStorage.setItem('bookingDetails', JSON.stringify(updatedBookingDetails));

      return updatedBookingDetails;
    });
  };

  useEffect(() => {
    const storedBookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    if (storedBookingDetails) {
      setBookingDetails(storedBookingDetails);
    }
  }, []);

  const lowerTierSeats = isVrl
    ? seatDetails.filter((seat) => seat.UpLowBerth === "LB")
    : isSrs
      ? seatDetails.coach_details.filter((seat) => seat.z_index === 0)
      : seatDetails.filter((seat) => seat.zIndex === "0");
  const upperTierSeats = isVrl
    ? seatDetails.filter((seat) => seat.UpLowBerth === "UB")
    : isSrs
      ? seatDetails.coach_details.filter((seat) => seat.z_index === 1)
      : seatDetails.filter((seat) => seat.zIndex === "1");

  const renderSeatTable = (seats, selectedSeats) => {
    if (isVrl) {
      console.log(seats)
      const filteredSeats = seats;
      console.log(filteredSeats)
      const highlightedPrice = selectedPriceFilter;

      const numRows =
        Math.max(...filteredSeats?.map((seat) => parseInt(seat.Column, 10))) +
        1;
      const numCols =
        Math.max(...filteredSeats?.map((seat) => parseInt(seat.Row, 10))) + 1;
      const minRow = Math.min(
        ...filteredSeats?.map((seat) => parseInt(seat.Column, 10))
      );

      const seatTable = [];
      let previousSeatCount = -1;

      for (let row = minRow; row < numRows; row++) {
        const seatRow = [];
        let seatCount = 0;

        for (let col = 0; col < numCols; col++) {
          const seat = filteredSeats.find(
            (s) => parseInt(s.Column, 10) === row && parseInt(s.Row, 10) === col
          );

          if (seat) {
            seatCount++;
            const isHighlighted = seat.BaseFare === highlightedPrice;
            if (seat.Available === "Y") {
              if (selectedSeats.includes(seat.SeatNo)) {
                seatRow.push(
                  <td key={seat.SeatNo}>
                    <div
                      className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                        } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                    >
                      <img
                        onClick={() =>
                          seatSelectionHandler(
                            seat.SeatNo,
                            seat.BaseFare,
                            seat.ServiceTax,
                            0,
                            seat.SeatRate,
                            seat.IsLadiesSeat
                            // seat.ac,
                            // seat.sleeper
                          )
                        }
                        title={`ID: ${seat.SeatNo}\nFare: ₹${seat.BaseFare}`}
                        src={
                          seat.SeatType === 0 || seat.SeatType == 2
                            ? singleselected
                            : selectedFill
                        }
                        alt="selected seat"
                        className={seat.ColumnSpan == "2" ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              } else {
                if (seat.IsLadiesSeat === "Y") {
                  seatRow.push(
                    <td key={seat.SeatNo}>
                      <div
                        className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                          } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                      >
                        <img
                          onClick={() =>
                            seatSelectionHandler(
                              seat.SeatNo,
                              seat.BaseFare,
                              seat.ServiceTax,
                              0,
                              seat.SeatRate,
                              seat.IsLadiesSeat
                              // seat.ac,
                              // seat.sleeper
                            )
                          }
                          title={`ID: ${seat.SeatNo}\nFare: ₹${seat.BaseFare}`}
                          src={
                            seat.SeatType === 0 || seat.SeatType == 2
                              ? singleladiesavailable
                              : ladiesavailable
                          }
                          alt="available ladies"
                          className={seat.ColumnSpan == "2" ? "vertical" : ""}
                        />
                      </div>
                    </td>
                  );
                } else {
                  seatRow.push(
                    <td key={seat.SeatNo}>
                      <div
                        className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                          } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                      >
                        <img
                          onClick={() =>
                            seatSelectionHandler(
                              seat.SeatNo,
                              seat.BaseFare,
                              seat.ServiceTax,
                              0,
                              seat.SeatRate,
                              seat.IsLadiesSeat
                              // seat.ac,
                              // seat.sleeper
                            )
                          }
                          title={`ID: ${seat.SeatNo}\nFare: ₹${seat.BaseFare}`}
                          src={
                            seat.SeatType === 0 || seat.SeatType == 2
                              ? singleavailable
                              : available
                          }
                          alt="available"
                          className={seat.ColumnSpan == "2" ? "vertical" : ""}
                        />
                      </div>
                    </td>
                  );
                }
              }
            } else {
              if (seat.ladiesSeat === "N") {
                seatRow.push(
                  <td key={seat.SeatNo}>
                    <div className={`seat_____container`}>
                      <img
                        title={`ID: ${seat.SeatNo}\nFare: ₹${seat.BaseFare}`}
                        src={
                          seat.SeatType === 0 || seat.SeatType == 2
                            ? singleladiesbooked
                            : ladiesbooked
                        }
                        alt="ladiesbooked"
                        className={seat.ColumnSpan == "2" ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              } else {
                seatRow.push(
                  <td key={seat.SeatNo}>
                    <div className={`seat_____container `}>
                      <img
                        title={`ID: ${seat.SeatNo}\nFare: ₹${seat.BaseFare}`}
                        src={
                          seat.SeatType === 0 || seat.SeatType == 2
                            ? singlebooked
                            : booked
                        }
                        alt="booked"
                        className={seat.ColumnSpan == "2" ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              }
            }
          } else {
            seatRow.push(<td key={`empty-${row}-${col}`}></td>);
          }
        }
        if (!(seatCount === 0 && previousSeatCount === 0)) {
          seatTable.push(<tr key={`row-${row}`}>{seatRow}</tr>);
        }
        previousSeatCount = seatCount;
      }

      return (
        <table>
          <tbody>{seatTable}</tbody>
        </table>
      );
    } else if (isSrs) {
      const filteredSeats = seats;
      const highlightedPrice = selectedPriceFilter;
      const numRows =
        Math.max(...filteredSeats?.map((seat) => parseInt(seat.column, 10))) +
        1;
      const numCols =
        Math.max(...filteredSeats?.map((seat) => parseInt(seat.row, 10))) + 1;
      const minRow = Math.min(
        ...filteredSeats?.map((seat) => parseInt(seat.column, 10))
      );

      const seatTable = [];
      let previousSeatCount = -1;

      for (let row = minRow; row < numRows; row++) {
        const seatRow = [];
        let seatCount = 0;

        for (let col = 0; col < numCols; col++) {
          const seat = filteredSeats.find(
            (s) => parseInt(s.column, 10) === row && parseInt(s.row, 10) === col
          );
          if (seat) {
            seatCount++;
            const isHighlighted =
              parseFloat(seatDetails.available[seat.seatName]) ===
              parseFloat(highlightedPrice);

            if (seatDetails.available[seat.seatName]) {
              if (selectedSeats.includes(seat.seatName)) {
                seatRow.push(
                  <td key={seat.seatName}>
                    <div
                      className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                        } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                    >
                      <img
                        onClick={() =>
                          seatSelectionHandler(
                            seat.seatName,
                            seatDetails.available[seat.seatName],
                            seatDetails.available_gst[seat.seatName] || 0,
                            0,
                            parseFloat(seatDetails.available[seat.seatName]) +
                            parseFloat(
                              seatDetails.available_gst[seat.seatName] || 0
                            ),
                            seatDetails.ladies_seats?.includes(seat.seatName)
                            // seat.ac,
                            // seat.sleeper
                          )
                        }
                        title={`ID: ${seat.seatName}\nFare: ₹${seatDetails.available[seat.seatName]
                          }`}
                        src={seat.width === 1 ? singleselected : selectedFill}
                        alt="selected seat"
                      // className={(seat.width == "2") ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              } else {
                if (seatDetails.ladies_seats?.includes(seat.seatName)) {
                  seatRow.push(
                    <td key={seat.seatName}>
                      <div
                        className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                          } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                      >
                        <img
                          onClick={() =>
                            seatSelectionHandler(
                              seat.seatName,
                              seatDetails.available[seat.seatName],
                              seatDetails.available_gst[seat.seatName] || 0,
                              0,
                              parseFloat(seatDetails.available[seat.seatName]) +
                              parseFloat(
                                seatDetails.available_gst[seat.seatName] || 0
                              ),
                              seatDetails.ladies_seats?.includes(seat.seatName)
                              // seat.ac,
                              // seat.sleeper
                            )
                          }
                          title={`ID: ${seat.seatName}\nFare: ₹${seatDetails.available_gst[seat.seatName]
                            }`}
                          src={
                            seat.width === 1
                              ? singleladiesavailable
                              : ladiesavailable
                          }
                          alt="available ladies"
                        // className={(seat.width == "2") ? "vertical" : ""}
                        />
                      </div>
                    </td>
                  );
                } else {
                  seatRow.push(
                    <td key={seat.seatName}>
                      <div
                        className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                          } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                      >
                        <img
                          onClick={() =>
                            seatSelectionHandler(
                              seat.seatName,
                              seatDetails.available[seat.seatName],
                              seatDetails.available_gst[seat.seatName] || 0,
                              0,
                              parseFloat(seatDetails.available[seat.seatName]) +
                              parseFloat(
                                seatDetails.available_gst[seat.seatName] || 0
                              ),
                              seatDetails.ladies_seats?.includes(seat.seatName)
                              // seat.ac,
                              // seat.sleeper
                            )
                          }
                          title={`ID: ${seat.seatName}\nFare: ₹${seatDetails.available[seat.seatName]
                            }`}
                          src={seat.width === 1 ? singleavailable : available}
                          alt="available"
                        // className={(seat.width == "2") ? "vertical" : ""}
                        />
                      </div>
                    </td>
                  );
                }
              }
            } else {
              if (seatDetails.ladies_booked_seats?.includes(seat.seatName)) {
                seatRow.push(
                  <td key={seat.seatName}>
                    <div
                      className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                        } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                    >
                      <img
                        title={`ID: ${seat.seatName}`}
                        src={
                          seat.width === 1 ? singleladiesbooked : ladiesbooked
                        }
                        alt="ladiesbooked"
                      // className={(seat.width == "2") ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              } else {
                seatRow.push(
                  <td key={seat.seatName}>
                    <div
                      className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                        } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                    >
                      <img
                        title={`ID: ${seat.seatName}`}
                        src={seat.width === 1 ? singlebooked : booked}
                        alt="booked"
                      // className={(seat.width == "2") ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              }
            }
          } else {
            seatRow.push(<td key={`empty-${row}-${col}`}></td>);
          }
        }
        if (!(seatCount === 0 && previousSeatCount === 0)) {
          seatTable.push(<tr key={`row-${row}`}>{seatRow}</tr>);
        }
        previousSeatCount = seatCount;
      }
      return (
        <table>
          <tbody>{seatTable}</tbody>
        </table>
      );
    } else {
      const filteredSeats = seats;
      const highlightedPrice = selectedPriceFilter;

      const numRows =
        Math.max(...filteredSeats?.map((seat) => parseInt(seat.row, 10))) + 1;
      const numCols =
        Math.max(...filteredSeats?.map((seat) => parseInt(seat.column, 10))) +
        1;

      const seatTable = [];
      let previousSeatCount = -1;

      for (let row = 0; row < numRows; row++) {
        const seatRow = [];
        let seatCount = 0;

        for (let col = 0; col < numCols; col++) {
          const seat = filteredSeats.find(
            (s) => parseInt(s.row, 10) === row && parseInt(s.column, 10) === col
          );

          if (seat) {
            seatCount++;
            const isHighlighted = seat.baseFare === highlightedPrice;
            if (seat.available === "true") {
              if (selectedSeats.includes(seat.name)) {
                seatRow.push(
                  <td key={seat.name}>
                    <div
                      className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                        } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                    >
                      <img
                        onClick={() =>
                          seatSelectionHandler(
                            seat.name,
                            seat.baseFare,
                            seat.serviceTaxAbsolute,
                            seat.operatorServiceChargeAbsolute,
                            seat.fare,
                            seat.ladiesSeat
                            // seat.ac,
                            // seat.sleeper
                          )
                        }
                        title={`ID: ${seat.name}\nFare: ₹${seat.baseFare}`}
                        src={
                          seat.width !== "2" && seat.length !== "2"
                            ? singleselected
                            : selectedFill
                        }
                        alt="selected seat"
                        className={seat.width == "2" ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              } else {
                if (seat.ladiesSeat === "true") {
                  seatRow.push(
                    <td key={seat.name}>
                      <div
                        className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                          } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                      >
                        <img
                          onClick={() =>
                            seatSelectionHandler(
                              seat.name,
                              seat.baseFare,
                              seat.serviceTaxAbsolute,
                              seat.operatorServiceChargeAbsolute,
                              seat.fare,
                              seat.ladiesSeat
                              // seat.ac,
                              // seat.sleeper
                            )
                          }
                          title={`ID: ${seat.name}\nFare: ₹${seat.baseFare}`}
                          src={
                            seat.width !== "2" && seat.length !== "2"
                              ? singleladiesavailable
                              : ladiesavailable
                          }
                          alt="available ladies"
                          className={seat.width == "2" ? "vertical" : ""}
                        />
                      </div>
                    </td>
                  );
                } else {
                  seatRow.push(
                    <td key={seat.name}>
                      <div
                        className={`seat_____container ${isHighlighted ? "highlighted_____seat" : ""
                          } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                      >
                        <img
                          onClick={() =>
                            seatSelectionHandler(
                              seat.name,
                              seat.baseFare,
                              seat.serviceTaxAbsolute,
                              seat.operatorServiceChargeAbsolute,
                              seat.fare,
                              seat.ladiesSeat
                              // seat.ac,
                              // seat.sleeper
                            )
                          }
                          title={`ID: ${seat.name}\nFare: ₹${seat.baseFare}`}
                          src={
                            seat.width !== "2" && seat.length !== "2"
                              ? singleavailable
                              : available
                          }
                          alt="available"
                          className={seat.width == "2" ? "vertical" : ""}
                        />
                      </div>
                    </td>
                  );
                }
              }
            } else {
              if (seat.ladiesSeat === "true") {
                seatRow.push(
                  <td key={seat.name}>
                    <div
                      className={`seat_____container ${isHighlighted ? "" : ""
                        } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                    >
                      <img
                        title={`ID: ${seat.name}\nFare: ₹${seat.baseFare}`}
                        src={
                          seat.width !== "2" && seat.length !== "2"
                            ? singleladiesbooked
                            : ladiesbooked
                        }
                        alt="ladiesbooked"
                        className={seat.width == "2" ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              } else {
                seatRow.push(
                  <td key={seat.name}>
                    <div
                      className={`seat_____container ${isHighlighted ? "" : ""
                        } ${highlightedPrice ? "priceOptionSelected" : ""}`}
                    >
                      <img
                        title={`ID: ${seat.name}\nFare: ₹${seat.baseFare}`}
                        src={
                          seat.width !== "2" && seat.length !== "2"
                            ? singlebooked
                            : booked
                        }
                        alt="booked"
                        className={seat.width == "2" ? "vertical" : ""}
                      />
                    </div>
                  </td>
                );
              }
            }
          } else {
            seatRow.push(<td key={`empty-${row}-${col}`}></td>);
          }
        }
        if (!(seatCount === 0 && previousSeatCount === 0)) {
          seatTable.push(<tr key={`row-${row}`}>{seatRow}</tr>);
        }
        previousSeatCount = seatCount;

        // seatTable.push(<tr key={`row-${row}`}>{seatRow}</tr>);
      }

      return (
        <table>
          <tbody>{seatTable}</tbody>
        </table>
      );
    }
  };

  // useEffect(() => {
  //   const getSeats = async () => {
  //     try {
  //       const response = await axiosInstance.post(
  //         `${import.meta.env.VITE_BASE_URL}/api/busBooking/getSeatLayout`,
  //         {
  //           sourceCity: sourceCity,
  //           destinationCity: destinationCity,
  //           doj: doj,
  //           inventoryType: inventoryType,
  //           routeScheduleId: routeScheduleId,
  //         }
  //       );
  //       setBoardingPoint(response.data.boardingPoints);
  //       setDroppingPoint(response.data.droppingPoints);
  //     } catch (error) {
  //       alert("Something went wrong");
  //       console.error("Something went wrong:", error);
  //     }
  //   };
  //   getSeats();
  // }, []);

  const handleContinue = () => {
    if (
      bookingDetails.boardingPoint.bpId &&
      (bookingDetails.droppingPoint.bpId || dropLocationOne[0] === undefined || dropLocationOne[0]?.bpName === undefined) &&
      bookingDetails.selectedSeats.length !== 0
    ) {
      // Add GST 5 %
      let newGst = parseFloat(bookingDetails.fare) * (5 / 100);
      // bookingDetails.gst = newGst;
      bookingDetails.gst = 0;
      // bookingDetails.totalFare = bookingDetails.totalFare + newGst;

      // if AC bus, add platform charge
      // if (isAcBus) {
      //   const newServiceTax =
      //     import.meta.env.VITE_SERVICE_TAX * parseFloat(bookingDetails.fare);
      //   bookingDetails.serviceTax += newServiceTax;
      //   bookingDetails.totalFare += newServiceTax;
      // }

      navigate("/busbooking/payment");
    } else {
      alert("Please select seats, boarding and droping points");
    }
  };

  const [error, setError] = useState(null);

  const handleNext = () => {
    switch (selectedTab) {
      case "seats":
        if (bookingDetails.selectedSeats.length > 0) {
          setError(null);
          setSelectedTab("pickup");
        } else {
          setError("Please select at least one seat.");
        }
        break;
      case "pickup":
        console.log(bookingDetails);
        if (bookingDetails.boardingPoint.bpId) {
          setError(null);
          setSelectedTab("drop");
        } else {
          setError("Please select a pickup location.");
        }
        break;
      case "drop":
        if (bookingDetails?.droppingPoint?.bpId) {
          setError(null);
          handleContinue();
        } if (dropLocationOne[0] === undefined || dropLocationOne[0]?.bpName === undefined) {
          setError(null);
          handleContinue();
        } else {
          setError("Please select a drop location.");
          console.log(dropLocationOne);
        }
        break;
      default:
        return null;
    }
  };


  const renderMobileContent = () => {
    switch (selectedTab) {
      case "seats":
        return renderSeatTableMobile();
      default:
        return null;
    }
  };

  const renderSeatTableMobile = () => {
    return (
      <>
        <div className="seatMobileRight">
          <div className="legend">
            <SeatLegend title={"Booked"} img={booked} />
            <SeatLegend title={"Available"} img={available} />
            <SeatLegend title={"Selected"} img={selectedFill} />
            <SeatLegend
              title={"Ladies"}
              subtitle={"(Available)"}
              img={ladiesavailable}
            />
            <SeatLegend
              title={"Ladies"}
              subtitle={"(Booked)"}
              img={ladiesbooked}
            />
          </div>
          {prices.length > 1 && (
            <div className="filters">
              <button
                className={`filter ${selectedPriceFilter === null ? "highlighted" : ""
                  }`}
                onClick={() => setSelectedPriceFilter(null)}
              >
                All
              </button>
              {prices.map((price) => (
                <button
                  key={price}
                  className={`filter ${selectedPriceFilter === price ? "highlighted" : ""
                    }`}
                  onClick={() => setSelectedPriceFilter(price)}
                >
                  ₹{price}
                </button>
              ))}
              <p className="" id="noSeatsMessage">
                {"No seats available"}
              </p>
            </div>
          )}
          <div
            className="bus-container"
            style={
              upperTierSeats.length === 0
                ? { marginBottom: "130px", marginTop: "130px" }
                : {}
            }
          >
            <div className="bus">
              <div className="driver">
                <img src={driver} alt="driver" />
                {upperTierSeats.length > 0 && (
                  <h4 className="tier-label">Lower Tier</h4>
                )}
              </div>

              <div className="gridContainer">
                {/* {upperTierSeats.length > 0 && <h4>Lower Tier</h4>} */}
                {renderSeatTable(lowerTierSeats, bookingDetails.selectedSeats)}
              </div>
            </div>
            {upperTierSeats.length > 0 && (
              <div className="bus">
                <div className="driver">
                  <h4 className="tier-label">Upper Tier</h4>
                </div>
                <div className="gridContainer">
                  <>
                    {/* <h4>Upper Tier</h4> */}
                    {renderSeatTable(
                      upperTierSeats,
                      bookingDetails.selectedSeats
                    )}
                  </>
                </div>
              </div>
            )}
          </div>

          <div className="price">
            <div className="selectedSeat">
              <span>Selected Seat(s):</span>
              <p>
                {bookingDetails.selectedSeats.join(", ") || "None Selected"}
              </p>
            </div>
            <p>₹ {bookingDetails.fare}</p>
          </div>
          {error && <div className="alert">{error}</div>}
          <div className="continue">
            <Button
              onClicked={() => handleNext()}
              text={"Select Boarding Point"}
            />
          </div>
        </div>
      </>
    );
  };


  return (
    <>
      <div className="seats">
        <div className="mobile-seats">{renderMobileContent()}</div>

        
      </div>
    </>
  );
};

export default Seats;
