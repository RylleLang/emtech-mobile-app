const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// For web, mock react-native-maps to avoid bundling native code
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.extraNodeModules = {
    'react-native-maps': path.resolve(__dirname, 'mocks/react-native-maps.js')
  };
}

module.exports = config;
