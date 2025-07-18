import React, { Component } from 'react';
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
  ToastAndroid 
} from 'react-native';
import { useDispatch, connect } from 'react-redux';
import { FAB, Provider, TextInput, Button   } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {logout, addProductList} from '../redux/reducer';
import {RadioButton, Searchbar} from 'react-native-paper';

Moment.locale('en');

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
  },
  productlist: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    // marginHorizontal: 5
  },
  prodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  prodMrp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  inText: {
    color: '#ffffff',
    fontSize: 16,
  }
});

export class ExpenseList extends Component {

  constructor(props) {
    super(props);

    this.flatListRef;

    this.state = {
      productList: [],
      isLoading: true,
      modalVisible: false,
      reason: "",
      amount: null,
      expensLoading: false,
      expenseDisable: false,
      selDate: '',
      pickerVisible: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {

    const { loginDetails } = this.props;
    //const { selDate } = this.state;

    fetch(
      ser_url +
      '/expenditure_list.php?company_no=' + 
      loginDetails.ID + 
      '&type=' + 
      loginDetails.Type + 
      '&e_date=' + 
      Moment().format('yyyy-MM-DD'), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((json) => {
        if(json.Expenditure_List.length > 0){
          this.setState({
            productList: json.Expenditure_List
          })
          this.props.addProductList(json.Expenditure_List);
        }else{
          this.setState({
            productList: []
          })
          this.props.addProductList([]);
        }
      })
      .catch((error) => alert(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  rmItem = (rmId) => {
    fetch(
      ser_url +
      '/expenditure_delete.php?e_id=' +
      rmId, 
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((json) => {
        this.fetchData();
      })
      .catch((error) => alert(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  submitExpense = () => {
    const { loginDetails } = this.props;
    const { selDate } = this.state;

    if (!selDate) {
      ToastAndroid.showWithGravity(
        "Please add date",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    } else {

      fetch(
        ser_url +
        '/expenditure.php?company_no=' +
        loginDetails.ID +
        '&e_date=' +
        Moment(selDate).format('yyyy-MM-DD') +
        '&type=' +
        loginDetails.Type, 
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
              "Final expense amount submitted successfully.",
              ToastAndroid.SHORT,
              ToastAndroid.TOP
            );
            this.props.navigation.goBack();
          }else{
            ToastAndroid.showWithGravity(
              "Failed, try again.",
              ToastAndroid.SHORT,
              ToastAndroid.TOP
            );
          }
        })
        .catch((error) => alert(error))
        .finally(() => {
          // this.setState({ isLoading: false });
        });
    }
  }

  getTotalAmount = (prodListData) => {
    let tamt = 0;
    prodListData.map((item) => {
      tamt = tamt + parseFloat(item.amount);
    });

    return tamt;
  }

  handleSearch = text => {
    const formattedQuery = text.toLowerCase();

    let filteredData = this.props.rproductList.filter(function (item) {
      return item.title.toLowerCase().includes(formattedQuery);
    });

    this.setState({filteredData: filteredData});
    // const data = filter(this.state.fullData, user => {
    //   return this.contains(user, formattedQuery)
    // })
    // this.setState({ data, query: text })
  };

  renderHeader = () => (
    <View
      style={{
        // backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* <Input
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={this.handleSearch}
        status='info'
        placeholder='Search'
        style={{
          borderRadius: 25,
          borderColor: '#333',
          backgroundColor: '#fff'
        }}
        textStyle={{ color: '#000' }}
      /> */}
      <Searchbar
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={this.handleSearch}
        status="info"
        placeholder="Search"
        style={{
          borderRadius: 25,
          borderColor: '#333',
          backgroundColor: '#fff',
        }}
        // onChangeText={(value) => this.setState({searchQuery: value})}
        // value={searchQuery}
      />
    </View>
  );


  render() {
    const { navigate } = this.props.navigation;
    const { loginDetails, rproductList } = this.props;
    const { 
      productList, 
      isLoading, 
      modalVisible, 
      reason, 
      amount, 
      expensLoading, 
      expenseDisable,
      selDate,
      pickerVisible,  
    } = this.state;
    if(isLoading){
      return(
        <View style={{paddingVertical: 20}}
        >
          <ActivityIndicator animating size="large" color="#0000ff" />
        </View>
      )
    }
    if(productList.length == 0){
      return(
        <View style={{paddingVertical: 50,}}
        >
          <Text style={{alignSelf: 'center', fontSize: 16, color: '#ffffff'}}>No expenditure Added</Text>
        </View>
      )
    }
    return (
        <View style={styles.container}>

          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => this.setState({pickerVisible: true})}>
            <Text style={styles.inText}>
              Date: {selDate ? Moment(selDate).format('Do MMMM YYYY') : '    '}
            </Text>
            <Icon
              name="pencil"
              size={20}
              color={'#ffffff'}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
          
          <View style={styles.typDvdr}></View>
          
          <DatePicker
            modal
            title="Select Date"
            open={pickerVisible}
            date={selDate ? selDate : new Date()}
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

            <FlatList
              data={
                this.state.filteredData && this.state.filteredData.length > 0
                  ? this.state.filteredData
                  : rproductList
              }
              initialNumToRender={10}
              ListHeaderComponent={this.renderHeader}
              renderItem={({item, index}) => (
                <View style={styles.productlist}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{width:'10%'}}>
                      <Text style={{color: '#ffffff',fontWeight:'bold'}}>
                        Sr No
                      </Text>
                      <Text style={{color: '#ffffff',fontWeight:'bold'}}>
                        {index+1}
                      </Text>
                    </View>
                    <View style={{width:'90%'}}>
                      <Text style={styles.prodName}>{item.title}</Text>
                      <Text style={styles.prodMrp}>{'\u20B9'}{item.amount}</Text>
                      <View style={{flexDirection: 'row', marginVertical: 5,}}>
                        <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', padding: 5,borderRadius: 5, flexDirection: 'row'}} onPress={() => 
                          Alert.alert(
                            "Remove Item",
                            "Do you want to remove item from list?",
                            [
                              {
                                text: "Yes",
                                onPress: () => this.rmItem(item.id),
                              },
                              {
                                text: "No",
                                style: "cancel"
                              }
                            ]
                          )}><Icon name="trash" size={20} color={'#ffffff'}/><Text style={{fontSize: 16, color: 'white'}}>Remove</Text></TouchableOpacity>
                      </View>
                    </View>
                  </View>
                    
                </View>
                )}
                keyExtractor={(item, index) => 'sale'+index}
            />

            {/* {productList.length > 0 ? <View style={{bottom: 0, flexDirection: 'column'}}><Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>Total Amount - {'\u20B9'}{this.getTotalAmount(productList)}</Text></View> : null} */}

            {productList.length > 0 ? <View style={{bottom: 0, flexDirection: 'column'}}><Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>Total Amount - {'\u20B9'}{(this.getTotalAmount(productList)).toFixed(2)}</Text><TouchableOpacity style={{backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', padding: 15,borderRadius: 5,}} onPress={() => Alert.alert(
            "Final Submit",
            "Are you sure you want to submit final expense amount?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Yes", onPress: () => this.submitExpense() }
            ]
          )}><Text style={{fontSize: 20, color: 'white'}}>Final Submit</Text></TouchableOpacity></View> : null}
        </View>
    )
  }
}

const mapStateToProps = state => ({
  loginDetails: state.loginDetails,
  rproductList: state.productList,
});


export default connect(mapStateToProps, {addProductList})(ExpenseList);