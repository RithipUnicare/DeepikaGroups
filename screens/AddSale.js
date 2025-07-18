import React, { Component, useState } from 'react';
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
import {RadioButton, Searchbar} from 'react-native-paper';
import {FAB, Provider, TextInput, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {ser_url} from '../components/constants';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';

Moment.locale('en');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		// alignItems: "center",
		marginTop: 40,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#ffffff',
	},
	dropdownBtnStyle: {
		width: '100%',
		height: 50,
		backgroundColor: '#FFF',
		borderRadius: 8,
		marginBottom: 5,
		textAlign: 'left'
	},
	picker_align:{
		position: "relative",
		top: 5,
		
	},
	prodRetail: {
		fontSize: 14,
		color: '#ffffff',
	},
});


export class AddSale extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		this.state = {
			productList: [],
			isLoading: true,
			modalVisible: false,
			product: '',
			stock: '',
			qty: '',
			relCounter:null,
			c_price : '',
			p_price : '',
			selectedPrice : 'price1',
			saleProdDetail: {},
			isProductSelcted: false,
			saleLoading: false,
			saleDisable: false,
			selDate: new Date(),
			pickerVisible: false,
			selectedItems: [],
			Itemsname: '',
		};
	}

	componentDidMount() {
		this.fetchData();
		this.fetchCounterDetails();
	}

	fetchData = () => {
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
				// console.log(json.Product)
				if (json.Product.length > 0) {
					this.setState({
						productList: json.Product,
					});
					this.renderProduct();
				} else {
					this.setState({
						productList: [],
					});
					// this.props.addProductList([]);
				}
			})
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
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
			.catch(error => alert(error))
			.finally(() => {
				this.setState({isLoading: false});
			});
	};

	renderProduct = () => {
		const {productList} = this.state;
		return productList.map((product) => {
			return <Picker.Item key={product.p_id} label={product.product_name} value={product.p_id} />
		})
	}

	addStock = (itemValue) => {
		const {productList, product} = this.state;
		this.setState({product: itemValue})
		return productList.map((value) => {
			if(value.p_id == itemValue){
				this.setState({
					saleProdDetail: value,
					stock: value.stock, 
					isProductSelcted: true,
				});
			}
		});
	}


	placeSaleOrder = () => {
		const {
			productList,
			isLoading,
			modalVisible,
			qty,
			saleProdDetail,
			saleLoading,
			selectedPrice,
			selDate,
		} = this.state;
		const {loginDetails} = this.props;

		let finalSelPrice;
		if (loginDetails.Type == 'Godown') {
			switch (selectedPrice) {
				case 'price1':
					finalSelPrice = saleProdDetail.price1_btl;
					break;
				case 'price2':
					finalSelPrice = saleProdDetail.price2_btl;
					break;
				case 'price3':
					finalSelPrice = saleProdDetail.price3_btl;
					break;
				case 'price4':
					finalSelPrice = saleProdDetail.price4_btl;
					break;
				case 'price5':
					finalSelPrice = saleProdDetail.price5_btl;
					break;
				case 'price6':
					finalSelPrice = saleProdDetail.price6_btl;
					break;
				case 'price7':
					finalSelPrice = saleProdDetail.price7_btl;
					break;
				default:
					finalSelPrice = saleProdDetail.price1_btl;
			}
		} else {
			finalSelPrice = saleProdDetail.c_price;
		}

		var totalPrice = qty * finalSelPrice;

		// alert(inputValue +"---"+ saleProdDetail.stock)
		if (
			qty &&
			qty > 0 &&
			parseInt(qty, 10) <= parseInt(saleProdDetail.stock, 10)
		) {
			fetch(
				ser_url +
					'/add_cart.php?p_id=' +
					saleProdDetail.p_id +
					'&p_name=' +
					saleProdDetail.product_name +
					'&cart_date=' +
					Moment(selDate).format('yyyy-MM-DD') +
					'&qty=' +
					qty +
					'&p_price=' +
					finalSelPrice +
					'&t_price=' +
					totalPrice +
					'&c_no=' +
					loginDetails.ID +
					'&c_name=' +
					loginDetails.Shop_Name +
					'&type=' +
					loginDetails.Type +
					'&p_code=' +
					saleProdDetail.p_id,
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
						this.setState({
							modalVisible: false,
							inputValue:0,
						});
						ToastAndroid.showWithGravity(
							'Product added successfully.',
							ToastAndroid.SHORT,
							ToastAndroid.TOP,
						);
						this.props.navigation.goBack();
					} else {
						ToastAndroid.showWithGravity(
							'Failed to add product, try again.',
							ToastAndroid.SHORT,
							ToastAndroid.TOP,
						);
					}
				})
				.catch(error => alert(error))
				.finally(() => {
					this.setState({saleLoading: false});
				});
		} else {
			this.setState({saleLoading: false});
			ToastAndroid.showWithGravity(
				'Quantity should be greater than 0 and smaller or equal to stock',
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
			);
		}
	};


	render() {
		const {navigate} = this.props.navigation;
		const {loginDetails} = this.props;
		const {
			productList,
			items,
			isLoading,
			stock,
			modalVisible,
			product,
			qty,
			selectedPrice,
			saleProdDetail,
			isProductSelcted,
			saleLoading,
			saleDisable,
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
		// if(productList.length == 0){
		//   return(
		//     <View style={{paddingVertical: 50,}}
		//     >
		//       <Text style={{alignSelf: 'center', fontSize: 16}}>No expense Added</Text>
		//     </View>
		//   )
		// }
		return (
			<Provider>
				<View style={styles.container}>

					<Text style={styles.modalText}>Add CounterTransfer</Text>
					<Picker
						selectedValue={product}
						style={{
							backgroundColor: '#fff', 
							placeholderTextColor: '#fff',
							marginBottom:10,
						}}
						onValueChange={(itemValue, itemIndex) =>
							this.addStock(itemValue)
						}>
							<Picker.Item label="Select Product" value="" />
							{this.renderProduct()}
							
					</Picker>

					<Text style={{color:'#fff',fontSize:12,padding:10}}>Stock : {this.state.stock}</Text>
					

						{/* Single 
						{/*<Text style={{color:'#fff',fontSize:12,padding:10}}>Expenditure Reason</Text>
						<Text style={{color:'#fff',fontSize:18,padding:10}}>{this.state.Itemsname}</Text>
						<SearchableDropdown

							selectedItems={this.state.selectedItems}
							onItemSelect={(item) => {
								const items = this.state.selectedItems;
								items.push(item)
								this.setState({ reason: item.p_id });
								this.setState({ Itemsname: item.product_name });
								this.setState({ selectedItems: items });
							}}
							containerStyle={{ backgroundColor: '#ffffff',marginBottom:10 }}
							onRemoveItem={(item, index) => {
								const items = this.state.selectedItems.filter((sitem) => sitem.p_id !== item.p_id);
								this.setState({ selectedItems: items });
							}}
							itemStyle={{
								padding:15,borderBottomWidth:1,borderColor:'#ddd'
							}}
							// itemTextStyle={{backgroundColor: '#ffffff'}}
							itemsContainerStyle={{ maxHeight: 140 }}
							items={productList}
							defaultIndex={0}
							resetValue={false}
							textInputProps={
								{
									placeholder: "Select Expenditure Reason",
									underlineColorAndroid: "transparent",
									style: {
											padding: 12,
											borderWidth: 1,
											borderColor: '#ccc',
											borderRadius: 5,
									},
								}
							}
							listProps={
								{
									nestedScrollEnabled: true,
								}
							}
					/>*/}

					<TextInput
						// mode='outlined'
						// style={styles.input}
						style={{backgroundColor: '#ffffff'}}
						theme={{
							colors: {
								text: '#000000',
								placeholder: '#000000',
								background: 'transparent',
							},
						}}
						onChangeText={value => this.setState({qty: value})}
						value={qty}
						label="Quantity"
						keyboardType="number-pad"
					/>

					{isProductSelcted ? (
						<RadioButton.Group
									onValueChange={newValue =>
										this.setState({selectedPrice: newValue})
									}
									value={selectedPrice}>
									
									{saleProdDetail.price1 != 0.00 ? ( 
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'flex-start',
												alignItems: 'center',
												width: '100%',
												color:'#ffffff'
											}}>
											<RadioButton value="price1" color='#ffffff' uncheckedColor="#ffffff" checked/>
											<Text style={[styles.prodRetail]}>
												Price 1 - {'\u20B9'}
												{saleProdDetail.price1}-{saleProdDetail.price1_btl}
											</Text>
										</View>
									) : null}

									{saleProdDetail.price2 != 0.00 ? ( 
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'flex-start',
												alignItems: 'center',
												width: '100%',
											}}>
											<RadioButton value="price2" color='#ffffff' uncheckedColor="#ffffff"/>
											<Text style={[styles.prodRetail]}>
												Price 2 - {'\u20B9'}
												{saleProdDetail.price2}-{saleProdDetail.price2_btl}
											</Text>
										</View>
									) : null}

									{saleProdDetail.price3 != 0.00 ? ( 
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'flex-start',
												alignItems: 'center',
												width: '100%',
											}}>
											<RadioButton value="price3"  color='#ffffff' uncheckedColor="#ffffff"/>
											<Text style={[styles.prodRetail]}>
												Price 3 - {'\u20B9'}
												{saleProdDetail.price3}-{saleProdDetail.price3_btl}
											</Text>
										</View>
									) : null}

									{saleProdDetail.price4 != 0.00 ? (
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'flex-start',
												alignItems: 'center',
												width: '100%',
											}}>
											<RadioButton value="price4"  color='#ffffff' uncheckedColor="#ffffff"/>
											<Text style={[styles.prodRetail]}>
												Price 4 - {'\u20B9'}
												{saleProdDetail.price4}-{saleProdDetail.price4_btl}
											</Text>
										</View>
									) : null}

									{saleProdDetail.price5 != 0.00 ? ( 
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'flex-start',
												alignItems: 'center',
												width: '100%',
											}}>
											<RadioButton value="price5" color='#ffffff' uncheckedColor="#ffffff" />
											<Text style={[styles.prodRetail]}>
												Price 5 - {'\u20B9'}
												{saleProdDetail.price5}-{saleProdDetail.price5_btl}
											</Text>
										</View>
									) : null}

									{saleProdDetail.price6 != 0.00 ? ( 
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'flex-start',
												alignItems: 'center',
												width: '100%',
											}}>
											<RadioButton value="price6"  color='#ffffff' uncheckedColor="#ffffff"/>
											<Text style={[styles.prodRetail]}>
												Price 6 - {'\u20B9'}
												{saleProdDetail.price6}-{saleProdDetail.price6_btl}
											</Text>
										</View>
									) : null}

									{saleProdDetail.price7 != 0.00 ? ( 
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'flex-start',
												alignItems: 'center',
												width: '100%',
											}}>
											<RadioButton value="price7"  color='#ffffff' uncheckedColor="#ffffff"/>
											<Text style={[styles.prodRetail]}>
												Price 7 - {'\u20B9'}
												{saleProdDetail.price7}-{saleProdDetail.price7_btl}
											</Text>
										</View>
									) : null}
								</RadioButton.Group>
							):null
						}
					<Button
						mode="contained"
						loading={saleLoading}
						disabled={saleDisable}
						onPress={() => this.placeSaleOrder()}
						style={{marginTop: 10}}>
						Submit
					</Button>
					{/* <FAB
										icon="plus"
										style={styles.fab}
										color="#ffffff"
										animated={true}
										disabled={false}
										visible={true}
										onPress={() => this.setState({modalVisible: true})}
								/> */}
					
				</View>
			</Provider>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
});

export default connect(mapStateToProps, {})(AddSale);
