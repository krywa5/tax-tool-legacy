import React from "react";

const PrintButton = props => {
  return (
    <button
      className="no-print print-btn"
      onClick={() => {
        window.print();
      }}
    >
      Wydrukuj
    </button>
  );
};

export default PrintButton;
