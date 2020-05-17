import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  TextInput,
  ScrollView,
  FlatList,
  Text /* include other react native components here as needed */,
} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([
    {
      /* FixMe: initial state here */
      symbol: 'symbol',
      name: 'name',
    },
  ]);
  console.log(state);
  // can put more code here
  const SearchBar = () => {
    return (
      <View>
        <Text style={styles.text}>Please </Text>
        <TextInput style={styles.input} defaultValue='You can type in me' />
      </View>
    );
  };
  const SearchItem = (props) => {
    const { symbol, name } = props.item;
    return (
      <TouchableOpacity
        onPress={() => {
          addList(item.symbol);
          navigation.navigate('Stocks');
        }}
      >
        <Text style={styles.item}>{symbol}</Text>
        <Text style={styles.item}>{name}</Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    const URL = 'http://131.181.190.87:3001/all';
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* FixMe: add children here! */}
        <SearchBar></SearchBar>
        {/* <ScrollView>
          {state.map((item) => (
            <SearchItem item={item} key={item.name} />
          ))}
        </ScrollView> */}
        <FlatList
          data={state}
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
  input: {
    color: '#fff',
    height: 40,
  },
  item: {
    color: '#fff',
    height: 30,
  },
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
});
