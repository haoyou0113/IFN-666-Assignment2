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

const SearchBar = (props) => {
  const { setSearchInput } = props;

  function debounce(fn, delay) {
    let timer = null;
    return function () {
      let args = arguments;
      if (timer) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn(...args);
        }, delay);
      } else {
        timer = setTimeout(function () {
          fn(...args);
        }, delay);
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
      <Text style={styles.searchBarTitle}>
        Type a company name or stock symbol:
      </Text>
      <View style={styles.searchBar}>
        <Ionicons
          style={{ padding: 7 }}
          name='ios-search'
          size={20}
          color='#fff'
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

  const SearchItem = (props) => {
    const { symbol, name } = props.item;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          addToWatchlist(symbol);
          navigation.navigate('Stocks');
        }}
      >
        <Text style={styles.item1}>{symbol}</Text>
        <Text style={styles.item2}>{name}</Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
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
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    height: scaleSize(40),
  },
  searchBarTitle: {
    marginTop: scaleSize(20),
    height: scaleSize(23),
    fontSize: scaleSize(15),
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    fontSize: scaleSize(20),
    flex: 1,
    paddingTop: scaleSize(10),
    paddingRight: scaleSize(10),
    paddingBottom: scaleSize(10),
    paddingLeft: scaleSize(0),
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  itemContainer: {
    paddingTop: scaleSize(5),
    paddingLeft: scaleSize(5),
    height: scaleSize(55),
    borderStyle: 'solid',
    borderBottomColor: '#7A7A7A',
    borderBottomWidth: scaleSize(0.5),
  },
  item1: {
    color: '#fff',
    fontSize: scaleSize(20),
  },
  item2: {
    color: '#fff',
    fontSize: scaleSize(15),
  },
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
});
