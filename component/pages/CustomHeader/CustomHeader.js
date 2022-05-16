/*
 * ****************************************************************
 * File: CustomHeader.js
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

import {Icon, ActionSheet, Button} from 'native-base';

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  BackHandler,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import Snackbar from 'react-native-snackbar';
import Clipboard from '@react-native-clipboard/clipboard';
var RNFS = require('react-native-fs');

// screen width and height based on dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var BUTTONS = [
  {text: 'speaker', icon: 'ios-volume-medium-outline', iconColor: '#2c8ef4'},
  {text: 'Phone', icon: 'call', iconColor: '#f42ced'},
];

const CustomHeader = ({
  connection,
  setConnection,
  navigation,
  debugLogs,
  RTCUtils,
  joinWithVideoMuted,
  testComponent,
  logoutClient,
  session,
  whoosh,
  // mediaState,
  // setMediaState,
  onDeviceMediaSelected,
  onAudioSelection,
  engageClient,
  readyEvent,
  hideDeviceSelection,
  audioDevices,
  setAudioDevices,
  selectedAudioDevice,
  hideResolutionSelection,
  deviceMode,
  userSip,
}) => {
  const [data, setData] = useState();
  const [userId, setUserId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    'SD',
    // '',
    // RTCUtils?.getSelectedCameraResolution() !== undefined
    //   ? RTCUtils?.getSelectedCameraResolution()
    //   : '',
  );
  const [dataDomain, setDataDomain] = useState('');
  const [isLogged, setIsLogged] = useState(true);
  const [resolutionSettings, setResolutionSettings] = useState(false);
  const [logoutState, setLogoutState] = useState(false);
  const [orientation, setOrientation] = useState('PORTRAIT');
  const toggleisLogged = () => setIsLogged(previousState => !previousState);

  useEffect(() => {
    getData();
    getUserID();
  }, [data]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (JSON.parse(value) !== null) {
        setData(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserID = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if (JSON.parse(value) !== null) {
        setUserId(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const downloadClientlogs = () => {
    // File path and name for logs
    // const path = RNFS.DocumentDirectoryPath + 'Logs.txt';

    const path =
      Platform.OS === 'ios'
        ? RNFS.DocumentDirectoryPath + `logs_${Date.now()}.txt`
        : '/storage/emulated/0/Download/' + `logs_${Date.now()}.txt`;

    // File creation
    RNFS.writeFile(path, JSON.stringify(engageClient?.getLogs()), 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });

    RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
      Snackbar.show({
        text: path,
        duration: Snackbar.LENGTH_LONG,
      });
    });
  };

  const connectionStatusMap = {
    Disconnected: 'red',
    Connected: 'green',
    Connecting: 'yellow',
  };

  const logoutData = () => {
    if (session.session) {
      if (session.incoming && session.ringing) {
        session.session.rejectCall();
      } else {
        session.session.disconnectCall();
      }
    }

    logoutClient();
    whoosh.stop();
    navigation.navigate('Login');
  };

  const logout = () => {
    Alert.alert('Window Close', 'Are you sure you want to logout?', [
      {
        text: 'CANCEL',

        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'CONTINUE',
        style: 'destructive',
        onPress: logoutData,
      },
    ]);
  };

  // const toggleSwitch = () =>
  //   setJoinWithVideoMuted(previousState => !previousState);

  useEffect(() => {
    if (engageClient && readyEvent) {
      engageClient.updateLogSettings({
        console: {enable: false},
        blob: {enable: isLogged},
      });
    }
  }, [isLogged]);

  const handleSelect = (itemValue, itemIndex) => {
    if (RTCUtils && itemValue !== '') {
      RTCUtils.setCameraResolution(itemValue);
    }
    setSelectedValue(itemValue);
  };

  useEffect(() => {
    if (RTCUtils) {
      if (RTCUtils.getSelectedCameraResolution() !== undefined) {
        setSelectedValue(RTCUtils.getSelectedCameraResolution());
      }
    }
  }, []);

  const copyHandler = () => {
    Clipboard.setString(userSip);
    Snackbar.show({
      text: 'Your SIP URI copied to clipboard',
      duration: Snackbar.LENGTH_LONG,
    });
  };

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
    <View>
      {testComponent ? (
        <View>
          <Text
            style={{display: 'none'}}
            testID="logoutData"
            onPress={logoutData}>
            Test 1
          </Text>
        </View>
      ) : null}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: SCREEN_WIDTH * 0.02,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginRight: SCREEN_WIDTH * 0.25,
          }}>
          <Icon
            name="user-circle-o"
            type="FontAwesome"
            style={{
              color: connectionStatusMap[connection.status],
              marginRight: SCREEN_WIDTH * 0.02,
              marginTop: SCREEN_WIDTH * 0.01,
              fontSize: SCREEN_WIDTH * 0.085,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: SCREEN_WIDTH * 0.04,
                fontWeight: 'bold',
                marginRight: SCREEN_WIDTH * 0.08,
                textTransform: 'capitalize',
                color: 'white',
                marginTop: SCREEN_WIDTH * 0.01,
              }}>
              {data?.trim() === '' ? 'Unknown user' : data}
            </Text>
            <Text
              onPress={() => copyHandler()}
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginRight: 5,
                // textTransform: 'capitalize',
                color: 'white',
              }}>
              {orientation === 'PORTRAIT'
                ? userSip !== undefined
                  ? userSip.length <= 16
                    ? userSip
                    : `${userSip.substring(0, 16)}...`
                  : ''
                : userSip !== undefined
                ? userSip.length <= 50
                  ? userSip
                  : `${userSip.substring(0, 50)}...`
                : ''}
            </Text>
          </View>
        </View>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          {/* <Switch
            style={{ marginTop: 8, marginRight: SCREEN_WIDTH * 0.015}}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={joinWithVideoMuted ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={joinWithVideoMuted}
          /> */}
          {!hideResolutionSelection ? (
            <Icon
              testId="setting"
              onPress={() => setResolutionSettings(true)}
              name="setting"
              type="AntDesign"
              size={30}
              style={{color: 'white', marginRight: 7, marginTop: 8}}
            />
          ) : null}
          <Icon
            testId="bug"
            onPress={() => setModalVisible(true)}
            name="bug"
            type="FontAwesome"
            size={30}
            style={{color: 'white', marginRight: 7, marginTop: 8}}
          />
          {!hideDeviceSelection ? (
            <Icon
              onPress={() =>
                ActionSheet.show(
                  {
                    options: audioDevices,
                  },
                  buttonIndex => {
                    buttonIndex !== undefined
                      ? onAudioSelection(audioDevices[buttonIndex].text)
                      : null;
                    // setMediaState(BUTTONS[buttonIndex]);
                    // onDeviceMediaSelected(BUTTONS[buttonIndex].text);
                  },
                )
              }
              name={
                Platform.OS !== 'ios'
                  ? selectedAudioDevice.icon
                  : deviceMode === 'SPEAKER_PHONE' || deviceMode === undefined
                  ? 'ios-volume-medium-outline'
                  : deviceMode === 'EARPIECE' || deviceMode === undefined
                  ? 'ios-ear-outline'
                  : 'bluetooth'
              }
              type="Ionicons"
              size={30}
              style={{
                color: selectedAudioDevice.iconColor,
                marginRight: 7,
                marginTop: 8,
              }}
            />
          ) : null}
          {/* <Icon
          name="link"
          type="Entypo"
          size={30}
          style={{color: connectionStatusMap[connection.status]}}
        /> */}

          <Icon
            testID="logoutButton"
            onPress={() => logout()}
            name="logout"
            type="MaterialCommunityIcons"
            style={{color: 'white', marginTop: 8}}
          />
        </View>
      </View>

      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                testID="debug"
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    marginBottom: 12,
                    marginLeft: 8,
                  }}>
                  Debug
                </Text>
                <Icon
                  testID="Modal"
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  style={{
                    // float: 'right',
                    // marginRight:"auto",
                    // marginLeft: 190,
                    color: 'red',
                  }}
                  name="close"
                  type="AntDesign"
                />
              </View>
              <ScrollView style={{flex: 1}}>
                {debugLogs.current.map((data, index) => (
                  <Text key={index} style={styles.modalText}>
                    <Icon
                      style={{color: 'black', marginTop: 8}}
                      name="dot-single"
                      type="Entypo"
                    />{' '}
                    {data}
                  </Text>
                ))}
              </ScrollView>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // width: SCREEN_WIDTH * 1,
                  marginTop: SCREEN_WIDTH * 0.03,
                }}>
                <Text style={styles.textData}>{`Enable client logs : ${
                  isLogged ? 'On' : 'Off'
                }`}</Text>
                <Switch
                  style={{
                    marginTop: SCREEN_WIDTH * 0.03,
                    marginLeft: SCREEN_WIDTH * 0.01,
                  }}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isLogged ? '#f5dd4b' : '#f4f3f4'}
                  onValueChange={toggleisLogged}
                  value={isLogged}
                />
                {isLogged ? (
                  <Button
                    testID="download"
                    onPress={() => downloadClientlogs()}
                    style={{
                      padding: 2,
                      width: SCREEN_WIDTH * 0.2,
                      height: SCREEN_HEIGHT * 0.06,
                      marginLeft: SCREEN_WIDTH * 0.03,
                      justifyContent: 'center',
                      marginBottom: SCREEN_WIDTH * -0.1,
                    }}>
                    <Text style={{color: 'white'}}>Download</Text>
                  </Button>
                ) : (
                  <Button
                    // onPress={() => downloadClientlogs()}
                    style={{
                      padding: 2,
                      width: SCREEN_WIDTH * 0.2,
                      height: SCREEN_HEIGHT * 0.06,
                      marginLeft: SCREEN_WIDTH * 0.03,
                      justifyContent: 'center',
                      marginBottom: SCREEN_WIDTH * -0.1,
                      backgroundColor: 'white',
                    }}>
                    {/* <Text style={{color: 'white'}}>Download</Text> */}
                  </Button>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* Resolution modal  */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={resolutionSettings}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setResolutionSettings(!resolutionSettings);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: SCREEN_WIDTH * 0.01,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                height: SCREEN_HEIGHT * 0.2,
                width: SCREEN_WIDTH * 0.89,
                marginRight: SCREEN_WIDTH * 0.048,
                marginLeft: SCREEN_WIDTH * 0.048,
                backgroundColor: '#F1F5F8',
                borderRadius: SCREEN_WIDTH * 0.048,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: SCREEN_WIDTH * 1,
                }}>
                <Text
                  style={{
                    color: 'black',
                    marginTop: SCREEN_WIDTH * 0.04,
                    fontSize: SCREEN_WIDTH * 0.05,
                    marginLeft: SCREEN_WIDTH * 0.09,
                  }}>
                  Resolutions
                </Text>
                <Icon
                  testID="Resolutions"
                  onPress={() => setResolutionSettings(!resolutionSettings)}
                  name="close"
                  type="AntDesign"
                  style={{
                    color: 'red',
                    marginRight: SCREEN_WIDTH * 0.09,
                    marginTop: SCREEN_WIDTH * 0.03,
                  }}
                />
              </View>
              <View style={styles.container}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: SCREEN_WIDTH * 0.045,
                    marginTop: 15,
                  }}>
                  Select resolution :
                </Text>
                <Picker
                  selectedValue={selectedValue}
                  style={{
                    height: 50,
                    width: 150,
                    color: 'black',
                    fontSize: SCREEN_WIDTH * 0.045,
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    handleSelect(itemValue, itemIndex)
                  }>
                  {/* <Picker.Item label="Select" value="" /> */}
                  <Picker.Item label="QCIF - 144p" value="QCIF" />
                  <Picker.Item label="LD - 240p" value="LD" />
                  <Picker.Item label="SD - 480p" value="SD" />
                  {/* <Picker.Item label="HD - 720p" value="HD" /> */}
                </Picker>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textData: {
    marginTop: SCREEN_WIDTH * 0.04,
    color: 'black',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: 0,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalView: {
    height: 450,
    borderColor: 'white',
    backgroundColor: 'white',
    padding: 35,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 0,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#051540',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'justify',
    color: 'black',
    fontSize: 17,
    justifyContent: 'center',
  },
});

export default CustomHeader;
