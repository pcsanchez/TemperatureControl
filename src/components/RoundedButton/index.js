import React from "react";
import "./roundedButton.css";

const RoundedButton = (props) => {
  return (
    <div id="rounded-button" onClick={props.onClick}>
      {props.displayValue}
    </div>
  );
};

export default RoundedButton;
