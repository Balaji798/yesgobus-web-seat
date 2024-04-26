import "./SeatLegend.scss";

const SeatLegend = ({ title, img, ladies,subtitle }) => {
  return (
    <div className="SeatLegend">
      <div
        style={{ display: "flex", height:"40px" }}
      >
        {ladies && (
          <img
            src={ladies}
            alt=""
            style={{ width: "24px", marginRight: "5px" }}
          />
        )}
        <span>{title}<br/><span style={{fontSize:"10px",marginTop:"-5px"}}>{subtitle}</span></span>
      </div>
      <img className="legendImage" src={img} alt="" />
    </div>
  );
};

export default SeatLegend;
