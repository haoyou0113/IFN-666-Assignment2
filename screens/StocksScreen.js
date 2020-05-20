import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  AsyncStorage,
  Text /* include other react-native components here as needed */,
} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [localList, setLocalList] = useState([]);
  const [state, setState] = useState(watchList);
  const [watchData, setWatchData] = useState([]);
  const [curDetail, setCurDetail] = useState('');
  const [detailStock, setDetailStock] = useState([]);

  console.log('watchList', watchList);
  console.log('watchData', watchData);

  // can put more code here
  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
  const StockDetail = (curDetail) => {
    return (
      <View style={styles.detail}>
        <Text style={styles.detailItem}>Company Name</Text>
        <Text style={styles.detailItem}>OPEN</Text>
        <Text style={styles.detailItem}>LOW</Text>
        <Text style={styles.detailItem}>CLOSE</Text>
        <Text style={styles.detailItem}>HIGH</Text>
        <Text style={styles.detailItem}>VOLUME</Text>
        <TouchableOpacity onPress={clearAsyncStorage}>
          <Text style={styles.detailItem}>clear</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const StockItem = (props) => {
    const { symbol, close, open } = props.item;
    return (
      <TouchableOpacity
        style={styles.stockItem}
        onPress={() => {
          console.log(symbol);
        }}
      >
        <Text style={styles.stockItemSymbol}>{symbol}</Text>
        <Text style={styles.stockItemClose}>{close}</Text>
        <Text style={styles.stockItemPer1}>
          {Math.floor(((close - open) / open) * 100 * 100) / 100} %
        </Text>
      </TouchableOpacity>
    );
  };
  function equar(a, b) {
    if (a.length !== b.length) {
      return false;
    } else {
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
  }

  useEffect(() => {
    // const diff = watchList.filter((item) => detailStock.indexOf(item) === -1);
    // const workList = diff;
    //过滤
    console.log('localList', localList);
    console.log('watchList', watchList);
    if (!equar(localList, watchList)) {
      setLocalList(watchList);
      setWatchData([]);
      for (const symbol of watchList) {
        console.log('请求发送');
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
            console.log('watchData', watchData);
            setWatchData((watchData) => [...watchData, data[0]]);
          })
          .catch((e) => {
            console.warn(e);
          });
      }
    }
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state
  }, [watchList]);
  // setWatchData(new Set(watchData.map(JSON.stringify)));
  // const stockFilter = new Set(watchData.map(JSON.stringify));
  // setWatchData(stockFilter);
  // console.log(new Set(watchData.map(JSON.stringify)));
  console.log(watchData);
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
