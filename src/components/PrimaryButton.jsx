import React from "react";

const PrimaryButton = (props) => {
  const { disabelBtn, text } = props;

  return (
    <button
      style={{
        fontSize: 20,
        color: "black",
        margin: "10px",
        backgroundColor: "grey",
        border: "1px solid black",
      }}
      onClick={props.onClick}
      disabled={disabelBtn}
    >
      {text}
      {props.children}
    </button>
  );
};
export default PrimaryButton;
