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
	ToastAndroid
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
// import { Text } from 'react-native-paper';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


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
	totalName: {
		fontSize: 18,
		//color: '#ffffff',
		color: '#6ea2f4'
	}
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
			totalCr: [],
			totalDr: [],
			productList: [],
			remainingAmount: 0,
			selDate: new Date(),
			pickerVisible: false,
			toDate: new Date(),
			toPickerVisible: false,
			gestureName: 'none',
		};
	}


	componentDidMount() {

		this.setState(
			{
				selDate: new Date(this.props.route.params.selDate),
				
			},
			() => {
				this.fetchData();
			},
		);
	}

	fetchData = () => {

		const {loginDetails} = this.props;
		const {selDate, toDate} = this.state;
		const {shop} = this.props.route.params;


		if(Moment(selDate).format('yyyy-MM-DD') > Moment(toDate).format('yyyy-MM-DD')){
			ToastAndroid.show('Please select valid to date', ToastAndroid.SHORT);
			this.setState({
				toPickerVisible: true
			})
		} else if(Moment(selDate).format('yyyy-MM-DD') <= Moment(toDate).format('yyyy-MM-DD')){
			console.log(ser_url + '/get_opbal_history.php?c_no=' + 
					loginDetails.ID +
					'&counter_id=' +
					shop.counter_id +
					'&f_date=' +
					Moment(selDate).format('yyyy-MM-DD') +
					'&t_date=' +
					Moment(toDate).format('yyyy-MM-DD'))
			fetch(
				ser_url + '/get_opbal_history.php?c_no=' + 
					loginDetails.ID +
					'&counter_id=' +
					shop.counter_id +
					'&f_date=' +
					Moment(selDate).format('yyyy-MM-DD') +
					'&t_date=' +
					Moment(toDate).format('yyyy-MM-DD'),
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

				this.setState({
					productList: json.opening_balance_res,
				});

				/*if (json.opening_balance_res.length > 0) {
					//console.log(json.opening_balance_res[0].credit_amount)

						this.setState({
							openingBalance: json.opening_balance_res[0].opbal_amount,
							counterSale: json.opening_balance_res[0].counter_sales,
							godownSale: json.opening_balance_res[0].gowdown_sales,
							expenseList: json.opening_balance_res[0].expences,
							totalCr: json.opening_balance_res[0].credit_amount,
							totalDr: json.opening_balance_res[0].debit_amount,
						
						});

				} */

			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
		}

	};
	
	leftBtn = () => {
			
		const {selDate, toDate} = this.state;

		var difference = (Moment(selDate).diff(toDate, 'days') - 1);
		var left_selDate = Moment(selDate, "DD-MM-YYYY").add(-1*difference, 'days');
		var left_toDate = Moment(toDate, "DD-MM-YYYY").add(-1*difference, 'days');

		this.setState(
			{
				selDate: new Date(left_selDate),
				toDate: new Date(left_toDate),
			},
			() => {
				this.fetchData(); // Ensuring it runs AFTER state update
			}
		);
	}
	 
	rightBtn =() =>{

		const {selDate, toDate} = this.state;

		var difference = Moment(selDate).diff(toDate, 'days') - 1;
		var right_selDate = Moment(selDate, "DD-MM-YYYY").add(difference, 'days');
		var right_toDate = Moment(toDate, "DD-MM-YYYY").add(difference, 'days');

		this.setState(
			{
				selDate: new Date(right_selDate),
				toDate: new Date(right_toDate),
			},
			() => {
				this.fetchData(); // Ensuring it runs AFTER state update
			}
		);
	}


	render() {
		const {navigate} = this.props.navigation;
		const {loginDetails} = this.props;
		const {
			godownSale,
			counterSale,
			expenseList,
			openingBalance,
			totalCr,
			totalDr,
			productList,
			selDate,
			pickerVisible,
			toDate,
			toPickerVisible,
		} = this.state;

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
						From: {Moment(selDate).format('Do MMMM YYYY')}
					</Text>
					<Icon
						name="pencil"
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
					}}
					onPress={() => this.setState({toPickerVisible: true})}>
					<Text style={styles.inText}>
						To: {Moment(toDate).format('Do MMMM YYYY')}
					</Text>
					<Icon
						name="pencil"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
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
				<DatePicker
					modal
					title="Select To Date"
					open={toPickerVisible}
					date={toDate}
					maximumDate={new Date()}
					mode="date"
					onConfirm={date => {
						this.setState({
							toPickerVisible: false,
							toDate: date,
						});
					}}
					onCancel={() => {
						this.setState({
							toPickerVisible: false,
						});
					}}
				/>

				<View style={{flexDirection : 'row',marginBottom:20,marginLeft:'30%'}}>
					<TouchableOpacity onPress = {() => this.rightBtn()}>
						<Text style={{ fontSize: 20 }}>⬅️   </Text>
					</TouchableOpacity>
					<TouchableOpacity onPress = {() => this.leftBtn()}>
						<Text style={{ fontSize: 20 }}>    ➡️</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					style={{
						backgroundColor: 'green',
						justifyContent: 'center',
						alignItems: 'center',
						paddingHorizontal: 10,
						borderRadius: 5,
						paddingVertical: 5,
					}}
					onPress={() => this.fetchData()}>
					<Text style={{color: '#ffffff'}}>Search</Text>
				</TouchableOpacity>
				<View style={styles.typDvdr}></View>
				
				{productList.length == 0 ? (
					<View style={{paddingVertical: 50}}>
						<Text style={{alignSelf: 'center', fontSize: 16, color: '#ffffff'}}>
							No Account history Available
						</Text>
					</View>
				) : (
					<FlatList
						data={productList}
						initialNumToRender={10}
						renderItem={({item, index}) => (
							<View>

							{/*<View style={{justifyContent:'center', alignItems:'center'}}>
								<Text style={styles.inText}>{Moment(item.opening_balance_date).format('Do MMMM YYYY')}</Text>
							</View>*/}

							<TouchableOpacity
								style={{
									paddingHorizontal: 10,
									marginVertical: 10,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}>
								<Text style={styles.inText}>
									Opening Balance  :   {'\u20B9'} 
										{item.opbal_amount != null ? parseFloat(item.opbal_amount).toFixed(2) : 0}
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
										selDate: Moment(selDate).format('DD-MM-yyyy'),
										toDate: Moment(toDate).format('DD-MM-yyyy'),
									})
								}>
								<Text style={styles.inText}>
									Godown Sale  :   {'\u20B9'}
									{item.gowdown_sales != null ? parseFloat(item.gowdown_sales).toFixed(2) : 0}
									{/*this.getTotalAmount(godownSale).toFixed(2)*/}
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
										selDate: Moment(selDate).format('DD-MM-yyyy'),
										toDate: Moment(toDate).format('DD-MM-yyyy'),
									})
								}>
								<Text style={styles.inText}>
									Counter Sale  :   {'\u20B9'}
									{item.counter_sales != null ? parseFloat(item.counter_sales).toFixed(2) : 0}
									{/*this.getTotalAmount(counterSale).toFixed(2)*/}
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
									navigate('CrHistory', {
										shop: this.props.route.params.shop,
										selDate: Moment(selDate).format('DD-MM-yyyy'),
										toDate: Moment(toDate).format('DD-MM-yyyy'),
									})
								}>
								<Text style={styles.inText}>
									Payment Credit :   {'\u20B9'}
									{item.payment_credit != null ? parseFloat(item.payment_credit).toFixed(2) : 0}
									{/*this.getTotalAmount(totalCr).toFixed(2)*/}
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
									navigate('LoanAmountHistory', {
										shop: this.props.route.params.shop,
										selDate: Moment(selDate).format('DD-MM-yyyy'),
										toDate: Moment(toDate).format('DD-MM-yyyy'),
									})
								}>
								<Text style={styles.inText}>
									+ Loan Credit :   {'\u20B9'}
									{item.loan_credit != null ? parseFloat(item.loan_credit).toFixed(2) : 0}
									{/*this.getTotalAmount(totalCr).toFixed(2)*/}
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
								<Text style={styles.totalName}>
									= Total :   {'\u20B9'}
										{(
											parseFloat(item.opbal_amount != null ? (item.opbal_amount) : 0) + 
											parseFloat(item.gowdown_sales != null ? (item.gowdown_sales) : 0) + 
											parseFloat(item.counter_sales != null ? (item.counter_sales) : 0) + 
											parseFloat(item.payment_credit != null ? (item.payment_credit) : 0)+ 
											parseFloat(item.loan_credit != null ? (item.loan_credit) : 0)
										).toFixed(2)}
									{/*(
										parseFloat(openingBalance) +
										(this.getTotalAmount(godownSale) +
											this.getTotalAmount(counterSale) +
											this.getTotalAmount(totalCr)) 
									).toFixed(2)*/}
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
									navigate('DrHistory', {
										shop: this.props.route.params.shop,
										selDate: Moment(selDate).format('DD-MM-yyyy'),
										toDate: Moment(toDate).format('DD-MM-yyyy'),
									})
								}>
								<Text style={styles.inText}>
									Payment Debit  :   {'\u20B9'}
									{item.payment_debit != null ? parseFloat(item.payment_debit).toFixed(2) : 0}
									{/*this.getExpenseAmount(totalDr).toFixed(2)*/}
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
									navigate('LoanAmountHistory', {
										shop: this.props.route.params.shop,
										selDate: Moment(selDate).format('DD-MM-yyyy'),
										toDate: Moment(toDate).format('DD-MM-yyyy'),
									})
								}>
								<Text style={styles.inText}>
									Loan Debit  :   {'\u20B9'}
									{item.loan_debit != null ? parseFloat(item.loan_debit).toFixed(2) : 0}
									{/*this.getExpenseAmount(totalDr).toFixed(2)*/}
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
									navigate('ExpenseHistory', {
										shop: this.props.route.params.shop,
										selDate: Moment(selDate).format('DD-MM-yyyy'),
										toDate: Moment(toDate).format('DD-MM-yyyy'),
									})
								}>
								<Text style={styles.inText}>
									Expenditure  :   {'\u20B9'}
									{item.expences !=null ? parseFloat(item.expences).toFixed(2) : 0}
									{/*this.getExpenseAmount(expenseList).toFixed(2)*/}
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
									navigate('PAmountHistory', {
										shop: this.props.route.params.shop,
										selDate: Moment(selDate).format('yyyy-MM-DD'),
										toDate: Moment(toDate).format('yyyy-MM-DD'),
									})
								}>
								<Text style={styles.inText}>
									- Partner Amount  :   {'\u20B9'}
									{item.pAmount !=null ? parseFloat(item.pAmount).toFixed(2) : 0}
									{/*this.getExpenseAmount(expenseList).toFixed(2)*/}
								</Text>
								<Icon
									name="chevron-forward"
									size={20}
									color={'#ffffff'}
									style={{marginLeft: 10}}
								/>
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
								<Text style={styles.totalName}>
									= Final Total  :   {'\u20B9'}
									{
										((
											parseFloat(item.opbal_amount != null ? (item.opbal_amount) : 0) + 
											parseFloat(item.gowdown_sales != null ? (item.gowdown_sales) : 0) + 
											parseFloat(item.counter_sales != null ? (item.counter_sales) : 0) + 
											parseFloat(item.payment_credit != null ? (item.payment_credit) : 0)+ 
											parseFloat(item.loan_credit != null ? (item.loan_credit) : 0)
										) - 
										(
											parseFloat(item.payment_debit != null ? (item.payment_debit) : 0) +
											parseFloat(item.loan_debit != null ? (item.loan_debit) : 0)+
											parseFloat(item.expences != null ? (item.expences) : 0)+
											parseFloat(item.pAmount != null ? (item.pAmount) : 0)
										)).toFixed(2)
									}
								</Text>
							</TouchableOpacity>

							<View style={styles.typDvdr}></View>
							</View>
						)}
						keyExtractor={(item, index) => 'accountsHistory' + index}
					/>
				)}
			</View>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
});

export default connect(mapStateToProps, {})(Accounts);
