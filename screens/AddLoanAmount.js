import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList, ScrollView, Modal, ToastAndroid } from 'react-native';
import { useDispatch, connect } from 'react-redux';
import { FAB, Provider, TextInput, Button   } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import {Picker} from '@react-native-picker/picker';

Moment.locale('en');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
  },
  inputView: {
      // flex: 1,
      flexDirection: "column",
      marginTop: 20,
      marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 25,
    right: 0,
    bottom: 0,
    backgroundColor: '#ff4081',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 40
  },
  modalView: {
    margin: 20,
    // flex: 1,
    backgroundColor: "rgb(42, 32, 51)",
    borderRadius: 20,
    padding: 20,
    // alignItems: "center",
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 1,
    // elevation: 1,
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'column'
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#ffffff'
  },
  dropdownBtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 5,
    textAlign: 'left'
  }
});

const paytypecon = ["credit", "debit"]

export class AddLoanAmount extends Component {

  constructor(props) {
    super(props);

    this.flatListRef;

    this.state = {
      reason: "",
      amount: null,
      loanLoading: false,
      loanDisable: false,
      loantype: '',
    };
  }

  componentDidMount() {
    // this.fetchData();
  }

  // fetchData = () => {
  //   const {paymentTitle} = this.state;
  //   fetch(ser_url +
  //       '/payment_title.php', {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     }
  //   }).then((response) => response.json())
  //     .then((json) => {
  //       // console.log(json)
  //       if(json.Payment_Title.length > 0){
  //           this.setState({
  //             paymentTitle: json.Payment_Title
  //           })
  //         }else{
  //           this.setState({
  //             paymentTitle: []
  //           })

  //         }

  //     })
  //     .catch((error) => console.log(error))
  //     .finally(() => {
  //       this.setState({ isLoading: false });
  //     });
  // };

  addLoan = () => {
    const { loginDetails } = this.props;
    const { reason, amount, loantype } = this.state;
    
    if(reason == "" || !amount || loantype == ''){
      ToastAndroid.showWithGravity(
        "Please add all details",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }else{
      this.setState({loanLoading: true, loanDisable: true});
      
      fetch(ser_url +
        '/add_loan_cart.php?c_no=' +
        loginDetails.ID +
        '&reason=' +
        reason +
        '&loan_amount=' +
        amount +
        '&loan_type=' +
        loantype, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }).then((response) => response.json())
        .then((json) => {
            // console.log(JSON.stringify(json))
          if(json.Success == 0){
            ToastAndroid.showWithGravity(
              "Loan added successfully.",
              ToastAndroid.SHORT,
              ToastAndroid.TOP
            );
            this.props.navigation.replace('AddLoanAmount');
          }else{
            ToastAndroid.showWithGravity(
              "Loan adding failed.",
              ToastAndroid.SHORT,
              ToastAndroid.TOP
            );
          }
        })
        .catch((error) => alert(error))
        .finally(() => {
            this.setState({
                loanLoading: false, 
                loanDisable: false
              });
        });
    }
  }

  // renderPaymentTitle = () => {
  //   const {paymentTitle, paytype} = this.state
  //   return paymentTitle.map((product) => {
  //     if(product.payment_type == paytype){
  //       return <Picker.Item label={product.payment_name} value={product.id} />
  //     } 
  //   })
  // }

  render() {
    const { navigate } = this.props.navigation;
    const { loginDetails } = this.props;
    const { reason, amount, loanLoading, loanDisable, loantype } = this.state;
    return (
        <View style={styles.container}>
            {/* <Text style={styles.modalText}>Add Expense</Text> */}

            
            <Picker
              selectedValue={loantype}
              style={{
                        backgroundColor: '#fff', 
                        placeholderTextColor: '#fff',
                        marginBottom:10,
                    }}
              onValueChange={(itemValue, itemIndex) =>
              this.setState({loantype: itemValue})
              
              }>
                <Picker.Item label="Select Loan Type" value="" />
                <Picker.Item label="Credit" value="credit"/>
                <Picker.Item label="Debit" value="debit"/>
                
            </Picker>
            
           {/* <Picker
              selectedValue={reason}
              style={{
                        backgroundColor: '#fff', 
                        placeholderTextColor: '#fff',
                        marginBottom:10,
                    }}
              onValueChange={(itemValue, itemIndex) =>
              this.setState({reason: itemValue})
              }>
                <Picker.Item label="Select Payment Reason" value="" />
                {this.renderPaymentTitle()}
            </Picker>*/}

            <TextInput
                // mode='outlined'
                // style={styles.input}
                style={{backgroundColor: '#ffffff',marginBottom:'3%'}}
                theme={{ colors: { text: '#000000', placeholder: "#000000", background: "transparent" } }}
                onChangeText={value => this.setState({reason: value})}
                value={reason}
                label="Reason"
            />

            <TextInput
                // mode='outlined'
                // style={styles.input}
                style={{backgroundColor: '#ffffff'}}
                theme={{ colors: { text: '#000000', placeholder: "#000000", background: "transparent" } }}
                onChangeText={value => this.setState({amount: value})}
                value={amount}
                label="Amount"
                keyboardType='number-pad'
            />
            <Button mode="contained" loading={loanLoading} disabled={loanDisable} onPress={() => this.addLoan()} style={{marginTop: 10}}>Submit</Button>
        </View>
    )
  }
}


const mapStateToProps = state => ({
  loginDetails: state.loginDetails
});


export default connect(mapStateToProps, {})(AddLoanAmount)