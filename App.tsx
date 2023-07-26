/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Home from './src/screens/Home';

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <GestureHandlerRootView style={{flex: 1}}>
          <Home />
        </GestureHandlerRootView>
      </View>
    </SafeAreaProvider>
  );
}

export default App;
