import React from 'react';

const Belgium = (props) => {
    const belgium = {
        income: "Loon loonbelasting/volksverzekeringen",
        tax: "Ingehouden loonbelasting/premie volksverz. (loonheffing)"
    };
    return (
        <div className="input-box">
            <div className="input-box-inputs">
                <label htmlFor="income">Przychód brutto<br /><span>{belgium.income}</span></label>
                <input type="number" id="income" min="0" />
            </div>
            <div className="input-box-inputs">
                <label htmlFor="tax">Podatek<br /><span>{belgium.tax}</span></label>
                <input type="number" id="tax" min="0" />
            </div>
            <div className="input-box-inputs">
                <label htmlFor="startDate">Data rozpoczęcia pracy</label>
                <input type="date" id="startDate" />
            </div>
            <div className="input-box-inputs">
                <label htmlFor="endDate">Data zakończenia pracy</label>
                <input type="date" id="endDate" />
            </div>
            <div className="userInfo">Wartości poniżej są obliczane automatycznie</div>
            <div className="input-box-inputs">
                <label htmlFor="currencyValue">Kurs waluty</label>
                <input type="number" id="currencyValue" />
            </div>
            <div className="input-box-inputs">
                <label htmlFor="allowanceMonths">Ilość miesięcy, za które przysługują diety</label>
                <input type="number" id="allowanceMonths" />
            </div>
            <div className="input-box-inputs">
                <label htmlFor="allowanceValue">Wysokość diety za dzień</label>
                <input type="number" id="allowanceValue" />
            </div>
            <div className="input-box-inputs">
                <label htmlFor="workDays">Ilość dni zagranicą</label>
                <input type="number" readOnly id="workDays" />
            </div>
            <div className="input-box-inputs">
                <label htmlFor="allAllowanceValue">Wartość diet</label>
                <input type="number" readOnly id="allAllowanceValue" />
            </div>
            <div className="input-box-inputs results">
                <label htmlFor="taxValue">Wartość podatku<br /><span>pole nr 204 oraz PIT-ZG pole nr 10</span></label>
                <input type="number" readOnly id="taxValue" />
            </div>
            <div className="input-box-inputs results">
                <label htmlFor="allIncomeValue">Wartość przychodu<br /><span>pole nr 43 oraz PIT-ZG pole nr 9</span><br /><span>w polu PIT-ZG pole nr 8 = 0</span></label>
                <input type="number" readOnly id="allIncomeValue" />
            </div>
            <div className="userInfo" style={{ borderBottom: 'none', borderRadius: '0 0 10px 10px' }}><span className="bottomNote">Sprawdzić ulgę abolicyjną!</span></div>
        </div>
    );

}

export default Belgium;