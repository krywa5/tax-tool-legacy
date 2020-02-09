import React, { Component } from "react";

class USA extends Component {
  state = {
    income: "",
    currencyValue: "",
    currencyValueDate: "",
    currencyTable: "",
    date: ""
  };

  inputHandler = e => {
    if (e.target.value) {
      this.setState({
        [e.target.name]: +e.target.value
      });
    } else {
      this.setState({
        [e.target.name]: ""
      });
    }
  };

  dateInputHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  checkWeekend = date => {
    let output = false;
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    !(newDate.getDay() % 6) ? (output = true) : (output = false);
    if (output === true) {
      newDate.setDate(newDate.getDate() - 1);
    }
    !(newDate.getDay() % 6) ? (output = true) : (output = false);
    if (output === true) {
      newDate.setDate(newDate.getDate() - 1);
    }
    !(newDate.getDay() % 6) ? (output = true) : (output = false);
    return newDate.toISOString().slice(0, 10);
  };

  getCurrencyValue() {
    const API_URL = `http://api.nbp.pl/api/exchangerates/rates/a/usd/${this.state.currencyValueDate}/?format=json`;
    fetch(API_URL)
      .then(response => response.json())
      .then(data =>
        this.setState({
          currencyValue: data.rates[0].mid.toFixed(4),
          currencyValueDate: data.rates[0].effectiveDate,
          currencyTable: data.rates[0].no
        })
      )
      .catch(error => {
        console.log(error);
        alert(
          "Wystąpił błąd w pobieraniu kursu waluty. Proszę to zrobić ręcznie lub powiadomić Krystiana :)"
        );
      });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.date !== this.state.date && this.state.date[0] === "2") {
      this.setState({
        currencyValueDate: this.checkWeekend(this.state.date)
      });
    }
    if (
      previousState.currencyValueDate !== this.state.currencyValueDate &&
      this.state.currencyValueDate !== ""
    ) {
      this.setState({
        currencyValue: this.getCurrencyValue()
      });
    }
  }

  changeFormateDate(oldDate) {
    return oldDate
      .toString()
      .split("-")
      .reverse()
      .join("-");
  }

  currencyValueChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <div className="input-box">
        <div className="input-box-inputs">
          <label htmlFor="income">Przychód (USD)</label>
          <input
            value={this.state.income}
            name="income"
            onChange={this.inputHandler}
            type="number"
            id="income"
            min="0"
          />
        </div>
        <div className="input-box-inputs">
          <label htmlFor="date">Data przychodu</label>
          <input
            type="date"
            id="date"
            value={this.state.date}
            name="date"
            onChange={this.dateInputHandler}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>

        {/* INPUTY WYPEŁNIANE AUTOMATYCZNIE */}
        <div className="userInfo">
          Wartości poniżej są obliczane automatycznie
        </div>

        {/* INPUTY WYPEŁNIANE AUTOMATYCZNIE */}
        <div className="input-box-inputs">
          <label htmlFor="currencyValue">
            Średni kurs waluty
            <br />
            {this.state.currencyValueDate && (
              <span style={{ fontSize: "12px" }}>{`(${this.changeFormateDate(
                this.state.currencyValueDate
              )}, ${this.state.currencyTable})`}</span>
            )}
          </label>
          <input
            type="number"
            id="currencyValue"
            value={this.state.currencyValue ? this.state.currencyValue : ""}
            onChange={this.currencyValueChangeHandler}
            step="0.0001"
            name="currencyValue"
            min="0"
          />
        </div>
        <div className="input-box-inputs results">
          <label htmlFor="valuePLN">Wartość przychodu (PLN)</label>
          <input
            type="number"
            readOnly
            id="valuePLN"
            onClick={this.props.copyToClipboard}
            value={
              this.state.income && this.state.currencyValue
                ? (this.state.income * this.state.currencyValue).toFixed(2)
                : ""
            }
          />
        </div>
      </div>
    );
  }
}

export default USA;
