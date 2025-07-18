import React, {Component} from 'react';
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
	ToastAndroid,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import {FAB, Provider, TextInput, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {addCityList, addProductList} from '../redux/reducer';
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
	prod: {
		flex:1,
	},
	prodName: {
		fontSize: 14,
		fontWeight: 'bold',
		//color: '#ffffff',
		color: '#6ea2f4'
	},
	prodMrp: {
		fontSize: 16,
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
		fontSize: 16,
	},
});

export class PurchaseList extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		// Get the first day of the current month and today's date
		const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		const today = new Date();

		this.state = {
			productList: [],
			filteredData: [],
			isLoading: true,
			modalVisible: false,
			selDate: firstDayOfMonth,
			pickerVisible: false,
			toDate: today,
			toPickerVisible: false,
			gestureName: 'none',
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = () => {
		const {loginDetails} = this.props;
		const {shop} = this.props.route.params;
		const {productList} = this.state;
		const { selDate, toDate } = this.state;

		this.setState({
			productList: [],
		});

			fetch(
				ser_url +
					'/sale_date_report.php?company_no=' +
					loginDetails.ID+
					'&from_date=' +
					Moment(selDate).format('YYYY-MM-DD') +
					'&to_date=' +
					Moment(toDate).format('YYYY-MM-DD'),
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
				// console.log(json);
				if (json.Sale_Report_List.length > 0) {
					this.setState({
						productList: json.Sale_Report_List,
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
		// }
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

	getTotalAmount = prodListData => {
		let tamt = 0;
		prodListData.map(item => {
			tamt = tamt + parseFloat(item.TotalAmount);
		});

		return tamt;
	};

	refetchData = () => {
		this.fetchData();
	};

	handleSearch = text => {
		const formattedQuery = text.toLowerCase();

		let filteredData = this.state.productList.filter(function (item) {
			return item.Date.toLowerCase().includes(formattedQuery);
		});

		this.setState({filteredData: filteredData});
	};

	renderHeader = () => (
		<View
			style={{
				// backgroundColor: '#fff',
				padding: 10,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
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
			/>
		</View>
	);


	render() {
		const {navigate} = this.props.navigation;
		const {loginDetails} = this.props;
		const {
			productList,
			isLoading,
			modalVisible,
			selDate,
			pickerVisible,
			toDate,
			toPickerVisible,
		} = this.state;
		if (isLoading) {
			return (
				<View style={{paddingVertical: 20}}>
					<ActivityIndicator animating size="large" color="#0000ff" />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<View style={{paddingBottom:'50%'}}>
					
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
							/*data={productList}
							initialNumToRender={10}
							renderItem={({item, index}) => (*/
								<View style={styles.productlist}>
									<TouchableOpacity 
										style={{flexDirection:'row'}} onPress={() =>
										navigate('SalesHistory', {
											cart_date:item.Date,
											saleType:'Godown'
										})
									}>
											<View style={{width:'15%'}}>

												<Text style={{color: '#ffffff', fontWeight:'bold'}}>
													Sr No:
												</Text>
												<Text style={{color: '#ffffff', fontWeight:'bold'}}>
													{index+1}
												</Text>
											</View>
											<View style={{width:'85%'}}>
												<Text style={styles.prod}>
													<Text style={styles.prodName}>Date: </Text>
												  	<Text style={styles.prodMrp}>
												    	{item.Date}
													</Text>
												</Text>
												<Text style={styles.prod}>
													<Text style={styles.prodName}>Total Amount : </Text>
													<Text style={styles.prodMrp}>{item.TotalAmount}</Text>
												</Text>
				
											</View>
									</TouchableOpacity>
								</View>
							)}
							keyExtractor={(item, index) => 'saleHistory' + index}
						/>
					)}
					
					</View>

				{productList.length > 0 ? (
					<View style={{bottom: 0, flexDirection: 'column',position:'absolute',width:'100%'}}>
						<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
							Total Amount - {'\u20B9'}
							{this.getTotalAmount(productList).toFixed(2)}
						</Text>
					</View>
				) : null}
				
			</View>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
	rproductList: state.productList,
});

export default connect(mapStateToProps, {})(PurchaseList);
