/*
 * ****************************************************************
 * File: remoteSteamer.js
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
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RTCView } from 'react-native-webrtc-rad';

// screen width and height based on dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const RemoteStreamer = ({ stream }) => {
  const [orientation, setOrientation] = useState('LANDSCAPE');

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

  return (
    <RTCView
      streamURL={stream?.toURL()}
      objectFit="contain"
      style={{
        display: 'flex',
        width: SCREEN_WIDTH - 25,
        height:
          orientation === 'PORTRAIT'
            ? Dimensions.get('window').height * 0.7
            : Dimensions.get('window').height - 200,
        alignSelf: 'center',
        marginTop: 5,
        // backgroundColor: 'lightgrey',
        // position: 'absolute',
        // zIndex: 1,
        // elevation: 1,
      }}></RTCView>
  );
};

export default RemoteStreamer;
