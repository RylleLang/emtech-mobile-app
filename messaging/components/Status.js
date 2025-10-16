import NetInfo from '@react-native-community/netinfo';
import { Platform, StatusBar, StyleSheet, Text, View, Animated } from 'react-native';
import React from 'react';

export default class Status extends React.Component {
  constructor(props) {
    super(props);
    this.animatedOpacity = new Animated.Value(0);
    this.animatedColor = new Animated.Value(0);
    this.fadeOutTimer = null;
  }

  state = {
    info: null,
  };

  componentDidMount() {
    // Get initial connection info
    NetInfo.fetch().then(state => {
      this.setState({ info: state.isConnected ? 'connected' : 'none' }, () => {
        this.animateStatusBar();
        this.animateMessageBubble();
      });
    });

    // Subscribe to connection changes
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ info: state.isConnected ? 'connected' : 'none' }, () => {
        this.animateStatusBar();
        this.animateMessageBubble();
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.fadeOutTimer) {
      clearTimeout(this.fadeOutTimer);
    }
  }

  animateStatusBar() {
    const isConnected = this.state.info === 'connected';
    Animated.timing(this.animatedColor, {
      toValue: isConnected ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  animateMessageBubble() {
    // Animate in
    Animated.timing(this.animatedOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Set timeout to animate out
    if (this.fadeOutTimer) clearTimeout(this.fadeOutTimer);
    this.fadeOutTimer = setTimeout(() => {
      Animated.timing(this.animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 3000);
  }

  render() {
    const { info } = this.state;
    const isConnected = info === 'connected';
    const backgroundColor = this.animatedColor.interpolate({
      inputRange: [0, 1],
      outputRange: ['red', 'green'],
    });
    const statusBarColor = isConnected ? 'green' : 'red';
    const message = isConnected ? 'Connected' : 'No network connection';

    const statusBar = (
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle="light-content"
        animated={false}
      />
    );

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents={'none'}>
        {statusBar}
        <Animated.View style={[styles.bubble, { backgroundColor, opacity: this.animatedOpacity }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      </View>
    );

    if (Platform.OS === 'ios') {
      return <Animated.View style={[styles.status, { backgroundColor }]}>{messageContainer}</Animated.View>;
    }

    return messageContainer;
  }
}

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: Platform.OS === 'ios' ? 20 : 0,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: (Platform.OS === 'ios' ? 20 : 0) + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  text: {
    color: 'white',
  },
});
