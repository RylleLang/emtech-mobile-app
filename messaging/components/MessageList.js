import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Audio } from 'expo-av';
// Remove MapView import from 'expo' as it is not supported on web
// import { MapView } from 'expo';

import { MessageShape } from '../utils/MessageUtils';

const keyExtractor = item => item.id.toString();

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
    onLongPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
    onLongPressMessage: () => {},
  };

  renderMessageItem = ({ item }) => {
    const { onPressMessage, onLongPressMessage } = this.props;
    return (
      <View key={item.id} style={styles.messageRow}>
        <TouchableOpacity
          onPress={() => onPressMessage(item)}
          onLongPress={() => onLongPressMessage(item)}
        >
          {this.renderMessageBody(item)}
        </TouchableOpacity>
      </View>
    );
  };

  renderMessageBody = ({ type, text, uri, coordinate, audioUri }) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.text}>{text}</Text>
          </View>
        );
      case 'image':
        return <Image style={styles.image} source={{ uri }} />;
      case 'location':
        if (Platform.OS === 'web') {
          // For web, just show the coordinates as text since MapView is not supported
          return (
            <View style={styles.messageBubble}>
              <Text style={styles.text}>
                Location: {coordinate.latitude.toFixed(4)}, {coordinate.longitude.toFixed(4)}
              </Text>
            </View>
          );
        } else {
          // For native platforms, use MapView
          const MapView = require('react-native-maps').default;
          const Marker = require('react-native-maps').Marker;
          return (
            <MapView
              style={styles.map}
              initialRegion={{
                ...coordinate,
                latitudeDelta: 0.08,
                longitudeDelta: 0.04,
              }}
            >
              <Marker coordinate={coordinate} />
            </MapView>
          );
        }
      case 'audio':
        return (
          <View style={styles.audioBubble}>
            <TouchableOpacity style={styles.playButton} onPress={() => this.playAudio(audioUri)}>
              <Text style={styles.playText}>▶️</Text>
            </TouchableOpacity>
            <View style={styles.audioWave}>
              <View style={styles.waveBar} />
              <View style={styles.waveBar} />
              <View style={styles.waveBar} />
              <View style={styles.waveBar} />
              <View style={styles.waveBar} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  playAudio = async (audioUri) => {
    try {
      // Set audio mode to play through speaker on iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      await sound.setVolumeAsync(1.0); // Set volume to maximum
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  render() {
    const { messages } = this.props;
    return (
      <FlatList
        style={styles.container}
        inverted
        data={messages}
        renderItem={this.renderMessageItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible', // Prevents clipping on resize!
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 60,
  },
  messageBubble: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 15,
  },
  text: {
    color: 'white',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
  },
  map: {
    width: 150,
    height: 150,
    borderRadius: 15,
  },
  audioBubble: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    minWidth: 120,
  },
  playButton: {
    marginRight: 10,
  },
  playText: {
    fontSize: 20,
  },
  audioWave: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  waveBar: {
    width: 3,
    height: 20,
    backgroundColor: 'white',
    marginHorizontal: 1,
    borderRadius: 1,
  },
});
