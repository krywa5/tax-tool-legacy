import React from "react";

import Belgium from "./Belgium";
import Germany from "./Germany";
import Netherlands from "./Netherlands";
import France from "./France";
import USA from "./USA";

const Main = props => {
  const france = {
    income: "Total brut",
    paymentDay: "Paye Le"
  };
  const germany = {
    income: "Gesamt-Brutto"
  };
  const body = document.querySelector("body");

  const copyToClipboard = e => {
    const text = e.target.value.replace(".", ",");

    navigator.clipboard.writeText(text).then(
      function() {
        alert(`Wartość ${text} skopiowano do schowka`);
      },
      function(err) {
        alert("Błąd kopiowania wartości :( przepisz ją ręcznie!");
      }
    );
  };

  switch (props.countryData) {
    case "netherlands":
      return <Netherlands copyToClipboard={copyToClipboard} />;
    case "belgium":
      return <Belgium copyToClipboard={copyToClipboard} />;
    case "france":
      return <France copyToClipboard={copyToClipboard} />;
    case "germany":
      return <Germany copyToClipboard={copyToClipboard} />;
    case "usa":
      return <USA copyToClipboard={copyToClipboard} />;
  }
};

export default Main;
