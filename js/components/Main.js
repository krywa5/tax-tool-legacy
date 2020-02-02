import React from "react";

import Belgium from "./Belgium";
// import Germany from './Germany';
import Netherlands from "./Netherlands";
// import France from "./France";

const Main = props => {
  const france = {
    income: "Total brut",
    paymentDay: "Paye Le"
  };
  const germany = {
    income: "Gesamt-Brutto"
  };

  switch (props.countryData) {
    case "netherlands":
      return <Netherlands />;
    case "belgium":
      return <Belgium />;
    // case 'france':
    // return <France />;
    // case "germany":
    //   return <Germany />;
  }
};

export default Main;
