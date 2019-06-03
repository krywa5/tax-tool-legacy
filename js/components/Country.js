import React from 'react';

const Country = (props) => {
    return (
        <div className="country-bar">
            <label htmlFor='country-select'>Wybierz kraj:</label>
            <select
                id="country-select"
                onChange={e => props.onClick(e.target.value)}
            >
                <option value="">---Wybierz kraj---</option>
                <option value="netherlands">Holandia</option>
                <option value="belgium">Belgia</option>
                <option value="france">Francja</option>
                <option value="germany">Niemcy</option>
            </select>
        </div>
    );
}

export default Country;