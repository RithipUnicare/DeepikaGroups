import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TextInput,
	Button,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	FlatList,
	ToastAndroid,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout, addCityList, addProductList} from '../redux/reducer';
import {RadioButton, Searchbar} from 'react-native-paper';
// import SelectDropdown from 'react-native-select-dropdown';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';

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
		// textAlign: 'center',
		color: '#ffffff',
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
		width: '40%',
		height: 100,
		backgroundColor: '#841584',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10,
		borderRadius: 10,
	},
	optionName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#ffffff',
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
		color: '#6ea2f4',
		//color: '#ffffff',
	},
	prodMrp: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	prodRetail: {
		fontSize: 14,
		color: '#ffffff',
	},
	inText: {
		color: '#ffffff',
		fontSize: 16,
	}
});

const removeLoginLocal = async () => {
	try {
		await AsyncStorage.removeItem('loginData');
	} catch (err) {}
};

const selArea = ['Morapur'];
const selStore = ['ANS'];

export class Sales extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		this.state = {
			productList: [],
			isLoading: true,
			totalAmt: 0,
			areaSel: null,
			storeSel: null,
			cityLists: [],
			selCusList: [],
			selDate: '',
			pickerVisible: false,
		};
	}

	componentDidMount() {
		const {cityList} = this.props;
		this.fetchData();
		// this.fetchCityList();
		// console.log(JSON.stringify(cityList))
	}

	fetchData = () => {
		const { loginDetails } = this.props;

		fetch(ser_url + '/cart_list.php?company_no=' + loginDetails.ID, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => {
				if (json.Cart_List.length > 0) {
					let tamt = 0;
					let products = [];

					json.Cart_List.forEach(item => {
						if (item.saleType === 'Godown') {
							tamt += parseFloat(item.T_Price);
							products.push(item); // Add item to the products array
						}
					});

					this.setState({
						productList: products, // Update state with all Counter items
						totalAmt: tamt,       // Total amount
					});

					this.props.addProductList(products); // Pass array of products
				} else {
					this.setState({
						productList: [],
						totalAmt: 0,
					});

					this.props.addProductList([]); // Clear product list
				}
			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({ isLoading: false });
			});
	};


	fetchProductData = () => {
		const {loginDetails} = this.props;
		fetch(
			ser_url +
				'/product.php?company_no=' +
				loginDetails.ID +
				'&type=' +
				loginDetails.Type,
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
				if (json.Product.length > 0) {
					this.props.addProductList(json.Product);
				} else {
					this.props.addProductList([]);
				}
			})
			.catch(error => console.log('fetch', error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	rmFromCart = prData => {
		const {loginDetails} = this.props;
		fetch(
			ser_url +
				'/cart_delete.php?cart_id=' +
				prData.Cart_ID +
				'&company_no=' +
				loginDetails.ID +
				'&type=' +
				loginDetails.Type,
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
				// if(json.Cart_List.length > 0){
				//   this.setState({
				//     productList: json.Cart_List
				//   })
				// }
				this.fetchData();
				//this.fetchProductData();
			})
			.catch(error => console.log('remove ',error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	fetchCityList = () => {
		// console.log("fetch")
		fetch(ser_url + '/city_list.php', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => {
				// console.log(JSON.stringify(json))
				if (json.City_List.length > 0) {
					this.setState({
						cityLists: json.City_List,
					});
					// this.props.addCityList(json.City_List);
				}
			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	fetchCustList = cityId => {
		const {loginDetails} = this.props;

		fetch(ser_url + '/customer_list.php?c_id=' + cityId, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => {
				// console.log(JSON.stringify(json));
				// if(json.Cart_List.length > 0){
				//   this.setState({
				//     productList: json.Cart_List
				//   })
				// }
				this.setState({selCusList: json.Customer_List});
			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	placeOrder = () => {
		const {loginDetails} = this.props;
		const {areaSel, storeSel, selDate} = this.state;

		if (!selDate) {
			ToastAndroid.showWithGravity(
				"Please add date",
				ToastAndroid.SHORT,
				ToastAndroid.TOP
			);
		} else {

			fetch(
				ser_url +
					'/product_purchase.php?c_no=' +
					loginDetails.ID +
					'&type=' +
					loginDetails.Type +
					'&e_date=' +
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
					// alert(JSON.stringify(json));
					if (json.Success == 0) {
						ToastAndroid.showWithGravity(
							'Sales order placed successfully.',
							ToastAndroid.SHORT,
							ToastAndroid.TOP,
						);
						this.props.navigation.goBack();
					} else {
						ToastAndroid.showWithGravity(
							'Failed, try again.',
							ToastAndroid.SHORT,
							ToastAndroid.TOP,
						);
					}
				})
				.catch(error => alert(error))
				.finally(() => {
					// this.setState({ isLoading: false });
				});
		}
	};

	logoutAction = () => {
		removeLoginLocal();
		this.props.logout();
	};

	logout = () => {
		Alert.alert('Logout', 'Are you sure you want to logout??', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{text: 'OK', onPress: () => this.logoutAction()},
		]);
	};

	handleSearch = text => {
		const formattedQuery = text.toLowerCase();

		let filteredData = this.props.rproductList.filter(function (item) {
			return item.Product_Name.toLowerCase().includes(formattedQuery);
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
		const {navigate} = this.props.navigation;
		const {loginDetails, cityList, rproductList} = this.props;
		const {
			productList,
			isLoading,
			totalAmt,
			selCusList,
			cityLists,
			selDate,
			pickerVisible,
			searchText, 
			suggestions
		} = this.state;
		if (isLoading) {
			return (
				<View style={{paddingVertical: 20}}>
					<ActivityIndicator animating size="large" color="#0000ff" />
				</View>
			);
		}
		if (productList.length == 0) {
			return (
				<View style={{paddingVertical: 50}}>
					<Text style={{alignSelf: 'center', fontSize: 16, color: '#ffffff'}}>
						No sales yet
					</Text>
				</View>
			);
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
						Date: {selDate ? Moment(selDate).format('Do MMMM YYYY'): '           '}
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
									<Text style={styles.prodName}>{item.Product_Name}</Text>
									{/* <Text style={styles.prodRetail}>Code - {item.Product_Code}</Text> */}
									<Text style={styles.prodMrp}>Qty - {item.Qty}</Text>
									<Text style={styles.prodRetail}>
										Selected Price - {'\u20B9'}
										{parseFloat(item.P_Price).toFixed(2)}
									</Text>
									<Text style={styles.prodRetail}>
										Total Price - {'\u20B9'}
										{parseFloat(item.T_Price).toFixed(2)}
									</Text>
									<View style={{flexDirection: 'row', marginVertical: 5}}>
										<TouchableOpacity
											style={{
												backgroundColor: 'red',
												justifyContent: 'center',
												alignItems: 'center',
												padding: 5,
												borderRadius: 5,
											}}
											onPress={() =>
												Alert.alert(
													'Remove Item',
													'Do you want to remove item from cart?',
													[
														{
															text: 'Yes',
															onPress: () => this.rmFromCart(item),
														},
														{
															text: 'No',
															style: 'cancel',
														},
													],
												)
											}>
											<Text style={{fontSize: 16, color: 'white'}}>Remove</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
					)}
					keyExtractor={(item, index) => 'sale' + index}
				/>
				{/* </View> */}

				{productList.length > 0 ? (
					<View style={{bottom: 0, flexDirection: 'column'}}>
						<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
							Total Amount - {'\u20B9'}
							{totalAmt.toFixed(2)}
						</Text>
						<TouchableOpacity
							style={{
								backgroundColor: 'green',
								justifyContent: 'center',
								alignItems: 'center',
								padding: 15,
								borderRadius: 5,
							}}
							onPress={() =>
								Alert.alert(
									'Place Order',
									'Are you sure you want to place sales order?',
									[
										{
											text: 'Cancel',
											style: 'cancel',
										},
										{text: 'Yes', onPress: () => this.placeOrder()},
									],
								)
							}>
							<Text style={{fontSize: 20, color: 'white'}}>Place Order</Text>
						</TouchableOpacity>
					</View>
				) : null}

				{/* <View style={styles.actionBlock}>
						<TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Product')}>
							<Text style={styles.optionName}>Products</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Sales')}>
							<Text style={styles.optionName}>Sales</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Order')}>
							<Text style={styles.optionName}>Orders</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.optionBlock} onPress={() => navigate('Stock')}>
							<Text style={styles.optionName}>Stock</Text>
						</TouchableOpacity>
					</View> */}
				{/* <TouchableOpacity style={styles.logout} onPress={() => this.logout()}>
						<Text style={styles.optionName}>Log Out</Text>
					</TouchableOpacity> */}
			</View>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
	cityList: state.cityList,
	rproductList: state.productList,
});

export default connect(mapStateToProps, {logout, addProductList})(Sales);
