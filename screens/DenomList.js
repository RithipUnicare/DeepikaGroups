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
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
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
		width:'20%',
		fontSize: 16,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	prodMrp: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#ffffff'
	},
	typeView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 5
	},
	subTypeView: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
		flex: 6
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

export class DenomList extends Component {

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
		let originalSel ='';
		let originalTo ='';
		if(this.props.route.params.denomination_date == undefined){
			originalSel = this.props.route.params.selDate;
			originalTo = this.props.route.params.toDate;
		} else {
			originalSel = this.props.route.params.denomination_date;
			originalTo = this.props.route.params.denomination_date;
		}
		this.setState(
			{
				selDate: Moment(originalSel, 'DD-MM-YYYY').toDate(),
				toDate: Moment(originalTo, 'DD-MM-YYYY').toDate(),
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
					'/denomination_list.php?company_no=' +
					loginDetails.ID + 
					'&type=' +
					loginDetails.Type +
					'&d_date=' +
					Moment(selDate).format('yyyy-MM-DD') +
					'&from_date=' +
					Moment(selDate).format('yyyy-MM-DD') +
					'&to_date=' +
					Moment(toDate).format('yyyy-MM-DD'), 
				{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				}
			}).then((response) => response.json())
			.then((json) => {
				// console.log(json.Denomination_list);
				if(json.Denomination_list.length > 0){
					this.setState({
						productList: json.Denomination_list
					})
				}else{
					this.setState({
						productList: []
					})
				}
			})
			.catch((error) => alert(error))
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
		
	// 	const {selDate, toDate} = this.state;

	// 	var difference = (Moment(selDate).diff(toDate, 'days') - 1);
	// 	var left_selDate = Moment(selDate, "DD-MM-YYYY").add(-1*difference, 'days');
	// 	var left_toDate = Moment(toDate, "DD-MM-YYYY").add(-1*difference, 'days');

	// 	this.setState({
	// 		selDate: new Date(left_selDate),
	// 		toDate: new Date(left_toDate),
	// 	});

	// 	this.fetchData();
	// }
 
	// onSwipeRight(gestureState) {

	// 	const {selDate, toDate} = this.state;

	// 	var difference = Moment(selDate).diff(toDate, 'days') - 1;
	// 	var right_selDate = Moment(selDate, "DD-MM-YYYY").add(difference, 'days');
	// 	var right_toDate = Moment(toDate, "DD-MM-YYYY").add(difference, 'days');

	// 	this.setState({
	// 		selDate: new Date(right_selDate),
	// 		toDate: new Date(right_toDate),
	// 	});

	// 	this.fetchData();
	// }
 
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

	rmItem = (rmId) => {
		fetch(ser_url+'/denomination_delete.php?d_id='+rmId, {
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


	render() {
		const { navigate } = this.props.navigation;
		const { loginDetails } = this.props;
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
				<View style={{paddingBottom:'45%'}}>
					{productList.length == 0 ? (

						<View style={{paddingVertical: 50}}>
							<Text style={{alignSelf: 'center', fontSize: 16, color: '#ffffff'}}>
								No Denomination Added
							</Text>
						</View>

					) : (

							<FlatList

									data={productList}
									initialNumToRender={10}
									renderItem={({ item, index }) =>
									<View style={styles.productlist}>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title2}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty2}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount2}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title3}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty3}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount3}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title4}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty4}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount4}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title5}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty5}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount5}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title6}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty6}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount6}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title7}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty7}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount7}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title8}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty8}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount8}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title9}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty9}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount9}</Text>
											</View>
											<View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title10}</Text>
												<Text style={styles.prodName}>X</Text>
												<Text style={styles.prodName}>{item.qty10}</Text>
												<Text style={styles.prodName}>=</Text>
												<Text style={styles.prodMrp}>{'\u20B9'}{item.amount10}</Text>
											</View>
											
											{/* <View style={styles.typeView}>
												<Text style={styles.prodName}>{item.title7}</Text>
												<View style={styles.typDvdr}></View>
												<View style={styles.subTypeView}>
													<Text style={styles.prodName}>{item.qty7}</Text>
													<Text style={styles.prodMrp}>{'\u20B9'}{item.amount7}</Text>
												</View>
											</View> */}

											<View style={styles.typDvdr}></View>

											<View style={styles.typeView}>
												<Text style={styles.prodName}>Sub Total</Text>
												{/* <Text style={styles.prodName}>---</Text> */}
												<Text style={styles.prodName}>{'\u20B9'}{item.sub_total}</Text>
											</View>

											<View style={styles.typDvdr}></View>

											<View style={styles.typeView}>
												<Text style={styles.prodName}>UPI Amount</Text>
												{/* <Text style={styles.prodName}>---</Text> */}
												<Text style={styles.prodName}>{'\u20B9'}{item.UPIAmt}</Text>
											</View>

											<View style={styles.typDvdr}></View>

											<View style={styles.typeView}>
												<Text style={styles.prodName}>Pending</Text>
												{/* <Text style={styles.prodName}>---</Text> */}
												<Text style={styles.prodName}>{'\u20B9'}{item.pending}</Text>
											</View>

											<View style={styles.typDvdr}></View>

											<View style={styles.typeView}>
												<Text style={styles.prodName}>Total</Text>
												{/* <Text style={styles.prodName}>---</Text> */}
												<Text style={styles.prodName}>{'\u20B9'}{item.total}</Text>
											</View>
											<View style={styles.typDvdr}></View>

											<View style={styles.typeView}>
												<Text style={styles.prodName}>Date</Text>
												{/* <Text style={styles.prodName}>---</Text> */}
												<Text style={styles.prodName}>{Moment(item.d_date).format('Do MMMM YYYY')}</Text>
											</View>
											
											<View style={{flexDirection: 'row', marginVertical: 5,}}>
												<TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', padding: 5,borderRadius: 5, flexDirection: 'row'}} onPress={() => 
													Alert.alert(
														"Remove Item",
														"Do you want to remove item from list?",
														[
															{
																text: "Yes",
																onPress: () => this.rmItem(item.d_id),
															},
															{
																text: "No",
																style: "cancel"
															}
														]
													)}><Icon name="trash" size={20} color={'#ffffff'}/><Text style={{fontSize: 16, color: 'white'}}>Remove</Text></TouchableOpacity>
											</View>
											
									</View>
									}
									keyExtractor={(item, index) => 'sale'+index}
									nestedScrollEnabled={true}
							/>
						)}
				</View>
			</View>
		)
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails
});


export default connect(mapStateToProps, {})(DenomList)