import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import renderer from 'react-test-renderer';
import GetCall from '../pages/call/getCall';
import {render, cleanup, fireEvent} from '@testing-library/react-native';

afterEach(cleanup);

describe('Testing react navigation', () => {
  const props = {
    navigation: {
      navigate: jest.fn(),
    },
    route: {params: {currentBid: '11'}},
    endCall: jest.fn(),
    session: {
      session: {
        incomingCallWithVideo: jest.fn(),
        addEventHandler: (value, func) => (registered[value] = func),
        toggleVideo: jest.fn(),
        toggleAudio: jest.fn(),
        switchCamera: jest.fn(),
        disconnectCall: jest.fn(),
        rejectCall: jest.fn(),
      },
      remoteUser: 'XYZ',
      remoteUserName: 'ABC',
      incoming: false,
      ringing: false,
      constraints: {audio: true, video: true},
    },
    acceptCall: jest.fn(),
    handleCalls: jest.fn(),
  };
  test('snapshot test', () => {
    const tree = renderer.create(<GetCall {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('endCall click ', () => {
    const {getByTestId} = render(<GetCall {...props} />);
    const foundIconButton = getByTestId('callEnd');
    fireEvent.press(foundIconButton);
    expect(props.endCall).toHaveBeenCalled();
  });

  // test('call click ', () => {
  //   const {getByTestId} = render(<GetCall {...props} />);
  //   const foundIconButton = getByTestId('call');
  //   fireEvent.press(foundIconButton);
  //   expect(props.handleCalls).toHaveBeenCalled();
  // });

  test('video click ', () => {
    const {getByTestId} = render(<GetCall {...props} />);
    const foundIconButton = getByTestId('video');
    fireEvent.press(foundIconButton);
    expect(props.acceptCall).toHaveBeenCalled();
  });

  test('gobackFunction', () => {
    const registered = {};
    const props = {
      navigation: {
        navigate: jest.fn(),
      },
      session: {
        session: {
          incomingCallWithVideo: jest.fn(),
          addEventHandler: (value, func) => (registered[value] = func),
          toggleVideo: jest.fn(),
          toggleAudio: jest.fn(),
          switchCamera: jest.fn(),
          disconnectCall: jest.fn(),
          rejectCall: jest.fn(),
        },
        remoteUser: 'XYZ',
        remoteUserName: 'ABC',
        incoming: true,
        ringing: true,
        constraints: {audio: true, video: true},
      },
      endCall: jest.fn(),
      remoteStream: null,
      localStream: null,
      route: {params: {currentBid: '11'}},
      logoutClient: jest.fn(),
      callTransfer: {status: false, to: '', message: ''},
      joinWithVideoMuted: true,
      connection: {
        connection: null,
        status: 'Disconnected',
        identity: '',
        username: '',
      },
      selectedAudioDevice: {
        text: 'EARPIECE',
        icon: 'call',
        iconColor: '#2c8ef4',
      },
      debugLogs: {
        current: ['connecting', 'connected'],
      },
      whoosh: {
        stop: jest.fn(),
      },
      acceptCall: jest.fn(),
      handleCalls: jest.fn(),
    };
    const {getByTestId} = render(<GetCall {...props} testComponent={true} />);
    fireEvent.press(getByTestId('goback'));
    expect(props.session.session.rejectCall).toHaveBeenCalled();
  });

  test('handleCallsFunction', () => {
    const registered = {};
    const props = {
      navigation: {
        navigate: jest.fn(),
      },
      session: {
        incoming: jest.fn(),
        session: {
          incomingCallWithVideo: true,
          addEventHandler: (value, func) => (registered[value] = func),
          toggleVideo: jest.fn(),
          toggleAudio: jest.fn(),
          switchCamera: jest.fn(),
          disconnectCall: jest.fn(),
          rejectCall: jest.fn(),
        },
        remoteUser: 'XYZ',
        remoteUserName: 'ABC',
        incoming: true,
        ringing: true,
        constraints: {audio: true, video: true},
      },
      endCall: jest.fn(),
      remoteStream: null,
      localStream: null,
      route: {params: {currentBid: '11'}},
      logoutClient: jest.fn(),
      callTransfer: {status: false, to: '', message: ''},
      joinWithVideoMuted: true,
      connection: {
        connection: null,
        status: 'Disconnected',
        identity: '',
        username: '',
      },
      selectedAudioDevice: {
        text: 'EARPIECE',
        icon: 'call',
        iconColor: '#2c8ef4',
      },
      debugLogs: {
        current: ['connecting', 'connected'],
      },
      whoosh: {
        stop: jest.fn(),
      },
      acceptCall: jest.fn(),
    };
    let sessionData = props.session.incoming;
    const {getByTestId} = render(<GetCall {...props} sessionData={true} />);
    fireEvent.press(getByTestId('call'));
    expect(props.acceptCall).toHaveBeenCalled();
  });

  test('handleCallsFunction else', () => {
    const registered = {};
    const props = {
      navigation: {
        navigate: jest.fn(),
      },
      session: {
        incoming: jest.fn(),
        session: {
          incomingCallWithVideo: false,
          addEventHandler: (value, func) => (registered[value] = func),
          toggleVideo: jest.fn(),
          toggleAudio: jest.fn(),
          switchCamera: jest.fn(),
          disconnectCall: jest.fn(),
          rejectCall: jest.fn(),
        },
        remoteUser: 'XYZ',
        remoteUserName: 'ABC',
        incoming: true,
        ringing: true,
        constraints: {audio: true, video: true},
      },
      endCall: jest.fn(),
      remoteStream: null,
      localStream: null,
      route: {params: {currentBid: '11'}},
      logoutClient: jest.fn(),
      callTransfer: {status: false, to: '', message: ''},
      joinWithVideoMuted: true,
      connection: {
        connection: null,
        status: 'Disconnected',
        identity: '',
        username: '',
      },
      selectedAudioDevice: {
        text: 'EARPIECE',
        icon: 'call',
        iconColor: '#2c8ef4',
      },
      debugLogs: {
        current: ['connecting', 'connected'],
      },
      whoosh: {
        stop: jest.fn(),
      },
      acceptCall: jest.fn(),
    };

    let sessionData = props.session.incoming;
    const {getByTestId} = render(<GetCall {...props} sessionData={false} />);
    fireEvent.press(getByTestId('call'));
    expect(props.acceptCall).toHaveBeenCalled();
  });
});
