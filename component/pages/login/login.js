import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Linking,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withNavigation} from 'react-navigation';
import {Card, Text, Button, Icon} from 'native-base';
import Logo from '../../assets/radisys-logo.png';

var RNFS = require('react-native-fs');
// screen width and height based on dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Login = ({connect, isSupport, navigation: {navigate}}) => {
  const [dataDomain, setDataDomain] = useState(''); //rtc.engagedigital.ai

  useEffect(async () => {
    // Fetch from async storage then set the domain
    const value = await AsyncStorage.getItem('domainSettings');
    if (value === null) {
      setDomain('rtc.engagedigital.ai');
    } else {
      setDataDomain(JSON.parse(value));
      setDomain(JSON.parse(value));
    }
  }, []);

  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [domain, setDomain] = useState(dataDomain);
  const [isEnabled, setIsEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [domainSettings, setdomainSettings] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const submit = async () => {
    try {
      // Saving for local persistence
      const userData = JSON.stringify(userName);
      await AsyncStorage.setItem('username', userData);
      const userNumber = JSON.stringify(userId);
      await AsyncStorage.setItem('userId', userNumber);
    } catch (e) {
      console.log(e);
    }
    connect(userName, userId, isEnabled, domain.toString());
    navigate('Call');
  };

  const inputAccessoryViewID = 'uniqueID';

  // useEffect(() => {
  //   console.log('domain', typeof domain);
  //   console.log('dataDomain', typeof dataDomain);
  // }, [userName, userId, domain, dataDomain]);

  const inputUsername = input => {
    setUserName(input);
  };

  const inputUserid = input => {
    setUserId(input.trim());
  };

  const inputDomin = async input => {
    setDomain(input);
  };

  // storing DomainData in asyncstorage
  useEffect(async () => {
    try {
      const userDomain = JSON.stringify(domain);
      await AsyncStorage.setItem('domainSettings', userDomain);
    } catch (e) {
      console.log(e);
    }
  }, [domain]);

  // fetching DomainData in asyncstorage
  useEffect(async () => {
    try {
      const value = await AsyncStorage.getItem('domainSettings');
      if (JSON.parse(value)) {
        setDataDomain(JSON.parse(value));
      } else {
        setDataDomain('');
      }
    } catch (e) {
      console.log(e);
    }
  }, [AsyncStorage.getItem('domainSettings'), domain]);

  useEffect(() => {
    if (!isSupport) {
      setModalVisible(true);
    }
  }, [isSupport]);

  const closeApp = () => {
    BackHandler.exitApp();
  };

  const handleClose = () => {
    setdomainSettings(!domainSettings);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
      enabled
      style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          testID="image"
          onPress={() => Linking.openURL('https://www.radisys.com/')}>
          <Image style={styles.image} source={Logo}></Image>
        </TouchableOpacity>
        <Text style={styles.text}>programmable video</Text>
        <Card style={styles.cardViewStyle}>
          <Icon
            testID="open"
            onPress={() => setdomainSettings(true)}
            name="more-vert"
            type="MaterialIcons"
            style={{
              color: 'grey',
              // float: 'right',
              marginLeft: 'auto',
              padding: SCREEN_WIDTH * 0.02,
            }}
          />
          <Card
            style={{
              width: SCREEN_WIDTH * 0.19,
              height: SCREEN_WIDTH * 0.19,
              borderRadius: SCREEN_WIDTH * 0.1,
              margin: SCREEN_WIDTH * 0.01,
              marginTop: -5,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#BDC9E3',
            }}>
            <Image
              source={require('../../assets/User_Icon.png')}
              style={{
                width: SCREEN_WIDTH * 0.091,
                height: SCREEN_HEIGHT * 0.05,
              }}></Image>
          </Card>
          <Text
            style={{
              fontSize: SCREEN_WIDTH * 0.043,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginBottom: SCREEN_WIDTH * 0.03,
            }}>
            Register
          </Text>

          <Text
            style={{
              marginLeft: SCREEN_WIDTH * 0.048,
              fontSize: SCREEN_WIDTH * 0.039,
              fontWeight: 'bold',
              marginBottom: -5,
            }}>
            Username
          </Text>
          <TextInput
            name="username"
            placeholder="Username"
            style={styles.input}
            value={userName}
            // onChangeText={username => setUserName({username})}
            onChangeText={inputUsername}
            underlineColorAndroid="transparent"
            keyboardType="default"
            placeholderTextColor="grey"
            autoCapitalize="none"
            returnKeyLabel={'next'}
            inputAccessoryViewID={inputAccessoryViewID}
          />
          <Text
            style={{
              marginLeft: SCREEN_WIDTH * 0.048,
              fontSize: SCREEN_WIDTH * 0.039,
              fontWeight: 'bold',
              marginBottom: -5,
              marginTop: SCREEN_WIDTH * 0.02,
            }}>
            Identity
          </Text>
          <TextInput
            name="userId"
            placeholder="Identity"
            style={styles.input}
            value={userId}
            keyboardType="default"
            // onChangeText={identity => setUserId({identity})}
            onChangeText={inputUserid}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            placeholderTextColor="grey"
          />

          <Button
            // testID="submit"
            backgroundColor={
              userId === '' ||
              ((domain === '' || domain === null) &&
                (dataDomain === '' || dataDomain === null || dataDomain === {}))
                ? '#D3D3D3'
                : '#314B9F'
            }
            disabled={
              userId === '' ||
              ((domain === '' || domain === null) &&
                (dataDomain === '' || dataDomain === null || dataDomain === {}))
            }
            onPress={() => submit()}
            style={styles.next}>
            <Text style={{color: 'white'}}>Get Started</Text>
          </Button>
        </Card>
        {(domain === '' || domain === null) &&
        (dataDomain === '' || dataDomain === null || dataDomain === {}) ? (
          <Text
            style={{
              color: 'tomato',
              fontSize: SCREEN_WIDTH * 0.03,
              marginTop: 10,
              textAlign: 'center',
            }}>
            * Please enter domain name in settings
          </Text>
        ) : (
          <Text
            style={{
              color: 'grey',
              fontSize: SCREEN_WIDTH * 0.03,
              marginTop: 10,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Configured Domain :
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {' '}
              {dataDomain}
            </Text>
          </Text>
        )}
      </ScrollView>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={domainSettings}
          accessibilityRole={'modal'}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setdomainSettings(!domainSettings);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: SCREEN_WIDTH * 0.3,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                height: SCREEN_HEIGHT * 0.38,
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
                    fontSize: SCREEN_WIDTH * 0.053,
                    marginLeft: SCREEN_WIDTH * 0.07,
                  }}>
                  Domain Info
                </Text>
                <Icon
                  testID="Domain"
                  // onPress={() => setdomainSettings(!domainSettings)}
                  onPress={() => handleClose()}
                  name="close"
                  type="AntDesign"
                  style={{
                    color: 'red',
                    marginRight: SCREEN_WIDTH * 0.07,
                    marginTop: SCREEN_WIDTH * 0.03,
                  }}
                />
              </View>
              <TextInput
                testID="domainName"
                name="domain"
                placeholder="Domain Info"
                style={styles.input1}
                defaultValue={dataDomain === '' ? domain : dataDomain}
                keyboardType="default"
                // onChangeText={domain => setDomain({domain})}
                onChangeText={inputDomin}
                underlineColorAndroid="transparent"
                placeholderTextColor="grey"
              />

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: SCREEN_WIDTH * 1,
                  marginTop: SCREEN_WIDTH * 0.05,
                }}>
                <Text style={styles.textData}>{`Secure : ${
                  isEnabled ? 'On' : 'Off'
                }`}</Text>
                <Switch
                  testID="switch"
                  style={{
                    marginTop: SCREEN_WIDTH * 0.03,
                    marginRight: SCREEN_WIDTH * 0.095,
                  }}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>EngageDigital not supported</Text>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Icon
                  name="warning"
                  type="AntDesign"
                  style={{
                    color: '#E5C600',
                    fontSize: SCREEN_WIDTH * 0.16,
                    margin: SCREEN_WIDTH * 0.05,
                    marginTop: SCREEN_WIDTH * 0.01,
                  }}
                />
                <Text
                  style={{
                    overflow: 'hidden',
                    color: 'grey',
                    fontSize: SCREEN_WIDTH * 0.04,
                    marginTop: SCREEN_WIDTH * 0.01,
                    width: SCREEN_WIDTH * 0.53,
                  }}>
                  {/* EngageDigital is not supported to your current device version.  */}
                  EngageDigital supports Android version 10 and above, and IOS
                  version 12 onwards.
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: SCREEN_WIDTH * 0.01,
                }}>
                <Button
                  testID="closeApp"
                  onPress={() => closeApp()}
                  bordered
                  style={{
                    width: SCREEN_WIDTH * 0.28,
                    height: SCREEN_HEIGHT * 0.07,
                    justifyContent: 'center',
                    margin: SCREEN_WIDTH * 0.024,
                  }}>
                  <Text>Ok</Text>
                </Button>

                <Button
                  testID="exit"
                  onPress={() => setModalVisible(!modalVisible)}
                  style={{
                    width: SCREEN_WIDTH * 0.28,
                    height: SCREEN_HEIGHT * 0.07,
                    justifyContent: 'center',
                    margin: SCREEN_WIDTH * 0.024,
                  }}>
                  <Text>Exit</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F5F8',
    display: 'flex',
    flex: 1,
    alignContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.08,
  },
  cardViewStyle: {
    width: null,
    marginLeft: SCREEN_WIDTH * 0.05,
    marginRight: SCREEN_WIDTH * 0.05,
    borderRadius: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.04,
    borderColor: 'black',
    shadowColor: 'black',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'black',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: SCREEN_WIDTH * 0.05,
    textTransform: 'uppercase',
    color: '#314B9F',
  },
  input: {
    height: SCREEN_HEIGHT * 0.065,
    marginRight: SCREEN_WIDTH * 0.048,
    marginLeft: SCREEN_WIDTH * 0.048,
    marginTop: SCREEN_WIDTH * 0.02,
    borderColor: 'grey',
    borderWidth: SCREEN_WIDTH * 0.005,
    color: 'black',
  },
  input1: {
    height: SCREEN_HEIGHT * 0.065,
    marginRight: SCREEN_WIDTH * 0.048,
    marginLeft: SCREEN_WIDTH * 0.048,
    marginTop: SCREEN_WIDTH * 0.08,
    borderColor: 'grey',
    borderWidth: SCREEN_WIDTH * 0.005,
    color: 'black',
    padding: 10,
    width: SCREEN_WIDTH * 0.8,
  },
  next: {
    marginTop: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.04,
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_HEIGHT * 0.068,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SCREEN_WIDTH * 0.04,
    borderRadius: SCREEN_WIDTH * 0.01,
  },
  textData: {
    marginTop: SCREEN_WIDTH * 0.04,
    color: 'black',
    marginLeft: SCREEN_WIDTH * 0.11,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SCREEN_WIDTH * 0.05,
    backgroundColor: 'transparent',
    marginRight: SCREEN_WIDTH * 0.048,
    marginLeft: SCREEN_WIDTH * 0.048,
  },
  modalView: {
    width: SCREEN_WIDTH * 0.94,
    height: SCREEN_HEIGHT * 0.4,
    marginRight: SCREEN_WIDTH * 0.048,
    marginLeft: SCREEN_WIDTH * 0.048,
    margin: SCREEN_WIDTH * 0.2,
    backgroundColor: '#F1F5F8',
    borderRadius: SCREEN_WIDTH * 0.002,
    padding: SCREEN_WIDTH * 0.1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: SCREEN_WIDTH * 0.03,
    textTransform: 'capitalize',
    color: '#314B9F',
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
  },
});

export default withNavigation(Login);
