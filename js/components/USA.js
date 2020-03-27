import React, { Component } from "react";

//TODO
// Wyłączyć przycisk gdy wartość przychodu (PLN) = 0
// Możliwość usunięcia pozycji z listy

class USA extends Component {
  state = {
    income: "",
    currencyValue: "",
    currencyValueDate: "",
    currencyValueDateAPI: "",
    currencyTable: "",
    date: "",
    overall: 0,
    incomes: []
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

    // Nieudana walidacja

    // const today = new Date();
    // const inputDate = new Date(e.target.value);

    // if (today >= inputDate) {
    //   if (e.target.value) {
    //     this.setState({
    //       [e.target.name]: e.target.value
    //     });
    //   } else {
    //     this.setState({
    //       [e.target.name]: ""
    //     });
    //   }
    // } else {
    //   alert("Podana data jest z przyszłości !!!");
    // }
  };

  handleSubmit = e => {
    if (e.key === "Enter") {
      // console.log("dodano do listy");
      this.addToIncomeList();
    }
  };

  clearIncome = () => {
    this.setState({
      income: ""
    });
    this.income.focus();
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

  addToIncomeList = e => {
    if (this.state.income === "" || this.state.currencyValueDate === "") {
      return;
    }

    const newIncome = {
      id: Date.now(),
      date: this.state.date,
      table: this.state.currencyTable,
      currencyValue: this.state.currencyValue,
      incomeUSD: this.state.income,
      incomePLN: (this.state.income * this.state.currencyValue).toFixed(2),
      overall: this.state.overall + this.state.income * this.state.currencyValue
    };

    this.setState(prevState => ({
      incomes: [...prevState.incomes, newIncome],
      overall: newIncome.overall
    }));

    this.clearIncome();
  };

  handleDeleteBtn = e => {
    const incomes = [...this.state.incomes];
    const incomeID = e.target.parentElement.parentElement.dataset.id;
    const output = [];

    incomes.forEach((el, i) => {
      if (el.id != incomeID) {
        output.push(el);
      }
    });

    this.setState({
      incomes: output
    });
  };

  render() {
    let overallIncomePLN = 0;
    let overallIncomeUSD = 0;

    return (
      <div className="input-box">
        <div className="input-box-inputs no-print">
          <label htmlFor="income">
            Przychód {this.props.countryData.usa.currency}
          </label>
          <input
            value={this.state.income}
            name="income"
            onChange={this.inputHandler}
            type="number"
            id="income"
            min="0"
            ref={input => {
              this.income = input;
            }}
          />
        </div>
        <div className="input-box-inputs no-print">
          <label htmlFor="date">Data przychodu</label>
          <input
            type="date"
            id="date"
            // value={this.state.date}
            name="date"
            onBlur={this.dateInputHandler}
            // onChange={this.dateInputHandler}
            // onKeyPress={this.handleSubmit}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>

        {/* INPUTY WYPEŁNIANE AUTOMATYCZNIE */}
        <div className="userInfo no-print">
          Wartości poniżej są obliczane automatycznie
        </div>

        {/* INPUTY WYPEŁNIANE AUTOMATYCZNIE */}
        <div className="input-box-inputs no-print">
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
        <div className="input-box-inputs results no-print">
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
                <th>Data wpłaty</th>
                <th>Tabela</th>
                <th>Kurs waluty</th>
                <th>Przychód {this.props.countryData.usa.currency}</th>
                <th>Przychód PLN</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.incomes.map((el, i) => {
                const incomeUSD = String(
                  (Math.round(el.incomeUSD * 100) / 100).toFixed(2)
                ).replace(".", ",");

                const incomePLN = String(
                  (Math.round(el.incomePLN * 100) / 100).toFixed(2)
                ).replace(".", ",");

                overallIncomePLN += el.incomePLN * 1;
                overallIncomeUSD += el.incomeUSD * 1;

                return (
                  <tr data-id={el.id} key={i}>
                    <td>{i + 1}.</td>
                    <td>{el.date}</td>
                    <td>{el.table}</td>
                    <td>{el.currencyValue.replace(".", ",")}</td>
                    <td>{incomeUSD}</td>
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
                <th>Łącznie</th>
                <th>
                  {(Math.round(overallIncomeUSD * 100) / 100)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                    .replace(".", ",")}{" "}
                  {this.props.countryData.usa.currency}
                </th>
                <th>
                  {(Math.round(overallIncomePLN * 100) / 100)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                    .replace(".", ",")}{" "}
                  PLN
                </th>
                <th className="no-print"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
}

export default USA;
