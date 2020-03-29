import React, { Component } from "react";

import closeIcon from "../../images/close.png";

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

// Font Awesome../../node_modules/

class Netherlands extends Component {
  state = {
    allowanceValue: this.props.countryData.netherlands.diet,
    monthlyIncomeCost: this.props.countryData.netherlands.monthlyIncomeCost,
    income: "",
    tax: "",
    currencyValue: "",
    currencyValueDate: "",
    currencyValueDateAPI: "",
    currencyTable: "",
    workDays: "",
    workMonths: "",
    startDate: "",
    endDate: "",
    daysInPoland: 0,
    tips: [
      "gdy L02 (zwolnienie lekarskie) -> zredukować wartość diet do 0 (ustawić stawkę 0)"
    ],
    isTipsActive: false
  };

  inputHandler = e => {
    if (e.target.value) {
      this.setState({
        [e.target.name]: +e.target.value.replace(",", ".")
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
    // console.log(newDate);
    !(newDate.getDay() % 6) ? (output = true) : (output = false);
    // console.log(`Pierwsza iteracja ${output}`);
    if (output === true) {
      newDate.setDate(newDate.getDate() - 1);
    }
    // console.log(newDate);
    !(newDate.getDay() % 6) ? (output = true) : (output = false);
    // console.log(`Druga iteracja ${output}`);
    if (output === true) {
      newDate.setDate(newDate.getDate() - 1);
    }
    // console.log(newDate);
    !(newDate.getDay() % 6) ? (output = true) : (output = false);
    // console.log(`Trzecia iteracja ${output}`);
    // console.log(`ostateczna data: ${newDate}`);
    return newDate.toISOString().slice(0, 10);
  };

  getCurrencyValue() {
    const API_URL = `http://api.nbp.pl/api/exchangerates/rates/a/eur/${this.state.currencyValueDate}/?format=json`;
    fetch(API_URL)
      .then(response => response.json())
      .then(data =>
        this.setState({
          currencyValue: data.rates[0].mid.toFixed(4),
          currencyValueDate: data.rates[0].effectiveDate,
          currencyValueDateAPI: data.rates[0].effectiveDate,
          currencyTable: data.rates[0].no
        })
      )
      .catch(error => {
        console.log(error);
        alert(
          "Wystąpił błąd w pobieraniu kursu waluty. Prawdopodobnie wprowadzona data jest z przyszłości albo nie masz internetu. Jeśli ani to ani to, to daj znać Krystianowi :)"
        );
      });
  }

  componentDidUpdate(previousProps, previousState) {
    if (
      (previousState.startDate !== this.state.startDate ||
        previousState.endDate !== this.state.endDate ||
        previousState.daysInPoland !== this.state.daysInPoland) &&
      this.state.startDate &&
      this.state.endDate &&
      this.state.endDate[0] === "2"
    ) {
      this.calculateWorkDays();
      this.setState({
        workDays: this.countDaysDifference(
          this.state.startDate,
          this.state.endDate,
          this.state.daysInPoland
        ),
        currencyValueDate: this.checkWeekend(this.state.endDate),
        workMonths: this.calculateWorkDays()
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

  countDaysDifference = (startDate, endDate, daysInPoland) => {
    const firstDate = Date.parse(startDate);
    const secondDate = Date.parse(endDate);
    const timeDiff = secondDate - firstDate;
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) - daysInPoland + 1;
  };

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

  calculateWorkDays = () => {
    const startDate = new Date(this.state.startDate);
    const endDate = new Date(this.state.endDate);
    const daysInPoland = new Date(this.state.daysInPoland);
    const diffTime = Math.abs(
      endDate.getTime() - startDate.getTime() - daysInPoland.getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.round(diffDays / 30);
  };

  showTips(e) {
    e.target.parentElement.classList.add("active");
    console.log(this);
    this.setState({
      isTipsActive: true
    });
  }

  hideTip = e => {
    e.target.parentElement.classList.remove("active");
    this.setState({
      isTipsActive: false
    });
  };

  render() {
    const { income, tax } = this.props.countryData.netherlands;

    return (
      <>
        <div className={`tips ${this.state.isTipsActive ? "active" : ""}`}>
          <div className="tips__show-tips" onClick={this.showTips.bind(this)}>
            <FontAwesomeIcon icon={faInfo} />
          </div>
          <img
            src={closeIcon}
            alt=""
            title="Schowaj"
            className="tips__close"
            onClick={this.hideTip}
          />
          <h3 className="tips__title">Pamiętaj</h3>
          <ul className="tips__list">
            {this.state.tips.map((el, i) => (
              <li key={i} className="tips__item">
                {el}
              </li>
            ))}
          </ul>
        </div>

        <div className="input-box">
          <div className="input-box-inputs">
            <label htmlFor="income">
              Przychód brutto ({this.props.countryData.netherlands.currency})
              <br />
              <span className="no-print">{income}</span>
            </label>
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
            <label htmlFor="tax">
              Podatek ({this.props.countryData.netherlands.currency})
              <br />
              <span className="no-print">{tax}</span>
            </label>
            <input
              value={this.state.tax}
              name="tax"
              onChange={this.inputHandler}
              type="number"
              id="tax"
              min="0"
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="startDate">Data rozpoczęcia pracy</label>
            <input
              type="date"
              id="startDate"
              // value={this.state.startDate}
              name="startDate"
              // onChange={this.dateInputHandler}
              onBlur={this.dateInputHandler}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="endDate">Data zakończenia pracy</label>
            <input
              type="date"
              id="endDate"
              // value={this.state.endDate}
              name="endDate"
              onBlur={this.dateInputHandler}
              // onChange={() => {}}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="daysInPoland">Dni spędzone w Polsce</label>
            <input
              type="number"
              id="daysInPoland"
              value={this.state.daysInPoland}
              name="daysInPoland"
              onChange={this.inputHandler}
              min="0"
            />
          </div>
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
                  this.state.currencyValueDateAPI
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
          <div className="input-box-inputs">
            <label htmlFor="allowanceMonths">Ilość miesięcy zagranicą</label>
            <input
              type="number"
              id="allowanceMonths"
              value={this.state.workMonths}
              onChange={this.inputHandler}
              name="workMonths"
              min="0"
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="allowanceValue">
              Wysokość diety za dzień (
              {this.props.countryData.netherlands.currency})
            </label>
            <input
              type="number"
              id="allowanceValue"
              value={this.state.allowanceValue}
              onChange={this.inputHandler}
              name="allowanceValue"
              min="0"
              step="0.1"
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="workDays">Ilość dni zagranicą</label>
            <input
              type="number"
              id="workDays"
              value={this.state.workDays}
              onChange={this.inputHandler}
              name="workDays"
              min="0"
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="allAllowanceValue">
              Wartość diet ({this.props.countryData.netherlands.currency})
            </label>
            <input
              readOnly
              type="number"
              id="allAllowanceValue"
              value={
                this.state.workDays
                  ? (this.state.workDays * this.state.allowanceValue).toFixed(2)
                  : ""
              }
            />
          </div>
          <div className="input-box-inputs results">
            <label htmlFor="taxValue">
              Wartość podatku (PLN)
              <br />
              <span className="no-print">
                <strong>pole nr 227</strong> oraz
                <strong> PIT-ZG pole nr 10</strong>
              </span>
            </label>
            <input
              type="number"
              readOnly
              id="taxValue"
              onClick={this.props.copyToClipboard}
              value={
                this.state.currencyValue
                  ? (this.state.tax * this.state.currencyValue).toFixed(2)
                  : ""
              }
            />
          </div>
          <div className="input-box-inputs results">
            <label htmlFor="allIncomeValue">
              Wartość przychodu (PLN)
              <br />
              <span className="no-print">
                <strong>pole nr 63</strong> oraz
                <strong> PIT-ZG pole nr 9</strong>
                <br />w polu PIT-ZG pole nr 8 = 0
              </span>
            </label>
            <input
              type="number"
              readOnly
              onClick={this.props.copyToClipboard}
              id="allIncomeValue"
              value={
                this.state.currencyValue
                  ? (
                      (this.state.income -
                        this.state.workDays * this.state.allowanceValue) *
                        this.state.currencyValue -
                      this.state.workMonths * this.state.monthlyIncomeCost
                    ).toFixed(2)
                  : ""
              }
            />
          </div>
          <div
            className="userInfo"
            style={{ borderBottom: "none", borderRadius: "0 0 10px 10px" }}
          >
            <span className="bottomNote no-print">
              Sprawdzić ulgę abolicyjną!
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default Netherlands;
