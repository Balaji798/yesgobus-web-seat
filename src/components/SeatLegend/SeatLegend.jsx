import "./SeatLegend.scss";

const SeatLegend = ({ title, img,subtitle }) => {
  return (
    <div className="SeatLegend">
      <div
        style={{ display: "flex", height:"40px" }}
      >
        <span>{title}<br/><span style={{fontSize:"10px",marginTop:"-5px"}}>{subtitle}</span></span>
      </div>
      <img className="legendImage" src={img} alt="" />
    </div>
  );
};

export default SeatLegend;
