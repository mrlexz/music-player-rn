/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StyleSheet, View, Dimensions, Animated, Text} from 'react-native';
import {
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import {Path, G, Text as SvgText, TSpan, Svg} from 'react-native-svg';
import color from 'randomcolor';
import * as d3Shape from 'd3-shape';
import {snap} from '@popmotion/popcorn';

const {width} = Dimensions.get('screen');

const numOfSegments = 10;
const wheelSize = width * 0.9;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = color({hue: 'purple'});

const makeWheel = () => {
  const data = Array.from({length: numOfSegments}).fill(1) as Array<number>;
  const arcs = d3Shape.pie()(data);
  const colors = color({
    luminosity: 'dark',
    count: numOfSegments,
  });

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);
    return {
      path: instance(arc),
      color: colors[index],
      value: `${index}`,
      centroid: instance.centroid(arc),
    };
  });
};

function App(): JSX.Element {
  const [enabled, setEnabled] = React.useState(true);
  const angle = React.useRef(0);
  const [winner, setWinner] = React.useState<number | null>(null);
  const [finished, setFinished] = React.useState(false);
  const _wheelPaths = React.useMemo(() => makeWheel(), []);
  const _angle = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const events = _angle.addListener(event => {
      if (enabled) {
        setEnabled(false);
        setFinished(false);
      }
      angle.current = event.value;
    });
    return () => {
      _angle.removeListener(events);
    };
  }, [_angle, enabled]);

  const _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(angle.current % oneTurn));
    // wheel turning counterclockwise
    if (angle.current < 0) {
      return Math.floor(deg / angleBySegment);
    }
    // wheel turning clockwise
    return (numOfSegments - Math.floor(deg / angleBySegment)) % numOfSegments;
  };

  const _onPan = ({
    nativeEvent,
  }: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (nativeEvent.state === State.END) {
      const {velocityY} = nativeEvent;

      Animated.decay(_angle, {
        velocity: velocityY / 1000,
        deceleration: 0.999,
        useNativeDriver: true,
      }).start(() => {
        _angle.setValue(angle.current % oneTurn);
        const snapTo = snap(oneTurn / numOfSegments);
        Animated.timing(_angle, {
          toValue: snapTo(angle.current),
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          const winnerIndex = _getWinnerIndex();
          setWinner(+_wheelPaths[winnerIndex].value);
          setFinished(true);
          setEnabled(true);
        });
      });
    }
  };

  const renderKnob = () => {
    const knobSize = 30;
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(_angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment),
      ),
      1,
    );
    return (
      <Animated.View
        style={[
          styles.knobContainer,
          {
            width: knobSize,
            height: knobSize * 2,
            transform: [
              {
                rotate: YOLO.interpolate({
                  inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                  outputRange: [
                    '0deg',
                    '0deg',
                    '35deg',
                    '-35deg',
                    '0deg',
                    '0deg',
                  ],
                }),
              },
            ],
          },
        ]}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={'0 0 57 100'}
          style={{transform: [{translateY: 8}]}}>
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={knobFill}
          />
        </Svg>
      </Animated.View>
    );
  };

  const renderSvgView = () => {
    return (
      <View style={styles.svgViewContainer}>
        {renderKnob()}
        <Animated.View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            transform: [
              {
                rotate: _angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, '0deg', `${oneTurn}deg`],
                }),
              },
            ],
          }}>
          <Svg
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{transform: [{rotate: `-${angleOffset}deg`}]}}>
            <G x={width / 2} y={width / 2}>
              {_wheelPaths.map((arc, index) => {
                const [x, y] = arc.centroid;
                return (
                  <G key={`arc-${index}`}>
                    <Path d={arc.path} fill={arc.color} />
                    <G
                      rotation={(index * oneTurn) / numOfSegments + angleOffset}
                      origin={`${x}, ${y}`}>
                      <SvgText
                        fontSize={fontSize}
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle">
                        <TSpan
                          key={`arc-${index}-slice`}
                          x={x}
                          dy={fontSize}
                          textAnchor="middle">
                          {arc.value}
                        </TSpan>
                      </SvgText>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1, backgroundColor: 'gray'}}>
        <PanGestureHandler enabled={enabled} onHandlerStateChange={_onPan}>
          <View style={styles.container}>
            {renderSvgView()}
            {winner && finished ? (
              <View style={styles.winnerContainer}>
                <Text>Winner is: {winner}</Text>
              </View>
            ) : null}
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
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
});

export default App;
