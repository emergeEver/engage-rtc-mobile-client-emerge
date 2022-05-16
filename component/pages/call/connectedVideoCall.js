/*
 * ****************************************************************
 * File: connectedVideoCall.js
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

import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import RemoteStreamer from './remoteStreamer';
import LocalStreamer from './localStreamer';
import Keypadscreen from './keypad';
import Snackbar from 'react-native-snackbar';

// screen width and height based on dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ConnectedVideoCall = ({
  navigation,
  session,
  endCall,
  remoteStream,
  localStream,
  route,
  logoutClient,
  callTransfer,
  testComponent,
  joinWithVideoMuted,
}) => {
  const [videoStatus, setVideoStatus] = useState(false);
  const [audioStatus, setAudioStatus] = useState(true);
  const { audiocall } = route.params;
  const [keyboard, setKeyboard] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState('');
  const [second, setSecond] = useState('00');
  const [minute, setMinute] = useState('00');
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const onToggleVideo = () => {
    if (session.session) {
      const { session: instance } = session;
      try{
      instance.toggleVideo();
      }catch(e){
        Snackbar.show({
          text: e.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
      }
    }
  };

  const onToggleAudio = () => {
    if (session.session) {
      const { session: instance } = session;
      try{
      instance.toggleAudio();
      }catch(e){
        Snackbar.show({
          text: e.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
      }
    }
  };

  useEffect(() => {
    if (joinWithVideoMuted) {
      setVideoStatus(false);
    }
  }, []);

  // useEffect(() => {
  //   // This is when call is ended
  //   if (session.session === null) {
  //     navigation.navigate('Call');
  //   }
  // }, [session]);

  useEffect(() => {
    const { session: instance } = session;
    if (instance) {
      instance.addEventHandler('muted', ({ audio, video }) => {
        if (audio) {
          setAudioStatus(false);
        }
        if (video) {
          setVideoStatus(false);
        }
      });
      instance.addEventHandler('unmuted', ({ audio, video }) => {
        if (audio) {
          setAudioStatus(true);
        }
        if (video) {
          setVideoStatus(true);
        }
      });
    }
  }, []);

  const keyboardStatus = () => {
    setKeyboard(!keyboard);
  };

  const logout = () => {
    // if (session.session) {
    //   session.disconnectCall();
    // }
    if (session.session) {
      if (session.incoming && session.ringing) {
        session.session.rejectCall();
      } else {
        session.session.disconnectCall();
      }
    }
    navigation.navigate('Call');
  };

  const handleBackButtonClick = () => {
    if (navigation.isFocused()) {
      Alert.alert(
        'Window Close',
        'Are you sure you want cancel call?',
        [
          {
            text: 'CANCEL',
            style: 'destructive',
            onPress: () => {
              // console.log('NO Pressed');
            },
          },
          {
            text: 'CONTINUE',
            style: 'cancel',
            onPress: logout,
          },
        ],
        { cancelable: false },
      );
    } else {
      return false;
    }
    // Return true to enable back button over ride.
    return true;
  };

  useEffect(() => {
    let intervalId;

    intervalId = setInterval(() => {
      const secondCounter = counter % 60;
      const minuteCounter = Math.floor(counter / 60);

      const computedSecond =
        String(secondCounter).length === 1
          ? `0${secondCounter}`
          : secondCounter;
      const computedMinute =
        String(minuteCounter).length === 1
          ? `0${minuteCounter}`
          : minuteCounter;

      setSecond(computedSecond);
      setMinute(computedMinute);

      setCounter(counter => counter + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [counter]);

  const toggleCamera = () => {
    if (session.session) {
      session.session.switchCamera();
      Snackbar.show({
        text: 'Camera switched',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      <View style={{ display: 'flex', flex: 1 }}>
        {testComponent ? (
          <View>
            <Text testID="logout" onPress={logout}>
              Test 1
            </Text>
          </View>
        ) : null}
        <View>
          {callTransfer.status ? (
            <Text style={styles.text}>
              {`${callTransfer.message} ${minute}:${second}`}{' '}
            </Text>
          ) : (
            <Text style={styles.text}>
              {`${session.remoteUserName
                ? session.remoteUserName
                : session.remoteUser
                } is connected ${minute}:${second}`}{' '}
            </Text>
          )}
        </View>
        <View
          style={{
            zIndex: 1,
            elevation: 1,
          }}>
          {/* Because we have called these one here RTCView */}
          <RemoteStreamer stream={remoteStream} session={session} />
        </View>

        <View
          style={{
            flex: 0.8,
            margin: 30,
            justifyContent: 'center',
          }}>
          {keyboard ? (
            <Keypadscreen
              testID="Keypadscreen"
              number={number}
              setNumber={setNumber}
              keyboard={keyboard}
              setKeyboard={setKeyboard}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              session={session}
            />
          ) : null}
        </View>
        <View
          style={{
            display: 'flex',
            padding: 15,
            position: 'absolute',
            float: 'left',
            left: 10,
            top: SCREEN_HEIGHT * 0.09,
            zIndex: 3,
            elevation: 3,
          }}>
          {
            // audiocall === false
            session.constraints.video ? (
              <LocalStreamer stream={localStream} session={session} />
            ) : null
          }
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 15,
            position: 'absolute',
            bottom: 12,
            width: '100%',
          }}>
          {videoStatus ? (
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
              }}>
              <Icon
                testID="toggleCamera"
                onPress={() => toggleCamera()}
                name="camera"
                type="Fontisto"
                size={30}
                style={{ color: 'grey', marginLeft: 5 }}
              />
              <Text style={{ color: 'grey' }}>Switch</Text>
            </View>
          ) : null}
          {videoStatus ? (
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
              }}>
              <Icon
                testID="onToggleVideo"
                onPress={onToggleVideo}
                name="video"
                type="FontAwesome5"
                size={30}
                style={{ color: 'grey', marginLeft: 5 }}
              />
              <Text style={{ color: 'grey' }}>Video</Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
              }}>
              <Icon
                testID="onToggleVideo"
                onPress={onToggleVideo}
                name="video-slash"
                type="FontAwesome5"
                size={30}
                style={{ color: 'grey', marginLeft: 5 }}
              />
              <Text style={{ color: 'grey' }}>Video</Text>
            </View>
          )}
          {audioStatus ? (
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
              }}>
              <Icon
                testID="onToggleAudio"
                onPress={onToggleAudio}
                name="microphone"
                type="FontAwesome"
                size={30}
                style={{ color: 'grey', marginLeft: 3 }}
              />
              <Text style={{ color: 'grey' }}>Mute</Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
              }}>
              <Icon
                onPress={onToggleAudio}
                name="microphone-slash"
                type="FontAwesome"
                size={30}
                style={{ color: 'grey', marginLeft: 3 }}
              />
              <Text style={{ color: 'grey' }}>Mute</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'column',
              display: 'flex',
            }}>
            <Icon
              testID="keyboardStatus"
              onPress={() => {
                keyboardStatus();
                setModalVisible(true);
              }}
              name="keyboard"
              type="Entypo"
              size={30}
              style={{ color: 'grey', marginLeft: 12 }}
            />
            <Text style={{ color: 'grey' }}>Keyboard</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              display: 'flex',
            }}>
            <Icon
              onPress={endCall}
              name="call-end"
              type="MaterialIcons"
              size={30}
              style={{ color: 'red', marginLeft: 12 }}
            />
            <Text style={{ color: 'grey' }}>Call end</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    position: 'relative',
  },
  titleText: {
    fontSize: 14,
    textAlign: 'center',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'black',
  },
  container: {
    backgroundColor: '#051540',
    display: 'flex',
    flex: 1,
  },
  image: {
    width: '34%',
    height: '28%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  cardViewStyle: {
    width: null,
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 20,
    marginTop: 140,
    borderColor: 'black',
    borderWidth: 8,
    shadowColor: 'black',
    justifyContent: 'center',
    alignContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 22,
    //fontFamily: 'system-ui',
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    height: 38,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 18,
    borderWidth: 1,
  },
  next: {
    marginTop: 16,
    marginBottom: 6,
    borderRadius: 30,
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default ConnectedVideoCall;
