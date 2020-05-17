import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  TextInput,
  FlatList,
  Text /* include other react native components here as needed */,
} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)
const SearchBar = (props) => {
  const { setSearchInput } = props;

  function debounce(fn, delay) {
    let timer = null; //借助闭包
    return function () {
      let args = arguments;
      if (timer) {
        clearTimeout(timer); //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
        timer = setTimeout(fn(...args), delay);
      } else {
        timer = setTimeout(fn(...args), delay); // 进入该分支说明当前并没有在计时，那么就开始一个计时
      }
    };
  }
  const onChange = debounce((text) => {
    console.log(text);
    if (text) {
      setSearchInput(text);
    } else {
      setSearchInput(null);
    }
  }, 200);
  return (
    <View>
      <Text style={{ fontSize: 15, color: 'white' }}>
        Type a company name or stock symbol:
      </Text>
      <View style={styles.searchBar}>
        <Ionicons
          style={{ padding: 7 }}
          name='ios-search'
          size={20}
          color='white'
        />
        <TextInput
          style={styles.input}
          onChangeText={onChange}
          placeholder={'Search'}
          defaultValue={''}
          autoCorrect={true}
          autoFocus={true}
        />
      </View>
    </View>
  );
};
export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]);
  const [dataDisplayed, setDataDisplayed] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // can put more code here

  const SearchItem = (props) => {
    const { symbol, name } = props.item;
    return (
      <TouchableOpacity
        onPress={() => {
          addToWatchlist(symbol);
          navigation.navigate('Stocks');
        }}
      >
        <Text style={styles.item}>{symbol}</Text>
        <Text style={styles.item}>{name}</Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
    fetch(`${ServerURL}/all`)
      .then((data) => data.json())
      .then((data) =>
        data.map((item) => {
          return { symbol: item.symbol, name: item.name };
        })
      )
      .then((data) => setState(data));
  }, []);
  useEffect(() => {
    if (searchInput !== null) {
      const resultFromSymbol = state.filter(
        (item) =>
          item.symbol.includes(searchInput) || item.name.includes(searchInput)
      );
      setDataDisplayed(resultFromSymbol);
    } else {
      setDataDisplayed([]);
    }
  }, [searchInput]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* FixMe: add children here! */}
        <SearchBar setSearchInput={setSearchInput}></SearchBar>
        <FlatList
          data={dataDisplayed}
          renderItem={SearchItem}
          keyExtractor={(item) => item.name}
        ></FlatList>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    color: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    paddingTop: scaleSize(10),
    paddingRight: scaleSize(10),
    paddingBottom: scaleSize(10),
    paddingLeft: scaleSize(0),
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  item: {
    color: '#fff',
    height: 30,
  },
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
});
