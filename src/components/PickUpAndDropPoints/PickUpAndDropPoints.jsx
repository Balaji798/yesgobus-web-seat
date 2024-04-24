import "./PickUpAndDropPoints.scss";

const PickUpAndDropPoints = ({
  time,
  locationOne,
  locationTwo,
  onClick,
  highlight,
}) => {
  return (
    <div
      className="PickUpAndDropPoints"
      style={{
        backgroundColor: highlight ? "#FD5901" : "white",
        fontWeight: highlight ? 700 : "normal",
        color: highlight ? "white" : "black"
      }}
      onClick={onClick}
    >
      <p style={{ color: highlight ? "white" : "black" }}>{time}</p>
      <span
        className="locationOne"
        style={{
          fontWeight: highlight ? 700 : "normal",
        }}
      >
        {locationOne}
      </span>
      <span className="locationTwo">{locationTwo}</span>
    </div>
  );
};

export default PickUpAndDropPoints;
