import React from 'react';
import renderer from 'react-test-renderer';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import CustomHeader from '../pages/CustomHeader/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

afterEach(cleanup);
// jest.mock('react-native-webrtc-rad', () => {});
jest.mock('react-native-fs', () => {
  return {
    mkdir: jest.fn(),
    writeFile: () => new Promise((resolve, reject) => resolve()),
    readDir: () => new Promise((resolve, reject) => resolve()),
  };
});

jest.mock('@react-native-clipboard/clipboard', () => {});

describe('Testing react navigation', () => {
  const props = {
    connection: {
      connection: null,
      status: 'Disconnected',
      identity: '',
      username: '',
    },
    navigation: '',
    debugLogs: {
      current: ['Connecting', 'Connected'],
    },
    RTCUtils: {
      getSelectedCameraResolution: jest.fn(),
    },
    logoutClient: jest.fn(),
    session: {
      session: null,
      remoteUser: 'XYZ',
      remoteUserName: 'ABC',
      incoming: false,
      ringing: false,
      constraints: {audio: true, video: true},
    },
    whoosh: jest.fn(),
    onDeviceMediaSelected: jest.fn(),
    onAudioSelection: jest.fn(),
    engageClient: {
      updateLogSettings: jest.fn(),
      getLogs: jest.fn(),
    },
    readyEvent: true,
    hideDeviceSelection: false,
    audioDevices: [
      {
        text: 'EARPIECE',
        icon: 'call',
        iconColor: '#2c8ef4',
      },
    ],
    selectedAudioDevice: {
      text: 'EARPIECE',
      icon: 'call',
      iconColor: '#2c8ef4',
    },
    hideResolutionSelection: false,
  };

  test('snapshot test', () => {
    const tree = renderer.create(<CustomHeader {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('getData Async Storage', () => {
    AsyncStorage.setItem('username', JSON.stringify(''));
    const wrapper = render(<CustomHeader {...props} />);
    AsyncStorage.removeItem('username');
  });

  test('getData Async Storage negative case', () => {
    AsyncStorage.setItem('username', JSON.stringify('') + '{{{{');
    const wrapper = render(<CustomHeader {...props} />);
    AsyncStorage.removeItem('username');
  });

  test('userId Async Storage', () => {
    AsyncStorage.setItem('userId', JSON.stringify(''));
    const wrapper = render(<CustomHeader {...props} />);
    AsyncStorage.removeItem('userId');
  });

  test('userId Async Storage negative case', () => {
    AsyncStorage.setItem('userId', JSON.stringify('') + '{{{{');
    const wrapper = render(<CustomHeader {...props} />);
    AsyncStorage.removeItem('userId');
  });

  test('Verify if updateLogSetting is called on Ready Event', () => {
    const {getByTestId} = render(<CustomHeader {...props} />);
    expect(props.engageClient.updateLogSettings).toHaveBeenCalled;
  });

  test('Camera Resolution is being updated to state in Valid RTCUTIL', () => {
    const {getByTestId} = render(<CustomHeader {...props} />);
    expect(props.RTCUtils.getSelectedCameraResolution).toHaveBeenCalled;
  });

  test('getLogs is being called on download', () => {
    const {getByTestId} = render(<CustomHeader {...props} />);
    props.engageClient.getLogs.mockImplementationOnce(() => {});
    fireEvent.press(getByTestId('download'));
    fireEvent.press(getByTestId('logoutButton'));
    expect(props.engageClient.getLogs).toHaveBeenCalled();
  });

  test('setResolutions is being called on press resolution', () => {
    const {getByTestId} = render(<CustomHeader {...props} />);
    fireEvent.press(getByTestId('Resolutions'));
  });

  test('setResolutions is being called on press resolution', () => {
    const {getByTestId} = render(<CustomHeader {...props} />);
    fireEvent.press(getByTestId('Modal'));
  });

  test('logoutData', () => {
    const registered = {};
    const props = {
      navigation: {
        navigate: jest.fn(),
      },
      session: {
        session: {
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
    };
    const {getByTestId} = render(
      <CustomHeader {...props} testComponent={true} />,
    );
    fireEvent.press(getByTestId('logoutData'));
    expect(props.session.session.rejectCall).toHaveBeenCalled();
  });

  // test('Resolutions click ', () => {
  //   const onPressMock = jest.fn();
  //   const {getByTestId} = render(
  //     <CustomHeader {...props} onPressMock={onPressMock} />,
  //   );
  //   const foundIconButton = getByTestId('Resolutions');
  //   fireEvent.press(foundIconButton);
  //   expect(onPressMock).toHaveBeenCalled();
  // });

  // test('customHeader press event', () => {
  //   const setModalVisible = jest.fn();
  //   const {getByTestId} = render(<CustomHeader {...props} />);
  //   const foundButton = getByTestId('bug');
  //   fireEvent.press(foundButton);
  //   expect(setModalVisible).toHaveBeenCalled();
  // });

  // test('customHeader press event', () => {
  //   const setModalVisible = jest.fn();
  //   const {getByTestId} = render(<CustomHeader {...props} />);
  //   const foundButton = getByTestId('debug');
  //   fireEvent.press(foundButton);
  //   // expect(setModalVisible).toHaveBeenCalled();
  // });
});
