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
	categoryName: {
		fontSize: 18,
		fontWeight: 'bold',
		//color: '#ffffff',
		color: '#6ea2f4'
	},
	prodName: {
		fontSize: 16,
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

export class RegisterCategory extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		// Get the first day of the current month and today's date
		const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		const today = new Date();

		this.state = {
			productList: [],
			categoryList: [],
			sections: [],
			isLoading: true,
			modalVisible: false,
			category_id: "",
			selDate: new Date(),
			pickerVisible: false,
			toDate: new Date(),
			toPickerVisible: false,
		};
	}

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener('focus', this.refetchData);
		this.fetchData();
	}
	
	componentWillUnmount() {
		// Remove the focus listener
		if (this.focusListener) {
			this.focusListener();
		}
	}

	fetchData = () => {
		const {loginDetails} = this.props;
		const {shop} = this.props.route.params;
		const {categoryList} = this.state;

		this.setState({
			categoryList: [],
		});

			fetch(
				ser_url +
					'/categories.php',
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
				if (json.Category_list.length > 0) {
					this.setState({
						categoryList: json.Category_list,
					});
					this.fetchRegisterData();

				} else {
					this.setState({
						categoryList: [],
					});
				}
			})
			.catch(error => alert('test'))
			.finally(() => {
				this.setState({isLoading: false});
			});
		// }
	};

	fetchRegisterData = () => {
		const { loginDetails } = this.props;
		const { selDate, toDate, categoryList } = this.state;
		// Clear the current product list
		this.setState({ productList: [], sortedData: [] });

		// Check date validity first
		if (Moment(selDate).format('yyyy-MM-DD') > Moment(toDate).format('yyyy-MM-DD')) {
			ToastAndroid.show('Please select valid to date', ToastAndroid.SHORT);
			this.setState({ toPickerVisible: true });
			return;
		}

		// Map through each category and prepare an API request for each
		const requests = categoryList.map(category => {

			const url = ser_url +
				'/categoryProductTotal.php?c_no=' + loginDetails.ID +
				'&category_id=' + category.id +
				'&f_date=' + Moment(selDate).format('yyyy-MM-DD') +
				'&t_date=' + Moment(toDate).format('yyyy-MM-DD');

			return fetch(url, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
			.then(response => response.json())
			.then(json => {
				// If products exist for this category, attach the category name to each product
				if (json.categoryProduct && json.categoryProduct.length > 0) {
					return json.categoryProduct.map(product => {
						product.categoryName = category.name;  // Add category name
						product.category_id = category.id;  // Add category name
						return product;
					});
				}
				return [];
			});
		});

		// Wait for all requests to complete
		Promise.all(requests)
			.then(results => {
				// Flatten the results array (each element is an array of products)
				const combinedProducts = results.flat();
				// console.log(combinedProducts)
				this.setState({ 
					productList: combinedProducts,
				});
				const grouped = this.groupDataByCategory(combinedProducts);
			// Convert the grouped object into an array of sections
			const sectionData = Object.values(grouped);
			this.setState({ sections: sectionData });
				this.props.addProductList(combinedProducts);
			})
		.catch(error => alert(error))
		.finally(() => {
			this.setState({ isLoading: false });
		});
	};

	groupDataByCategory = (data)=> {
		return data.reduce((acc, item) => {
			const cat = item.categoryName;
			if (!acc[cat]) {
				acc[cat] = {
					categoryName: cat,
					category_id: item.category_id,
					opening_Stock: 0,
					KSBCL: 0,
					total: 0,
					sales: 0,
					closing_Stock: 0,
					opening_Stock_litre: 0,
					KSBCL_litre: 0,
					total_litre: 0,
					sales_litre: 0,
					closing_Stock_litre: 0,
				};
			}
			acc[cat].opening_Stock += item.opening_Stock;
			acc[cat].KSBCL += item.KSBCL;
			acc[cat].total += item.total;
			acc[cat].sales += item.sales;
			acc[cat].closing_Stock += item.closing_Stock;
			acc[cat].opening_Stock_litre += item.opening_Stock_litre;
			acc[cat].KSBCL_litre += item.KSBCL_litre;
			acc[cat].total_litre += item.total_litre;
			acc[cat].sales_litre += item.sales_litre;
			acc[cat].closing_Stock_litre += item.closing_Stock_litre;
			return acc;
		}, {});
	}


	// Function to render a section for a given key and title
	renderSection = (section)=> {
		const { navigate } = this.props.navigation;
		const { selDate, toDate } = this.state;
		return (
			<View>
				{section.categoryName != 'COOLDRINKS' ? (
				<View style={styles.productlist} key={section.categoryName}>
					<View style={{flexDirection:'row'}}>
						<Text style={styles.categoryName}>{section.categoryName}</Text> 
						<Text style={{paddingLeft: '30%',color:'#ffffff'}}>Date: {Moment(selDate).format('DD-MM-yyyy')}</Text>
					</View>
					<Text><Text style={styles.prodName}>Opening Stock : </Text><Text style={styles.inText}>{section.opening_Stock}</Text></Text>
					<Text><Text style={styles.prodName}>KSBCL : </Text><Text style={styles.inText}>{section.KSBCL}</Text></Text>
					<Text><Text style={styles.prodName}>Total : </Text><Text style={styles.inText}>{section.total}</Text></Text>
					<Text><Text style={styles.prodName}>Sales : </Text><Text style={styles.inText}>{section.sales}</Text></Text>
					<Text><Text style={styles.prodName}>Closing Stock : </Text><Text style={styles.inText}>{section.closing_Stock}</Text></Text>
					<Text><Text style={styles.prodName}>Opening Stock (L) : </Text><Text style={styles.inText}>{section.opening_Stock_litre.toFixed(2)}</Text></Text>
					<Text><Text style={styles.prodName}>KSBCL (L) : </Text><Text style={styles.inText}>{section.KSBCL_litre.toFixed(2)}</Text></Text>
					<Text><Text style={styles.prodName}>Total (L) : </Text><Text style={styles.inText}>{section.total_litre.toFixed(2)}</Text></Text>
					<Text><Text style={styles.prodName}>Sales (L) : </Text><Text style={styles.inText}>{section.sales_litre.toFixed(2)}</Text></Text>
					<Text><Text style={styles.prodName}>Closing Stock (L) : </Text><Text style={styles.inText}>{section.closing_Stock_litre.toFixed(2)}</Text></Text>

					<View style={{
							flexDirection: 'row',
							marginVertical: 5,
							justifyContent: 'space-between',
					}}>
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
								navigate('RegisterBook', {
									category_id:section.category_id,
									details:'Quantity',
									selDate:selDate,
									toDate:toDate,
								})
							}
						>
							<Text style={{fontSize: 16, color: 'white'}}>
								Quantity Wise
							</Text>
						</TouchableOpacity>

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
								navigate('RegisterBook', {
									category_id:section.category_id,
									details:'Litre',
									selDate:selDate,
									toDate:toDate,
								})
							}
						>
							<Text style={{fontSize: 16, color: 'white'}}>
								Litre Wise
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				):null}
			</View>
		);
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
			category_id,
			selDate,
			pickerVisible,
			toDate,
			toPickerVisible, 
			details,
			sections
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
					
	
				<FlatList
				    data={sections}
				    keyExtractor={(item, index) => index.toString()}
				    renderItem={({ item }) => this.renderSection(item)}
				/>
										
			</View>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
	rproductList: state.productList,
});

export default connect(mapStateToProps, {addProductList})(RegisterCategory);
