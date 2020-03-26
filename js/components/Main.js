import React from "react";

import Belgium from "./Belgium";
import Germany from "./Germany";
import Netherlands from "./Netherlands";
import France from "./France";
import USA from "./USA";

const Main = props => {
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

  switch (props.country) {
    case "netherlands":
      return (
        <Netherlands
          copyToClipboard={copyToClipboard}
          countryData={props.countryData}
        />
      );
    case "belgium":
      return (
        <Belgium
          copyToClipboard={copyToClipboard}
          countryData={props.countryData}
        />
      );
    case "france":
      return (
        <France
          copyToClipboard={copyToClipboard}
          countryData={props.countryData}
        />
      );
    case "germany":
      return (
        <Germany
          copyToClipboard={copyToClipboard}
          countryData={props.countryData}
        />
      );
    case "usa":
      return (
        <USA
          copyToClipboard={copyToClipboard}
          countryData={props.countryData}
        />
      );
  }
};

export default Main;
