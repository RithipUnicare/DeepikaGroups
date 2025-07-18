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
	inputView: {
		// flex: 1,
		flexDirection: 'column',
		marginTop: 20,
		marginBottom: 20,
	},
	fab: {
		position: 'absolute',
		margin: 25,
		right: 0,
		bottom: 0,
		backgroundColor: '#ff4081',
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		// alignItems: "center",
		marginTop: 40,
	},
	modalView: {
		margin: 20,
		// flex: 1,
		backgroundColor: 'rgb(42, 32, 51)',
		borderRadius: 20,
		padding: 20,
		// alignItems: "center",
		shadowColor: '#000',
		// shadowOffset: {
		//   width: 0,
		//   height: 1
		// },
		// shadowOpacity: 0.25,
		// shadowRadius: 1,
		// elevation: 1,
		borderWidth: 1,
		borderColor: 'grey',
		flexDirection: 'column',
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
});

const placeholder_expenditure = {
	label:'Select Expenditure Reason',
	value:'',
}


export class Expense extends Component {
	constructor(props) {
		super(props);

		this.flatListRef;

		this.state = {
			expenditureTitle: [],
			isLoading: true,
			modalVisible: false,
			reason: '',
			amount: null,
			expensLoading: false,
			expenseDisable: false,
			selDate: new Date(),
			pickerVisible: false,
			selectedItems: [],
			Itemsname: '',
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = () => {
		const {expenditureTitle} = this.state;
		fetch(ser_url +
				'/expenditure_title.php', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			}
		}).then((response) => response.json())
			.then((json) => {
				//console.log(json.Expenditure_Title)
				if(json.Expenditure_Title.length > 0){
						this.setState({
							expenditureTitle: json.Expenditure_Title
						})
						this.renderExpenditureTitle();
					}else{
						this.setState({
							expenditureTitle: []
						})

					}

			})
			.catch((error) => alert(error))
			.finally(() => {
				this.setState({ isLoading: false });
			});
	};

	renderExpenditureTitle = () => {
		const {expenditureTitle} = this.state;
		return expenditureTitle.map((product) => {
			return <Picker.Item label={product.name} value={product.id} />
		})
	}


	addExpense = () => {
		const {loginDetails} = this.props;
		const {reason, amount, selDate} = this.state;
		// console.log(reason + '  '+amount);
		if (reason == '' || !amount) {
			ToastAndroid.showWithGravity(
				'Please add both details',
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
			);
		} else {
			this.setState({expensLoading: true, expenseDisable: true});

			fetch(
				ser_url +
					'/expenditure_cart.php?company_no=' +
					loginDetails.ID +
					'&type=' +
					loginDetails.Type +
					'&e_id=' +
					reason +
					'&amount=' +
					amount +
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
					// console.log(JSON.stringify(json))
					if (json.Success == 0) {
						this.setState({
							modalVisible: false,
							expensLoading: false,
							expenseDisable: false,
						});
						ToastAndroid.showWithGravity(
							'Expenditure added successfully.',
							ToastAndroid.SHORT,
							ToastAndroid.TOP,
						);
						this.props.navigation.replace('Expense');
						// this.props.navigation.goBack();
					} else {
						this.setState({
							expensLoading: false,
							expenseDisable: false,
						});
						ToastAndroid.showWithGravity(
							'Expenditure adding failed.',
							ToastAndroid.SHORT,
							ToastAndroid.TOP,
						);
					}
				})
				.catch(error => alert(error))
				.finally(() => {
					this.setState({isLoading: false});
				});
		}
	};

	render() {
		const {navigate} = this.props.navigation;
		const {loginDetails} = this.props;
		const {
			expenditureTitle,
			items,
			isLoading,
			modalVisible,
			reason,
			amount,
			expensLoading,
			expenseDisable,
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

					<Text style={styles.modalText}>Add Expense</Text>
					{/*<Picker
						selectedValue={reason}
						style={{
											backgroundColor: '#fff', 
											placeholderTextColor: '#fff',
											marginBottom:10,
									}}
						onValueChange={(itemValue, itemIndex) =>
							this.setState({reason: itemValue})
						}>
							<Picker.Item label="Select Expenditure Reason" value="" />
							{this.renderExpenditureTitle()}
							
					</Picker>*/}

					

						{/* Single */}
						<Text style={{color:'#fff',fontSize:12,padding:10}}>Expenditure Reason</Text>
						<Text style={{color:'#fff',fontSize:18,padding:10}}>{this.state.Itemsname}</Text>
						<SearchableDropdown

							selectedItems={this.state.selectedItems}
							onItemSelect={(item) => {
								const items = this.state.selectedItems;
								items.push(item)
								this.setState({ reason: item.id });
								this.setState({ Itemsname: item.name });
								this.setState({ selectedItems: items });
							}}
							containerStyle={{ backgroundColor: '#ffffff',marginBottom:10 }}
							onRemoveItem={(item, index) => {
								const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
								this.setState({ selectedItems: items });
							}}
							itemStyle={{
								padding:15,borderBottomWidth:1,borderColor:'#ddd'
							}}
							// itemTextStyle={{backgroundColor: '#ffffff'}}
							itemsContainerStyle={{ maxHeight: 140 }}
							items={expenditureTitle}
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
					/>

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
						onChangeText={value => this.setState({amount: value})}
						value={amount}
						label="Amount"
						keyboardType="number-pad"
					/>
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
					<Button
						mode="contained"
						loading={expensLoading}
						disabled={expenseDisable}
						onPress={() => this.addExpense()}
						style={{marginTop: 10}}>
						Submit
					</Button>

					<Modal
						animationType="slide"
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => {
							this.setState({modalVisible: false});
						}}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'baseline',
										justifyContent: 'space-between',
									}}>
									<Text style={styles.modalText}>Add Expense</Text>
									<Icon
										name="close"
										size={30}
										color={'#ffffff'}
										style={{alignSelf: 'flex-end'}}
										onPress={() => this.setState({modalVisible: false})}
									/>
								</View>

								<TextInput
									mode="outlined"
									// style={styles.input}
									onChangeText={value => this.setState({reason: value})}
									value={reason}
									label="Reason"
								/>
								<TextInput
									mode="outlined"
									// style={styles.input}
									onChangeText={value => this.setState({amount: value})}
									value={amount}
									label="Amount"
									keyboardType="number-pad"
								/>
								<Button
									mode="contained"
									loading={expensLoading}
									disabled={expenseDisable}
									onPress={() => this.addExpense()}
									style={{marginTop: 10}}>
									Submit
								</Button>
							</View>
						</View>
					</Modal>
				</View>
			</Provider>
		);
	}
}

const mapStateToProps = state => ({
	loginDetails: state.loginDetails,
});

export default connect(mapStateToProps, {})(Expense);
