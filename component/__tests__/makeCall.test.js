import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import renderer from 'react-test-renderer';
import Makecall from '../pages/call/makeCall';
import {render, cleanup, fireEvent} from '@testing-library/react-native';

afterEach(cleanup);

describe('Testing react navigation', () => {
  const props = {
    navigation: {
      navigate: jest.fn(),
    },
    session: {
      session: {
        toggleAudio: jest.fn(),
      },
      remoteUser: 'XYZ',
      remoteUserName: 'ABC',
      incoming: false,
      ringing: true,
      constraints: {audio: true, video: true},
    },
    makeCall: jest.fn(),
  };

  test('renders correctly', () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <Makecall {...props} />
        </NavigationContainer>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('clicking on one item takes you to the details screen', () => {
    const {getByPlaceholderText} = render(
      <NavigationContainer>
        <Makecall {...props} />
      </NavigationContainer>,
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter Phone No / SIP URI'),
      '123',
    );
    expect(
      getByPlaceholderText('Enter Phone No / SIP URI').props.value,
    ).toEqual('123');
  });

  test('clicking on one item takes you to the details screen', () => {
    const props = {
      navigation: {
        navigate: jest.fn(),
      },
      session: {
        session: {
          toggleAudio: jest.fn(),
        },
        remoteUser: 'XYZ',
        remoteUserName: 'ABC',
        incoming: false,
        ringing: true,
        constraints: {audio: true, video: true},
      },
      makeCall: jest.fn(),
    };
    const {getByTestId, getByPlaceholderText} = render(
      <NavigationContainer>
        <Makecall {...props} />
      </NavigationContainer>,
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter Phone No / SIP URI'),
      '123',
    );
    fireEvent.press(getByTestId('videoCallhandler1'));
    fireEvent.press(getByTestId('videoCallhandler2'));
    fireEvent.press(getByTestId('audioCallhandler1'));
    fireEvent.press(getByTestId('audioCallhandler2'));
    expect(props.makeCall).toHaveBeenCalled();
  });
});
