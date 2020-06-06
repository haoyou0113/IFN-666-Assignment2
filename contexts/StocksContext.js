import React, { useState, useContext, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  const [stateName, setStateName] = useState('TASKS');

  function addToWatchlist(newSymbol) {
    if (state.indexOf(newSymbol) === -1) {
      const newSymbols = [...state, newSymbol];
      setState((state) => [...state, newSymbol]);
      AsyncStorage.setItem(stateName, JSON.stringify(newSymbols));
    }
  }

  useEffect(() => {
    AsyncStorage.getItem(stateName)
      .then((savedString) => JSON.parse(savedString))
      .then((savedStocks) => savedStocks && setState(savedStocks));
  }, []);

  return {
    ServerURL: 'http://131.181.190.87:3001',
    watchList: state,
    addToWatchlist,
  };
};
