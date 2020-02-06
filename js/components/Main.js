import React from "react";

import Belgium from "./Belgium";
import Germany from "./Germany";
import Netherlands from "./Netherlands";
import France from "./France";

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
      // body.classList.add("country-active");
      return <Netherlands copyToClipboard={copyToClipboard} />;
    case "belgium":
      // body.classList.add("country-active");
      return <Belgium copyToClipboard={copyToClipboard} />;
    case "france":
      // body.classList.add("country-active");
      return <France copyToClipboard={copyToClipboard} />;
    case "germany":
      // body.classList.add("country-active");
      return <Germany copyToClipboard={copyToClipboard} />;
    // case "":
    //   console.log("Usuwam");
    //   body.classList.remove("country-active");
    //   break;
  }
};

export default Main;

// TODO
// DODAĆ TOOLTIPY ŻE SKOPIOWANO DO SCHOWKA
