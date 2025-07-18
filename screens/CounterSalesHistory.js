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
	prodName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#6ea2f4',
	},
	prodMrp: {
		fontSize: 20,
		fontWeight: 'bold',
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

export class CounterSalesHistory extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		this.state = {
			productList: [],
			isLoading: true,
			modalVisible: false,
			reason: '',
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
		if(this.props.route.params.cart_date == undefined){
			originalSel = this.props.route.params.selDate;
			originalTo = this.props.route.params.toDate;
		} else {
			originalSel = this.props.route.params.cart_date;
			originalTo = this.props.route.params.cart_date;
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
		const {shop} = this.props.route.params;
		const {selDate, toDate, productList} = this.state;
			this.setState({
				productList: [],
			});

		fetch(
			ser_url +
				'/sale_report_list.php?company_no=' +
				shop.counter_id +
				'&type=Counter&c_date=' +
				Moment(selDate).format('yyyy-MM-DD') +
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
				if (json.Sale_Report_List.length > 0) {
					this.setState({
						productList: json.Sale_Report_List,
					});
					this.props.addProductList(json.Sale_Report_List);
				} else {
					this.setState({
						productList: [],
					});
					this.props.addProductList([]);
				}
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	rmItem = rmId => {
		fetch(ser_url + '/expenditure_delete.php?e_id=' + rmId, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => {
				this.fetchData();
			})
			.catch(error => console.log(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
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

	getSales = prodListData => {
		let tamt = 0;
		prodListData.map(item => {
			tamt = tamt + parseFloat(item.sales);
		});
		return tamt;
	};

	getTotalSalesAmount = prodListData => {
		let tamt = 0;
		prodListData.map(item => {
			tamt = tamt + parseFloat(item.Total_sales_amount);
		});
		return tamt;
	};

	refetchData = () => {
		this.fetchData();
	};



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
		const {navigate} = this.props.navigation;
		const {loginDetails, rproductList} = this.props;
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
		if (isLoading) {
			return (
				<View style={{paddingVertical: 20}}>
					<ActivityIndicator animating size="large" color="#0000ff" />
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<View style = {{paddingBottom:'45%'}}>
					
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
									: rproductList
							}
							initialNumToRender={10}
							ListHeaderComponent={this.renderHeader}
							renderItem={({item, index}) => (
							/*data={productList}
							initialNumToRender={10}
							renderItem={({item, index}) => (*/
								<View style={styles.productlist}>
									<View style={{flexDirection:'row'}}>
										<View styles={{width:'10%'}}>
											<Text style={{color: '#ffffff',fontWeight:'bold'}}>
												Sr No
											</Text>
											<Text style={{color: '#ffffff',fontWeight:'bold'}}>
												{index+1}
											</Text>
										</View>
											<View styles={{width:'90%'}}>
												{console.log(this.state.productList)}
													<Text style={styles.prodName}>{item.product_name}</Text>
													
													<Text style={{color: '#ffffff'}}>
															Stock Sales: {parseFloat(item.sales)}
													</Text>

													<Text style={{color: '#ffffff'}}>
														Sales Rate: {parseFloat(item.sales_rate).toFixed(2)}
													</Text>
												

												<Text style={{color: '#ffffff', fontWeight:'bold'}}>
													Total: {parseFloat(item.Total_sales_amount).toFixed(2)}
												</Text>
												
												{/*<Text style={{color: '#ffffff'}}>
														Purchases Rate: {parseFloat(item.purchase_amount).toFixed(2)}
												</Text>
												<Text style={{color: '#ffffff'}}>
														Purchases Total Amount: {(parseFloat(item.sales))*(parseFloat(item.purchase_amount)).toFixed(2)}

												</Text>
												<Text style={{color: '#ffffff'}}>
														Differences: {(parseFloat(item.Total_sales_amount)-(parseFloat(item.sales)*parseFloat(item.purchase_amount)))}
												</Text>
												<Text style={{color: '#ffffff'}}>
														Each Bottle Margin: {(((parseFloat(item.sales_rate)-parseFloat(item.purchase_amount))*100)/parseFloat(item.sales_rate)).toFixed(2)} %
												</Text>*/}
											</View>
									</View>
								</View>
							)}
							keyExtractor={(item, index) => 'saleHistory' + index}
						/>
					)}
			</View>

				{productList.length > 0 ? (
					<View style={{bottom: 0, flexDirection: 'column',position:'absolute',width:'100%'}}>
						<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
							Total Sales -
							{this.getSales(productList).toFixed(2)}
						</Text>
						<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
							Total Sales Amount -
							{this.getTotalSalesAmount(productList).toFixed(2)}
						</Text>
						{/*<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
							Purchases Total Amount -
							{this.getPurchasesTotalAmount(productList).toFixed(2)}
						</Text>
						<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
							Total Differences -
							{this.getTotalDifferences(productList).toFixed(2)}
						</Text>
						<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff'}}>
							Total Bottle Margin -
							{this.getTotalEachBottleMargin(productList).toFixed(2)}
						</Text>*/}
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

export default connect(mapStateToProps, {addProductList})(CounterSalesHistory);
