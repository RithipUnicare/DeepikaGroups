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
	import {logout, addCityList, addProductList} from '../redux/reducer';
	import {RadioButton, Searchbar} from 'react-native-paper';
	import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

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
			//color: '#ffffff'
			color: '#6ea2f4'
		},
		prodMrp: {
			fontSize: 10,
			fontWeight: 'bold',
			color:'#ffffff',
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
		btmbox:{
			flexDirection: 'row', 
			alignItems: 'center', 
			flex:1,
			borderColor:'#ccc',
			borderWidth:1,
		},
		btmColumn:{
			flexDirection: 'column', 
			flex:1,
		},
		text:{
			color: '#ffffff',
		},
	});

	export class StockBalance extends Component {

		constructor(props) {
			super(props);

			this.flatListRef;

			this.state = {
				productList: [],
				cashBalance: [],
				isLoading: true,
				modalVisible: false,
				reason: "",
				amount: null,
				expensLoading: false,
				expenseDisable: false,
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
        			toDate: new Date(this.props.route.params.selDate),
				},
				() => {
					this.fetchData();
				},
			);
		}

		fetchData = () => {
			const { loginDetails } = this.props;
			const {selDate, toDate, productList,cashBalance} = this.state;

			this.setState({
				productList: [],
				cashBalance:[]
			});

			if(Moment(selDate).format('yyyy-MM-DD') > Moment(toDate).format('yyyy-MM-DD')){
				ToastAndroid.show('Please select valid to date', ToastAndroid.SHORT);
				this.setState({
					toPickerVisible: true
				})
			} else if(Moment(selDate).format('yyyy-MM-DD') <= Moment(toDate).format('yyyy-MM-DD')){
				console.log(ser_url +
					'/stockBalance_report.php?company_no=' +
					loginDetails.ID +
					'&f_date=' +
					Moment(selDate).format('yyyy-MM-DD') + 
					'&t_date=' +
					Moment(toDate).format('yyyy-MM-DD'));
				fetch(
					ser_url +
					'/stockBalance_report.php?company_no=' +
					loginDetails.ID +
					'&f_date=' +
					Moment(selDate).format('yyyy-MM-DD') + 
					'&t_date=' +
					Moment(toDate).format('yyyy-MM-DD'),
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					}
				}).then((response) => response.json())
					.then((json) => {

						// console.log(json)
						if(json.StockBalance.length > 0){
							this.setState({
								productList: json.StockBalance, 
								cashBalance: json.StockCashBalance,
							})
						}else{
							this.setState({
								productList: [],
								cashBalance:[]
							})
						}

				}).catch((error) => alert(error))
					.finally(() => {
						this.setState({ isLoading: false });
				});
			}
		}

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
	 
		// onSwipe(gestureName, gestureState) {
		// 	const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
		// 	this.setState({gestureName: gestureName});
		// 	switch (gestureName) {
		// 		case SWIPE_LEFT:
		// 			// this.setState({backgroundColor: 'blue'});
		// 			break;
		// 		case SWIPE_RIGHT:
		// 			// this.setState({backgroundColor: 'yellow'});
		// 			break;
		// 	}
		// }

		handleSearch = text => {
			const formattedQuery = text.toLowerCase();

			let filteredData = this.state.productList.filter(function (item) {
				return item.product_name.toLowerCase().includes(formattedQuery);
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
			const { loginDetails } = this.props;
			const { 
				productList, 
				cashBalance,
				isLoading, 
				modalVisible, 
				reason, 
				amount, 
				expensLoading, 
				expenseDisable,
				selDate,
				pickerVisible,
				toDate,
				toPickerVisible, 
			} = this.state;

			if(isLoading){
				return(
					<View style={{paddingVertical: 20}}
					>
						<ActivityIndicator animating size="large" color="#0000ff" />
					</View>
				)
			}

			return (
				<View style={styles.container}>
					<View style={{marginBottom:'45%'}}>
						
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
						{/*<Icon
						    name="chevron-back"
						    size={20}
						    color={'#ffffff'}
						    style={{marginRight: 10}} 
						/>
						<Icon
						    name="chevron-forward"
						    size={20}
						    color={'#ffffff'}
						    style={{marginRight: 10}} 
						/>*/}

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
							<Text style={styles.text}>Search</Text>
						</TouchableOpacity>
						<View style={styles.typDvdr}></View>

						{/*<GestureRecognizer
						onSwipe={(direction, state) => this.onSwipe(direction, state)}
						onSwipeLeft={(state) => this.onSwipeLeft(state)}
						onSwipeRight={(state) => this.onSwipeRight(state)}
						>*/}

						{productList.length == 0 ? (

							<View style={{paddingVertical: 50}}>
								<Text style={{alignSelf: 'center', fontSize: 16, color: '#ffffff'}}>
									No Sales Added
								</Text>
							</View>

						) : (

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

												<Text style={styles.text}>
													Sr No:
												</Text>
												<Text style={styles.text}>
													{index+1}
												</Text>
											</View>
											<View style={{width:'90%'}}>
												<Text style={styles.prodName}>
													{item.product_name}
												</Text>

												{ item.MinimumCounterStock >= item.ClosingStockCounter  ? (
													<Text style={styles.text}>
														Counter Closing Stock: <Text style={{color: 'red'}}>{item.ClosingStockCounter}</Text>
													</Text>
												):(
													<Text style={styles.text}>
														Counter Closing Stock: {item.ClosingStockCounter}
													</Text>
												)}

												{ item.MinimumGodownStock >= item.ClosingStockGodown ? (
													<Text style={styles.text}>
														Godown Closing Stock: <Text style={{color: 'red'}}>{item.ClosingStockGodown}</Text>
													</Text>
												):(
													<Text style={styles.text}>
														Godown Closing Stock: {item.ClosingStockGodown}
													</Text>
												)}

												<Text style={{color: '#ffffff', fontWeight:'bold'}}>
													Total: {parseFloat(item.ClosingStockCounter)+parseFloat(item.ClosingStockGodown)}
												</Text>
												<Text style={styles.text}>
													Purchase Price Per Bottle: {parseFloat(item.purchase_price).toFixed(4)}
												</Text>  
												<Text style={styles.text}>
													Purchase Price Box: {parseFloat(item.total_CBs)}
												</Text>                    
												<Text style={{color: '#ffffff', fontWeight:'bold'}}>
													Amount: {parseFloat(item.Amount) }
												</Text>
											</View>
										</View> 
									</View>
									)}
								keyExtractor={(item, index) => 'counterStock'+index}
							/>
						)}
						{/*</GestureRecognizer>*/}
					</View>
					
							{cashBalance.length > 0 ? 
								<View style={{bottom: 0,position:'absolute',width:'105%', backgroundColor:'blue'}}>
					
									<View style={{alignItems: 'center',padding:2, flexDirection: 'row',borderColor:'#cccc',borderWidth:1}}>
										
										<View style={styles.btmColumn}>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Stock Bal: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{parseFloat(cashBalance[0].GrandTotal).toFixed(2)}
												</Text>
											</View>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Cash Bal: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{parseFloat(cashBalance[0].CashBalance).toFixed(2)}
												</Text>
											</View>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Total: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{(parseFloat(cashBalance[0].GrandTotal) + parseFloat(cashBalance[0].CashBalance)).toFixed(4)}
												</Text>
											</View>
										</View>
										<View style={styles.btmColumn}>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Total: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{(parseFloat(cashBalance[0].GrandTotal) + parseFloat(cashBalance[0].CashBalance)).toFixed(4)}
												</Text>
											</View>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Stock Bal: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{parseFloat(cashBalance[0].GrandTotal).toFixed(2)}
												</Text>
											</View>
											
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Cash Bal: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{((parseFloat(cashBalance[0].GrandTotal) + parseFloat(cashBalance[0].CashBalance)) - parseFloat(cashBalance[0].GrandTotal)).toFixed(4)}
												</Text>
											</View>
										</View>
										<View style={styles.btmColumn}>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Denomination: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{parseFloat(cashBalance[0].Denomination).toFixed(2)}
												</Text>
											</View>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Pending Amt: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{parseFloat(cashBalance[0].PendingAmount).toFixed(2)}
												</Text>
											</View>
											<View style={styles.btmbox}>
												<Text style={styles.prodMrp}>Total: </Text>
												<Text style={styles.prodMrp}>
													{'\u20B9'}
													{(parseFloat(cashBalance[0].Denomination) + parseFloat(cashBalance[0].PendingAmount)).toFixed(4)}
												</Text>
											</View>
										</View>
									</View>
								</View>
							: null}
					</View>
			)
		}
	}

	const mapStateToProps = state => ({
		loginDetails: state.loginDetails,
		rproductList: state.productList,
	});


	export default connect(mapStateToProps, {addProductList})(StockBalance);