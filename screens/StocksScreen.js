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
  const [curDetail, setCurDetail] = useState(null);
  const [detailStock, setDetailStock] = useState([]);

  console.log('watchList', watchList);
  console.log('watchData', watchData);

  // can put more code here
  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
  const StockDetail = () => {
    if (curDetail) {
      const { name, open, high, low, volumes, close } = curDetail;
      return (
        <View style={styles.detail}>
          <Text style={styles.detailName}>{name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>OPEN</Text>
            <Text style={styles.detailContent}>{open}</Text>
            <Text style={styles.detailTitle}>LOW</Text>
            <Text style={styles.detailContent}>{low}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>CLOSE</Text>
            <Text style={styles.detailContent}>{close}</Text>
            <Text style={styles.detailTitle}>HIGH</Text>
            <Text style={styles.detailContent}>{high}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>VOLUME</Text>
            <Text style={styles.detailContent}>{volumes}</Text>
            <Text style={styles.detailTitle}></Text>
            <Text style={styles.detailContent}></Text>
          </View>
          {/* <TouchableOpacity onPress={clearAsyncStorage}>
            <Text style={styles.detailItem}>clear</Text>
          </TouchableOpacity> */}
        </View>
      );
    } else {
      return <View />;
    }
  };
  const setDetail = (symbol) => {
    const result = watchData.filter((item) => item.symbol === symbol);
    setCurDetail(() => result[0]);
  };

  const StockItem = (props) => {
    const { symbol, close, open } = props.item;
    const stockPer = Math.floor(((close - open) / open) * 100 * 100) / 100;
    return (
      <TouchableOpacity
        style={styles.stockItem}
        onPress={() => {
          setDetail(symbol);
        }}
      >
        <Text style={styles.stockItemSymbol}>{symbol}</Text>
        <Text style={styles.stockItemClose}>{close}</Text>
        <Text style={stockPer > 0 ? styles.stockPerGreen : styles.stockPerRed}>
          {stockPer}%
        </Text>
      </TouchableOpacity>
    );
  };
  function equar(a, b) {
    // avoid shaking
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
    if (!equar(localList, watchList)) {
      setLocalList(watchList);
      setWatchData([]);
      for (const symbol of watchList) {
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
            setWatchData((watchData) => [...watchData, data[0]]);
          })
          .catch((error) => {
            console.warn(error);
          });
      }
    }
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state
  }, [watchList]);

  return (
    <View style={styles.container}>
      <FlatList
        data={watchData}
        renderItem={StockItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      ></FlatList>

      <StockDetail />
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
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    height: scaleSize(55),
    padding: scaleSize(10),
    paddingBottom: scaleSize(3),
    paddingTop: scaleSize(3),
    backgroundColor: '#010101',
    justifyContent: 'center',
    borderBottomColor: '#585858',
  },
  stockItemSymbol: {
    textAlignVertical: 'center',
    fontSize: scaleSize(20),
    width: scaleSize(150),
    color: '#fff',
    textAlign: 'left',
    paddingRight: scaleSize(20),
  },
  stockItemClose: {
    fontSize: scaleSize(20),
    width: scaleSize(100),
    color: '#fff',
    textAlign: 'right',
    paddingRight: scaleSize(20),
  },
  stockPerGreen: {
    backgroundColor: '#4CDA64',
    fontSize: scaleSize(20),
    width: scaleSize(100),
    height: scaleSize(40),
    paddingTop: scaleSize(7),
    paddingRight: scaleSize(5),
    textAlign: 'right',
    borderRadius: 10,
    alignItems: 'center',
    color: '#fff',
    overflow: 'hidden',
  },
  stockPerRed: {
    backgroundColor: '#F53931',
    fontSize: scaleSize(20),
    width: scaleSize(100),
    height: scaleSize(40),
    paddingTop: scaleSize(7),
    paddingRight: scaleSize(5),
    textAlign: 'right',
    borderRadius: 10,
    alignItems: 'center',
    color: '#fff',
    overflow: 'hidden',
  },
  detail: {
    backgroundColor: '#222222',
    height: scaleSize(150),
    flexDirection: 'column',
  },
  detailName: {
    paddingTop: scaleSize(10),
    height: scaleSize(60),
    fontSize: scaleSize(30),
    textAlign: 'center',
    color: '#fff',
  },

  detailRow: {
    paddingTop: scaleSize(10),
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#474747',
  },
  detailTitle: {
    marginLeft: scaleSize(5),
    flex: 1,
    color: '#4F4F4F',
    textAlign: 'left',
    fontSize: scaleSize(15),
  },
  detailContent: {
    flex: 1,
    color: '#fff',
    fontSize: scaleSize(15),
    textAlign: 'right',
  },
});
