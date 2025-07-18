import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, Button, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useDispatch, connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../redux/reducer';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
  },
  subContainer: {
      flexDirection: 'column',
  },
  inputView: {
      // flex: 1,
      flexDirection: "column",
      marginTop: 20,
      marginBottom: 20,
  },
  input: {
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 10,
      marginVertical: 5,
      marginHorizontal: 20,
      paddingHorizontal: 10,
      textAlign: 'center',
      fontSize: 16
  },
  shopName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      // textAlign: 'center',
  },
  codeName: {
    fontSize: 16,
    marginBottom: 5,
    // textAlign: 'center',
  },
  btn: {
      marginHorizontal: 20,
      backgroundColor: '#841584',
      paddingHorizontal: 5,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginTop: 20,
      marginBottom: 20,
  },
  actionBlock: {
    // flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  optionBlock: {
    width: '40%',
    height: 100,
    backgroundColor: '#841584',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  logout: {
    marginHorizontal: 20,
    backgroundColor: '#08a8a6',
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    // bottom: 0,
  },
  shoplist: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    // marginHorizontal: 5
  }
});

const removeLoginLocal = async () => {
  try {
    await AsyncStorage.removeItem('loginData');
  } catch (err) {
    
  }
};

export class Shop extends Component {

  constructor(props) {
    super(props);

    this.flatListRef;

    this.state = {
      
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    const { loginDetails,  } = this.props;
    const { details } = this.props.route.params;
    return (
        <View style={styles.container}>
          <View style={{paddingHorizontal: 10,}}>
            <Text style={styles.shopName}>{details.name}</Text>
            <Text style={styles.codeName}>Shop Number - {details.shop_no}</Text>
            {/* <Text style={styles.codeName}>Shop Type - {details.Type}</Text> */}
            <Text style={styles.codeName}>Location - {details.location}</Text>
          </View>
          
          <View style={styles.actionBlock}>
            <TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Product', {shop: details})}>
              <Text style={styles.optionName}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Sales', {shop: details})}>
              <Text style={styles.optionName}>Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Order', {shop: details})}>
              <Text style={styles.optionName}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Stock', {shop: details})}>
              <Text style={styles.optionName}>Stock</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logout}>
            <Text style={styles.optionName}>History</Text>
          </TouchableOpacity>
        </View>
    )
  }
}


const mapStateToProps = state => ({
  loginDetails: state.loginDetails
});


export default connect(mapStateToProps, {logout})(Shop)