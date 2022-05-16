/*
 * ****************************************************************
 * File: getCall.js
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

import {Icon} from 'native-base';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, BackHandler, Alert} from 'react-native';
import Keypadscreen from './keypad';

const GetCall = ({
  navigation,
  route,
  endCall,
  session,
  acceptCall,
  joinWithVideoMuted,
  logoutClient,
}) => {
  const {username, audiocall} = route.params;
  const [keyboard, setKeyboard] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState('');
  const [isAudioCall, setIsAudioCall] = useState(true);
  let phNo = username !== undefined || username !== null ? username : '';

  // const keyboardStatus = () => {
  //   setKeyboard(!keyboard);
  // };

  const testComponent = true;

  const onCallEnd = () => {
    endCall();
    navigation.navigate('Call');
  };

  useEffect(() => {
    if (session.session && !session.ringing) {
      navigation.navigate('ConnectedVideoCall', {audiocall});
    } else if (session.session === null) {
      navigation.navigate('Call');
    }
  }, [session]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const goBackFunction = () => {
    if (session.session) {
      if (session.incoming && session.ringing) {
        session.session.rejectCall();
      } else {
        session.session.disconnectCall();
      }
    }
    // logoutClient();
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
            onPress: () => goBackFunction,
          },
        ],
        {cancelable: false},
      );
    } else {
      return false;
    }
    // Return true to enable back button over ride.
    return true;
  };

  const handleCalls = () => {
    if (session.incoming) {
      session.session?.incomingCallWithVideo
        ? acceptCall({audio: true, video: true})
        : acceptCall({audio: true, video: false});
    }
  };

  return (
    <View style={{display: 'flex', flex: 1}}>
      {testComponent ? (
        <View>
          <Text
            style={{display: 'none'}}
            testID="goback"
            onPress={goBackFunction}>
            Test 1
          </Text>
        </View>
      ) : null}
      <Text style={styles.text}>
        {' '}
        {session.incoming
          ? `${
              session.remoteUserName
                ? session.remoteUserName
                : session.remoteUser
            } is calling you`
          : `Calling ${
              session.remoteUserName
                ? session.remoteUserName
                : session.remoteUser
            }`}
      </Text>
      <View
        style={{
          flex: 0.8,
          margin: 30,
          justifyContent: 'center',
        }}>
        {session.session?.incomingCallWithVideo ? (
          <Icon
            name="video-camera"
            type="FontAwesome"
            style={{
              color: '#314B9F',
              textAlign: 'center',
              fontSize: 90,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ) : session.session?.incomingCallWithVideo === false ? (
          <Icon
            name="call"
            type="MaterialIcons"
            style={{
              color: '#314B9F',
              textAlign: 'center',
              fontSize: 90,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ) : session.constraints.audio === true &&
          session.constraints.video === true ? (
          <Icon
            name="video-camera"
            type="FontAwesome"
            style={{
              color: '#314B9F',
              textAlign: 'center',
              fontSize: 90,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ) : (
          <Icon
            name="call"
            type="MaterialIcons"
            style={{
              color: '#314B9F',
              textAlign: 'center',
              fontSize: 90,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 15,
          position: 'absolute',
          bottom: 35,
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'column',
            display: 'flex',
          }}>
          {session.incoming ? (
            <>
              <Icon
                testID="call"
                onPress={() => handleCalls()}
                name="call"
                type="Ionicons"
                size={30}
                style={{color: 'green'}}
              />
              <Text>Answer</Text>
            </>
          ) : (
            <>
              <Icon
                testID="video"
                onPress={() => acceptCall({audio: true, video: true})}
                name="video-camera"
                type="FontAwesome"
                size={30}
                style={{color: 'grey'}}
              />
              <Text>Video</Text>
            </>
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            display: 'flex',
          }}>
          <Icon
            // onPress={() => acceptCall({audio: true, video: false})}
            name="microphone"
            type="FontAwesome"
            size={30}
            style={{color: 'grey', marginLeft: 5}}
          />
          <Text style={{color: 'grey'}}>Audio</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            display: 'flex',
            flex: 0.3,
          }}>
          <Icon
            name="keyboard"
            type="Entypo"
            style={{color: 'grey', marginLeft: 10}}
            size={30}
          />
          <Text style={{color: 'grey'}}>Keyboard</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            display: 'flex',
          }}>
          <Icon
            testID="callEnd"
            onPress={onCallEnd}
            name="call-end"
            type="MaterialIcons"
            size={30}
            style={{color: 'red', marginLeft: 10}}
          />
          <Text>End Call</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
    // fontFamily: 'system-ui',
    color: 'black',
    marginTop: 50,
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
export default GetCall;
