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
	Modal,
	Pressable,
	ToastAndroid,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import {addCityList, addProductList} from '../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../redux/reducer';
import {RadioButton, Searchbar} from 'react-native-paper';
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
	},
	codeName: {
		fontSize: 16,
		marginBottom: 5,
		// textAlign: 'center',
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
		color: '#6ea2f4'
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
	inputQty: {
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 5,
		// marginHorizontal: 10,
		padding: 5,
		textAlign: 'center',
		fontSize: 16,
		width: '100%',
		color: 'black',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		// margin: 20,
		width: '80%',
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
		color: 'black',
	},
});

const removeLoginLocal = async () => {
	try {
		await AsyncStorage.removeItem('loginData');
	} catch (err) {}
};

export class CounterTransfer extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		this.state = {
			productList: [],
			isLoading: true,
			modalVisible: false,
			transferModalVisible: false,
			inputValue: 0,
			saleProdDetail: {},
			saleLoading: false,
			selectedPrice: null,
			searchQuery: '',
			filteredData: [],
			relCounter: null,
			selDate: new Date(),
			pickerVisible: false,
			currentPage : 1,
			formattedQuery:'',
			isSearch: false,
			searchQuery: '',
		};
		this.isMountedFlag = false;
	}

	componentDidMount() {
		this.isMountedFlag = true;
		this.focusListener = this.props.navigation.addListener('focus',
				() => this.refreshfunc());
		const nextPage = this.state.currentPage;
    	this.fetchData(nextPage);
		this.fetchCounterDetails();
	}

	componentWillUnmount() {
	    this.isMountedFlag = false; // Set the flag to false
	    if (this.focusListener) {
	    	this.focusListener(); // Remove the navigation listener
	    }
	}

	refreshfunc = () => {
		if (!this.isMountedFlag) return;
		this.setState({
			productList: [],
		});
		const nextPage = this.state.currentPage;
    	this.fetchData(nextPage);
		this.fetchCounterDetails();
	};

	fetchData = (page = 1, isSearch = false, searchQuery = '', preserveExisting = true) => {

	    const { loginDetails } = this.props;
	    const { isFetchingMore } = this.state;

	    if (!loginDetails?.ID || !loginDetails?.Type) {
	        alert("Missing company details!");
	        return;
	    }

	    if (isFetchingMore) return; // Prevent multiple API calls

	    this.setState({ isFetchingMore: true });

	    let url = ser_url+'/product.php?company_no='+loginDetails.ID+'&type='+loginDetails.Type+'&page='+page;
	    if (isSearch && searchQuery) {
	        url += '&search='+encodeURIComponent(searchQuery);
	    }

	    fetch(url, {
	        method: 'GET',
	        headers: {
	            Accept: 'application/json',
	            'Content-Type': 'application/json',
	        },
	    })
	    .then(response => response.json())
	    .then(json => {
	        if (json?.Product?.length > 0) {
	            this.setState(prevState => {
	                const newProducts = json.Product.filter(
	                    product => !prevState.productList.some(p => p.p_id === product.p_id)
	                );

	                return {
	                    productList: preserveExisting 
	                        ? [...prevState.productList, ...newProducts] 
	                        : newProducts, 
	                    filteredData: isSearch ? newProducts : prevState.filteredData, 
	                    currentPage: page,
	                    isFetchingMore: false,
	                    hasMoreData: json.Product.length > 0, 
	                };
	            });
	        } else {
	            this.setState({ isFetchingMore: false, hasMoreData: false, filteredData: [] });
	        }
	        this.setState({ isFetchingMore: false, isLoading: false});
	    })
	    .catch(error => {
	        console.log(error);
	        this.setState({ isFetchingMore: false, isLoading: false });
	    });
	};

	// Function to load more data when scrolling
	loadMoreData = () => {
		this.setState({ searchQuery: '', isSearch: false});
	    if (this.state.hasMoreData && !this.state.isFetchingMore) {
	        const nextPage = this.state.currentPage + 1;
	        this.fetchData(nextPage);
	    }
	};

	fetchCounterDetails = () => {
		const {loginDetails} = this.props;
		// console.log(JSON.stringify(loginDetails))

		fetch(ser_url + '/counter_list.php?g_id=' + loginDetails.ID, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => {
				// console.log(JSON.stringify(json))
				this.setState({relCounter: json.Counter_List[0]});
				// if(json.Product.length > 0){
				//   this.setState({
				//     productList: json.Product
				//   })
				// }
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	transferToCounter = () => {
		const {
			productList,
			isLoading,
			modalVisible,
			inputValue,
			saleProdDetail,
			saleLoading,
			relCounter,
			selDate,
			formattedQuery,
			isSearch,
			filteredData,
		} = this.state;
		const {loginDetails, rproductList} = this.props;
		//alert(JSON.stringify(relCounter))
		if (relCounter) {
			var totalPrice = inputValue * saleProdDetail.counter_price;

			if (
				inputValue &&
				inputValue > 0 &&
				parseInt(inputValue, 10) <= parseInt(saleProdDetail.stock, 10)
			) {
							console.log(ser_url +
						'/counter_transfer.php?g_id=' +
						loginDetails.ID +
						'&c_id=' +
						relCounter.counter_id +
						'&p_id=' +
						saleProdDetail.p_id +
						'&p_price=' +
						saleProdDetail.purchase_price +
						'&c_price=' +
						saleProdDetail.counter_price +
						'&qty=' +
						inputValue +
						'&stock=' +
						saleProdDetail.stock)
				fetch(
					ser_url +
						'/counter_transfer.php?g_id=' +
						loginDetails.ID +
						'&c_id=' +
						relCounter.counter_id +
						'&p_id=' +
						saleProdDetail.p_id +
						'&p_price=' +
						saleProdDetail.purchase_price +
						'&c_price=' +
						saleProdDetail.counter_price +
						'&qty=' +
						inputValue +
						'&stock=' +
						saleProdDetail.stock,
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
						if (json.Success == 0) {

							// ✅ Update stock in both filteredData & productList
		                    const updatedFilteredData = filteredData.map(product => {
		                        if (product.p_id === saleProdDetail.p_id) {
		                            return {
		                                ...product,
		                                stock: product.stock - inputValue, // Reduce stock count
		                            };
		                        }
		                        return product;
		                    });

		                    const updatedProductList = productList.map(product => {
		                        if (product.p_id === saleProdDetail.p_id) {
		                            return {
		                                ...product,
		                                stock: product.stock - inputValue, // Reduce stock count
		                            };
		                        }
		                        return product;
		                    });

							this.setState({
								productList: updatedProductList, // Keep full product list intact
	                        	filteredData: updatedFilteredData, // Keep filtered search results intact
								transferModalVisible: false,
								inputValue: 0,
							});
							ToastAndroid.showWithGravity(
								'Product transferred to counter successfully.',
								ToastAndroid.SHORT,
								ToastAndroid.TOP,
							);
						} else {
							ToastAndroid.showWithGravity(
								json.Messages,
								ToastAndroid.SHORT,
								ToastAndroid.TOP,
							);
						}
					})
					.catch(error => console.log(error))
					.finally(() => {
						this.setState({saleLoading: false});
					});
			} else {
				this.setState({saleLoading: false});
				ToastAndroid.showWithGravity(
					'Quantity should be greater than 0 and smaller than stock',
					ToastAndroid.SHORT,
					ToastAndroid.TOP,
				);
			}
		} else {
			this.setState({saleLoading: false});
			ToastAndroid.showWithGravity(
				'Counter not available',
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
			);
		}
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

	handleSearch = text => {
	    const formattedQuery = text.toLowerCase();

	    this.setState({ 
	        formattedQuery,
	        searchQuery: text, 
	        isSearch: true 
	    });

	    // Check if search term matches any already loaded products
	    let filteredData = this.state.productList.filter(item =>
	        item.product_name.toLowerCase().includes(formattedQuery)
	    );

	    if (filteredData.length === 0) {
	        // If no results found in the current list, immediately fetch from API
	        this.fetchData(1, true, formattedQuery);
	    } else {
	        // If results found locally, update state immediately
	        this.setState({ filteredData });
	    }
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
				placeholder="Search min 4 character"
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
		const {loginDetails, rproductList} = this.props;
		const {
			productList,
			isLoading,
			modalVisible,
			inputValue,
			saleProdDetail,
			saleLoading,
			selectedPrice,
			searchQuery,
			transferModalVisible,
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
		if (productList.length == 0) {
			return (
				<View style={{paddingVertical: 50}}>
					<Text style={{alignSelf: 'center', fontSize: 16, color: '#ffffff'}}>
						No products available
					</Text>
				</View>
			);
		}
		return (
			<View style={styles.container}>
				{/* <View style={{paddingHorizontal: 10,}}> */}
				{/* <Text style={styles.shopName}>{loginDetails.Shop_Name}</Text> */}
				{/* <Text style={styles.codeName}>Shop Number - {loginDetails.Shop_No}</Text>
						<Text style={styles.codeName}>Shop Type - {loginDetails.Type}</Text>
						<Text style={styles.codeName}>Location - {loginDetails.Location}</Text> */}
				{/* </View> */}
				{/* <View> */}
				<FlatList
					data={
						this.state.filteredData && this.state.filteredData.length > 0
							? this.state.filteredData
							: productList
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
									<Text style={styles.prodName}>{item.product_name}</Text>
									{/* <Text style={styles.prodRetail}>Code - {item.product_code}</Text> */}
									<Text style={styles.prodMrp}>Stock - {item.stock}</Text>
									<Text style={{color: '#ffffff'}}>
										CBs Purchase Amount: {'\u20B9'}
										{loginDetails.Type == 'Godown'
											? parseFloat(item.purchase_price_CBs).toFixed(2)
											: parseFloat(item.purchase_price_CBs).toFixed(2)}
									</Text>
									<Text style={{color: '#ffffff'}}>
										Bottle Purchase Amount: {'\u20B9'}
										{loginDetails.Type == 'Godown'
											? parseFloat(item.purchase_price_Btl).toFixed(2)
											: parseFloat(item.purchase_price_Btl).toFixed(2)}
									</Text>
									{/* <Text style={styles.prodRetail}>MRP - {'\u20B9'}{item.price5}</Text>
												<Text style={styles.prodRetail}>Retail - {'\u20B9'}{item.price4}</Text>
												<Text style={styles.prodRetail}>Price 1 - {'\u20B9'}{item.price1}</Text>
												<Text style={styles.prodRetail}>Price 2 - {'\u20B9'}{item.price2}</Text>
												<Text style={styles.prodRetail}>Price 3 - {'\u20B9'}{item.price3}</Text> */}
									<View
										style={{
											flexDirection: 'row',
											marginVertical: 5,
											justifyContent: 'space-between',
										}}>
										{/*<TouchableOpacity
											style={{
												backgroundColor: 'green',
												justifyContent: 'center',
												alignItems: 'center',
												paddingHorizontal: 10,
												borderRadius: 5,
												paddingVertical: 5,
											}}
											onPress={() =>
												this.setState({
													modalVisible: !modalVisible,
													saleProdDetail: item,
													selectedPrice: 'price1',
													selDate: new Date(),
												})
											}>
											<Text style={{fontSize: 16, color: 'white'}}>
												Add to Sale
											</Text>
										</TouchableOpacity>*/}
										{loginDetails.Type == 'Godown' ? (
											<TouchableOpacity
												style={{
													backgroundColor: 'green',
													justifyContent: 'center',
													alignItems: 'center',
													paddingHorizontal: 10,
													borderRadius: 5,
													paddingVertical: 5,
												}}
												onPress={() =>
													this.setState({
														transferModalVisible: !transferModalVisible,
														saleProdDetail: item,
														selectedPrice: 'counter_price',
														selDate: new Date(),
													})
												}>
												<Text style={{fontSize: 16, color: 'white'}}>
													To Counter
												</Text>
											</TouchableOpacity>
										) : null}
									</View>
								</View>
							</View>
						</View>
					)}
					keyExtractor={(item) => item.p_id.toString()}
					onEndReached={this.loadMoreData} // Triggers loadMoreData on scroll
				    onEndReachedThreshold={0.2} // Adjust threshold (20% from bottom)
				    // ListFooterComponent={() => (
				    //     this.state.isFetchingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null
				    // )}
				/>
				{/* </View> */}

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

				<Modal
					animationType="fade"
					transparent={true}
					visible={transferModalVisible}
					>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text
								style={[
									styles.modalText,
									{
										fontSize: 18,
										fontWeight: 'bold',
										textDecorationStyle: 'solid',
										textDecorationColor: 'black',
										textDecorationLine: 'underline',
									},
								]}>
								Transfer to Counter
							</Text>
							<Text
								style={[styles.modalText, {fontSize: 16, fontWeight: 'bold'}]}>
								{saleProdDetail.product_name}
							</Text>
							<Text
								style={[styles.modalText, {fontSize: 14, fontWeight: 'bold'}]}>
								Opening Stock - {saleProdDetail.stock}
							</Text>
							<Text
								style={[styles.modalText, {fontSize: 14, fontWeight: 'bold'}]}>
								Closing Stock - {saleProdDetail.stock-inputValue}
							</Text>
							<TouchableOpacity
								style={{
									paddingHorizontal: 10,
									marginVertical: 10,
									backgroundColor: 'blue',
									justifyContent: 'center',
									borderRadius: 5,
									paddingVertical: 5,
								}}
								onPress={() => this.setState({pickerVisible: true})}>
								<Text
									style={{fontSize: 14, fontWeight: 'bold', color: '#ffffff'}}>
									Date: {Moment(selDate).format('Do MMMM YYYY')}
								</Text>
							</TouchableOpacity>
							<TextInput
								style={styles.inputQty}
								onChangeText={value => this.setState({inputValue: value})}
								// value={userName}
								placeholder="Enter Quantity"
								// editable={isEditable}
								keyboardType="number-pad"
								placeholderTextColor="grey"
							/>

							{/* <RadioButton.Group onValueChange={newValue => this.setState({selectedPrice: newValue})} value={selectedPrice}>
									<View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
										<RadioButton value="mrp_price" />
										<Text style={[styles.prodRetail, {color: 'black'}]}>MRP - {'\u20B9'}{saleProdDetail.mrp_price}</Text>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
										<RadioButton value="retail_price" />
										<Text style={[styles.prodRetail, {color: 'black'}]}>Retail - {'\u20B9'}{saleProdDetail.retail_price}</Text>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
										<RadioButton value="price1" />
										<Text style={[styles.prodRetail, {color: 'black'}]}>Price 1 - {'\u20B9'}{saleProdDetail.price1}</Text>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
										<RadioButton value="price2" />
										<Text style={[styles.prodRetail, {color: 'black'}]}>Price 2 - {'\u20B9'}{saleProdDetail.price2}</Text>
									</View>
									<View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
										<RadioButton value="price3" />
										<Text style={[styles.prodRetail, {color: 'black'}]}>Price 3 - {'\u20B9'}{saleProdDetail.price3}</Text>
									</View>
								</RadioButton.Group> */}

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-evenly',
									alignItems: 'center',
									marginVertical: 20,
									width: '100%',
								}}>
								<TouchableOpacity
									style={{
										backgroundColor: 'green',
										justifyContent: 'center',
										alignItems: 'center',
										padding: 5,
										paddingHorizontal: 10,
										borderRadius: 5,
										paddingVertical: 5,
									}}
									onPress={() => {
										if (!saleLoading) {
											this.setState({saleLoading: true});
											this.transferToCounter();
										}
									}}>
									<Text
										style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
										Transfer
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={{
										backgroundColor: 'red',
										justifyContent: 'center',
										alignItems: 'center',
										paddingHorizontal: 10,
										borderRadius: 5,
										paddingVertical: 5,
									}}
									onPress={() => {
										if (!saleLoading) {
											this.setState({
												transferModalVisible: !transferModalVisible,
											});
										}
									}}>
									<Text
										style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
										Cancel
									</Text>
								</TouchableOpacity>
							</View>

							{saleLoading ? (
								<ActivityIndicator animating size="large" color="#0000ff" />
							) : null}
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
	rproductList: state.productList,
});

export default connect(mapStateToProps, {logout, addProductList})(CounterTransfer);
