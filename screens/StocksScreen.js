import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text /* include other react-native components here as needed */,
} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([
    {
      /* FixMe: initial state here */

      symbol: 'AA',
      close: 41,
      percent: `${-5}%`,
    },
  ]);

  // can put more code here
  const StockDetail = () => {
    return (
      <View style={styles.detail}>
        <Text style={styles.detailItem}>Company Name</Text>
        <Text style={styles.detailItem}>OPEN</Text>
        <Text style={styles.detailItem}>LOW</Text>
        <Text style={styles.detailItem}>CLOSE</Text>
        <Text style={styles.detailItem}>HIGH</Text>
        <Text style={styles.detailItem}>VOLUME</Text>
      </View>
    );
  };

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state
  }, [watchList]);

  return (
    <View style={styles.container}>
      <StockDetail></StockDetail>
      {/* FixMe: add children here! */}
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    position: 'relative',
    color: '#fff',
  },

  detail: {
    height: 100,
    color: '#fff',
    position: 'absolute',
    bottom: 0,
  },

  detailItem: {
    color: '#fff',
  },
});
