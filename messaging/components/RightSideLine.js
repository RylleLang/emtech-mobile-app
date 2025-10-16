import React from 'react';
import { View, StyleSheet } from 'react-native';

const RightSideLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 2,
    width: 100,
    backgroundColor: 'gray',
    borderRadius: 1,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default RightSideLine;
