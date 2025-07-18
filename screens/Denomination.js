import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	FlatList,
	ScrollView,
	KeyboardAvoidingView,
	SafeAreaView,
	ToastAndroid,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import {Button, TextInput, Provider} from 'react-native-paper';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';

Moment.locale('en');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		color: 'ffffff',
	},
	input: {
		textAlign: 'center',
		height:50,
		flex: 2,
		backgroundColor: '#ffffff',
	},
	denomView: {
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'space-between',
		marginVertical: 2,
	},
	denoText: {
		fontSize: 14,
		fontWeight: 'bold',
		flex: 2,
		textAlign: 'center',
		color: '#ffffff',
	},
	typDvdr: {
		height: 1,
		width: '100%',
		backgroundColor: '#909090',
		marginBottom: 10,
	},
	inText: {
		color: '#ffffff',
		fontSize: 14,
	},
	inputbox: {
		width:'60%',
		marginBottom:12,
		height:40,
		backgroundColor:'#ffffff',
	}
});

export class Denomination extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		this.state = {
			productList: [],
			isLoading: true,
			modalVisible: true,
			reason: '',
			denoAmt: [
				{value: 500, input: 0, total: 0},
				{value: 200, input: 0, total: 0},
				{value: 100, input: 0, total: 0},
				{value: 50, input: 0, total: 0},
				{value: 20, input: 0, total: 0},
				{value: 10, input: 0, total: 0},
				{value: 5, input: 0, total: 0},
				{value: 2, input: 0, total: 0},
				{value: 1, input: 0, total: 0},
			],
			expensLoading: false,
			expenseDisable: false,
			pendingAmount: 0,
			subTotal: 0,
			totalAmount: 0,
			counterSale: 0,
			godownSale:0,
			expenseAmount: 0,
			openingBalance: 0,
			totalCr: 0,
			totalDr: 0,
			loanCr: 0,
			loanDr: 0,
			partnerAmount: 0,
			selDate: '',
			pickerVisible: false,
			UPIAmt:0,
		};
	}

	componentDidMount() {
		this.fetchData();
		this.fetchPendingAmount();
	}

	fetchPendingAmount = () => {
		const {loginDetails} = this.props;
		const {selDate} = this.state;

		let date = new Date()

		if(selDate == ''){
			date = Moment().format('yyyy-MM-DD')
		} else {
			date = Moment(selDate).format('yyyy-MM-DD')
		}

		fetch(
			ser_url +
					'/get_pending_cart_final.php?company_no=' +
					loginDetails.ID +
					'&type=' +
					loginDetails.Type +
					'&pending_date=' +
					date +
					'&status=unpaid' +
					'&f_date=' +
					date +
					'&t_date=' +
					date,
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
				if (json.Pending_list.length > 0) {
					var sub_total = 0;
					json.Pending_list.map((item, index) => {
						sub_total = sub_total + Number.parseFloat(item.pending_amount);
						return sub_total;
					});
					this.setState({
						pendingAmount: sub_total,
					});
				} else {
					this.setState({
						pendingAmount: 0,
					});
				}
			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	fetchData = () => {

		const {loginDetails} = this.props;
		const {selDate} = this.state;
		const {shop} = this.props.route.params;

		let date = new Date()

		if(selDate == ''){
			date = Moment().format('yyyy-MM-DD')
		} else {
			date = Moment(selDate).format('yyyy-MM-DD')
		}
		console.log(ser_url + '/get_opbal_history.php?c_no=' + 
					loginDetails.ID +
					'&counter_id=' +
					shop.counter_id +
					'&f_date=' +
					date +
					'&t_date=' +
					date)
			fetch(
				ser_url + '/get_opbal_history.php?c_no=' + 
					loginDetails.ID +
					'&counter_id=' +
					shop.counter_id +
					'&f_date=' +
					date +
					'&t_date=' +
					date,
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
				console.log(json)

				/*this.setState({
					productList: json.opening_balance_res,
				});*/

				if (json.opening_balance_res.length > 0) {
					//console.log(json.opening_balance_res[0].credit_amount)

						this.setState({
							openingBalance: json.opening_balance_res[0].opbal_amount,
							counterSale: json.opening_balance_res[0].counter_sales,
							godownSale: json.opening_balance_res[0].gowdown_sales,
							expenseAmount: json.opening_balance_res[0].expences,
							totalCr: json.opening_balance_res[0].payment_credit,
							totalDr: json.opening_balance_res[0].payment_debit,
							loanCr: json.opening_balance_res[0].loan_credit,
							loanDr: json.opening_balance_res[0].loan_debit,
							partnerAmount: json.opening_balance_res[0].pAmount,
						});

				}

			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
		};

	setInput = (index, amount) => {
		this.setState(
			prevState => {
				let newArray = [...prevState.denoAmt];
				newArray[index].input = amount;
				newArray[index].total = amount * newArray[index].value;
				return {denoAmt: newArray};
			},
			function () {
				this.getSubTotal();
			},
		);
	};

	getSubTotal = () => {
		const {denoAmt, godownSale, counterSale, expenseAmount} = this.state;
		var sub_total = 0;
		denoAmt.map((item, index) => {
			sub_total = sub_total + parseFloat(item.total);
			// return sub_total
		});
		this.setState({subTotal: sub_total ? sub_total : 0});
	};

	addDenomination = () => {
		const {loginDetails} = this.props;
		const {
			denoAmt,
			pendingAmount,
			subTotal,
			openingBalance,
			godownSale,
			counterSale,
			expenseAmount,
			totalCr,
			totalDr,
			loanCr,
			loanDr,
			partnerAmount,
			selDate,
			UPIAmt,
		} = this.state;

		let total_amount = ((parseFloat(openingBalance) +
								parseFloat(godownSale) +
								parseFloat(counterSale) +
								parseFloat(totalCr)+
								parseFloat(loanCr)) -
								(parseFloat(expenseAmount) +
								parseFloat(loanDr) +
								parseFloat(totalDr) +
								parseFloat(partnerAmount)).toFixed(0))

		let expect_subTotal = Number.parseInt(total_amount) - Number.parseInt(pendingAmount)
		console.log(expect_subTotal);
		//let total_amount = Number.parseFloat(subTotal) + Number.parseFloat(pendingAmount);
		let final_total_amount = parseFloat(subTotal) +parseFloat(UPIAmt);
		if (subTotal == 0) {
			ToastAndroid.showWithGravity(
				'Atleast one denomination required',
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
			);
		} else if(final_total_amount != expect_subTotal){
			ToastAndroid.showWithGravity(
				'Enter proper denomination',
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
			);
		} else if (!selDate) {
			ToastAndroid.showWithGravity(
				"Please add date",
				ToastAndroid.SHORT,
				ToastAndroid.TOP
			);
		} else {
			this.setState({expensLoading: true, expenseDisable: true});
			
			fetch(
				ser_url +
					'/denomination_cart.php?company_no=' +
					loginDetails.ID +
					'&type=' +
					loginDetails.Type +
					'&title2=' +
					denoAmt[0].value +
					'&qty2=' +
					denoAmt[0].input +
					'&amount2=' +
					denoAmt[0].total +
					'&title3=' +
					denoAmt[1].value +
					'&qty3=' +
					denoAmt[1].input +
					'&amount3=' +
					denoAmt[1].total +
					'&title4=' +
					denoAmt[2].value +
					'&qty4=' +
					denoAmt[2].input +
					'&amount4=' +
					denoAmt[2].total +
					'&title5=' +
					denoAmt[3].value +
					'&qty5=' +
					denoAmt[3].input +
					'&amount5=' +
					denoAmt[3].total +
					'&title6=' +
					denoAmt[4].value +
					'&qty6=' +
					denoAmt[4].input +
					'&amount6=' +
					denoAmt[4].total +
					'&title7=' +
					denoAmt[5].value +
					'&qty7=' +
					denoAmt[5].input +
					'&amount7=' +
					denoAmt[5].total +
					'&title8=' +
					denoAmt[6].value +
					'&qty8=' +
					denoAmt[6].input +
					'&amount8=' +
					denoAmt[6].total +
					'&title9=' +
					denoAmt[7].value +
					'&qty9=' +
					denoAmt[7].input +
					'&amount9=' +
					denoAmt[7].total +
					'&title10=' +
					denoAmt[8].value +
					'&qty10=' +
					denoAmt[8].input +
					'&amount10=' +
					denoAmt[8].total +
					'&sub_total=' +
					subTotal +
					'&UPIAmt=' +
					UPIAmt +
					'&pending=' +
					pendingAmount +
					'&total=' +
					final_total_amount +
					'&d_date=' +
					Moment(selDate).format('yyyy-MM-DD') +
					'&counter_sales=' +
					counterSale +
					'&godown_sales=' +
					godownSale +
					'&total_expenses=' +
					expenseAmount +
					'&credit_amount=' +
					totalCr +
					'&debit_amount=' +
					totalDr,
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
							expensLoading: false,
							expenseDisable: false,
						});
						ToastAndroid.showWithGravity(
							'Denomination added successfully.',
							ToastAndroid.SHORT,
							ToastAndroid.TOP,
						);
						this.props.navigation.goBack();
					} else {
						this.setState({
							expensLoading: false,
							expenseDisable: false,
						});
						ToastAndroid.showWithGravity(
							'Denomination adding failed.',
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

	render(){
		const {navigate} = this.props.navigation;
		const {loginDetails} = this.props;
		const {
			denoAmt,
			expensLoading,
			expenseDisable,
			pendingAmount,
			subTotal,
			saleAmount,
			godownSale,
			counterSale,
			expenseAmount,
			openingBalance,
			totalCr,
			totalDr,
			selDate,
			pickerVisible,
			loanCr,
			loanDr,
			partnerAmount,
			UPIAmt,

		} = this.state;
		return (
			<Provider>
				<SafeAreaView style={styles.container}>

					<ScrollView
						contentContainerStyle={{
							paddingHorizontal: 5,
							paddingBottom: 20,
							paddingTop: 5,
						}}>

						<View style={{flexDirection:'row'}}>
							<View style={{width:'40%'}}>
								<Text style={{fontSize: 14, marginVertical: 10, color: '#ffffff'}}>
									Opening Balance = {'\u20B9'}
									{parseFloat(openingBalance).toFixed(2)}
								</Text>
								<Text style={{fontSize: 14, marginVertical: 10, color: '#ffffff'}}>
									Godown Sale = {'\u20B9'}
									{parseFloat(godownSale).toFixed(2)}
								</Text>
								<Text style={{fontSize: 14, marginVertical: 10, color: '#ffffff'}}>
									Counter Sale = {'\u20B9'}
									{parseFloat(counterSale).toFixed(2)}
								</Text>
								<Text
									style={{ fontSize: 14, marginVertical: 10, color:'#ffffff' }}>
									Payment Credit = {'\u20B9'}
									{parseFloat(totalCr).toFixed(2)}
								</Text>
								<Text
									style={{ fontSize: 14, marginVertical: 10, color:'#ffffff' }}>
									Loan Credit = {'\u20B9'}
									{parseFloat(loanCr).toFixed(2)}
								</Text>

								<View style={styles.typDvdr}></View>

								<Text style={{fontSize: 14, marginVertical: 10, color: '#6ea2f4'}}>
									Total Sale = {'\u20B9'}
									{(
										parseFloat(openingBalance) +
										parseFloat(godownSale) +
										parseFloat(counterSale) +
										parseFloat(totalCr) +
										parseFloat(loanCr) 
									).toFixed(2)}
								</Text>
								{/* <Text style={{fontSize: 18, marginHorizontal: 10, color: '#ffffff'}}>+</Text>
									<Text style={{fontSize: 18, marginVertical: 10, color: '#ffffff'}}>Pending Amount = {'\u20B9'}{pendingAmount ? pendingAmount : 0}</Text> */}
								<Text style={{fontSize: 14, marginHorizontal: 10, color: '#ffffff'}}>
								 - 
								</Text>
								<Text style={{fontSize: 14, marginVertical: 10, color: '#ffffff'}}>
									Expenditure = {'\u20B9'}
									{parseFloat(expenseAmount).toFixed(2)}
								</Text>
								<Text
									style={{
										fontSize: 14,
										marginVertical: 10,
										color: '#ffffff',
									}}>
									Payment Debit = {'\u20B9'}
									{parseFloat(totalDr).toFixed(2)}
								</Text>
								<Text
									style={{
										fontSize: 14,
										marginVertical: 10,
										color: '#ffffff',
									}}>
									Loan Debit = {'\u20B9'}
									{parseFloat(loanDr).toFixed(2)}
								</Text>
								<Text
									style={{
										fontSize: 14,
										marginVertical: 10,
										color: '#ffffff',
									}}>
									Partner Amount = {'\u20B9'}
									{parseFloat(partnerAmount).toFixed(2)}
								</Text>
								
								<View style={styles.typDvdr}></View>
								
								<Text style={{fontSize: 14, marginVertical: 10, color: '#6ea2f4'}}>
									Final Total = {'\u20B9'}
									{(
										(parseFloat(openingBalance) +
										parseFloat(godownSale) +
										parseFloat(counterSale) +
										parseFloat(totalCr) +
										parseFloat(loanCr)) -
										(parseFloat(expenseAmount) +
										parseFloat(totalDr) +
										parseFloat(loanDr) +
										parseFloat(partnerAmount))
									).toFixed(2)}
								</Text>

								<View style={styles.typDvdr}></View>

								<Text
									style={{
										fontSize: 14,
										marginVertical: 10,
										color: pendingAmount < 0 ? '#e01223' : '#ffffff',
									}}>
									Pending Amount = {'\u20B9'}
									{parseFloat(pendingAmount).toFixed(2)}
								</Text>
								<View style={styles.typDvdr}></View>

								<Text
									style={{
										fontSize: 14,
										marginVertical: 10,
										color: '#6ea2f4',
									}}>
									Final Amount = {'\u20B9'}
									{((
										(parseFloat(openingBalance) +
										parseFloat(godownSale) +
										parseFloat(counterSale) +
										parseFloat(totalCr) +
										parseFloat(loanCr)) -
										(parseFloat(expenseAmount) +
										parseFloat(totalDr) +
										parseFloat(loanDr) +
										parseFloat(partnerAmount))
									)-parseFloat(pendingAmount)).toFixed(2)}
								</Text>
								<View style={styles.typDvdr}></View>

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
										this.setState(
										{
											pickerVisible: false,
											selDate: date,
										},
										() => {
											this.fetchData();
											this.fetchPendingAmount();
										},
										);
									}}
									onCancel={() => {
										this.setState({
											pickerVisible: false,
										});
									}}
								/>

							</View>
							<View style={{width:'55%',marginLeft:'5%'}}>
								{denoAmt.map((item, index) => (
									<View style={styles.denomView} key={'denoList' + index}>
										{/* <Text style={styles.denoText}>{item.value}</Text>
													<Text style={styles.denoText}>X</Text> */}
										
										<TextInput
											// mode='outlined'
											style={styles.input}
											theme={{
												colors: {
													text: '#000000',
													placeholder: '#000000',
													background: 'transparent',
												},
											}}
											onChangeText={value => this.setInput(index, value)}
											value={item.input.toString()}
											label={item.value}
											keyboardType="number-pad"
										/>
										<Text style={{color: '#ffffff'}}>=</Text>
										<Text style={styles.denoText}>{item.total}/-</Text>
									</View>
								))}

								<Text style={{fontSize: 14, marginVertical: 10, color: '#6ea2f4'}}>
									Sub Total = {'\u20B9'}
									{parseFloat(subTotal).toFixed(2)}
								</Text>

								<View style={styles.typDvdr}></View>
								<View style={{flexDirection:'row'}}>
									<Text style={{color: '#ffffff',width:'30%',fontSize:14}}>UPI Amount : </Text>
									<TextInput 
										style={styles.inputbox}
										onChangeText={value => this.setState({UPIAmt: value})}
										theme={{ colors: { text: '#000000', placeholder: "#000000", background: "transparent" } }}
										keyboardType='number-pad'
									/>
								</View>

								{/* <TextInput
												// mode='outlined'
												style={{backgroundColor: '#ffffff', marginBottom: 10}}
												theme={{ colors: { text: '#000000', placeholder: "#000000", background: "transparent" } }}
												onChangeText={value => this.setState({pendingAmount: value})}
												value={pendingAmount.toString()}
												label="Pending Amount"
												keyboardType='number-pad'
										/> */}
								{/* <Text style={{fontSize: 18, marginVertical: 10, color: '#ffffff'}}>Total = {'\u20B9'}{Number.parseInt(subTotal, 10) + Number.parseInt(pendingAmount ? pendingAmount : 0, 10)}</Text> */}
								<View style={styles.typDvdr}></View>

								<Text style={{fontSize: 14, marginVertical: 10, color: '#6ea2f4'}}>
									Total Amount = {'\u20B9'}
									{(
										parseFloat(subTotal) +
										parseFloat(UPIAmt)
									).toFixed(2)}
								</Text>

							</View>
						</View>

						<Button
							mode="contained"
							loading={expensLoading}
							disabled={expenseDisable}
							onPress={() => this.addDenomination()}
							style={{marginTop: 10}}>
							Submit
						</Button>
					</ScrollView>
				</SafeAreaView>
			</Provider>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
});

export default connect(mapStateToProps, {})(Denomination);
