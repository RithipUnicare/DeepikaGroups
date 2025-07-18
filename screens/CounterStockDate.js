import React, { Component } from 'react';
import { 
	View, 
	StyleSheet, 
	Text, 
	TouchableOpacity, 
	ActivityIndicator, 
	FlatList 
} from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';

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
	},
	prodName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#6ea2f4',
	},
	prodMrp: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	inText: {
		color: '#ffffff',
		fontSize: 16,
	},
});

export class GodownStock extends Component {
	constructor(props) {
        super(props);
        this.state = {
            selDate: new Date(new Date().setDate(new Date().getDate() - 9)), // Default to today
            toDate: new Date(), // Default to today
            last10Dates: [], // Stores last 10 dates
            pickerVisible: false,
            toPickerVisible: false
        };
    }

    componentDidMount() {
        this.generateLast10Dates();
    }

    // Function to generate last 10 dates based on given range
    generateLast10Dates = () => {
	    const { selDate, toDate } = this.state;
	    let last10Dates = [];
	    let currentDate = new Date(selDate);

	    while (currentDate <= toDate) {  // Ensure it includes `toDate`
	        last10Dates.push(new Date(currentDate)); 
	        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
	    }

	    last10Dates.reverse();

	    this.setState({ last10Dates });
	};

    handleSearch = () => {
        this.generateLast10Dates();
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
	            this.generateLast10Dates(); // Ensuring it runs AFTER state update
	        }
	    );
	};
	 
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
	            this.generateLast10Dates(); // Ensuring it runs AFTER state update
	        }
	    );
	};

	render() {
		const {navigate} = this.props.navigation;
		const {loginDetails} = this.props;
		const { selDate, toDate, pickerVisible, toPickerVisible, last10Dates } = this.state;

		return (
			<View style={styles.container}>
				{/* From Date Picker */}
				<TouchableOpacity
					style={{ paddingHorizontal: 10, marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}
					onPress={() => this.setState({ pickerVisible: true })}
				>
					<Text style={styles.inText}>From: {Moment(selDate).format('Do MMMM YYYY')}</Text>
					<Icon name="pencil" size={20} color={'#ffffff'} style={{ marginLeft: 10 }} />
				</TouchableOpacity>

				{/* To Date Picker */}
				<TouchableOpacity
					style={{ paddingHorizontal: 10, marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}
					onPress={() => this.setState({ toPickerVisible: true })}
				>
					<Text style={styles.inText}>To: {Moment(toDate).format('Do MMMM YYYY')}</Text>
					<Icon name="pencil" size={20} color={'#ffffff'} style={{ marginLeft: 10 }} />
				</TouchableOpacity>

				{/* Date Pickers */}
				<DatePicker
					modal
					title="Select From Date"
					open={pickerVisible}
					date={selDate}
					maximumDate={new Date()}
					mode="date"
					onConfirm={date => {
						this.setState({ pickerVisible: false, selDate: date }, this.handleSearch);
					}}
					onCancel={() => this.setState({ pickerVisible: false })}
				/>

				<DatePicker
					modal
					title="Select To Date"
					open={toPickerVisible}
					date={toDate}
					maximumDate={new Date()}
					mode="date"
					onConfirm={date => {
						this.setState({ toPickerVisible: false, toDate: date }, this.handleSearch);
					}}
					onCancel={() => this.setState({ toPickerVisible: false })}
				/>

				<View style={{flexDirection : 'row',marginBottom:20,marginLeft:'30%'}}>
					<TouchableOpacity onPress = {() => this.rightBtn()}>
						<Text style={{ fontSize: 20 }}>⬅️   </Text>
					</TouchableOpacity>
					<TouchableOpacity onPress = {() => this.leftBtn()}>
						<Text style={{ fontSize: 20 }}>    ➡️</Text>
					</TouchableOpacity>
				</View>

				{/* Search Button */}
				<TouchableOpacity
					style={{ backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 5 }}
					onPress={this.handleSearch}
				>
					<Text style={{ color: '#ffffff' }}>Search</Text>
				</TouchableOpacity>

				{/* List Divider */}
				<View style={{ height: 1, width: '100%', backgroundColor: '#909090', marginVertical: 10 }}></View>

				{/* Display Last 10 Dates */}
				<FlatList
					data={last10Dates}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => (
						<View style={styles.productlist}>
							<TouchableOpacity style={{ flexDirection: 'row' }} onPress={() =>
										navigate('CounterStock', {
											shop : this.props.route.params,
											selDate:item,
										})}
							>

								<View style={{ width: '20%' }}>
									<Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Sr No:</Text>
									<Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{index + 1}</Text>
								</View>
								<View style={{ width: '80%' }}>
									<Text style={styles.prod}>
										<Text style={styles.prodName}>Date: </Text>
										<Text style={styles.prodMrp}>{Moment(item).format('Do MMMM YYYY')}</Text>
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>
		);
	}
}

export default GodownStock;
