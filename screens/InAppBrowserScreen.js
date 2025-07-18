import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class InAppBrowserScreen extends Component {
  state = {
    cameraPermissionGranted: false,
  };

  async componentDidMount() {
    await this.requestCameraPermission();
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to enable camera features.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        this.setState({ cameraPermissionGranted: true });
      } else {
        console.log('Camera permission denied');
        Alert.alert(
          'Permission Denied',
          'Camera access is required for this feature. Please enable it in settings.',
          [{ text: 'OK' }]
        );
        this.setState({ cameraPermissionGranted: false });
      }
    } catch (err) {
      console.warn('Error requesting camera permission:', err);
      this.setState({ cameraPermissionGranted: false });
    }
  };

  render() {
    const { loginDetails,route } = this.props;
    const { cameraPermissionGranted } = this.state;
    const saleType = route?.params?.saleType || ''; 
    console.log(saleType)
    return (
      <View style={styles.container}>
        <WebView
          source={{
            uri: `https://deepikagroups.in/?c_no=${loginDetails.ID}&type=${loginDetails.Type}&number_counter=${loginDetails.number_counter}&saleType=${saleType}`,
          }}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          geolocationEnabled={true} // Optional, if your webpage needs geolocation
          onPermissionRequest={(event) => {
            // Grant camera and microphone permissions for WebView
            event.nativeEvent.requestPermissions(['camera', 'microphone']);
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  loginDetails: state.loginDetails,
});

export default connect(mapStateToProps)(InAppBrowserScreen);
