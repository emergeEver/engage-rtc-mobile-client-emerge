/*
 * ****************************************************************
 * File: App.js
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
import React, {useState, useRef, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Snackbar from 'react-native-snackbar';
import Login from './component/pages/login/login';
import Home from './component/pages/call/localStreamer';
import Call from './component/pages/call/makeCall';
import HeaderTitle from './component/pages/CustomHeader/CustomHeader';
import GetCall from './component/pages/call/getCall';
import ConnectedVideoCall from './component/pages/call/connectedVideoCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EngageDigital from './component/assets/engageDigital.min';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc-rad';
import RecentCalls from './component/pages/call/recentCalls';
import moment from 'moment';
//import KeepAwake from 'react-native-keep-awake';
import InCallManager from 'react-native-incall-manager';
import {Platform} from 'react-native';
import APPversion from './package.json';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {
  getHeadset,
  addListener,
  removeListener,
} from 'react-native-bluetooth-headset-detect';
import {Text, View} from 'react-native';

var Sound = require('react-native-sound');


const apiKey = '#apiKey';


/*******TO BE REMOVED. MUST BE HANDLED IN SDK*******/
window.RTCPeerConnection = window.RTCPeerConnection || RTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || RTCIceCandidate;
window.RTCSessionDescription =
  window.RTCSessionDescription || RTCSessionDescription;
window.MediaStream = window.MediaStream || MediaStream;
window.MediaStreamTrack = window.MediaStreamTrack || MediaStreamTrack;
window.navigator.mediaDevices = window.navigator.mediaDevices || mediaDevices;
window.navigator.getUserMedia =
  window.navigator.getUserMedia || mediaDevices.getUserMedia;
/*******TO BE REMOVED. MUST BE HANDLED IN SDK*******/

// Enable playback in silence mode
Sound.setCategory('Playback');

const Stack = createStackNavigator();





const whoosh = new Sound('ring.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    // console.log('failed to load the sound', error);
    return;
  }
  whoosh.setVolume(1);
});
const eventEmitter = new NativeEventEmitter(NativeModules.InCallManager);

const App = () => {
  const debugLogs = useRef([]);
  const engageClient = useRef(null);
  const music = useRef(null);
  const engageRTCUtil = useRef(null);
  const [ring, setRing] = useState(false);
  const [connection, setConnection] = useState({
    connection: null,
    status: 'Disconnected',
    identity: '',
    username: '',
  });
  const [userSip, setUserSip] = useState('');
  const [deviceMode, setDeviceMode] = useState();
  const [audioDevices, setAudioDevices] = useState([
    {
      text: 'EARPIECE',
      icon: 'ios-ear-outline',
      iconColor: '#2c8ef4',
    },
    {
      text: 'SPEAKER_PHONE',
      icon: 'ios-volume-medium-outline',
      iconColor: '#2c8ef4',
    },
  ]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState({
    text: 'EARPIECE',
    icon: 'ios-ear-outline',
    iconColor: '#2c8ef4',
  });
  // const [mediaState, setMediaState] = useState({
  //   text: 'Phone',
  //   icon: 'call',
  //   iconColor: '#f42ced',
  // });
  const [callTransfer, setCallTransfer] = useState({
    status: false,
    to: '',
    message: '',
  });
  const [joinWithVideoMuted, setJoinWithVideoMuted] = useState(false);
  const [session, setSession] = useState({
    session: null,
    remoteUser: 'XYZ',
    remoteUserName: 'ABC',
    incoming: false,
    ringing: false,
    constraints: {audio: true, video: true},
  });
  const [isSupport, setIsSupport] = useState(
    EngageDigital.isEngageDigitalWebrtcSupported(),
  );
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [readyEvent, setReadyEvent] = useState(false);

  const getRoomID = async () => {

    debugLogs.current.push(`getRoomID entered`);
    //try {
      const response = await fetch('https://apigateway.engagedigital.ai/api/v1/accounts/#AccountID/room?Status=CREATED,RESERVED&Limit=10', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'apikey': `${apiKey}`,
        }
      });
      debugLogs.current.push(`rdrDtoList above debug ${response.status}`);
      const json = await response.json();
      debugLogs.current.push(`rdrDtoList  '${json.rdrDtoList[0].id}`);
      
      return json.rdrDtoList[0].id;
    //} catch (error) {
      //console.error(error);
    //}
  };

const makeCallAndJoin = async () => {
  
      debugLogs.current.push(`makeCallAndJoin entered`);

      let roomId = await getRoomID();


      debugLogs.current.push(`room Id from SOS ${roomId} `);


      fetch(`https://apigateway.engagedigital.ai/api/v1/accounts/#AccountID/room/${roomId}/join`, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'apikey' : `${apiKey}`,
                  },
                  body: JSON.stringify({
                    "Participant":"sip:1234567@sipaz1.engageio.com"
                    })
                }).then(response => {
                  debugLogs.current.push(`makeCallAndJoin resp ${response.status}`);
                  
                }).catch((error) => {
                  debugLogs.current.push(`makeCallAndJoin errror ${error} `);
                });

                
                
                /*.then((response) => response.json())
                .then((json) => {
                  return json;
                })*/
                
                
        debugLogs.current.push(`joing agent end`);

};

  const onAudioSelection = mode => {
    setDeviceMode(mode);
    if (Platform.OS !== 'ios') {
      InCallManager.chooseAudioRoute(mode).then(newAudioDeviceList => {});
    } else {
      if (mode === 'SPEAKER_PHONE') {
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.chooseAudioRoute('SPEAKER_PHONE');
      } else if (mode == 'BLUETOOTH') {
        InCallManager.setForceSpeakerphoneOn(false);
        InCallManager.chooseAudioRoute('BLUETOOTH');
      } else {
        InCallManager.setForceSpeakerphoneOn(false);
        InCallManager.chooseAudioRoute('EARPIECE');
      }
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      eventEmitter.addListener('onAudioDeviceChanged', e => {
        const devices = JSON.parse(e.availableAudioDeviceList);
        const selected = e.selectedAudioDevice;
        setAudioDevices(
          devices.map(d => {
            return {
              text: d,
              icon:
                d === 'SPEAKER_PHONE'
                  ? 'ios-volume-medium-outline'
                  : d === 'EARPIECE'
                  ? 'ios-ear-outline'
                  : d === 'BLUETOOTH'
                  ? 'bluetooth'
                  : 'headset',
              iconColor: '#2c8ef4',
            };
          }),
        );
        setSelectedAudioDevice({
          text: selected,
          icon:
            selected === 'SPEAKER_PHONE'
              ? 'ios-volume-medium-outline'
              : selected === 'EARPIECE'
              ? 'ios-ear-outline'
              : selected === 'BLUETOOTH'
              ? 'bluetooth'
              : 'headset',
          iconColor: '#2c8ef4',
        });
      });
    } else {
      addListener(device => {
        if (device) {
          Snackbar.show({
            text: `Connect with ${device}`,
            duration: Snackbar.LENGTH_LONG,
          });
          setAudioDevices([
            {
              text: 'BLUETOOTH',
              icon: 'ios-volume-medium-outline',
              iconColor: '#ffffff',
            },
            {
              text: 'SPEAKER_PHONE',
              icon: 'ios-volume-medium-outline',
              iconColor: '#ffffff',
            },
          ]);
        } else {
          setAudioDevices([
            {
              text: 'EARPIECE',
              icon: 'ios-ear-outline',
              iconColor: '#ffffff',
            },
            {
              text: 'SPEAKER_PHONE',
              icon: 'ios-volume-medium-outline',
              iconColor: '#ffffff',
            },
          ]);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (engageClient !== null) {
      setUserSip(engageClient.current?.getUri()?.toString());
    }
  }, [engageClient.current?.getUri()]);

  useEffect(() => {
    if (session.ringing) {
      if (ring) {
        music.current = new Sound('ring.mp3', Sound.MAIN_BUNDLE, error => {
          if (error) {
            // console.log('failed to load the sound', error);
            return;
          }
          //InCallManager.setForceSpeakerphoneOn(true)
          onAudioSelection('SPEAKER_PHONE');
          music.current?.setVolume(1);
          music.current?.play(success => {
            if (success) {
              // console.log('successfully finished playing');
            } else {
              // console.log('playback failed due to audio decoding errors');
            }
            music.current.stop();
            //InCallManager.setForceSpeakerphoneOn(false)
            onAudioSelection('EARPIECE');
          });
        });
      }
    }
    return () => {
      if (music.current) {
        music.current.release();
        music.current = null;
      }
    };
  }, [session.ringing, ring]);

  // useEffect(() => {
  //   console.log('incoming call', session.ringing === true);
  //   console.log('ring', ring === true);
  //   if (ring === true ) {
  //     InCallManager.setForceSpeakerphoneOn(true);
  //   } else if(session.ringing === true) {
  //     InCallManager.setForceSpeakerphoneOn(true);
  //   }else{
  //     InCallManager.setForceSpeakerphoneOn(false);
  //   }
  // }, [ring, session.ringing]);

  const stopMusic = () => {
    if (music.current) {
      music.current.stop();
      //InCallManager.setForceSpeakerphoneOn(false)
      onAudioSelection('EARPIECE');
    }
  };

  useEffect(() => {
    if (session.session !== null) {
      InCallManager.start();

      const ongoingSession = session.session;
      ongoingSession.addEventHandler('errorinfo', error => {
        // console.log('Session-errorInfo:', error);
        Snackbar.show({
          text: error.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
      });
      ongoingSession.addEventHandler('connecting', () => {
        // whoosh.play((success) => {
        //   if (success) {
        //     console.log('successfully finished playing');
        //   } else {
        //     console.log('playback failed due to audio decoding errors');
        //   }
        // });
        debugLogs.current.push('Call: Connecting');
        setRing(false);
        stopMusic();
        // console.log('Call: Connecting');
      });
      ongoingSession.addEventHandler('failed', e => {
        //  KeepAwake.deactivate();
        debugLogs.current.push(`Call: Failed, ${e.errorMessage}`);
        // console.log('Call: Failed', e['cause']);
        Snackbar.show({
          text: e.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
        setRing(false);

        stopMusic();
        setSession({
          ...session,
          session: null,
          incoming: false,
          ringing: false,
        });
        setCallTransfer({
          status: false,
          to: '',
          message: '',
        });
        setRemoteStream(null);
        setLocalStream(null);
      });
      ongoingSession.addEventHandler('disconnected', () => {
        InCallManager.setKeepScreenOn(false);
        // KeepAwake.deactivate();
        debugLogs.current.push('Call: Disconnected');
        // console.log('Call: Failed');
        setRing(false);
        stopMusic();
        setSession({
          ...session,
          session: null,
          incoming: false,
          ringing: false,
        });
        setCallTransfer({
          status: false,
          to: '',
          message: '',
        });
        setRemoteStream(null);
        setLocalStream(null);
      });
      ongoingSession.addEventHandler('peerdisconnected', () => {
        InCallManager.setKeepScreenOn(false);
        // KeepAwake.deactivate();
        debugLogs.current.push('Call: Peer Disconnected');
        // console.log('Call: Peer Disconnected');
        setRing(false);
        stopMusic();
        setSession({
          ...session,
          session: null,
          incoming: false,
          ringing: false,
        });
        setCallTransfer({
          status: false,
          to: '',
          message: '',
        });
        setRemoteStream(null);
        setLocalStream(null);
      });
      ongoingSession.addEventHandler('connected', () => {
        InCallManager.setKeepScreenOn(true);
        // KeepAwake.activate();
        onAudioSelection('SPEAKER_PHONE');
        debugLogs.current.push('Call: Connected');
        setRing(false);
        stopMusic();
        // console.log('Call: Connected');        
        setSession({...session, ringing: false});
        debugLogs.current.push('Call: Connected after call Connected');
        debugLogs.current.push('Call: calling make call after call Connected');

        setTimeout ( () =>   {
          makeCallAndJoin();
        }, 10000);
        

        debugLogs.current.push('Call: afet make call');

        
      });

      ongoingSession.addEventHandler('calltransferinitiated', ({to}) => {
        setCallTransfer({
          status: true,
          to: to,
          message: `Call Transferring to ${to}`,
        });
        // Snackbar.show({
        //   text: 'calltransferinitiated',
        //   duration: Snackbar.LENGTH_LONG,
        // });
      });

      ongoingSession.addEventHandler('calltransfersucceeded', () => {
        setCallTransfer({
          ...callTransfer,
          message: `${callTransfer.to} is connected`,
        });
        // Snackbar.show({
        //   text: 'calltransfersucceeded',
        //   duration: Snackbar.LENGTH_LONG,
        // });
      });

      ongoingSession.addEventHandler('remotestream', ({stream}) => {
        //  KeepAwake.activate();
        /*
         *  The Method is called only once at the beginning of the session, providing
         *  the remote stream. Irrespective of Audio/Video Calls
         *  Event Name: localstream
         */
        setRemoteStream(stream);
        // console.log('Call: Attached Remote Stream', stream);
        debugLogs.current.push('Call: Attached Remote Stream');
        

        Snackbar.show({
          text: 'remoteStream',
          duration: Snackbar.LENGTH_LONG,
        });
      });

      ongoingSession.addEventHandler('localstream', ({stream}) => {
        //  KeepAwake.activate();
        /*
         *  The Method is called only once at the beginning of the session, providing
         *  the local stream. Irrespective of Audio/Video Calls
         *  Event Name: localstream
         */
        setLocalStream(stream);
        // console.log('Call: Attached Local Stream', stream);
        debugLogs.current.push('Call: Attached Local Stream');
        Snackbar.show({
          text: 'localstream',
          duration: Snackbar.LENGTH_LONG,
        });
      });

      /*****
       *
       *  TO BE UTILIZED FOR UPGRADE/DOWNGRADE USECASE 
       * 
      ongoingSession.addEventHandler('localvideoadded', ({stream}) => {
        setLocalStream(stream)
        Snackbar.show({
          text: 'localvideoadded',
          duration: Snackbar.LENGTH_LONG,
        });
      });

      ongoingSession.addEventHandler('localvideoremoved', ({stream}) => {
        setLocalStream(stream)
        Snackbar.show({
          text: 'localvideoremoved',
          duration: Snackbar.LENGTH_LONG,
        });
      });
      ongoingSession.addEventHandler('remotevideoadded', ({stream}) => {
        setRemoteStream(stream)
        Snackbar.show({
          text: 'remotevideoadded',
          duration: Snackbar.LENGTH_LONG,
        });
      });
      ongoingSession.addEventHandler('remotevideoremoved', ({stream}) => {
        setRemoteStream(stream)
        Snackbar.show({
          text: 'remotevideoremoved',
          duration: Snackbar.LENGTH_LONG,
        });
      });
      
      ***/
      ongoingSession.addEventHandler('upgradevideoaccessdenied', () => {
        Snackbar.show({
          text: 'upgradevideoaccessdenied',
          duration: Snackbar.LENGTH_LONG,
        });
      });

      // ongoingSession.addEventHandler('ringing', () => {
      //   // KeepAwake.activate();
      //   whoosh.play(success => {
      //     if (success) {
      //       // console.log('successfully finished playing');
      //     } else {
      //       console.log('playback failed due to audio decoding errors');
      //     }
      //   });
      //   debugLogs.current.push('Call: Ringing');
      //   // console.log('Call: Ringing');
      // });
    } else {
      try {
        InCallManager.stop();
      } catch (e) {}
    }
  }, [session.session]);

  // Device Settings
  const [devices, setDevices] = useState({
    camera: [],
    speaker: [],
    input: [],
    selected: {
      camera: null,
      speaker: null,
      input: null,
    },
  });

  const onDeviceMediaSelected = data => {
    if (data === 'speaker') {
      //InCallManager.setSpeakerphoneOn(true);
      InCallManager.setForceSpeakerphoneOn(true);
      //InCallManager.chooseAudioRoute(nextAudioDevice) ( ['EARPIECE', 'SPEAKER_PHONE', 'BLUETOOTH', 'WIRED_HEADSET'] )
    } else {
      InCallManager.setSpeakerphoneOn(false);
    }
  };

  //  setting date and time for callLogs
  let newDate = moment().format('DD/MM/YYYY');

  let callTime = moment().format('h:mm a');

  const onDeviceSelected = deviceType => {
    // const device = devices[deviceType];
    // const selectedDevice = device.filter(e => e.label === deviceLabel)[0];
    const RTCUtils = engageRTCUtil.current;
    switch (deviceType) {
      case 'speaker': {
        const remoteStreamReference =
          document.getElementById('remoteMediaElement');
        if (remoteStreamReference) {
          remoteStreamReference
            .setSinkId(selectedDevice.deviceId)
            .then(() => {});
        }
        break;
      }
      case 'input':
        RTCUtils.setAudioInputDevice(selectedDevice.deviceId);
        break;
      case 'camera':
        RTCUtils.setVideoInputDevice(selectedDevice.deviceId);
        break;
    }
    setDevices({
      ...devices,
      selected: {
        // ...devices.selected,
        [deviceType]: selectedDevice.label,
      },
    });
  };

  const onSession = async engageSession => {
    const constraints = engageSession._defaultCallParams.mediaConstraints;
    // console.log('SDP',engageSession.getPeerConnection())

    engageSession.addEventHandler('ringing', () => {
      setRing(true);
      debugLogs.current.push('Call: Ringing');
      // console.log('Call: Ringing');
    });

    if (engageSession.getOriginator() === 'local') {
      debugLogs.current.push('Session: Outgoing Call in Progress');
      // console.log('Session: Outgoing Call in Progress');
      const constraints = engageSession.getCallParams()['mediaConstraints'];

      // Incoming Call
      const calls = await AsyncStorage.getItem('history');
      // if (calls) {
      //   const items = JSON.parse(calls);
      //   items.push({
      //     name: engageSession.getRemoteId()._display_name,
      //     uri: engageSession.getRemoteId()._uri._user,
      //     type: 'outgoing',
      //   });
      //   AsyncStorage.setItem('history', JSON.stringify(items));
      if (calls) {
        let itemData = {};
        const items = JSON.parse(calls);
        itemData = {
          uri: engageSession.getRemoteId()._uri._user,
          duration: callTime,
          type: 'outgoing',
          name: engageSession.getRemoteId()._display_name,
          call: engageSession._callParams.mediaConstraints,
        };
        if (!items['Calllogs'][newDate]) {
          items['Calllogs'][newDate] = [];
        }
        items['Calllogs'][newDate].push(itemData);
        AsyncStorage.setItem('history', JSON.stringify(items));
      } else {
        // AsyncStorage.setItem(
        //   'history',
        //   JSON.stringify([
        //     {
        //       name: engageSession.getRemoteId()._display_name,
        //       uri: engageSession.getRemoteId()._uri._user,
        //       type: 'outgoing',
        //     },
        //   ]),
        // );
        AsyncStorage.setItem(
          'history',
          JSON.stringify({
            Calllogs: {
              [newDate]: [
                {
                  uri: engageSession.getRemoteId()._uri._user,
                  duration: callTime,
                  type: 'outgoing',
                  name: engageSession.getRemoteId()._display_name,
                  call: engageSession._callParams.mediaConstraints,
                },
              ],
            },
          }),
        );
      }

      setSession({
        ...session,
        session: engageSession,
        ringing: true,
        remoteUser: engageSession.getRemoteId()._uri._user,
        remoteUserName: engageSession.getRemoteId()._display_name,
        constraints: constraints,
      });
      return;
    }

    /*
     *  If an incoming sesson is already active, then if another use is trying the same
     *  user, then that user would be returned with a response as 486
     */

    const calls = await AsyncStorage.getItem('history');
    // if (calls) {
    //   const items = JSON.parse(calls);
    //   items.push({
    //     name: engageSession.getRemoteId()._display_name,
    //     uri: engageSession.getRemoteId()._uri._user,
    //     type: 'incoming',
    //   });
    //   AsyncStorage.setItem('history', JSON.stringify(items));
    if (calls) {
      let itemData = {};
      const items = JSON.parse(calls);
      itemData = {
        uri: engageSession.getRemoteId()._uri._user,
        duration: callTime,
        type: 'incoming',
        name: engageSession.getRemoteId()._display_name,
        call: engageSession._callParams.mediaConstraints,
      };
      if (!items['Calllogs'][newDate]) {
        items['Calllogs'][newDate] = [];
      }

      items['Calllogs'][newDate].push(itemData);
      AsyncStorage.setItem('history', JSON.stringify(items));
    } else {
      // AsyncStorage.setItem(
      //   'history',
      //   JSON.stringify([
      //     {
      //       name: engageSession.getRemoteId()._display_name,
      //       uri: engageSession.getRemoteId()._uri._user,
      //       type: 'outgoing',
      //     },
      //   ]),
      // );
      AsyncStorage.setItem(
        'history',
        JSON.stringify({
          Calllogs: {
            [newDate]: [
              {
                uri: engageSession.getRemoteId()._uri._user,
                duration: callTime,
                type: 'incoming',
                name: engageSession.getRemoteId()._display_name,
                call: engageSession._callParams.mediaConstraints,
              },
            ],
          },
        }),
      );
    }

    if (session.session !== null) {
      engageSession.rejectCall({
        status_code: 486,
        reason_phrase: 'Busy Here',
      });
      return;
    }
    debugLogs.current.push('Session: Incoming Call Detected');
    // console.log('Session: Incoming Call Detected');
    // This is an incoming call and we require to listen to the various events
    setSession({
      ...session,
      session: engageSession,
      incoming: true,
      ringing: true,
      remoteUser: engageSession.getRemoteId()._uri._user,
      remoteUserName: engageSession.getRemoteId()._display_name,
      constraints: constraints,
    });
  };

  const makeCall = async ({audio, video, remoteNumber, setUsername}) => {
    debugLogs.current.push('Call: Call Action Triggered');

    if (remoteNumber === '') {
      // const calls = await AsyncStorage.getItem('history');
      // if (calls) {
      //   const items = JSON.parse(calls);
      //   remoteNumber = items[0].uri;
      //   setUsername(remoteNumber);
      // }
      const calls = await AsyncStorage.getItem('history');
      if (calls) {
        const items = JSON.parse(calls);
        const reDialData = Object.values(items.Calllogs)[
          Object.keys(items.Calllogs).length - 1
        ];
        remoteNumber = reDialData[reDialData.length - 1]['uri'];
        setUsername(remoteNumber);
      }
    }

    // This is an incoming call and we require to list
    if (engageClient.current !== null) {
      try {
        // console.log(`Call: Making a Call'${remoteNumber}`);
        debugLogs.current.push(`Call: Making a Call'${remoteNumber}`);

      // https://apigateway.engagedigital.ai/api/v1/accounts/AC-5647e4c5-6bf6-4a26-9675-4a21914d6dd2/call

      

        
        engageClient.current.makeCall(remoteNumber, {
          mediaConstraints: {
            audio,
            video,
          },
          rtcOfferConstraints: {
            offerToReceiveAudio: audio ? 1 : 0,
            offerToReceiveVideo: video ? 1 : 0,
          },
          joinWithVideoMuted: false,
        });


        
       // }


      } catch (e) {
        Snackbar.show({
          text: e.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
        debugLogs.current.push(
          `Call: Making call went into Exception, ${e.errorMessage}`,
        );
      }
    }
  };

  const acceptCall = ({audio, video}) => {
    /*
     * Accept a call when session is active and state is ringing
     */
    if (session.session && session.incoming && session.ringing) {
      debugLogs.current.push('Call: Accept Action Triggered');
      setRing(false);
      // console.log('Call: Action Action Triggered');
      const incomingSession = session.session;
      try {
        incomingSession.acceptCall({
          mediaConstraints: {
            audio,
            video,
          },
          rtcOfferConstraints: {
            offerToReceiveAudio: audio ? 1 : 0,
            offerToReceiveVideo: video ? 1 : 0,
          },
          joinWithVideoMuted: true,
        });
      } catch (e) {
        Snackbar.show({
          text: e.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
        debugLogs.current.push(
          `Call: Accept call went into Exception, ${e.errorMessage}`,
        );
      }
    }
  };

  const endCall = () => {
    /*
     * Disconnect an ongoing or initiated call
     */
    // console.log('Call: End Action Triggered');
    debugLogs.current.push('Call: End Action Triggered');
    if (session.session) {
      try {
        if (session.incoming & session.ringing) {
          // When an incoming call is observed and the user wants to terminate
          // console.log('Call: Rejected');
          debugLogs.current.push('Call: Rejectedd');
          session.session.rejectCall();
        } else {
          // When an call is ongoing either incoming or outgoing or outgoing call being made
          // console.log('Call: Disconnected');
          debugLogs.current.push('Call: Disconnected');
          session.session.disconnectCall();
        }
      } catch (e) {
        Snackbar.show({
          text: e.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
        debugLogs.current.push(
          `Call: End call went into Exception, ${e.errorMessage}`,
        );
      }
    }
  };

  const connect = async (userName, userId, isEnabled, domain) => {
    debugLogs.current.push(`Mobile Client version : ${APPversion?.version}`);
    debugLogs.current.push(
      `SDK version : ${EngageDigital?.getEngageDigitalVersion()}`,
    );
    debugLogs.current.push('Triggered Connection');
    let engageDigital;
    try {
      engageDigital = new EngageDigital.EngageDigitalClient(
        userId,
        [domain], // AWS Setup Required
        {
          log: {
            blob: {enable: false, emptyAfterRetrieval: true},
            console: {enable: false},
          },
          needRegistration: true,
          isSecureWeb: isEnabled,
          userName: userName,
          enableLog: false,
        },
      );
      setConnection({
        ...connection,
        identity: userId,
        username: userName,
      });
    } catch (error) {
      // console.log('Error:', error);
      Snackbar.show({
        text: error.errorMessage,
        duration: Snackbar.LENGTH_LONG,
      });
    }
    // console.log('Digital...', engageDigital);
    engageClient.current = engageDigital;
    engageRTCUtil.current = engageDigital.getEngageDigitalRTCUtils();

    engageRTCUtil.current.getAVPermission();
    engageRTCUtil.current.setCameraResolution('SD');

    engageDigital.addEventHandler('failed', error => {
      // console.log('Failed Event Called');
      debugLogs.current.push(`Failed_event, ${error.errorMessage}`);
      Snackbar.show({
        text: error.errorMessage,
        duration: Snackbar.LENGTH_LONG,
      });
    });
    engageDigital.addEventHandler('ready', () => {
      setReadyEvent(true);
      engageDigital.addEventHandler('errorinfo', error => {
        // console.log('engageDegital - errorInfo:', error);
        Snackbar.show({
          text: error.errorMessage,
          duration: Snackbar.LENGTH_LONG,
        });
      });
      debugLogs.current.push('Initialize Success');
      engageDigital.addEventHandler('connecting', () => {
        setConnection({...connection, status: 'Connecting'});
        debugLogs.current.push('Connecting');
        // console.log('Connecting');
      });
      engageDigital.addEventHandler('connected', e => {
        setConnection({...connection, status: 'Connected'});
        debugLogs.current.push('Connected');
        // console.log('Connected');
      });
      engageDigital.addEventHandler('disconnected', e => {
        setConnection({...connection, status: 'Disconnected'});
        debugLogs.current.push('Disconnect');
        // console.log('Disconnected');
      });

      engageDigital.addEventHandler('reconnecting', () => {
        setConnection({...connection, status: 'Connecting'});
        debugLogs.current.push('Connection: Re-connecting');
        //console.log("Connection: Re-connecting");
      });

      engageDigital.addEventHandler('reconnected', () => {
        setConnection({...connection, status: 'Connected'});
        debugLogs.current.push('Connection: Re-connected');
        //console.log("Connection: Re-connected");
      });

      engageDigital.addEventHandler('newRTCSession', onSession);
      engageDigital.connect();
    });
  };

  const logoutClient = () => {
    /*
     *  Clean up the connection on disconnect.
     */
    if (engageClient.current !== null) {
      if (engageClient.current.isConnected()) {
        engageClient.current.disconnect();
        engageClient.current = null;
        setConnection({...connection, status: 'Disconnected'});
      }
    }
  };

  return (
    <>
      <View testID="logout_for_ut" onPress={() => logoutClient()}>
        <Text testID="edrna" style={{display: 'none'}}>
          EngageDigital
        </Text>
      </View>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{headerShown: false}}>
            {props => (
              <Login
                {...props}
                connect={connect}
                isSupport={isSupport}
                engageClient={engageClient.current}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Home"
            options={{headerShown: false}}
            component={Home}
            options={({navigation}) => ({
              headerTitle: props => (
                <HeaderTitle
                userSip={userSip}
                  deviceMode={deviceMode}
                  readyEvent={readyEvent}
                  hideDeviceSelection={true}
                  hideResolutionSelection={false}
                  whoosh={whoosh}
                  joinWithVideoMuted={joinWithVideoMuted}
                  setJoinWithVideoMuted={setJoinWithVideoMuted}
                  devices={devices}
                  onAudioSelection={onAudioSelection}
                  onDeviceSelected={onDeviceSelected}
                  RTCUtils={engageRTCUtil.current}
                  logoutClient={logoutClient}
                  navigation={navigation}
                  audioDevices={audioDevices}
                  setAudioDevices={setAudioDevices}
                  selectedAudioDevice={selectedAudioDevice}
                  //mediaState={mediaState}
                  //setMediaState={setMediaState}
                  onDeviceMediaSelected={onDeviceMediaSelected}
                  engageClient={engageClient.current}
                  {...props}
                />
              ),
              headerStyle: {
                backgroundColor: '#314B9F',
              },
              headerTintColor: '#314B9F',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => null,
            })}
          />
          <Stack.Screen
            name="Call"
            options={{headerShown: false}}
            options={({navigation}) => ({
              headerTitle: props => (
                <HeaderTitle
                  {...props}
                  userSip={userSip}
                  deviceMode={deviceMode}
                  readyEvent={readyEvent}
                  whoosh={whoosh}
                  hideDeviceSelection={true}
                  hideResolutionSelection={false}
                  onAudioSelection={onAudioSelection}
                  joinWithVideoMuted={joinWithVideoMuted}
                  setJoinWithVideoMuted={setJoinWithVideoMuted}
                  navigation={navigation}
                  connection={connection}
                  session={session}
                  makeCall={acceptCall}
                  acceptCall={acceptCall}
                  endCall={endCall}
                  debugLogs={debugLogs}
                  devices={devices}
                  onDeviceSelected={onDeviceSelected}
                  RTCUtils={engageRTCUtil.current}
                  logoutClient={logoutClient}
                  audioDevices={audioDevices}
                  setAudioDevices={setAudioDevices}
                  selectedAudioDevice={selectedAudioDevice}
                  // mediaState={mediaState}
                  // setMediaState={setMediaState}
                  onDeviceMediaSelected={onDeviceMediaSelected}
                  engageClient={engageClient.current}
                />
              ),
              headerStyle: {
                backgroundColor: '#314B9F',
              },
              headerTintColor: '#314B9F',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => null,
            })}>
            {props => (
              <Call
                {...props}
                makeCall={makeCall}
                endCall={endCall}
                session={session}
                whoosh={whoosh}
                logoutClient={logoutClient}
                RTCUtils={engageRTCUtil.current}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Getcall"
            options={{headerShown: false}}
            options={({navigation}) => ({
              headerTitle: props => (
                <HeaderTitle
                  {...props}
                  userSip={userSip}
                  deviceMode={deviceMode}
                  readyEvent={readyEvent}
                  whoosh={whoosh}
                  hideDeviceSelection={false}
                  hideResolutionSelection={true}
                  onAudioSelection={onAudioSelection}
                  joinWithVideoMuted={joinWithVideoMuted}
                  setJoinWithVideoMuted={setJoinWithVideoMuted}
                  connection={connection}
                  session={session}
                  navigation={navigation}
                  makeCall={acceptCall}
                  acceptCall={acceptCall}
                  endCall={endCall}
                  debugLogs={debugLogs}
                  devices={devices}
                  onDeviceSelected={onDeviceSelected}
                  RTCUtils={engageRTCUtil.current}
                  logoutClient={logoutClient}
                  audioDevices={audioDevices}
                  setAudioDevices={setAudioDevices}
                  selectedAudioDevice={selectedAudioDevice}
                  //mediaState={mediaState}
                  //setMediaState={setMediaState}
                  onDeviceMediaSelected={onDeviceMediaSelected}
                  engageClient={engageClient.current}
                />
              ),
              headerStyle: {
                backgroundColor: '#314B9F',
              },
              headerTintColor: '#314B9F',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => null,
            })}>
            {props => (
              <GetCall
                {...props}
                joinWithVideoMuted={joinWithVideoMuted}
                session={session}
                endCall={endCall}
                acceptCall={acceptCall}
                logoutClient={logoutClient}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="ConnectedVideoCall"
            options={{headerShown: false}}
            options={({navigation}) => ({
              headerTitle: props => (
                <HeaderTitle
                  {...props}
                  userSip={userSip}
                  deviceMode={deviceMode}
                  readyEvent={readyEvent}
                  whoosh={whoosh}
                  hideDeviceSelection={false}
                  onAudioSelection={onAudioSelection}
                  hideResolutionSelection={true}
                  joinWithVideoMuted={joinWithVideoMuted}
                  setJoinWithVideoMuted={setJoinWithVideoMuted}
                  connection={connection}
                  session={session}
                  makeCall={acceptCall}
                  acceptCall={acceptCall}
                  endCall={endCall}
                  debugLogs={debugLogs}
                  devices={devices}
                  onDeviceSelected={onDeviceSelected}
                  RTCUtils={engageRTCUtil.current}
                  logoutClient={logoutClient}
                  navigation={navigation}
                  audioDevices={audioDevices}
                  setAudioDevices={setAudioDevices}
                  selectedAudioDevice={selectedAudioDevice}
                  //mediaState={mediaState}
                  //setMediaState={setMediaState}
                  onDeviceMediaSelected={onDeviceMediaSelected}
                  engageClient={engageClient.current}
                />
              ),
              headerStyle: {
                backgroundColor: '#314B9F',
              },
              headerTintColor: '#314B9F',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => null,
            })}>
            {props => (
              <ConnectedVideoCall
                {...props}
                callTransfer={callTransfer}
                joinWithVideoMuted={joinWithVideoMuted}
                session={session}
                endCall={endCall}
                remoteStream={remoteStream}
                localStream={localStream}
                logoutClient={logoutClient}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Recent"
            options={{headerShown: false}}
            options={({navigation}) => ({
              headerTitle: props => (
                <HeaderTitle
                  {...props}
                  userSip={userSip}
                  deviceMode={deviceMode}
                  readyEvent={readyEvent}
                  whoosh={whoosh}
                  hideResolutionSelection={false}
                  joinWithVideoMuted={joinWithVideoMuted}
                  onAudioSelection={onAudioSelection}
                  setJoinWithVideoMuted={setJoinWithVideoMuted}
                  connection={connection}
                  setConnection={setConnection}
                  session={session}
                  hideDeviceSelection={true}
                  navigation={navigation}
                  makeCall={acceptCall}
                  acceptCall={acceptCall}
                  endCall={endCall}
                  debugLogs={debugLogs}
                  devices={devices}
                  onDeviceSelected={onDeviceSelected}
                  RTCUtils={engageRTCUtil.current}
                  logoutClient={logoutClient}
                  audioDevices={audioDevices}
                  setAudioDevices={setAudioDevices}
                  selectedAudioDevice={selectedAudioDevice}
                  //mediaState={mediaState}
                  //setMediaState={setMediaState}
                  onDeviceMediaSelected={onDeviceMediaSelected}
                  engageClient={engageClient.current}
                />
              ),
              headerStyle: {
                backgroundColor: '#314B9F',
              },
              headerTintColor: '#314B9F',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => null,
            })}>
            {props => (
              <RecentCalls {...props} session={session} endCall={endCall} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
