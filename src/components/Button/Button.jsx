import "./Button.scss";

const Button = ({ text, onClicked, className, disable = false, style }) => {
  return (

    <button onClick={onClicked} className={`button ${className}`} disabled={disable} style={style}>
      {text}
    </button>
  );
};

export default Button;
