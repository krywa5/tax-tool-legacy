import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Country from './components/Country';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

class App extends Component {
    state = {
        country: '',
        isCountryChosen: false
    };

    handleCountryChoice = (country) => {
        // console.log(country);
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
            <>
                <div className="wrapper">
                    <Header />
                    <Country onClick={this.handleCountryChoice} />
                    {this.state.isCountryChosen && <Main countryData={this.state.country} />}
                </div>
                <Footer />
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));