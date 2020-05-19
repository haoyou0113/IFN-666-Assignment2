import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Text /* include other react-native components here as needed */,
} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [watchData, setWatchData] = useState([]);
  const [curDetail, setCurDetail] = useState('');
  const [detailStock, setDetailStock] = useState([]);

  console.log('watchList', watchList);
  console.log('watchData', watchData);
  // can put more code here
  const StockDetail = (curDetail) => {
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
  const StockItem = (props) => {
    console.log(props);
    const { symbol, close, open } = props.item;
    return (
      <TouchableOpacity
        style={styles.stockItem}
        onPress={(e) => {
          console.log(e);
          setCurDetail(e.target.innerText);
        }}
      >
        <Text style={styles.stockItemSymbol}>{symbol}</Text>
        <Text style={styles.stockItemClose}>{close}</Text>
        <Text style={styles.stockItemPer1}>
          {Math.floor(((close - open) / open) * 100 * 100) / 100}
        </Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    const diff = watchList.filter((item) => detailStock.indexOf(item) === -1);
    const workList = diff;
    //过滤
    for (const symbol of workList) {
      fetch(`${ServerURL}/history?symbol=${symbol}`)
        .then((data) => data.json())
        .then((data) =>
          data.map((item) => ({
            key: item.timestamp,
            symbol: item.symbol,
            name: item.name,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volumes: item.volumes,
          }))
        )
        .then((data) => {
          console.log(data[0]);
          if (watchData.indexOf(data[0]) === -1) {
            setWatchData((watchData) => [...watchData, data[0]]);
          } else {
            console.log('yicunzai ');
            return;
          }
        });
    }
    setDetailStock(watchList);
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state
  }, [watchList]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          data={watchData}
          renderItem={StockItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
        ></FlatList>
      </ScrollView>

      <StockDetail></StockDetail>
      {/* FixMe: add children here! */}
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  stockItem: {
    borderWidth: 1,
    padding: scaleSize(10),
    backgroundColor: 'black',
    borderBottomColor: '#585858',
  },
  stockItemSymbol: {
    fontSize: scaleSize(16),
    flex: 3,
    color: 'white',
    textAlign: 'right',
    paddingRight: scaleSize(20),
  },
  stockItemClose: {
    fontSize: scaleSize(16),
    flex: 3,
    color: 'white',
    textAlign: 'right',
    paddingRight: scaleSize(20),
  },
  stockItemPer1: {
    fontSize: scaleSize(16),
    flex: 2,
    backgroundColor: '#4cd964',
    textAlign: 'right',
    borderRadius: 10,
  },
  stockItemPer1: {
    borderWidth: 1,
    padding: scaleSize(10),
    backgroundColor: 'black',
    borderBottomColor: '#585858',
  },
  detail: {},

  detailItem: {
    color: '#fff',
    backgroundColor: 'blue',
  },
});
