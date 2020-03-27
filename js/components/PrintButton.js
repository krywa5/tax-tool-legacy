import React from "react";
import printerLogo from "../../images/printer.png";

console.log(printerLogo);

const PrintButton = props => {
  return (
    <button
      className="no-print print-btn"
      onClick={() => {
        window.print();
      }}
    >
      <img src={printerLogo} alt="Drukuj" title="Drukuj" />
    </button>
  );
};

export default PrintButton;
