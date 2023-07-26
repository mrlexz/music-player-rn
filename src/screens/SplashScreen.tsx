import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

export default function SplashScreen() {
  return (
    <View style={styles.viewStyles}>
      <Text style={styles.textStyles}>Cùng xoay nàooo</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyles: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
