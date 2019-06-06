import React, { Component } from 'react';

class France extends Component {
    state = {
        allowanceValue: 15, // to można edytować
        monthlyIncomeCost: 111.25, // to można edytować
        income: '',
        paymentDay: '',
        currencyValue: '',
        currencyValueDate: '',
        currencyTable: '',
        workDays: '',
        workMonths: '',
        startDate: '',
        endDate: '',
        daysInPoland: 0
    };

    inputHandler = (e) => {
        if (e.target.value) {
            this.setState({
                [e.target.name]: +e.target.value
            })
        } else {
            this.setState({
                [e.target.name]: ''
            })
        }
    }

    dateInputHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    checkWeekend = date => {
        let output = false;
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        // console.log(newDate);
        !(newDate.getDay() % 6) ? output = true : output = false;
        // console.log(`Pierwsza iteracja ${output}`);
        if (output === true) {
            newDate.setDate(newDate.getDate() - 1);
        }
        // console.log(newDate);
        !(newDate.getDay() % 6) ? output = true : output = false;
        // console.log(`Druga iteracja ${output}`);
        if (output === true) {
            newDate.setDate(newDate.getDate() - 1);
        }
        // console.log(newDate);
        !(newDate.getDay() % 6) ? output = true : output = false;
        // console.log(`Trzecia iteracja ${output}`);
        // console.log(`ostateczna data: ${newDate}`);
        return newDate.toISOString().slice(0, 10)
    }

    getCurrencyValue() {
        const API_URL = `http://api.nbp.pl/api/exchangerates/rates/a/eur/${this.state.currencyValueDate}/?format=json`;
        fetch(API_URL)
            .then(response => response.json())
            .then(data => this.setState({
                currencyValue: data.rates[0].mid.toFixed(4),
                currencyValueDate: data.rates[0].effectiveDate,
                currencyTable: data.rates[0].no
            }))
            // w wersji finalnej można dać tutaj alert
            .catch(error => console.log(error))
    }



    componentDidUpdate(previousProps, previousState) {
        // Warunki dla Francji są troszkę inne niż dla pozostałych krajów ze względu na to że wypłata mogłabyć w innym dniu niż w ostanim dniu pracy
        if ((previousState.startDate !== this.state.startDate || previousState.endDate !== this.state.endDate || previousState.daysInPoland !== this.state.daysInPoland) && (this.state.startDate && this.state.endDate) && this.state.endDate[0] === '2' || (previousState.paymentDay !== this.state.paymentDay && this.state.paymentDay[0] === '2' && this.state.startDate && this.state.endDate) || (previousState.paymentDay !== '' && this.state.paymentDay === "" && this.state.startDate && this.state.endDate)) {
            this.calculateWorkDays();
            this.setState({
                workDays: this.countDaysDifference(this.state.startDate, this.state.endDate, this.state.daysInPoland),
                currencyValueDate: this.state.paymentDay === '' ? this.checkWeekend(this.state.endDate) : this.checkWeekend(this.state.paymentDay),
                workMonths: this.calculateWorkDays()
            })
        }
        if (previousState.currencyValueDate !== this.state.currencyValueDate && this.state.currencyValueDate !== '') {
            this.setState({
                currencyValue: this.getCurrencyValue()
            })
        }
    }

    countDaysDifference = (startDate, endDate, daysInPoland) => {
        const firstDate = Date.parse(startDate);
        const secondDate = Date.parse(endDate);
        const timeDiff = secondDate - firstDate;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) - daysInPoland + 1;
    }

    changeFormateDate(oldDate) {
        return oldDate.toString().split("-").reverse().join("-");
    }

    currencyValueChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    calculateWorkDays = () => {
        const startDate = new Date(this.state.startDate);
        const endDate = new Date(this.state.endDate);
        const daysInPoland = new Date(this.state.daysInPoland);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime() - daysInPoland.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return Math.round(diffDays / 30);
    }

    render() {
        const france = {
            income: "Total Brut",
            paymentDay: "Paye Le"
        };

        return (
            <div className="input-box">
                <div className="input-box-inputs">
                    <label htmlFor="income">Przychód brutto (EUR)<br /><span>{france.income}</span></label>
                    <input
                        value={this.state.income}
                        name='income'
                        onChange={this.inputHandler}
                        type="number"
                        id="income"
                        min="0"
                    />
                </div>
                <div className="input-box-inputs">
                    <label htmlFor="startDate">Data rozpoczęcia pracy</label>
                    <input
                        type="date"
                        id="startDate"
                        value={this.state.startDate}
                        name="startDate"
                        onChange={this.dateInputHandler}
                    />
                </div>
                <div className="input-box-inputs">
                    <label htmlFor="endDate">Data zakończenia pracy</label>
                    <input
                        type="date"
                        id="endDate"
                        value={this.state.endDate}
                        name="endDate"
                        onChange={this.dateInputHandler}
                        max={new Date().toISOString().slice(0, 10)}
                    />
                </div>
                <div className="input-box-inputs">
                    <label htmlFor="paymentDay">Dzień wypłaty<br /><span>{france.paymentDay}</span><br /><span style={{ textDecoration: 'underline' }}>Zostawić puste jeśli inny niż ostatni dzień pracy</span></label>
                    <input
                        value={this.state.paymentDay}
                        name='paymentDay'
                        type="date"
                        id="paymentDay"
                        onChange={this.dateInputHandler}
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
                        min='0'
                    />
                </div>
                <div className="userInfo">Wartości poniżej są obliczane automatycznie</div>

                {/* INPUTY WYPEŁNIANE AUTOMATYCZNIE */}


                <div className="input-box-inputs">
                    <label htmlFor="currencyValue">Średni kurs waluty<br />{this.state.currencyValueDate && <span style={{ fontSize: '12px' }}>{`(${this.changeFormateDate(this.state.currencyValueDate)}, ${this.state.currencyTable})`}</span>}</label>
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
                    <label htmlFor="allowanceValue">Wysokość diety za dzień (EUR)</label>
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
                    <label htmlFor="allAllowanceValue">Wartość diet (EUR)</label>
                    <input
                        readOnly
                        type="number"
                        id="allAllowanceValue"
                        value={this.state.workDays ? (this.state.workDays * this.state.allowanceValue).toFixed(2) : ''}
                    />
                </div>
                <div className="input-box-inputs results">
                    <label htmlFor="allIncomeValue">Wartość przychodu (PLN)<br /><span><strong>PIT-ZG pole nr 8</strong><br />PIT-ZG pole nr 9,10 = 0, sprawdzić pole nr 199</span></label>
                    <input
                        type="number"
                        readOnly
                        id="allIncomeValue"
                        value={this.state.currencyValue ? ((this.state.income - this.state.workDays * this.state.allowanceValue) * this.state.currencyValue - (this.state.workMonths * this.state.monthlyIncomeCost)).toFixed(2) : ''}
                    />
                </div>
            </div>
        );
    }
}

export default France;