import { useState, useContext, createContext } from 'react';

const SelectedCountriesContext = createContext();

export const SelectedCountriesProvider = ({ children }) => {
    const [selectedCountries, setSelectedCountries] = useState([]);

    const addCountry = (country) => {
        setSelectedCountries((prevCountries) => [...prevCountries, country]);
    };

    const removeCountry = (countryUid) => {
        setSelectedCountries((prevCountries) => prevCountries.filter((c) => c.uid !== countryUid));
    };

    return (
        <SelectedCountriesContext.Provider value={{ selectedCountries, addCountry, removeCountry }}>
            {children}
        </SelectedCountriesContext.Provider>
    );
};

export const useSelectedCountries = () => {
    return useContext(SelectedCountriesContext);
};