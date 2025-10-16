import React from 'react';
import { StyleSheet, View, Alert, Image, TouchableHighlight, TouchableOpacity, Text, BackHandler, Platform, KeyboardAvoidingView } from 'react-native';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import Status from './components/Status';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';
import { createImageMessage, createLocationMessage, createTextMessage, createAudioMessage } from './utils/MessageUtils';

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullscreenImageId: null,
    fullscreenMapId: null,
    isInputFocused: false,
    isRecording: false,
  };

  async componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  handlePressMessage = (message) => {
    const { id, type } = message;
    switch (type) {
      case 'text':
        // For text messages, long press will handle delete
        break;
      case 'image':
        this.setState({ fullscreenImageId: id, isInputFocused: false });
        break;
      case 'location':
        this.setState({ fullscreenMapId: id, isInputFocused: false });
        break;
      case 'audio':
        // Audio messages are handled in MessageList component
        break;
      default:
        break;
    }
  };

  handleLongPressMessage = (message) => {
    const { id } = message;
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => this.deleteMessage(id),
        },
      ],
      { cancelable: true }
    );
  };

  handlePressToolbarCamera = () => {
    // Placeholder for camera button action
    alert('Camera button pressed');
  };

  handlePressToolbarVoice = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Audio recording permission is required to use voice input.');
        return;
      }

      if (this.state.isRecording) {
        // Stop recording
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        this.setState({ isRecording: false });
        // Create audio message and add to messages
        const { messages } = this.state;
        this.setState({
          messages: [createAudioMessage(uri), ...messages],
        });
      } else {
        // Start recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });
        this.recording = new Audio.Recording();
        await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await this.recording.startAsync();
        this.setState({ isRecording: true });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to record voice. Please try again.');
      console.error(error);
    }
  };

  handlePressToolbarLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this feature.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const { messages } = this.state;
      this.setState({
        messages: [createLocationMessage({ latitude, longitude }), ...messages],
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to get location. Please try again.');
    }
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    if (!text) return;
    this.setState({
      messages: [createTextMessage(text), ...messages],
      isInputFocused: false,
    });
  };

  renderToolbar() {
    const { isInputFocused, isRecording } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
          onPressVoice={this.handlePressToolbarVoice}
          isRecording={isRecording}
        />
      </View>
    );
  }

  deleteMessage = (id) => {
    this.setState((prevState) => ({
      messages: prevState.messages.filter((msg) => msg.id !== id),
      fullscreenImageId: prevState.fullscreenImageId === id ? null : prevState.fullscreenImageId,
      fullscreenMapId: prevState.fullscreenMapId === id ? null : prevState.fullscreenMapId,
    }));
  };

  handleLongPressMessage = (message) => {
    const { id } = message;
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => this.deleteMessage(id),
        },
      ],
      { cancelable: true }
    );
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  dismissFullscreenMap = () => {
    this.setState({ fullscreenMapId: null });
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
    const image = messages.find((message) => message.id === fullscreenImageId);
    if (!image) return null;
    const { uri } = image;
    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={this.dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  renderFullscreenMap = () => {
    const { messages, fullscreenMapId } = this.state;
    if (!fullscreenMapId) return null;
    const locationMessage = messages.find((message) => message.id === fullscreenMapId);
    if (!locationMessage) return null;
    const { coordinate } = locationMessage;
    const MapView = require('react-native-maps').default;
    const Marker = require('react-native-maps').Marker;
    return (
      <View style={styles.fullscreenOverlay}>
        <MapView
          style={styles.fullscreenMap}
          initialRegion={{
            ...coordinate,
            latitudeDelta: 0.08,
            longitudeDelta: 0.04,
          }}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          <Marker coordinate={coordinate} />
        </MapView>
        <TouchableOpacity style={styles.closeButton} onPress={this.dismissFullscreenMap}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}
          onLongPressMessage={this.handleLongPressMessage}
        />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Status />
        {this.renderMessageList()}
        <View style={styles.bottomSpacer} />
        {this.renderToolbar()}
        {this.renderFullscreenImage()}
        {this.renderFullscreenMap()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fullscreenMap: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  bottomSpacer: {
    height: Platform.OS === 'android' ? 24 : 0, // Adjust for Android navigation bar
  },
});
