import React from 'react';
import renderer from 'react-test-renderer';
import Keyboard from '../pages/call/keypad';
import {render, cleanup, fireEvent} from '@testing-library/react-native';

afterEach(cleanup);
// jest.mock('react-native-webrtc-rad', () => {});

describe('Testing react navigation', () => {
  const props = {
    setKeyboard: jest.fn(),
    modalVisible: false,
    setModalVisible: jest.fn(),
    number: '123456789',
    setNumber: jest.fn(),
    session: {
      session: {
        sendDTMF: jest.fn(),
      },
      remoteUser: 'XYZ',
      remoteUserName: 'ABC',
      incoming: false,
      ringing: false,
      constraints: {audio: true, video: true},
    },
  };
  test('snapshot test', () => {
    const tree = renderer.create(<Keyboard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Keyboard component', () => {
    //   const wrapper = render(<Keyboard {...props} />);
  });

  test('Keyboard press event dtmf1', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf1');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });

  test('Keyboard press event dtmf2', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf2');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf3', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf3');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmfA', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmfA');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf4', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf4');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf5', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf5');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf6', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf6');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmfB', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmfB');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf7', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf7');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf8', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf8');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf9', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf9');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmfC', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmfC');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf*', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf*');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf0', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf0');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmf#', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmf#');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event dtmfD', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundButton = getByTestId('dtmfD');
    fireEvent.press(foundButton);
    expect(props.session.session.sendDTMF).toHaveBeenCalled();
  });
  test('Keyboard press event textField', () => {
    // onEventMock = jest.fn();
    const {getByPlaceholderText} = render(<Keyboard {...props} />);
    fireEvent.changeText(getByPlaceholderText('Enter Number'), '123456789');
    expect(getByPlaceholderText('Enter Number').props.value).toEqual(
      '123456789',
    );
  });

  test('Keypad click ', () => {
    const {getByTestId} = render(<Keyboard {...props} />);
    const foundIconButton = getByTestId('keypad');
    fireEvent.press(foundIconButton);
    expect(props.setNumber).toHaveBeenCalled();
  });
  test('should match to snapshot - Primary', () => {
    const component = render(<Keyboard label="test label" {...props} number />);
    expect(component).toMatchSnapshot('Primary button snapshot');
  });
  test('should match to snapshot - Secondary', () => {
    const component = render(
      <Keyboard label="test label" {...props} number={false} />,
    );
    expect(component).toMatchSnapshot('Secondary button snapshot');
  });
});
