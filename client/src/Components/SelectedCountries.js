import { useState, useEffect, createContext, useContext } from 'react';

const SelectedCountryContext = createContext();

const usePersistedState = (key, initialValue) => {
    const [state, setState] = useState(() => {
        const persistedState = localStorage.getItem(key);
        return persistedState !== null ? JSON.parse(persistedState) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
};

export const SelectedCountryProvider = ({ children }) => {
    const [selectedCountry, setSelectedCountry] = usePersistedState('selectedCountry', null);
    const [startDate, setStartDate] = usePersistedState('startDate', null);
    const [endDate, setEndDate] = usePersistedState('endDate', null);
    const [guests, setGuests] = usePersistedState('guests', { adults: 2, children: 0 });
    const [destinationInput, setDestinationInput] = usePersistedState('destinationInput', '');

    return (
        <SelectedCountryContext.Provider value={{ selectedCountry, setSelectedCountry, startDate, setStartDate, endDate, setEndDate, guests, setGuests, destinationInput, setDestinationInput }}>
            {children}
        </SelectedCountryContext.Provider>
    );
};

export const useSelectedCountry = () => {
    return useContext(SelectedCountryContext);
};