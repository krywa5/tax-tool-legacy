import React, { Component } from "react";

class France extends Component {
  state = {
    allowanceValue: this.props.countryData.france.diet,
    monthlyIncomeCost: this.props.countryData.france.monthlyIncomeCost,
    income: "",
    incomes: [],
    paymentDay: "",
    currencyValue: "",
    currencyValueDate: "",
    currencyValueDateAPI: "",
    currencyTable: "",
    workDays: "",
    workMonths: "",
    startDate: "",
    endDate: "",
    daysInPoland: 0,
    tips: [],
    isTipsActive: false,
  };

  inputHandler = (e) => {
    if (e.target.value) {
      this.setState({
        [e.target.name]: +e.target.value.replace(",", "."),
      });
    } else {
      this.setState({
        [e.target.name]: "",
      });
    }
  };

  dateInputHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  checkWeekend = (date) => {
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
    const API_URL = `http://api.nbp.pl/api/exchangerates/rates/a/eur/${this.state.currencyValueDate}/?format=json`;
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          currencyValue: data.rates[0].mid.toFixed(4),
          currencyValueDate: data.rates[0].effectiveDate,
          currencyValueDateAPI: data.rates[0].effectiveDate,
          currencyTable: data.rates[0].no,
        })
      )
      .catch((error) => {
        console.log(error);
        alert(
          "Wystąpił błąd w pobieraniu kursu waluty. Prawdopodobnie wprowadzona data jest z przyszłości albo nie masz internetu. Jeśli ani to ani to, to daj znać Krystianowi :)"
        );
      });
  }

  componentDidUpdate(previousProps, previousState) {
    // Warunki dla Francji są troszkę inne niż dla pozostałych krajów ze względu na to że wypłata mogłabyć w innym dniu niż w ostanim dniu pracy
    if (
      ((previousState.startDate !== this.state.startDate ||
        previousState.endDate !== this.state.endDate ||
        previousState.daysInPoland !== this.state.daysInPoland) &&
        this.state.startDate &&
        this.state.endDate &&
        this.state.endDate[0] === "2") ||
      (previousState.paymentDay !== this.state.paymentDay &&
        this.state.paymentDay[0] === "2" &&
        this.state.startDate &&
        this.state.endDate) ||
      (previousState.paymentDay !== "" &&
        this.state.paymentDay === "" &&
        this.state.startDate &&
        this.state.endDate)
    ) {
      this.calculateWorkDays();
      this.setState({
        workDays: this.countDaysDifference(
          this.state.startDate,
          this.state.endDate,
          this.state.daysInPoland
        ),
        currencyValueDate:
          this.state.paymentDay === ""
            ? this.checkWeekend(this.state.endDate)
            : this.checkWeekend(this.state.paymentDay),
        workMonths: this.calculateWorkDays(),
      });
    }
    if (
      previousState.currencyValueDate !== this.state.currencyValueDate &&
      this.state.currencyValueDate !== ""
    ) {
      this.setState({
        currencyValue: this.getCurrencyValue(),
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
    return oldDate.toString().split("-").reverse().join("-");
  }

  currencyValueChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
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

  clearIncome = () => {
    this.setState({
      income: "",
      currencyValue: "",
      currencyValueDate: "",
      currencyValueDateAPI: "",
      currencyTable: "",
      workDays: "",
      workMonths: "",
      startDate: "",
      endDate: "",
      daysInPoland: 0,
    });
    this.income.focus();
  };

  addToIncomeList = (e) => {
    // wróć jeśli nie ma przychodu i kursu waluty
    if (this.state.income === "" || this.state.currencyValueDateAPI === "") {
      return;
    }

    const newIncome = {
      id: Date.now(),
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      paymentDay: this.state.paymentDay
        ? this.state.paymentDay
        : this.state.endDate,
      daysInPoland: this.state.daysInPoland,
      table: this.state.currencyTable,
      currencyValue: this.state.currencyValue,
      incomeAbroad: this.state.income,
      incomePLN: (
        (this.state.income - this.state.workDays * this.state.allowanceValue) *
          this.state.currencyValue -
        this.state.workMonths * this.state.monthlyIncomeCost
      ).toFixed(2),
    };

    this.setState((prevState) => ({
      incomes: [...prevState.incomes, newIncome],
      overall: newIncome.overall,
    }));

    this.clearIncome();
  };

  handleDeleteBtn = (e) => {
    const incomes = [...this.state.incomes];
    const incomeID = e.target.parentElement.parentElement.dataset.id;
    const output = [];

    incomes.forEach((el, i) => {
      if (el.id != incomeID) {
        output.push(el);
      }
    });

    this.setState({
      incomes: output,
    });
  };

  render() {
    const { income, paymentDay, currency } = this.props.countryData.france;

    let overallIncomePLN = 0;
    let overallIncomeAbroad = 0;

    return (
      <>
        <div className="input-box">
          <div className="input-box-inputs">
            <label htmlFor="income">
              Przychód brutto ({this.props.countryData.france.currency})
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
              min="0"
              ref={(input) => {
                this.income = input;
              }}
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="startDate">Data rozpoczęcia pracy</label>
            <input
              type="date"
              id="startDate"
              // value={this.state.startDate}
              name="startDate"
              onBlur={this.dateInputHandler}
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
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="input-box-inputs">
            <label htmlFor="paymentDay">
              Dzień wypłaty
              <br />
              <span className="no-print">{paymentDay}</span>
              <br />
              <span
                style={{ textDecoration: "underline" }}
                className="no-print"
              >
                Wypełnić jeśli inny niż ostatni dzień pracy
              </span>
            </label>
            <input
              // value={this.state.paymentDay}
              name="paymentDay"
              type="date"
              id="paymentDay"
              onBlur={this.dateInputHandler}
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
              Wysokość diety za dzień ({this.props.countryData.france.currency})
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
              Wartość diet ({this.props.countryData.france.currency})
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
            <label htmlFor="allIncomeValue">
              Wartość przychodu (PLN)
              <br />
              <span className="no-print">
                <strong>PIT-ZG pole nr 8</strong>
                <br />
                PIT-ZG pole nr 9,10 = 0, sprawdzić pole nr 222
              </span>
            </label>
            <input
              type="number"
              readOnly
              id="allIncomeValue"
              onClick={this.props.copyToClipboard}
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
        </div>
        {/* INCOME LIST FEATURE BELOW */}
        <button
          className="add-income-btn no-print"
          onClick={this.addToIncomeList}
          disabled={
            this.state.income && this.state.currencyValue ? false : true
          }
        >
          Dodaj pozycję
        </button>
        <div className="income-list">
          <span className="list-title">Lista przychodów</span>
          <table>
            <thead>
              <tr>
                <th>Lp.</th>
                <th>Data rozpoczęcia</th>
                <th>Data zakończenia</th>
                <th>Data wypłaty</th>
                <th>Ilość dni w Polsce</th>
                <th>Tabela</th>
                <th>Kurs waluty</th>
                <th>Przychód {currency}</th>
                <th>Przychód PLN</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.incomes.map((el, i) => {
                const incomeAbroad = String(
                  (Math.round(el.incomeAbroad * 100) / 100).toFixed(2)
                ).replace(".", ",");

                const incomePLN = String(
                  (Math.round(el.incomePLN * 100) / 100).toFixed(2)
                ).replace(".", ",");

                overallIncomePLN += el.incomePLN * 1;
                overallIncomeAbroad += el.incomeAbroad * 1;

                return (
                  <tr data-id={el.id} key={i}>
                    <td>{i + 1}.</td>
                    <td>{el.startDate}</td>
                    <td>{el.endDate}</td>
                    <td>{el.paymentDay}</td>
                    <td>{el.daysInPoland}</td>
                    <td>{el.table}</td>
                    <td>{el.currencyValue.replace(".", ",")}</td>
                    <td>{incomeAbroad}</td>
                    <td>{incomePLN}</td>
                    <td className="no-print">
                      <button
                        className="delete"
                        title="Usuń"
                        onClick={this.handleDeleteBtn}
                      ></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Łącznie</th>
                <th>
                  {(Math.round(overallIncomeAbroad * 100) / 100)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    .replace(".", ",")}
                  &nbsp;{currency}
                </th>
                <th
                  className="overallIncomePLN"
                  onClick={this.props.copyToClipboard}
                >
                  {(Math.round(overallIncomePLN * 100) / 100)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    .replace(".", ",")}
                  &nbsp;PLN
                </th>
                <th className="no-print"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  }
}

export default France;
