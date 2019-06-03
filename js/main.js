import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Country from './components/Country';
import Header from './components/Header';

class App extends Component {
    state = {
        country: '',
        isCountryChosen: false
    };

    handleCountryChoice = (country) => {
        console.log(country);
        if (country !== '') {
            this.setState({
                country,
                isCountryChosen: true
            })
        } else {
            this.setState({
                country: '',
                isCountryChosen: false
            })
        }



    }

    render() {

        return (
            <div className="wrapper">
                <Header />
                <Country onClick={this.handleCountryChoice} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));