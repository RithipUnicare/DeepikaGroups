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

export class RegisterBook extends Component {

	constructor(props) {
		super(props);

		this.flatListRef;

		this.state = {
			productList: [],
			isLoading: true,
			modalVisible: false,
			category_id: "",
			selDate: new Date(),
			pickerVisible: false,
			toDate: new Date(),
			toPickerVisible: false,
			details:'',
		};
	}

	componentDidMount() {
		 this.setState(
		    {
				selDate: new Date(this.props.route.params.selDate),
				toDate: new Date(this.props.route.params.toDate),
		    	category_id: this.props.route.params.category_id,
		    	details: this.props.route.params.details,
		    },
		    () => {
		      // Now that the state has been updated, category_id is available
		    	this.focusListener = this.props.navigation.addListener('focus', this.refetchData);
		    	this.fetchData();
		    }
		);
	}
	
	componentWillUnmount() {

	    // Remove the focus listener
	    if (this.focusListener) {
	      this.focusListener();
	    }
	}

	fetchData = () => {
		const { loginDetails } = this.props;
		const {selDate, toDate, productList, category_id} = this.state;

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
				'/categoryProductDetails.php?c_no=' +
				loginDetails.ID +
				'&category_id=' +
				category_id + 
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
// 
					console.log(json.categoryProduct)
					if(json.categoryProduct.length > 0){
						this.setState({
							productList: json.categoryProduct
						})
						this.props.addProductList(json.categoryProduct);
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


	refetchData = () => {
		this.setState({
			category_id: this.props.route.params.category_id,
		});
		this.fetchData();
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
			category_id,
			selDate,
			pickerVisible,
			toDate,
			toPickerVisible, 
			details,
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
				<View style={{paddingBottom:'55%'}}>
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
								No Stock Added
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
											
											<Text style={styles.prodName}> {item.product_name} </Text>
											<View style={{flexDirection:'row'}}>
												
												<View style={{width:'50%'}}>
													
													<Text style={{color: '#ffffff'}}>
														Opening Stock : {parseFloat(item.opening_Stock)}
													</Text>
													<Text style={{color: '#ffffff'}}>
														KSBCL : {parseFloat(item.KSBCL)}
													</Text>
													<Text style={{color: '#ffffff', fontWeight:'bold'}}>
														Total : {parseFloat(item.total)}
													</Text>
													<Text style={{color: '#ffffff'}}>
														Sales : {parseFloat(item.sales)}
													</Text>  
													<Text style={{color: '#ffffff'}}>
														Closing Stock : {parseFloat(item.closing_Stock)}
													</Text>                    
													
												</View>

												{details == 'Litre' ? (
												<View style={{width:'50%'}}>
													<Text style={{color: '#ffffff'}}>
														Opening Stock (L) : {parseFloat(item.opening_Stock_litre)}
													</Text>
													<Text style={{color: '#ffffff'}}>
														KSBCL (L) : {parseFloat(item.KSBCL_litre)}
													</Text>
													<Text style={{color: '#ffffff', fontWeight:'bold'}}>
														Total (L) : {parseFloat(item.total_litre)}
													</Text>
													<Text style={{color: '#ffffff'}}>
														Sales (L) : {parseFloat(item.sales_litre)}
													</Text>  
													<Text style={{color: '#ffffff'}}>
														Closing Stock (L) : {parseFloat(item.closing_Stock_litre)}
													</Text>                    
													
												</View>
												):null}
											</View>
										</View>
									</View> 
								</View>
								)}
							keyExtractor={(item, index) => 'categoryProduct'+index}
						/>
					)}
				</View>
				
				{productList.length > 0 ? 
					<TouchableOpacity style={{bottom: 0, flexDirection: 'column',position:'absolute',width:'100%'}} 
						onPress={() => navigate('RegisterBookTotal', { 
							category_id : category_id, 
							selDate : selDate, 
							toDate : toDate,
							details:details,
						})}
					>
						<Text style={{fontSize: 18, textAlign: 'center', color: '#ffffff',paddingBottom:10}}>
							Total   >>
						</Text>
					</TouchableOpacity> 
				: null}
			</View>
		)
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
	rproductList: state.productList,
});


export default connect(mapStateToProps, {addProductList})(RegisterBook);