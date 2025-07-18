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
		fontSize: 20,
		fontWeight: 'bold',
		color: '#ffffff'
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

export class GodownStock extends Component {

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
		const {selDate, toDate, productList} = this.state;

		this.setState({
			productList: [],
		});

		if(Moment(selDate).format('yyyy-MM-DD') > Moment(toDate).format('yyyy-MM-DD')){
			ToastAndroid.show('Please select valid to date', ToastAndroid.SHORT);
			this.setState({
				toPickerVisible: true
			})
		} else if(Moment(selDate).format('yyyy-MM-DD') <= Moment(toDate).format('yyyy-MM-DD')){

			fetch(
				ser_url +
				'/get_gowdown_stock.php?g_id=' +
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

					//console.log(json.Godown_stock)
					if(json.Godown_stock.length > 0){
						this.setState({
							productList: json.Godown_stock
						})
						this.props.addProductList(json.Godown_stock);
					}else{
						this.setState({
							productList: []
						})
						this.props.addProductList([]);
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
	// onSwipeLeft(gestureState) {
		
	//   const {selDate, toDate} = this.state;

	//   var difference = (Moment(selDate).diff(toDate, 'days') - 1);
	//   var left_selDate = Moment(selDate, "DD-MM-YYYY").add(-1*difference, 'days');
	//   var left_toDate = Moment(toDate, "DD-MM-YYYY").add(-1*difference, 'days');

	//   this.setState({
	//     selDate: new Date(left_selDate),
	//     toDate: new Date(left_toDate),
	//   });

	//   this.fetchData();
	// }
 
	// onSwipeRight(gestureState) {

	//   const {selDate, toDate} = this.state;

	//   var difference = Moment(selDate).diff(toDate, 'days') - 1;
	//   var right_selDate = Moment(selDate, "DD-MM-YYYY").add(difference, 'days');
	//   var right_toDate = Moment(toDate, "DD-MM-YYYY").add(difference, 'days');

	//   this.setState({
	//     selDate: new Date(right_selDate),
	//     toDate: new Date(right_toDate),
	//   });

	//   this.fetchData();
	// }
 
	// onSwipe(gestureName, gestureState) {
	//   const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
	//   this.setState({gestureName: gestureName});
	//   switch (gestureName) {
	//     case SWIPE_LEFT:
	//       // this.setState({backgroundColor: 'blue'});
	//       break;
	//     case SWIPE_RIGHT:
	//       // this.setState({backgroundColor: 'yellow'});
	//       break;
	//   }
	// }

	getTotalAmount = (prodListData) => {
		let tamt = 0;
		prodListData.map((item) => {
			tamt = tamt + parseFloat(item.purchase_amount) *
													((parseFloat(item.opening_stock) +
													parseFloat(item.purchase_stock)) -
													(parseFloat(item.sales) +
													(parseFloat(item.counter_transfer))));
		});

		return tamt;
	}

	handleSearch = text => {
		const formattedQuery = text.toLowerCase();

		let filteredData = this.props.rproductList.filter(function (item) {
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
				<View style={{paddingBottom:'50%'}}>
					{/*<GestureRecognizer
							onSwipe={(direction, state) => this.onSwipe(direction, state)}
							onSwipeLeft={(state) => this.onSwipeLeft(state)}
							onSwipeRight={(state) => this.onSwipeRight(state)}
							>*/}
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
									: rproductList
							}
							initialNumToRender={10}
							ListHeaderComponent={this.renderHeader}
							renderItem={({item, index}) => (
								<View style={styles.productlist}>
									<View style={{flexDirection:'row'}}>
										<View style={{width:'10%'}}>

											<Text style={{color: '#ffffff', fontWeight:'bold'}}>
												Sr No:
											</Text>
											<Text style={{color: '#ffffff', fontWeight:'bold'}}>
												{index+1}
											</Text>
										</View>
										<View style={{width:'90%'}}>
											<Text style={styles.prodName}>
												{item.product_name}
											</Text>
											<Text style={{color: '#ffffff'}}>
												Opening Stock: {parseFloat(item.opening_stock)}
											</Text>
											<Text style={{color: '#ffffff'}}>
												Purchases: {parseFloat(item.purchase_stock)}
											</Text>
											<Text style={{color: '#ffffff', fontWeight:'bold'}}>
												Total: {parseFloat(item.opening_stock)+parseFloat(item.purchase_stock)}
											</Text>
											<Text style={{color: '#ffffff'}}>
												Sales: {parseFloat(item.sales)}
											</Text>  
											<Text style={{color: '#ffffff'}}>
												Counter Transfer: {parseFloat(item.counter_transfer)}
											</Text>                    
											<Text style={{color: '#ffffff', fontWeight:'bold'}}>
												Closing Stock: {
														(parseFloat(item.opening_stock) +
														parseFloat(item.purchase_stock)) -
														(parseFloat(item.sales) +
														(parseFloat(item.counter_transfer)))
													}
											</Text>

											<Text style={{color: '#ffffff'}}>
												Purchase Amount:  {parseFloat(item.purchase_amount)}
											</Text> 

											<Text style={{color: '#ffffff'}}>
												Total Amount: {
													(parseFloat(item.purchase_amount) *
													((parseFloat(item.opening_stock) +
													parseFloat(item.purchase_stock)) -
													(parseFloat(item.sales) +
													(parseFloat(item.counter_transfer))))).toFixed(4)
												}
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
				
						{productList.length > 0 ? 
							<View style={{bottom: 0, flexDirection: 'column',position:'absolute',width:'100%'}}>
								<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
									Total Amount - {'\u20B9'}
									{this.getTotalAmount(productList).toFixed(2)}
								</Text>
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


export default connect(mapStateToProps, {addProductList})(GodownStock);