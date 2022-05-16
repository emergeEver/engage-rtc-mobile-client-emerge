/*
 * ****************************************************************
 * File: localSteamer.js
 * Project: CPaaS
 * Owner: Radisys
 *
 * Copyright - 2021 Radisys Corporation.
 * All rights reserved. No part of this software may be used or
 * reproduced in any form by any means without the prior written
 * permission of Radisys Corporation.
 *
 * Author: Pavan Kumar
 *
 * ****************************************************************
 */
import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { RTCView } from 'react-native-webrtc-rad';

// screen width and height based on dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const LocalStreamer = ({ stream }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const [orientation, setOrientation] = useState('PORTRAIT');

  let width, height;
  const determineAndSetOrientation = () => {
    width = Dimensions.get('window').width;
    height = Dimensions.get('window').height;
    if (width < height) {
      setOrientation('PORTRAIT');
    } else {
      setOrientation('LANDSCAPE');
    }
  };

  useEffect(() => {
    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  // useEffect(() => {
  //   if (stream._tracks) {
  //     stream._tracks.map(item => {
  //       if (
  //         item.kind === 'video' &&
  //         item._enabled === true &&
  //         item.muted === true
  //       ) {
  //         setStream(true);
  //       }
  //     });
  //   }
  // }, [stream]);

  // console.log('streamValue', streamValue === true ? 'mute' : 'unmute');
  // console.log('stream', stream);
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
        {...panResponder.panHandlers}>
        <View>
          {true ? (
            <RTCView
              streamURL={stream?.toURL()}
              objectFit="fill"
              // mirror=
              // {true}
              zOrder={1}
              style={{
                display: 'flex',
                height: 150,
                width: 150,
                borderRadius: 5,
                position: 'absolute',
                left:
                  orientation === 'PORTRAIT'
                    ? SCREEN_WIDTH * 0.578
                    : SCREEN_WIDTH * 0.01,
                top:
                  orientation === 'PORTRAIT'
                    ? SCREEN_HEIGHT * 0.427
                    : SCREEN_HEIGHT * -0.155,
                marginTop: orientation === 'PORTRAIT' ? 0 : SCREEN_HEIGHT * 0.1,
              }}></RTCView>
          ) : (
            <Text style={styles.titleText}>Video Off</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    textAlign: 'center',
  },
  viewer1: {},
});

export default LocalStreamer;
