import React from "react";
import "./selectOption.css";

const SelectOption = (props) => {
  const styles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: props.selected ? "#112A3E" : "#E5E5E5",
    color: props.selected ? "white" : "black",
    height: props.height,
    width: props.width,
    borderRadius: "100px",
    borderWidth: props.selected ? "0px" : "1px",
    borderColor: "#000000",
    borderStyle: "solid",
  };
  return <div id="select-option" style={styles} onClick={props.onClick}>{props.displayValue}</div>;
};

export default SelectOption;
