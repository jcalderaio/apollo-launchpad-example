import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Query } from "react-apollo";
import gql from "graphql-tag";

export default class ExchangeRates extends React.Component {
  renderItem = ({item, separators}) => (
    <Text style={styles.textStyle}>{item.currency} : {item.rate}</Text>
  )

  renderSeparator = () => {
    return (
        <View
            style={{
              height: Platform.OS === 'ios' ? 1 : 0.5,
              width: '100%',
              backgroundColor: 'white',
            }}
        />
    )
  }

  render() {
    return (
      <Query
        query={gql`
          {
            rates(currency: "USD") {
              currency
              rate
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <ScrollView contentContainerStyle={styles.container}>
                <ActivityIndicator style={{ color: 'white' }} />
              </ScrollView>
            )
          }
          if (error) {
            return (
              <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.textStyle}>{error}</Text>
              </ScrollView>
            )
          }

          let rates = []
          if (!loading && !error) {
              rates = data.rates
          }

         if (rates.length > 0) {
          return (
            <ScrollView contentContainerStyle={styles.container}>
              <FlatList 
                style={{ paddingTop: 100 }}
                data={rates}
                keyExtractor={item => item.currency}
                renderItem={this.renderItem}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </ScrollView>
          )
         } else {
           return (
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.textStyle}>Nothing to Show!</Text>
            </ScrollView>
           )
         }
        }}
      </Query>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: 'white'
  }
});


/*
const ExchangeRates = () => (
  <Query
    query={gql`
      {
        rates(currency: "USD") {
          currency
          rate
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.rates.map(({ currency, rate }) => (
        <div key={currency}>
          <p>{`${currency}: ${rate}`}</p>
        </div>
      ));
    }}
  </Query>
);
*/
