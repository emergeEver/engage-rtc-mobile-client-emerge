/*
 * ****************************************************************
 * File: keypad.js
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

import {Button, Icon} from 'native-base';
import React from 'react';
import {View, Text, Modal, StyleSheet, TextInput} from 'react-native';

const Keypadscreen = ({
  setKeyboard,
  modalVisible,
  setModalVisible,
  number,
  setNumber,
  session,
}) => {
  const sendDTMF = value => {
    const {session: instance} = session;
    if (instance) {
      instance.sendDTMF(value);
    }
    setNumber(number + value);
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  marginBottom: 8,
                  marginLeft: 8,
                }}>
                Keypad
              </Text>
              <Icon
                testID="keypad"
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setKeyboard(false);
                  setNumber('');
                }}
                style={{
                  // float: 'right',
                  marginLeft: 190,
                  color: 'red',
                }}
                name="close"
                type="AntDesign"
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                showSoftInputOnFocus={false}
                name="username"
                placeholder="Enter Number"
                style={{flex: 1}}
                value={number}
                onChangeText={text => setNumber(text)}
                underlineColorAndroid="transparent"
              />
              {number !== '' ? (
                <Icon 
                  onPress={() => setNumber(number.slice(0, -1))}
                  style={{color: '#051540', marginRight: 3}}
                  name="backspace"
                  type="Ionicons"
                />
              ) : (
                <Icon
                  style={{display: 'none'}}
                  name="backspace"
                  type="Ionicons"
                />
              )}
            </View>
            <View style={{flexDirection: 'row', margin: 10}}>
              <Button
                testID="dtmf1"
                onPress={() => sendDTMF('1')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>1</Text>
              </Button>
              <Button
                testID="dtmf2"
                onPress={() => sendDTMF('2')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>2</Text>
              </Button>
              <Button
                testID="dtmf3"
                onPress={() => sendDTMF('3')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>3</Text>
              </Button>
              <Button
                testID="dtmfA"
                onPress={() => sendDTMF('A')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>A</Text>
              </Button>
            </View>
            <View style={{flexDirection: 'row', margin: 10}}>
              <Button
                testID="dtmf4"
                onPress={() => sendDTMF('4')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>4</Text>
              </Button>
              <Button
                testID="dtmf5"
                onPress={() => sendDTMF('5')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>5</Text>
              </Button>
              <Button
                testID="dtmf6"
                onPress={() => sendDTMF('6')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>6</Text>
              </Button>
              <Button
                testID="dtmfB"
                onPress={() => sendDTMF('B')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>B</Text>
              </Button>
            </View>
            <View style={{flexDirection: 'row', margin: 10}}>
              <Button
                testID="dtmf7"
                onPress={() => sendDTMF('7')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>7</Text>
              </Button>
              <Button
                testID="dtmf8"
                onPress={() => sendDTMF('8')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>8</Text>
              </Button>
              <Button
                testID="dtmf9"
                onPress={() => sendDTMF('9')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>9</Text>
              </Button>
              <Button
                testID="dtmfC"
                onPress={() => sendDTMF('C')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>C</Text>
              </Button>
            </View>
            <View style={{flexDirection: 'row', margin: 10}}>
              <Button
                testID="dtmf*"
                onPress={() => sendDTMF('*')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>*</Text>
              </Button>
              <Button
                testID="dtmf0"
                onPress={() => sendDTMF('0')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>0</Text>
              </Button>
              <Button
                testID="dtmf#"
                onPress={() => sendDTMF('#')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>#</Text>
              </Button>
              <Button
                testID="dtmfD"
                onPress={() => sendDTMF('D')}
                style={{width: 70, justifyContent: 'center'}}
                transparent>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>D</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    borderRadius: 5,
    margin: 10,
    width: 280,
  },

  modalView: {
    height: 405,
    width: 340,
    margin: 28,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  button: {
    padding: 10,
    elevation: 4,
  },
  buttonClose: {
    backgroundColor: '#051540',
    position: 'absolute',
    bottom: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 38,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 18,
    borderWidth: 1,
    width: 300,
  },
});
export default Keypadscreen;
