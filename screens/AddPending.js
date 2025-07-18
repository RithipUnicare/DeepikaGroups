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
  }
});

export class AddPending extends Component {

  constructor(props) {
    super(props);

    this.flatListRef;

    this.state = {
      pendingTitle: [],
      reason: "",
      amount: null,
      selDate:new Date(),
      pendingLoading: false,
      pendingDisable: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const {pendingTitle} = this.state;
    fetch(ser_url +
        '/pending_title.php', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((json) => {
        //console.log(json.Pending_Title)
        if(json.Pending_Title.length > 0){
            this.setState({
              pendingTitle: json.Pending_Title
            })
            this.renderPendingTitle();
          }else{
            this.setState({
              pendingTitle: []
            })

          }

      })
      .catch((error) => alert(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  renderPendingTitle = () => {
    const {pendingTitle} = this.state;
    return pendingTitle.map((product) => {
      return <Picker.Item label={product.pending_name} value={product.id} />
    })
  }

  addPending = () => {
    const { loginDetails } = this.props;
    const { reason, amount, selDate } = this.state;
    // alert(ser_url+'/add_pending_cart.php?company_no='+loginDetails.ID+'&type='+loginDetails.Type+'&reason='+reason+'&amount='+amount+'&e_date='+ Moment().format('yyyy-MM-DD')+'&status=unpaid');
    if(reason == "" || !amount){
      ToastAndroid.showWithGravity(
        "Please add both details",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }else{
      this.setState({expensLoading: true, expenseDisable: true});
    
      fetch(
        ser_url +
        '/app_pending_cart.php?company_no=' +
        loginDetails.ID +
        '&type=' +
        loginDetails.Type +
        '&reason=' +
        reason +
        '&amount=' + 
        amount +
        '&e_date=' + 
        Moment().format('yyyy-MM-DD') +
        '&status=unpaid', 
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }).then((response) => response.json())
        .then((json) => {
          if(json.Success == 0){
            ToastAndroid.showWithGravity(
              "Pending amount added successfully.",
              ToastAndroid.SHORT,
              ToastAndroid.TOP
            );
            this.props.navigation.replace('AddPending');
          }else{
            ToastAndroid.showWithGravity(
              "Pending amount adding failed.",
              ToastAndroid.SHORT,
              ToastAndroid.TOP
            );
          }
        })
        .catch((error) => alert(error))
        .finally(() => {
            this.setState({
                pendingLoading: false, 
                pendingDisable: false
              });
        });
    }
    
  } 


  render() {
    const { navigate } = this.props.navigation;
    const { loginDetails } = this.props;
    const { 
      reason, 
      amount, 
      pendingLoading, 
      pendingDisable, 
      pendingTitle 
    } = this.state;
    return (
        <Provider>
            <View style={styles.container}>
                {/* <Text style={styles.modalText}>Add Expense</Text> */}
                
                <Picker
                  selectedValue={reason}
                  style={{
                            backgroundColor: '#fff', 
                            placeholderTextColor: '#fff',
                            marginBottom:10,
                        }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({reason: itemValue})
                  }>
                    <Picker.Item label="Select Pending Reason" value="" />
                    {this.renderPendingTitle()}
                    
                </Picker>

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
                <Button mode="contained" loading={pendingLoading} disabled={pendingDisable} onPress={() => this.addPending()} style={{marginTop: 10}}>Submit</Button>
            </View>
        </Provider>
    )
  }
}


const mapStateToProps = state => ({
  loginDetails: state.loginDetails
});


export default connect(mapStateToProps, {})(AddPending)