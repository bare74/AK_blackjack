import React from "react";

const PrimaryButton = (props) => {
  const { disabelBtn, text } = props;

  return (
    <button
      style={{ fontSize: 20, color: "blue", margin: "10px" }}
      onClick={props.onClick}
      disabled={disabelBtn}
    >
      {text}
      {props.children}
    </button>
  );
};
export default PrimaryButton;
