/*
 * ****************************************************************
 * File: makeCall.js
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

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  BackHandler,
  Alert,
} from 'react-native';
import {Card, Text, Icon, Button} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RecentCalls from './recentCalls';
import {NavigationContainer} from '@react-navigation/native';

// screen width and height based on dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function Keypad({
  navigation,
  makeCall,
  endCall,
  session,
  isEnabled,
  username,
  setUsername,
  whoosh,
  logoutClient,
  RTCUtils,
}) {
  const [textError, seteTextError] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [audio, setAudio] = useState(false);
  const [audiocall, setAudioCall] = useState(false);

  useEffect(() => {
    if (session.session && session.ringing) {
      navigation.navigate('Getcall', {username, audiocall});
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

  const videoCallhandler = () => {
    makeCall({
      audio: true,
      video: true,
      remoteNumber: username,
      setUsername: setUsername,
    });
  };

    const videoCallhandlerSos = () => {
    makeCall({
      audio: true,
      video: true,
      remoteNumber: '900770',
      setUsername: 'emergencyOperator',
    });
  };

  const audioCallhandler = () => {
    makeCall({
      audio: true,
      video: false,
      remoteNumber: username,
      setUsername: setUsername,
    });
  };

  const inputChanger = input => {
    setUsername(input);
  };

  const calBtns = [
    '1',
    '2',
    '3',
    'A',
    '4',
    '5',
    '6',
    'B',
    '7',
    '8',
    '9',
    'C',
    '*',
    '0',
    '#',
    'D',
  ];

  const handleBackButtonClick = () => {
    if (navigation.isFocused()) {
      Alert.alert(
        'Window Close',
        'Are you sure you want to exit?',
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
            onPress: () => {
              logoutClient();
              navigation.navigate('Login');
            },
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.cardViewStyle}>
          <TextInput
            name="username"
            placeholder="Enter Phone No / SIP URI"
            style={{
              color: '#314B9F',
              textAlign: 'center',
              fontSize: SCREEN_WIDTH * 0.049,
              marginBottom: SCREEN_WIDTH * 0.03,
              marginTop: 2,
              width: SCREEN_WIDTH - 140,
              alignSelf: 'center',
            }}
            value={username}
            onChangeText={inputChanger}
            underlineColorAndroid="transparent"
            placeholderTextColor="grey"
            contextMenuHidden={true}
          />
          <View
            style={{
              flexDirection: 'row',
              width: (SCREEN_HEIGHT + SCREEN_WIDTH) / 3,
              marginLeft: ((SCREEN_HEIGHT + SCREEN_WIDTH) / 2) * 0.18,
              marginRight: ((SCREEN_HEIGHT + SCREEN_WIDTH) / 2) * 0.1,
              flexWrap: 'wrap',
              flex: 1,
              alignSelf: 'center',
              margin: 'auto',
              // padding: 5
            }}>
            {calBtns.map((item, i) => (
              <Button
                key={i}
                style={{
                  width: ((SCREEN_HEIGHT + SCREEN_WIDTH) / 2) * 0.14,
                  height: ((SCREEN_HEIGHT + SCREEN_WIDTH) / 2) * 0.14,
                  justifyContent: 'center',
                  margin: ((SCREEN_HEIGHT + SCREEN_WIDTH) / 2) * 0.005,
                  padding: ((SCREEN_HEIGHT + SCREEN_WIDTH) / 2) * 0.005,
                  backgroundColor: '#F1F5F8',
                  borderRadius: ((SCREEN_HEIGHT + SCREEN_WIDTH) / 2) * 0.1,

                  // width: SCREEN_WIDTH * 0.2,
                  // width: SCREEN_HEIGHT * 0.11,
                  // height: SCREEN_HEIGHT * 0.11,
                  // justifyContent: 'center',
                  // margin: SCREEN_WIDTH * 0.01,
                  // margin: SCREEN_WIDTH * 0.008,
                  // padding: SCREEN_WIDTH * 0.01,
                  // backgroundColor: '#F1F5F8',
                  // borderRadius: SCREEN_WIDTH * 0.1,
                }}
                // onPress={() => manipulate('add', item)}
                onPress={() => setUsername(username + item)}
                transparent>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: SCREEN_WIDTH * 0.05,
                    color: '#000000',
                  }}>
                  {item}
                </Text>
              </Button>
            ))}
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: SCREEN_WIDTH * 0.01,
            bottom: SCREEN_HEIGHT * 0.03,
            margin: 'auto',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'column',
              display: 'flex',
            }}>
            {username !== undefined ? (
              <TouchableOpacity
                testID="videoCallhandler1"
                onPress={() => videoCallhandler()}
                style={styles.roundButton1}>
                <Icon
                  testID="videoCallhandler2"
                  onPress={() => videoCallhandler()}
                  name="video-camera"
                  type="FontAwesome"
                  style={{color: 'white', fontSize: SCREEN_WIDTH * 0.08}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.roundButton1}>
                <Icon
                  name="video-camera"
                  type="FontAwesome"
                  style={{color: 'lightgrey', fontSize: SCREEN_WIDTH * 0.08}}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
              display: 'flex',
            }}>
            {username !== undefined ? (
              <TouchableOpacity
                testID={'audioCallhandler1'}
                onPress={() => audioCallhandler()}
                style={styles.roundButton1}>
                <Icon
                  testID={'audioCallhandler2'}
                  onPress={() => audioCallhandler()}
                  name="call"
                  type="MaterialIcons"
                  style={{color: 'white', fontSize: SCREEN_WIDTH * 0.08}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.roundButton1}>
                <Icon
                  name="call"
                  type="MaterialIcons"
                  style={{color: 'lightgrey', fontSize: SCREEN_WIDTH * 0.08}}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* {username !== '' ? (
            <View
              style={{
                flexDirection: 'column',
                display: 'flex',
              }}>
              <TouchableOpacity
                // onPress={() => manipulate('delete')}
                onPress={() => setUsername('')}
                style={styles.roundButton1}>
                <Icon
                  // onPress={() => manipulate('delete')}
                  onPress={() => setUsername('')}
                  // username.slice(0, -1)
                  name="backspace"
                  type="Ionicons"
                  style={{color: 'white', fontSize: SCREEN_WIDTH * 0.08}}
                />
              </TouchableOpacity>
            </View>
          ) : null} */}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: SCREEN_WIDTH * 0.01,
            bottom: SCREEN_HEIGHT * 0.03,
            margin: 'auto',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'column',
              display: 'flex',
            }}>
            {username !== undefined ? (
              <TouchableOpacity
                testID="videoCallhandler1"
                onPress={() => videoCallhandlerSos()}
                style={styles.roundButton1}>
                <Icon
                  testID="videoCallhandler2"
                  onPress={() => videoCallhandlerSos()}
                  name="life-saver"
                  type="FontAwesome"
                  style={{color: 'white', fontSize: SCREEN_WIDTH * 0.08}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.roundButton1}>
                <Icon
                  name="life-saver"
                  type="FontAwesome"
                  style={{color: 'lightgrey', fontSize: SCREEN_WIDTH * 0.08}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>  
      </ScrollView>
    </SafeAreaView>
  );
}

function CallsScreen({navigation, username, setUsername}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <RecentCalls username={username} setUsername={setUsername} />
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs({
  makeCall,
  endCall,
  session,
  isEnabled,
  connection,
  navigation,
  username,
  setUsername,
  logoutClient,
}) {
  return (
    // <NavigationContainer independent={true} navigation={navigation}>
    <Tab.Navigator
      screenOptions={{gestureEnabled: true}}
      initialRouteName="Dialer"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#ffffff',
        inactiveColor: '#C9C9C9',
        style: {
          backgroundColor: '#314B9F',
          color: 'white',
          paddingTop: 3,
          height: SCREEN_HEIGHT * 0.09,
          borderTopWidth: 0,
        },
        labelStyle: {
          fontSize: SCREEN_WIDTH * 0.0,
          // marginBottom: SCREEN_HEIGHT * 0.02,
        },
      }}>
      <Tab.Screen
        name="Dialer"
        children={({navigation}) => (
          <Keypad
            navigation={navigation}
            makeCall={makeCall}
            endCall={endCall}
            session={session}
            isEnabled={isEnabled}
            connection={connection}
            username={username}
            setUsername={setUsername}
            logoutClient={logoutClient}
          />
        )}
        options={{
          gestureEnabled: true,
          activeTintColor: '#ffffff',
          inactiveColor: '#C9C9C9',
          tabBarLabel: 'Make Call',
          tabBarIcon: ({focused}) => (
            <Icon
              name="keypad"
              type="Ionicons"
              style={{
                // tintColor: focused ? 'red' : 'white',
                color: 'white',
                marginTop: 2,
                fontSize: SCREEN_WIDTH * 0.07,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        children={({navigation}) => (
          <CallsScreen
            username={username}
            setUsername={setUsername}
            navigation={navigation}
          />
        )}
        options={{
          gestureEnabled: true,
          tabBarLabel: 'History',
          tabBarIcon: ({focused, tintColor}) => (
            <Icon
              name="clockcircleo"
              type="AntDesign"
              style={{
                color: 'white',
                marginTop: 2,
                fontSize: SCREEN_WIDTH * 0.07,
              }}
              size={50}
            />
          ),
        }}
      />
    </Tab.Navigator>
    // </NavigationContainer>
  );
}

export default function Call({
  navigation,
  makeCall,
  endCall,
  session,
  isEnabled,
  connection,
  logoutClient,
}) {
  const [username, setUsername] = useState('');
  return (
    <MyTabs
      navigation={navigation}
      makeCall={makeCall}
      endCall={endCall}
      session={session}
      isEnabled={isEnabled}
      connection={connection}
      username={username}
      setUsername={setUsername}
      logoutClient={logoutClient}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6F7FF',
    display: 'flex',
    flex: 1,
  },
  roundButton1: {
    width: SCREEN_HEIGHT * 0.11,
    height: SCREEN_HEIGHT * 0.11,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SCREEN_WIDTH * 0.1,
    backgroundColor: '#314B9F',
    margin: SCREEN_WIDTH * 0.02,
  },
  cardViewStyle: {
    marginTop: SCREEN_WIDTH * 0.02,
    shadowColor: 'black',
    justifyContent: 'center',
    alignContent: 'center',
    padding: SCREEN_WIDTH * 0.05,
  },
});
