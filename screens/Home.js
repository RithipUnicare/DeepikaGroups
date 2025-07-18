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
	BackHandler
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import {addCityList} from '../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../redux/reducer';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
import {List} from 'react-native-paper';
import Moment from 'moment';

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
		color: '#6ea2f4',
		//color: '#ffffff',
		// textAlign: 'center',
	},
	codeName: {
		fontSize: 16,
		marginBottom: 5,
		// textAlign: 'center',
		color: '#6ea2f4',
		//color: '#ffffff',
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
	inText: {
		fontSize: 17,
		color: '#ffffff',
		flex: 1,
	},
	inTitle: {
		fontSize: 18,
		color: '#6ea2f4',
		//color: '#ffffff',
		textDecorationLine: 'underline',
	},
	listDesign: {
		// paddingHorizontal: 10,
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		// justifyContent: 'space-between'
	},
	innerBlocks: {
		margin: 5,
		padding: 5,
		borderRadius: 5,
		borderColor: '#ffffff',
		borderWidth: 1,
	},
	typDvdr: {
		height: 1,
		width: '100%',
		backgroundColor: '#909090',
		marginBottom: 10,
	},
});

const removeLoginLocal = async () => {
	try {
	await AsyncStorage.removeItem('loginData');
	} catch (err) {}
};

export class Home extends Component {
	constructor(props) {
	super(props);

	this.flatListRef;
	// this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
	this.state = {
		shopList: [],
		isLoading: true,
		relCounter: null,
		homeOptions: [
		{
			name: 'Add Counter Transfer',
			navScreen: 'CounterTransfer',
			icon: 'cart',
		},
		{
			name: 'Counter Transfer Cart',
			navScreen: 'CounterTransferCart',
			icon: 'cart',
		},
		{
			name: 'Counter Transfer History',
			navScreen: 'CounterTransferHistory',
			icon: 'list-circle',
		},
		{
			name: 'Godown Stock',
			navScreen: 'GodownStock',
			icon: 'business',
		},
		{
			name: 'Counter Stock',
			navScreen: 'CounterStock',
			icon: 'basket',
		},
		{
			name: 'Accounts',
			navScreen: 'Accounts',
			icon: 'list-circle',
		},
		{
			name: 'AccountsHistory',
			navScreen: 'AccountsHistory',
			icon: 'list-circle',
		},
		{
			name: 'Purchase List',
			navScreen: 'PurchaseList',
			icon: 'list-circle',
		},
		{
			name: 'Add Expense',
			navScreen: 'Expense',
			icon: 'add-circle',
		},
		{
			name: 'Expense List',
			navScreen: 'ExpenseList',
			icon: 'list-circle',
		},
		{
			name: 'Expense History',
			navScreen: 'ExpenseHistory',
			icon: 'list-circle',
		},
		{
			name: 'Add Partner Amount',
			navScreen: 'Partner Amount',
			icon: 'add-circle',
		},
		{
			name: 'Partner Amount List',
			navScreen: 'PartnerAmountList',
			icon: 'list-circle',
		},
		{
			name: 'Partner Amount History',
			navScreen: 'PartnerAmountHistory',
			icon: 'list-circle',
		},
		{
			name: 'Add Loan Amount',
			navScreen: 'Loan Amount',
			icon: 'add-circle',
		},
		{
			name: 'Loan Amount List',
			navScreen: 'LoanAmountList',
			icon: 'list-circle',
		},
		{
			name: 'Loan Amount History',
			navScreen: 'LoanAmountHistory',
			icon: 'list-circle',
		},
		{
			name: 'Add Denomination',
			navScreen: 'AddDenom',
			icon: 'cash',
		},
		{
			name: 'Denomination History',
			navScreen: 'DenomList',
			icon: 'list-circle',
		},
		],
	};
	}

	componentDidMount() {
		// BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		const {loginDetails} = this.props;
		// if (loginDetails.Type == 'Godown') {
			this.fetchCounterDetails();
		// }
	}

	handleBackButtonClick = () => {
		BackHandler.exitApp();
    	return true;
	} 

	fetchCounterDetails = () => {
		const {loginDetails} = this.props;
		// console.log(JSON.stringify(loginDetails))

		fetch(ser_url + '/counter_list.php?g_id=' + loginDetails.ID, {
			method: 'GET',
			headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			},
		}).then(response => response.json())
			.then(json => {
				console.log(JSON.stringify(json));
				if (json.Counter_List.length > 0) {
					this.setState({relCounter: json.Counter_List[0]});
				} else {
					this.setState({relCounter: {counter_id: 0, counter_name: ''}});
				}
			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
		});
	};

	logoutAction = () => {
		removeLoginLocal();
		this.props.logout();
	};

	logout = () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{
			text: 'Cancel',
			style: 'cancel',
			},
			{text: 'OK', onPress: () => this.logoutAction()},
		]);
	};

	render() {
	const {navigate} = this.props.navigation;
	const {loginDetails} = this.props;
	const {shopList, isLoading, homeOptions, relCounter} = this.state;
	return (
		<ScrollView style={styles.container}>
		<View style={{paddingHorizontal: 10}}>
			<Text style={styles.shopName}>{loginDetails.Shop_Name}</Text>
			{/* <Text style={styles.codeName}>Shop Number - {loginDetails.Shop_No}</Text> */}
			{/* <Text style={styles.codeName}>Shop Type - {loginDetails.Type}</Text> */}
			<Text style={styles.codeName}>{loginDetails.Location}</Text>
		</View>
		<View style={styles.typDvdr}></View>

		<View style={{marginHorizontal: 5, paddingHorizontal: 5}}>
			<TouchableOpacity
			style={styles.listDesign}
			onPress={() => navigate('Product')}>
			<Icon
				name="beer"
				size={25}
				color={'#ffffff'}
				style={{marginRight: 10}}
			/>
			{loginDetails.Type == 'Counter' ? (
					<Text style={styles.inText}>Add Counter Sale</Text>
				):
				(
					<Text style={styles.inText}>Add Godown Sale</Text>
				)
			}
			<Icon
				name="chevron-forward"
				size={20}
				color={'#ffffff'}
				style={{marginLeft: 10}}
			/>
			</TouchableOpacity>
			{loginDetails.number_counter == '2' ? (
				<TouchableOpacity
				style={styles.listDesign}
				onPress={() => navigate('Counter2Sale')}>
				<Icon
					name="beer"
					size={25}
					color={'#ffffff'}
					style={{marginRight: 10}}
				/>
					<Text style={styles.inText}>Add Counter2 Sale</Text>					
				<Icon
					name="chevron-forward"
					size={20}
					color={'#ffffff'}
					style={{marginLeft: 10}}
				/>
				</TouchableOpacity>
			):null}

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('SaleDate', {
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
				}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Sales History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				{loginDetails.number_counter == '2' ? (
				<TouchableOpacity
					style={styles.listDesign}
					// onPress={() => navigate('Counter2SaleDate')}
					onPress={() =>
					navigate('Counter2SaleDate', {
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
				}>
					<Icon
						name="beer"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
						<Text style={styles.inText}>Counter2 Sale History</Text>					
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
			):null}
				
				<TouchableOpacity
					style={styles.listDesign}
					// onPress={() => navigate('Counter2SaleDate')}
					onPress={() =>
					navigate('ReceivedStockDateList', {
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
				}>
					<Icon
						name="beer"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
						<Text style={styles.inText}>Received Stock History</Text>					
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.listDesign}
					// onPress={() => navigate('Counter2SaleDate')}
					onPress={() =>
					navigate('ShareStockDateList', {
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
				}>
					<Icon
						name="beer"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
						<Text style={styles.inText}>Shared Stock History</Text>					
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
			</View>


		<View style={{margin: 5, padding: 5}}>
			{loginDetails.Type == 'Counter' ? (
			<View>
				<TouchableOpacity
				style={styles.listDesign}
				onPress={() =>
					navigate('CounterStock', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
				}>
				<Icon
					name="list-circle"
					size={25}
					color={'#ffffff'}
					style={{marginRight: 10}}
				/>
				<Text style={styles.inText}>Counter Stock</Text>
				<Icon
					name="chevron-forward"
					size={20}
					color={'#ffffff'}
					style={{marginLeft: 10}}
				/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('CounterTrasferDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
						/>
						<Text style={styles.inText}>Transfer History</Text>
						<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

			</View>

			) : null}
		</View>

		{loginDetails.Type == 'Godown' ? (
			isLoading ? (
			<ActivityIndicator animating size="large" color="#0000ff" />
			) : (
			<View style={{flexDirection: 'column'}}>
				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Counter Transfer</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('CounterTransfer', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="add-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Add Counter Transfer</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				{/*<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('CounterTransferCart', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="cart"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Transfer Cart</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>*/}

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('CounterTrasferDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Transfer History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Stock</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('GodownStockDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Godown Stock</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('CounterStockDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Counter Stock</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				{/*<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('Accounts', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
					name="cash"
					size={25}
					color={'#ffffff'}
					style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Todays Accounts</Text>
					<Icon
					name="chevron-forward"
					size={20}
					color={'#ffffff'}
					style={{marginLeft: 10}}
					/>
				</TouchableOpacity>*/}
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('AccountsHistory', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="cash"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
						/>
					<Text style={styles.inText}> Accounts</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					// navigate('PurchaseList', {
					navigate('PurchaseDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Purchase List</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					// navigate('PurchaseList', {
					navigate('StockBalanceDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Stock Balance</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					// navigate('PurchaseList', {
					navigate('RegisterCategory', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Register Book</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Expense</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('Expense', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="add-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Add Expenditure</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				{/*<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('ExpenseList', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>List</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>*/}

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('ExpenditureDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Pending Amount</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('AddPending', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="add-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Add Pending</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				{/*<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('PendingCart', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>List</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>*/}

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('PendingDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Payment</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('AddCrDr', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="add-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Add Credit and Debit</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				{/*<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('CrDrCart', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>List</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>*/}

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('CreditDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Credit History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('DebitDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Debit History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Partner Amount</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('AddpAmount', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="add-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Add Partner Amount</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				{/*<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('PAmountCart', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>List</Text>
					<Icon
					name="chevron-forward"
					size={20}
					color={'#ffffff'}
					style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
*/}
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('PAmountDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Loan Amount</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('AddLoanAmount', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="add-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Add Loan</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				{/*<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('LoanAmountCart', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="list-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>List</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>*/}

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('LoanAmountDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
						toDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>

				<View style={styles.innerBlocks}>
				<Text style={styles.inTitle}>Denomination</Text>
				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('AddDenom', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="add-circle"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>Add</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.listDesign}
					onPress={() =>
					navigate('DenominationDate', {
						shop: relCounter,
						selDate: Moment().format('yyyy-MM-DD'),
					})
					}>
					<Icon
						name="book"
						size={25}
						color={'#ffffff'}
						style={{marginRight: 10}}
					/>
					<Text style={styles.inText}>History</Text>
					<Icon
						name="chevron-forward"
						size={20}
						color={'#ffffff'}
						style={{marginLeft: 10}}
					/>
				</TouchableOpacity>
				</View>
			</View>
			)
		) : null}

		<TouchableOpacity
			style={{
			marginHorizontal: 10,
			marginVertical: 30,
			backgroundColor: 'red',
			borderRadius: 5,
			flexDirection: 'row',
			alignItems: 'center',
			padding: 15,
			justifyContent: 'center',
			}}
			onPress={() => this.logout()}>
			{/* <Icon name="log-out" size={30} color={'#ffffff'}/> */}
			<Text style={styles.optionName}>Log Out</Text>
		</TouchableOpacity>

		{/* ...... */}

		{/* <View style={styles.actionBlock}>
			<TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Product')}>
				<Icon name="beer" size={30} color={'#ffffff'}/>
				<Text style={styles.optionName}>Products</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Sales')}>
				<Icon name="cart" size={30} color={'#ffffff'}/>
				<Text style={styles.optionName}>Cart</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.optionBlock} onPress={() => navigate('SalesHistory', {selDate: Moment().format('yyyy-MM-DD')})}>
				<Icon name="file-tray-full" size={30} color={'#ffffff'}/>
				<Text style={styles.optionName}>Sales History</Text>
			</TouchableOpacity>
			{loginDetails.Type == 'Godown' ? isLoading ? <ActivityIndicator animating size="large" color="#0000ff" /> : homeOptions.map((item, index) => {return(
				<TouchableOpacity style={styles.optionBlock} onPress={() => navigate(item.navScreen, {shop: relCounter, selDate: Moment().format('yyyy-MM-DD')})} key={'hmOptn'+ index}>
				<Icon name={item.icon} size={30} color={'#ffffff'}/>
				<Text style={styles.optionName}>{item.name}</Text>
			</TouchableOpacity>
			)}) : null}

			{loginDetails.Type == 'Counter' ? <TouchableOpacity style={styles.optionBlock} onPress={() => navigate('CounterStock', {shop: {counter_id: loginDetails.ID}})}>
				<Icon name={'basket'} size={30} color={'#ffffff'}/>
				<Text style={styles.optionName}>Counter Stock</Text>
			</TouchableOpacity> : null}
			
			<TouchableOpacity style={styles.optionBlock} onPress={() => this.logout()}>
				<Icon name="log-out" size={30} color={'#ffffff'}/>
				<Text style={styles.optionName}>Log Out</Text>
			</TouchableOpacity>
			</View> */}
		{/* <TouchableOpacity style={styles.logout} onPress={() => this.logout()}>
			<Text style={styles.optionName}>Log Out</Text>
			</TouchableOpacity> */}
		</ScrollView>
	);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
});

export default connect(mapStateToProps, {logout, addCityList})(Home);
