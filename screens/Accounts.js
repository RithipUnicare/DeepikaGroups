import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
// import { Text } from 'react-native-paper';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';

Moment.locale('en');

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
    flexDirection: 'column',
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
    fontSize: 16,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffffff',
    // textAlign: 'center',
  },
  codeName: {
    fontSize: 16,
    marginBottom: 5,
    // textAlign: 'center',
    color: '#ffffff',
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
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  optionBlock: {
    flexDirection: 'column',
    width: '40%',
    height: 100,
    backgroundColor: '#841584',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    padding: 5,
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
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
    bottom: 0,
  },
  shoplist: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    // marginHorizontal: 5
  },
  typDvdr: {
    height: 1,
    width: '100%',
    backgroundColor: '#909090',
    marginBottom: 10,
  },
  inText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      openingBalance: 0,
      godownSale: [],
      counterSale: [],
      expenseList: [],
      remainingAmount: 0,
      selDate: new Date(),
      pickerVisible: false,
      totalCr: 0,
      totalDr: 0,
    };
  }

  componentDidMount() {
    this.fetchOpeningBalance();
    this.fetchGodownSales();
    this.fetchCounterSales();
    this.fetchExpenseList();
    this.fetchCreditDebit();
  }

  fetchOpeningBalance = () => {
    const {loginDetails} = this.props;
    const {selDate} = this.state;
    fetch(
      ser_url +
        '/get_opening_balance.php?c_no=' +
        loginDetails.ID +
        '&type=' +
        loginDetails.Type +
        '&c_date=' +
        Moment(selDate).format('yyyy-MM-D'),
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
        // alert(JSON.stringify(json))
        if (json.opening_balance_res.length > 0) {
          console.log(json.opening_balance_res[0].opening_balance)
          this.setState({
            openingBalance: json.opening_balance_res[0].opening_balance,
          });
        }
      })
      .catch(error => alert(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
  };

  fetchGodownSales = () => {
    const {loginDetails} = this.props;
    const {selDate} = this.state;
    fetch(
      ser_url +
        '/sale_report_list.php?company_no=' +
        loginDetails.ID +
        '&type=' +
        loginDetails.Type +
        '&c_date=' +
        Moment(selDate).format('yyyy-MM-D') +
        '&f_date=' +
        Moment(selDate).format('yyyy-MM-DD') +
        '&t_date=' +
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
        if (json.Sale_Report_List.length > 0) {
          // let tamt = 0;
          // json.Sale_Report_List.map((item) => {
          //     tamt = tamt + parseFloat(item.t_price);
          // });

          this.setState({
            godownSale: json.Sale_Report_List,
          });
        } else {
          this.setState({
            godownSale: [],
          });
        }
      })
      .catch(error => alert(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
  };

  fetchCounterSales = () => {
    const {loginDetails} = this.props;
    const {shop} = this.props.route.params;
    const {selDate} = this.state;
    fetch(
      ser_url +
        '/sale_report_list.php?company_no=' +
        shop.counter_id +
        '&type=Counter&c_date=' +
        Moment(selDate).format('yyyy-MM-D') +
        '&f_date=' +
        Moment(selDate).format('yyyy-MM-DD') +
        '&t_date=' +
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
        if (json.Sale_Report_List.length > 0) {
          // let tamt = 0;
          // json.Sale_Report_List.map((item) => {
          //     tamt = tamt + parseFloat(item.t_price);
          // });

          this.setState({
            counterSale: json.Sale_Report_List,
          });
        } else {
          this.setState({
            counterSale: [],
          });
        }
      })
      .catch(error => alert(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
  };

  fetchExpenseList = () => {
    const {loginDetails} = this.props;
    const {selDate} = this.state;
    fetch(
      ser_url +
        '/get_expenditure_final.php?company_no=' +
        loginDetails.ID +
        '&type=' +
        loginDetails.Type +
        '&e_date=' +
        Moment(selDate).format('yyyy-MM-D') +
        '&f_date=' +
        Moment(selDate).format('yyyy-MM-DD') +
        '&t_date=' +
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
        if (json.Expenditure_List.length > 0) {
          // let tamt = 0;
          // json.Expenditure_List.map((item) => {
          //     tamt = tamt + parseFloat(item.amount);
          // });
          this.setState({
            expenseList: json.Expenditure_List,
          });
        } else {
          this.setState({
            expenseList: [],
          });
        }
      })
      .catch(error => alert(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
  };

  fetchCreditDebit = () => {
    const {loginDetails} = this.props;
    const {selDate, toDate} = this.state;
    // alert(ser_url+'/purchase.php?company_no='+loginDetails.ID+'&type='+loginDetails.Type+'&p_date='+ Moment().format('yyyy-MM-DD'))
  

      fetch(
        ser_url +
          '/get_payment_final.php?company_id=' +
          loginDetails.ID +
          '&type=' +
          loginDetails.Type +
          '&payment_date=' +
          Moment(selDate).format('yyyy-MM-DD') +
          '&f_date=' +
          Moment(selDate).format('yyyy-MM-DD') +
          '&t_date=' +
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
        // console.log(JSON.stringify(json));
        if (json.payment_list.length > 0) {
          this.setState({
            productList: json.payment_list,
          });
          let tcr = 0;
          let tdr = 0;
          json.payment_list.map(item => {
            if (item.payment_type == 'credit') {
              tcr = tcr + parseFloat(item.payment_amount);
            }
            if (item.payment_type == 'debit') {
              tdr = tdr + parseFloat(item.payment_amount);
            }
          });
          this.setState({
            totalCr: tcr,
            totalDr: tdr,
          });
        } else {
          this.setState({
            productList: [],
          });
        }
      })
      .catch(error => alert(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
    
  };

  getTotalAmount = prodListData => {
    let tamt = 0;
    prodListData.map(item => {
      tamt = tamt + parseFloat(item.t_price);
    });

    return tamt;
  };

  getExpenseAmount = prodListData => {
    let tamt = 0;
    prodListData.map(item => {
      tamt = tamt + parseFloat(item.amount);
    });

    return tamt;
  };

  refetchData = () => {
    this.fetchOpeningBalance();
    this.fetchGodownSales();
    this.fetchCounterSales();
    this.fetchExpenseList();
    this.fetchCreditDebit();
  };

  render() {
    const {navigate} = this.props.navigation;
    const {loginDetails} = this.props;
    const {
      selDate,
      pickerVisible,
      godownSale,
      counterSale,
      expenseList,
      openingBalance,
      totalDr,
      totalCr,
    } = this.state;
    return (
      <ScrollView style={styles.container}>
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
            this.setState(
              {
                pickerVisible: false,
                selDate: date,
              },
              () => {
                this.refetchData();
              },
            );
          }}
          onCancel={() => {
            this.setState({
              pickerVisible: false,
            });
          }}
        />
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.inText}>
            Opening Balance: {'\u20B9'}
            {openingBalance}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() =>
            navigate('SalesHistory', {
              selDate: Moment(selDate).format('yyyy-MM-DD'),
            })
          }>
          <Text style={styles.inText}>
            Godown Sale: {'\u20B9'}
            {this.getTotalAmount(godownSale).toFixed(2)}
          </Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={'#ffffff'}
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() =>
            navigate('CounterSalesHistory', {
              shop: this.props.route.params.shop,
              selDate: Moment(selDate).format('yyyy-MM-DD'),
            })
          }>
          <Text style={styles.inText}>
            + Counter Sale: {'\u20B9'}
            {this.getTotalAmount(counterSale).toFixed(2)}
          </Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={'#ffffff'}
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>

        <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() =>
                  navigate('CrDrHistory', {
                    shop: this.props.route.params.shop,
                    selDate: Moment(selDate).format('yyyy-MM-DD'),
                  })
                }>
                <Text style={styles.inText}>
                  + Credit Amount  :   {'\u20B9'}
                  {this.getTotalAmount(totalCr).toFixed(2)}
                </Text>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={'#ffffff'}
                  style={{marginLeft: 10}}
                />
              </TouchableOpacity>
        <View style={styles.typDvdr}></View>

        <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  marginVertical: 10,
                  flexDirection: 'row',
                }}>
                <Text style={styles.inText}>
                  = Total  :   {'\u20B9'}

                  {(
                    parseFloat(openingBalance) +
                    (this.getTotalAmount(godownSale) +
                      this.getTotalAmount(counterSale) +
                      this.getTotalAmount(totalCr)) 
                  ).toFixed(2)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() =>
                  navigate('CrDrHistory', {
                    shop: this.props.route.params.shop,
                    selDate: Moment(selDate).format('yyyy-MM-DD'),
                  })
                }>
                <Text style={styles.inText}>
                  Debit Amount  :   {'\u20B9'}
                  {this.getExpenseAmount(totalDr).toFixed(2)}
                </Text>
                <Icon
                  name="chevron-forward"
                  size={20}
                  color={'#ffffff'}
                  style={{marginLeft: 10}}
                />
              </TouchableOpacity>


        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
          }}
          onPress={() =>
            navigate('ExpenseHistory', {
              shop: this.props.route.params.shop,
              selDate: Moment(selDate).format('yyyy-MM-DD'),
            })
          }>
          <Text style={styles.inText}>
            - Expenditure: {'\u20B9'}
            {this.getExpenseAmount(expenseList).toFixed(2)}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{paddingHorizontal: 10, marginVertical: 10, flexDirection: 'row'}} onPress={() => navigate('ExpenseList', {shop: this.props.route.params.shop, selDate: Moment(selDate).format('yyyy-MM-DD')})}>
                <Text style={styles.inText}>Expenditure: {this.getExpenseAmount(expenseList).toFixed(2)}</Text>
            </TouchableOpacity> */}
        <View style={styles.typDvdr}></View>
        <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  marginVertical: 10,
                  flexDirection: 'row',
                }}>
                <Text style={styles.inText}>
                  = Final Total  :   {'\u20B9'}
                  {(
                    parseFloat(openingBalance) +
                    (this.getTotalAmount(godownSale) +
                      this.getTotalAmount(counterSale) +
                      this.getTotalAmount(totalCr)) - 
                    (this.getExpenseAmount(totalDr) +
                      this.getExpenseAmount(expenseList))
                  ).toFixed(2)}
                </Text>
              </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  loginDetails: state.loginDetails,
});

export default connect(mapStateToProps, {})(Accounts);
