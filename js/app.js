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
    isCountryChosen: false
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
    } else {
      body.classList.remove("country-active");
    }
  }

  render() {
    return (
      <>
        <div className="wrapper">
          <Header />
          <Country onClick={this.handleCountryChoice} />
          {this.state.isCountryChosen && (
            <Main countryData={this.state.country} />
          )}
        </div>
        <Footer />
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
