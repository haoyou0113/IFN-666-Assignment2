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

  // can put more code here

  function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
  }
  const stateName = 'stocks123123';
  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
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
