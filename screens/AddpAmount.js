import React, { Component, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Modal,
  ToastAndroid,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import {FAB, Provider, TextInput, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';

Moment.locale('en');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputView: {
    // flex: 1,
    flexDirection: 'column',
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
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: "center",
    marginTop: 40,
  },
  modalView: {
    margin: 20,
    // flex: 1,
    backgroundColor: 'rgb(42, 32, 51)',
    borderRadius: 20,
    padding: 20,
    // alignItems: "center",
    shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 1,
    // elevation: 1,
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'column',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#ffffff',
  },
  dropdownBtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 5,
    textAlign: 'left'
  },
  picker_align:{
    position: "relative",
    top: 5,
    
  },
});

const placeholder_expenditure = {
  label:'Select Expenditure Reason',
  value:'',
}


export class Expense extends Component {
  constructor(props) {
    super(props);

    this.flatListRef;

    this.state = {
      shareHolderName: [],
      isLoading: true,
      modalVisible: false,
      share_holder_id: '',
      reason: '',
      amount: null,
      pAmountLoading: false,
      pAmountDisable: false,
      selDate: new Date(),
      pickerVisible: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const {shareHolderName} = this.state;
    fetch(ser_url +
        '/shareHolder_Name.php', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((json) => {
        //console.log(json.Expenditure_Title)
        if(json.shareHolder_Name.length > 0){
            this.setState({
              shareHolderName: json.shareHolder_Name
            })
            this.rendershareHolderName();
          }else{
            this.setState({
              shareHolderName: []
            })

          }

      })
      .catch((error) => alert(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  rendershareHolderName = () => {
    const {shareHolderName} = this.state;
    return shareHolderName.map((product) => {
      return <Picker.Item label={product.name} value={product.id} />
    })
  }

  addpAmount = () => {
    const {loginDetails} = this.props;
    const {reason, amount, selDate} = this.state;
    if (reason == '' || amount == '') {
      ToastAndroid.showWithGravity(
        'Please add all the details',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else {
      this.setState({pAmountLoading: true, pAmountDisable: true});

      fetch(
        ser_url +
          '/partner_amount_cart.php?c_no=' +
          loginDetails.ID +
          // '&share_holder_id=' +
          // share_holder_id +
          '&reason=' +
          reason +
          '&amount=' +
          amount +
          '&pA_date=' +
          Moment(selDate).format('yyyy-MM-DD'),
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
        .then(response => response.json())
        .then(json => {
          // console.log(JSON.stringify(json))
          if (json.Success == 0) {
            this.setState({
              modalVisible: false,
              pAmountLoading: false,
              pAmountDisable: false,
            });
            ToastAndroid.showWithGravity(
              'Partner Amount added successfully.',
              ToastAndroid.SHORT,
              ToastAndroid.TOP,
            );
            this.props.navigation.replace('AddpAmount');
          } else {
            this.setState({
              pAmountLoading: false,
              pAmountDisable: false,
            });
            ToastAndroid.showWithGravity(
              'Partner Amount adding failed.',
              ToastAndroid.SHORT,
              ToastAndroid.TOP,
            );
          }
        })
        .catch(error => alert(error))
        .finally(() => {
          this.setState({isLoading: false});
        });
    }
  };

  render() {
    const {navigate} = this.props.navigation;
    const {loginDetails} = this.props;
    const {
      expenditureTitle,
      isLoading,
      modalVisible,
      shareHolderName,
      share_holder_id,
      reason,
      amount,
      pAmountLoading,
      pAmountDisable,
      selDate,
      pickerVisible,
    } = this.state;
    if (isLoading) {
      return (
        <View style={{paddingVertical: 20}}>
          <ActivityIndicator animating size="large" color="#0000ff" />
        </View>
      );
    }
    // if(productList.length == 0){
    //   return(
    //     <View style={{paddingVertical: 50,}}
    //     >
    //       <Text style={{alignSelf: 'center', fontSize: 16}}>No expense Added</Text>
    //     </View>
    //   )
    // }
    return (
      <Provider>
        <View style={styles.container}>

          <Text style={styles.modalText}>Add Partner Amount</Text>
          {/*<Picker
            selectedValue={share_holder_id}
            style={{
                      backgroundColor: '#fff', 
                      placeholderTextColor: '#fff',
                      marginBottom:10,
                  }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({share_holder_id: itemValue})
            }>
              <Picker.Item label="Select Share Holder Name" value="" />
              {this.rendershareHolderName()}
              
          </Picker>*/}

          <TextInput
            // mode='outlined'
            // style={styles.input}
            style={{backgroundColor: '#ffffff',marginBottom:'2%'}}
            theme={{
              colors: {
                text: '#000000',
                placeholder: '#000000',
                background: 'transparent',
              },
            }}
            onChangeText={value => this.setState({reason: value})}
            value={reason}
            label="Reason"
          />

          <TextInput
            // mode='outlined'
            // style={styles.input}
            style={{backgroundColor: '#ffffff'}}
            theme={{
              colors: {
                text: '#000000',
                placeholder: '#000000',
                background: 'transparent',
              },
            }}
            onChangeText={value => this.setState({amount: value})}
            value={amount}
            label="Amount"
            keyboardType="number-pad"
          />
          {/* <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => this.setState({pickerVisible: true})}>
            <Text style={styles.inText}>
              Date: {Moment(selDate).format('Do MMMM YYYY')}
            </Text>
            <Icon
              name="pencil"
              size={20}
              color={'#ffffff'}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
          <View style={styles.typDvdr}></View> */}
          <DatePicker
            modal
            title="Select Date"
            open={pickerVisible}
            date={selDate}
            maximumDate={new Date()}
            mode="date"
            onConfirm={date => {
              this.setState({
                pickerVisible: false,
                selDate: date,
              });
            }}
            onCancel={() => {
              this.setState({
                pickerVisible: false,
              });
            }}
          />
          <Button
            mode="contained"
            loading={pAmountLoading}
            disabled={pAmountDisable}
            onPress={() => this.addpAmount()}
            style={{marginTop: 10}}>
            Submit
          </Button>
          {/* <FAB
                    icon="plus"
                    style={styles.fab}
                    color="#ffffff"
                    animated={true}
                    disabled={false}
                    visible={true}
                    onPress={() => this.setState({modalVisible: true})}
                /> */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: false});
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.modalText}>Add Partner Amount</Text>
                  <Icon
                    name="close"
                    size={30}
                    color={'#ffffff'}
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => this.setState({modalVisible: false})}
                  />
                </View>

                <TextInput
                  mode="outlined"
                  // style={styles.input}
                  onChangeText={value => this.setState({share_holder_id: value})}
                  value={share_holder_id}
                  label="Share Holder"
                />

                <TextInput
                  mode="outlined"
                  // style={styles.input}
                  onChangeText={value => this.setState({reason: value})}
                  value={reason}
                  label="Reason"
                />
                <TextInput
                  mode="outlined"
                  // style={styles.input}
                  onChangeText={value => this.setState({amount: value})}
                  value={amount}
                  label="Amount"
                  keyboardType="number-pad"
                />
                <Button
                  mode="contained"
                  loading={pAmountLoading}
                  disabled={pAmountDisable}
                  onPress={() => this.addpAmount()}
                  style={{marginTop: 10}}>
                  Submit
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  loginDetails: state.loginDetails,
});

export default connect(mapStateToProps, {})(Expense);
