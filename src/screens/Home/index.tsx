/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import {Button, StyleSheet, Text, View, TextInput} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Wheel from '../../components/wheel';
import SplashScreen from '../SplashScreen';

function Home(): JSX.Element {
  const modalizeRef = useRef<Modalize>(null);
  const {top} = useSafeAreaInsets();
  const [isLoading, setIsLoading] = React.useState(true);

  const [value, onChangeText] = React.useState('');

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onCloseModal = () => {
    console.log(value.split('\n'));
    modalizeRef.current?.close();
  };

  useEffect(() => {
    const _timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(_timeout);
    };
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <Wheel
        listData={value ? value.split('\n') : undefined}
        textWinner="Người may mắn nhất đêm nay là..."
      />
      <View style={{marginBottom: 50}}>
        <Button onPress={onOpen} title="Vừng ơi mở ra" />
      </View>

      <Modalize ref={modalizeRef} modalStyle={{marginTop: top * 2}}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {'Nhập những cái tên may mắn nhất (xuống dòng mỗi tên nhen)'}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              autoCorrect={false}
              autoComplete={'off'}
              multiline
              numberOfLines={4}
              onChangeText={text => onChangeText(text)}
              value={value}
              style={{padding: 10}}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={onCloseModal} title="Ok, Chơi thôi" />
          </View>
        </View>
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  svgViewContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerContainer: {
    flex: 1,
    marginTop: 100,
  },
  knobContainer: {
    justifyContent: 'center',
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    borderBottomColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default Home;
