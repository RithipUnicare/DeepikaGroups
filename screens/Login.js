import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import {loggedIn} from '../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ser_url} from '../components/constants';
import {TextInput} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  subContainer: {
    flex: 1,
    // marginTop: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  inputView: {
    // flex: 1,
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    // borderWidth: 1,
    // borderColor: 'grey',
    // borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    // paddingHorizontal: 10,
    // textAlign: 'center',
    fontSize: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  btn: {
    marginHorizontal: 20,
    backgroundColor: '#841584',
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
});

const setLoginLocal = async loginData => {
  try {
    await AsyncStorage.setItem('loginData', JSON.stringify(loginData));
  } catch (err) {}
};

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      userName: '',
      password: '',
      uNameError: '',
      passwordError: '',
      isEditable: true,
    };
  }

  checkLogin = () => {
    const {userName, password} = this.state;
    if (!userName || !password) {
      Alert.alert('Login Error', 'Please fill all the details', [{text: 'OK'}]);
    } else {
      this.setState({isLoading: true, isEditable: false});
      console.log(ser_url + '/login.php?mobile=' + userName + '&password=' + password);
      fetch(
        ser_url + '/login.php?mobile=' + userName + '&password=' + password,
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
          // console.log(JSON.stringify(json));
          if (json.Success == 0) {
            // alert("correct");
            setLoginLocal(json);
            // dispatch(loggedIn(json));
            this.props.loggedIn(json);
            // this.resetToHome();
          } else {
            Alert.alert('Login Error', json.Messages, [
              {
                text: 'OK',
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(error => alert('veena ',error))
        .finally(() => {
          this.setState({isLoading: false, isEditable: true});
        });
    }
  };

  render() {
    const {isLoading, userName, password, isEditable} = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={{height: 100, resizeMode: 'contain', alignSelf: 'center'}}
          />
          <Text style={styles.appName}>Deepika Groups</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              onChangeText={value =>
                this.setState({userName: value, uNameError: ''})
              }
              value={userName}
              // placeholder="Mobile Number"
              label="Mobile Number"
              editable={isEditable}
              keyboardType="phone-pad"
            />
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              onChangeText={value =>
                this.setState({password: value, passwordError: ''})
              }
              value={password}
              // placeholder="Password"
              label="Password"
              editable={isEditable}
            />
            <TouchableOpacity
              style={styles.btn}
              onPress={() => this.checkLogin()}
              disabled={!isEditable}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', color: '#ffffff'}}>
                Login
              </Text>
            </TouchableOpacity>

            <ActivityIndicator
              size="large"
              color="#0000ff"
              animating={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  // loginDetails: state.loginDetails
});

export default connect(mapStateToProps, {loggedIn})(Login);
