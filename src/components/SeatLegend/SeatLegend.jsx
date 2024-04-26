import "./SeatLegend.scss";

const SeatLegend = ({ title, img, subtitle }) => {
  return (
    <div className="SeatLegend">
    <p>
    <span>{title}</span>
    </p>
      <img className="legendImage" src={img} alt="" />
    </div>
  );
};

export default SeatLegend;
