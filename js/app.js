import React, { Component } from "react";
import ReactDOM from "react-dom";

import Country from "./components/Country";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

const body = document.querySelector("body");

class App extends Component {
  state = {
    country: "",
    isCountryChosen: false,
    countryData: {
      // Stan na 2020 rok
      netherlands: {
        // Stawka = (stawka * oprocentowanie)
        diet: (50 * 0.3).toFixed(2) * 1, // Oprocentowanie 30% całej diety zagranicznej
        // koszty uzyskania przychodu za granicą
        monthlyIncomeCost: 111.25, // EURO
        currency: "EUR",
        income: "Loon loonbelasting/volksverzekeringen",
        tax: "Ingehouden loonbelasting/premie volksverz. (loonheffing)"
      },
      belgium: {
        // (stawka * oprocentowanie)
        diet: (48 * 0.3).toFixed(2) * 1, // Oprocentowanie 30% całej diety zagranicznej
        // koszty uzyskania przychodu za granicą
        monthlyIncomeCost: 111.25, // EURO
        currency: "EUR",
        income: "Loon loonbelasting/volksverzekeringen",
        tax: "Ingehouden loonbelasting/premie volksverz. (loonheffing)",
        paymentDay: "Paye Le" // TODO: sprawdzić czy tak jest
      },
      france: {
        // (stawka * oprocentowanie)
        diet: (50 * 0.3).toFixed(2) * 1, // Oprocentowanie 30% całej diety zagranicznej
        // koszty uzyskania przychodu za granicą
        monthlyIncomeCost: 111.25, // EURO
        currency: "EUR",
        income: "Total Brut",
        paymentDay: "Paye Le"
      },
      germany: {
        // (stawka * oprocentowanie)
        diet: (49 * 0.3).toFixed(2) * 1, // Oprocentowanie 30% całej diety zagranicznej
        // koszty uzyskania przychodu za granicą
        monthlyIncomeCost: 111.25, // EURO
        currency: "EUR",
        income: "Pole nr 3 - Bruttoarbaitslohn (Gesamt-Brutto)",
        holidayIncome: "Pole nr 20 - Steuefreue…"
      }
    }
  };

  handleCountryChoice = country => {
    // console.log(country);
    if (country !== "") {
      this.setState({
        country,
        isCountryChosen: true
      });
    } else {
      this.setState({
        country: "",
        isCountryChosen: false
      });
    }
  };

  componentDidUpdate() {
    if (this.state.isCountryChosen) {
      body.classList.add("country-active");
      if (this.state.country === "usa") {
        body.classList.add("wide");
      } else {
        body.classList.remove("wide");
      }
    } else {
      body.classList.remove("country-active");
      body.classList.remove("usa");
    }
  }

  render() {
    return (
      <>
        <div className="wrapper">
          <Header />
          <Country onClick={this.handleCountryChoice} />
          {this.state.isCountryChosen && (
            <Main
              country={this.state.country}
              countryData={this.state.countryData}
            />
          )}
        </div>
        <Footer />
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
