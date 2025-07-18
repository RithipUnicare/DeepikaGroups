import React, { Component, useEffect, useState, } from 'react';
import { Modal, Text, View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Alert} from 'react-native';
import { StackNavigator, createNativeStackNavigator  } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
// import WelcomeScreen from '../screens/Welcome';
import HomeScreen from '../screens/Home';
import AuthLogScreen from '../screens/Login';
import ApploadingScreen from '../screens/Splashscreen';
import Orders from '../screens/Orders';
import Sales from '../screens/Sales';
import Counter2SalesCart from '../screens/Counter2SalesCart';
import Products from '../screens/Products';
import Counter2Sale from '../screens/Counter2Sale';
import Stock from '../screens/Stock';
import Shop from '../screens/Shop';
import Expense from '../screens/Expense';
import ExpenseList from '../screens/ExpenseList';
import ExpenditureDate from '../screens/ExpenditureDate';
import ExpenseHistory from '../screens/ExpenseHistory';
import DenomList from '../screens/DenomList';
import DenominationDate from '../screens/DenominationDate';
import Denomination from '../screens/Denomination';
import AddSale from '../screens/AddSale';
import SaleDate from '../screens/SaleDate';
import Counter2SaleDate from '../screens/Counter2SaleDate';
import SalesHistory from '../screens/SalesHistory';
import CounterStock from '../screens/CounterStock';
import CounterStockDate from '../screens/CounterStockDate';
import GodownStock from '../screens/GodownStock';
import GodownStockDate from '../screens/GodownStockDate';
import CounterTransfer from '../screens/CounterTransfer';
import CounterTransferCart from '../screens/CounterTransferCart';
import Accounts from '../screens/Accounts';
import AccountsHistory from '../screens/AccountsHistory';
import StockBalance from '../screens/StockBalance';
import StockBalanceDate from '../screens/StockBalanceDate';
import CounterSalesHistory from '../screens/CounterSalesHistory';
import PurchaseDate from '../screens/PurchaseDate';
import PurchaseList from '../screens/PurchaseList';
import CounterTrasferDate from '../screens/CounterTrasferDate';
import CounterTransferHistory from '../screens/CounterTransferHistory';
import AddPending from '../screens/AddPending';
import PendingCart from '../screens/PendingCart';
import PendingDate from '../screens/PendingDate';
import PendingHistory from '../screens/PendingHistory';
import CrDr from '../screens/CrDr';
import CrDrCart from '../screens/CrDrCart';
import CrDrHistory from '../screens/CrDrHistory';
import CreditDate from '../screens/CreditDate';
import DebitDate from '../screens/DebitDate';
import CrHistory from '../screens/CrHistory';
import DrHistory from '../screens/DrHistory';
import AddpAmount from '../screens/AddpAmount';
import PAmountCart from '../screens/PAmountCart';
import PAmountDate from '../screens/PAmountDate';
import PAmountHistory from '../screens/PAmountHistory';
import AddLoanAmount from '../screens/AddLoanAmount';
import LoanAmountCart from '../screens/LoanAmountCart';
import LoanAmountDate from '../screens/LoanAmountDate';
import LoanAmountHistory from '../screens/LoanAmountHistory';
import ShareStockDateList from '../screens/ShareStockDateList';
import ShareStockHistory from '../screens/ShareStockHistory';
import ReceivedStockDateList from '../screens/ReceivedStockDateList';
import ReceivedStockHistory from '../screens/ReceivedStockHistory';
import RegisterCategory from '../screens/RegisterCategory';
import RegisterBook from '../screens/RegisterBook';
import RegisterBookTotal from '../screens/RegisterBookTotal';
import InAppBrowserScreen from '../screens/InAppBrowserScreen';

import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';

import { useColorScheme } from 'react-native';

import { logout } from '../redux/reducer';

// import NetInfo from '@react-native-community/netinfo';

const Stack = createNativeStackNavigator();

const MyTheme = {
	...DefaultTheme, // this includes fonts and everything else
	dark: true,
	colors: {
		...DefaultTheme.colors,
		primary: 'rgb(42, 32, 51)',
		background: 'rgb(26, 19, 31)',
		card: 'rgb(30, 23, 36)',
		text: 'rgb(255, 255, 255)',
		border: 'rgb(107, 104, 110)',
		notification: 'rgb(132, 69, 173)',
	},
};


	const styles = StyleSheet.create({
	modal: {
		flex: 1,
		margin: 'auto',
		padding: 'auto',
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		backgroundColor: 'rgba(52, 52, 52, 0.5)',
	},
	modalContainer: {
		width: '100%',
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingTop: 10,
		paddingBottom: 40,
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: '600',
	},
	modalText: {
		fontSize: 18,
		color: '#555',
		marginTop: 14,
		textAlign: 'center',
		marginBottom: 10,
	},
	button: {
		backgroundColor: 'red',
		paddingVertical: 12,
		paddingHorizontal: 16,
		width: '100%',
		alignItems: 'center',
		marginTop: 10,
		borderRadius: 20,
	},
	buttonText: {
		color: '#fff',
		fontSize: 20,
	},
	});

// const Button = ({children, ...props}) => (
// 	<TouchableOpacity style={styles.button} {...props}>
// 	  <Text style={styles.buttonText}>{children}</Text>
// 	</TouchableOpacity>
//   );

// const NoInternetModal = ({show, isRetrying}) => (
// 	<Modal visible={show} transparent={true} animationType="slide" statusBarTranslucent={true}>
// 		<View style={styles.modal}>
// 			<View style={styles.modalContainer}>
// 				<Text style={styles.modalTitle}>Connection Error</Text>
// 				<Text style={styles.modalText}>
// 				Oops! Looks like your device is not connected to the Internet.
// 				</Text>
// 				<Button onPress={() => console.log('retry')} disabled={isRetrying}>
// 				Try Again
// 				</Button>
// 			</View>
// 		</View>
// 	</Modal>
//   );



export default AppStackNav = () => {
	const scheme = useColorScheme();
	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.isLoading);
	const isSignedIn = useSelector(state => state.isSignedIn);
	const loginDetails = useSelector(state => state.loginDetails);

	// const [isOffline, setOfflineStatus] = useState(false);
	
	// useEffect(() => {
	// 	const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
	// 	const offline = !(state.isConnected && state.isInternetReachable);
	// 		setOfflineStatus(offline);
	// 		dispatch(setOnline(!offline));
	// 	});
	
	// 	return () => removeNetInfoSubscription();
	// }, []);

	const removeLoginLocal = async () => {
		try {
			await AsyncStorage.removeItem('loginData');
			dispatch(logout());
		} catch (err) {
			
		}
	};

	const logoutAction = () => {
		Alert.alert(
			"Logout",
			"Are you sure you want to logout?",
			[
			{
				text: "Cancel",
				style: "cancel"
			},
			{ text: "OK", onPress: () => removeLoginLocal() }
			]
		);
		}

	const stateConditionString = () => {
		let navigateTo = '';
		if (isLoading) {
			navigateTo = 'LOAD_APP';
		}
		if (isSignedIn && loginDetails && !isLoading) {
			navigateTo = 'LOAD_HOME';
		}
		if (!isSignedIn && !isLoading) {
			navigateTo = 'LOAD_SIGNIN';
		}
		return navigateTo;
	};

	homeScreens = () => {
		return(
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} options={{title: 'Home'}} />
				{/*<Stack.Screen name="Product" component={Products} options={({navigation}) => ({
					title: 'Products',
					// headerLeft: () => (
					// 	<TouchableOpacity style={{marginRight: 10}}
					// 		onPress={() => {
					// 			logoutAction();
					// 		}}
					// 	>
					// 		<Icon name="log-out" size={30} color="#ed0909" />
					// 	</TouchableOpacity>
					// ),
					headerRight: () => (
						// <Icon.Button
						// 	name="cart"
						// 	// backgroundColor="#097fed"
						// 	color="#ffffff"
						// 	onPress={() => navigation.navigate('Sales')}
						// >
						// </Icon.Button>
						<TouchableOpacity
							onPress={() => navigation.navigate('Sales')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					)
				})} 
				/>*/}
				<Stack.Screen
					name="Product"
					component={Products}
					options={({ navigation }) => ({
						title: 'Products',
						headerRight: () => (
							<View style={{ flexDirection: 'row', gap: 15, marginRight: 10 }}>
								<TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('InAppBrowserScreen',{saleType:"Godown"})}>
									<Icon name="camera" size={30} color="#097fed" />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => navigation.navigate('Sales')}>
									<Icon name="cart" size={30} color="#097fed" />
								</TouchableOpacity>
							</View>
						)
					})}
				/>
				<Stack.Screen name="Counter2Sale" component={Counter2Sale} options={({navigation}) => ({
					title: 'Counter2 Sale',
					headerRight: () => (
					<View style={{ flexDirection: 'row', gap: 15, marginRight: 10 }}>
						<TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('InAppBrowserScreen',{saleType:"Counter"})}>
									<Icon name="camera" size={30} color="#097fed" />
								</TouchableOpacity>
						<TouchableOpacity
							onPress={() => navigation.navigate('Counter2SalesCart')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					</View>
					)
				})} 
				/>
				<Stack.Screen name="Sales" component={Sales} options={{title: 'Cart'}} />
				<Stack.Screen name="InAppBrowserScreen" component={InAppBrowserScreen}/>
				<Stack.Screen name="Counter2SalesCart" component={Counter2SalesCart} options={{title: 'Counter2 Cart'}} />
				<Stack.Screen name="Stock" component={Stock} />
				<Stack.Screen name="Order" component={Orders} />
				<Stack.Screen name="Shop" component={Shop} />
				{/*<Stack.Screen name="Expense" component={Expense} />*/}
				<Stack.Screen name="Expense" component={Expense} options={({navigation}) => ({
					title: 'Expense',
					headerRight: () => (
						<TouchableOpacity
							onPress={() => navigation.navigate('ExpenseList')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					)
				})} 
				/>
				<Stack.Screen name="AddDenom" component={Denomination} options={{title: 'Add Denomination'}} />
				<Stack.Screen name="ExpenseList" component={ExpenseList} options={{title: 'Expenditure'}} />
				<Stack.Screen name="ExpenditureDate" component={ExpenditureDate} options={{title: 'Expense List'}} />
				<Stack.Screen name="ExpenseHistory" component={ExpenseHistory} options={{title: 'Expense History'}} />
				<Stack.Screen name="DenomList" component={DenomList} options={{title: 'Denomination'}} />
				<Stack.Screen name="DenominationDate" component={DenominationDate} options={{title: 'Denomination'}} />
				<Stack.Screen name="AddSale" component={AddSale} options={{title: 'Add Sale'}} />
				<Stack.Screen name="SaleDate" component={SaleDate} options={{title: 'Sales List'}} />
				<Stack.Screen name="Counter2SaleDate" component={Counter2SaleDate} options={{title: 'Counter2 Sales List'}} />
				<Stack.Screen name="SalesHistory" component={SalesHistory} options={{title: 'Sales'}} />
				<Stack.Screen name="CounterStock" component={CounterStock} options={{title: 'Counter Stock'}} />
				<Stack.Screen name="CounterStockDate" component={CounterStockDate} options={{title: 'Counter Stock'}} />
				<Stack.Screen name="GodownStock" component={GodownStock} options={{title: 'Godown Stock'}} />
				<Stack.Screen name="GodownStockDate" component={GodownStockDate} options={{title: 'Godown Stock'}} />
				{/*<Stack.Screen name="CounterTransfer" component={CounterTransfer} options={{title: 'Counter Transfer'}} />*/}
				<Stack.Screen name="CounterTransfer" component={CounterTransfer} options={({navigation}) => ({
					title: 'Counter Transfer',
					headerRight: () => (
						<TouchableOpacity
							onPress={() => navigation.navigate('CounterTransferCart')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					)
				})} 
				/>
				<Stack.Screen name="CounterTransferCart" component={CounterTransferCart} options={{title: 'Counter Transfer Cart'}} />
				<Stack.Screen name="Accounts" component={Accounts} />
				<Stack.Screen name="AccountsHistory" component={AccountsHistory} options={{title: 'Accounts'}}/>
				<Stack.Screen name="StockBalance" component={StockBalance} options={{title: 'Stock Balance'}}/>
				<Stack.Screen name="StockBalanceDate" component={StockBalanceDate} options={{title: 'Stock Balance'}}/>
				<Stack.Screen name="CounterSalesHistory" component={CounterSalesHistory} options={{title: 'Counter Sales'}} />
				<Stack.Screen name="PurchaseDate" component={PurchaseDate} options={{title: 'Purchase'}} />
				<Stack.Screen name="PurchaseList" component={PurchaseList} options={{title: 'Purchase List'}} />
				<Stack.Screen name="CounterTrasferDate" component={CounterTrasferDate} options={{title: 'Counter Transfer List'}} />
				<Stack.Screen name="CounterTransferHistory" component={CounterTransferHistory} options={{title: 'Counter Transfer History'}} />
				{/*<Stack.Screen name="AddPending" component={AddPending} options={{title: 'Add Pending Amount'}} />*/}
				<Stack.Screen name="AddPending" component={AddPending} options={({navigation}) => ({
					title: 'Add Pending Amount',
					headerRight: () => (
						<TouchableOpacity
							onPress={() => navigation.navigate('PendingCart')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					)
				})} 
				/>
				<Stack.Screen name="PendingCart" component={PendingCart} options={{title: 'Pending Amount'}} />
				<Stack.Screen name="PendingDate" component={PendingDate} options={{title: 'Pending Amount List'}} />
				<Stack.Screen name="PendingHistory" component={PendingHistory} options={{title: 'Pending Amount History'}} />
				{/*<Stack.Screen name="AddCrDr" component={CrDr} options={{title: 'Add Credit/Debit'}} />*/}
				<Stack.Screen name="AddCrDr" component={CrDr} options={({navigation}) => ({
					title: 'Add Credit/Debit',
					headerRight: () => (
						<TouchableOpacity
							onPress={() => navigation.navigate('CrDrCart')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					)
				})} 
				/>
				<Stack.Screen name="CrDrCart" component={CrDrCart} options={{title: 'Credit/Debit'}} />
				<Stack.Screen name="CrDrHistory" component={CrDrHistory} options={{title: 'Credit/Debit History'}} />
				<Stack.Screen name="CreditDate" component={CreditDate} options={{title: 'Credit History'}} />
				<Stack.Screen name="DebitDate" component={DebitDate} options={{title: 'Debit History'}} />
				<Stack.Screen name="CrHistory" component={CrHistory} options={{title: 'Credit History'}} />
				<Stack.Screen name="DrHistory" component={DrHistory} options={{title: 'Debit History'}} />
				{/*<Stack.Screen name="AddpAmount" component={AddpAmount} options={{title: 'Add Partner Amount'}} />*/}
				<Stack.Screen name="AddpAmount" component={AddpAmount} options={({navigation}) => ({
					title: 'Add Partner Amount',
					headerRight: () => (
						<TouchableOpacity
							onPress={() => navigation.navigate('PAmountCart')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					)
				})} 
				/>
				<Stack.Screen name="PAmountCart" component={PAmountCart} options={{title: 'Partner Amount cart'}} />
				<Stack.Screen name="PAmountDate" component={PAmountDate} options={{title: 'Partner Amount List'}} />
				<Stack.Screen name="PAmountHistory" component={PAmountHistory} options={{title: 'Partner Amount History'}} />
				{/*<Stack.Screen name="AddLoanAmount" component={AddLoanAmount} options={{title: 'Add Loan Amount'}} />*/}
				<Stack.Screen name="AddLoanAmount" component={AddLoanAmount} options={({navigation}) => ({
					title: 'Add Loan Amount',
					headerRight: () => (
						<TouchableOpacity
							onPress={() => navigation.navigate('LoanAmountCart')}
						>
							<Icon name="cart" size={30} color="#097fed" />
						</TouchableOpacity>
					)
				})} 
				/>
				<Stack.Screen name="LoanAmountCart" component={LoanAmountCart} options={{title: 'Loan Amount Cart'}} />
				<Stack.Screen name="LoanAmountDate" component={LoanAmountDate} options={{title: 'Loan Amount List'}} />
				<Stack.Screen name="LoanAmountHistory" component={LoanAmountHistory} options={{title: 'Loan Amount History'}} />
				<Stack.Screen name="ShareStockDateList" component={ShareStockDateList} options={{title: 'Shared Stock List'}} />
				<Stack.Screen name="ShareStockHistory" component={ShareStockHistory} options={{title: 'Shared Stock'}} />
				<Stack.Screen name="ReceivedStockDateList" component={ReceivedStockDateList} options={{title: 'Received Stock List'}} />
				<Stack.Screen name="ReceivedStockHistory" component={ReceivedStockHistory} options={{title: 'Received Stock'}} />
				<Stack.Screen name="RegisterCategory" component={RegisterCategory} options={{title: 'Register Book'}} />
				<Stack.Screen name="RegisterBook" component={RegisterBook} options={{title: 'Register Book'}} />
				<Stack.Screen name="RegisterBookTotal" component={RegisterBookTotal} options={{title: 'Register Book'}} />
			</Stack.Navigator>
		)
	}

	splashScreen = () => {
		return(
			<Stack.Navigator>
				<Stack.Screen name="Splash" component={ApploadingScreen} options={{headerShown: false}} />
			</Stack.Navigator>
		)
	}

	authScreen = () => {
		return(
			<Stack.Navigator>
				<Stack.Screen name="AuthScreen" component={AuthLogScreen} options={{headerShown: false}} />
			</Stack.Navigator>
		)
	}

	chooseScreen = () => {
		let navigateTo = stateConditionString();
		let arr = [];
	
		switch (navigateTo) {
			case 'LOAD_APP':
			arr.push(splashScreen());
			break;
			case 'LOAD_SIGNIN':
			arr.push(authScreen());
			break;
			case 'LOAD_HOME':
			arr.push(homeScreens());
			break;
			default:
			arr.push(authScreen());
			break;
		}
		return arr[0];
		};
		
	
	return(
		<SafeAreaView style={{flex: 1}}>
			<StatusBar
				backgroundColor={MyTheme.colors.card}
				barStyle={'light-content'}
				translucent
			/>
			<NavigationContainer theme={MyTheme}>
				{chooseScreen()}
			</NavigationContainer>
			{/* {isLoading ? null : <NoInternetModal
					show={isOffline}
					isRetrying={false}
				/>} */}
		</SafeAreaView>
		
	) 
}
