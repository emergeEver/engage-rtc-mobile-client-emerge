import React from 'react';
import renderer from 'react-test-renderer';
import Login from '../pages/login/login';
import {
  render,
  cleanup,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react-native';
import {BackHandler, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

// jest.mock('react-native', () => {
//   return {
//   ...jest.requireActual('react-native'),
//   BackHandler : jest.fn()
// }});

jest.mock('react-navigation', () => {
  return {withNavigation: component => component};
});

jest.mock('react-native/Libraries/LogBox/LogBox');

const props = {
  navigation: {
    navigate: jest.fn(),
  },
  connect: jest.fn(),
  isSupport: false,
  setModalVisible: jest.fn(),
  Linking: jest.fn(),
  setdomainSettings: jest.fn(),
  closeApp: jest.fn(),
  inputUsername: jest.fn(),
  inputUserid: jest.fn(),
  inputDomin: jest.fn(),
};

afterEach(cleanup);

describe('MyComponent test', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Login {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders', () => {
    renderer.create(<Login {...props} />);
  });

  test('image click ', () => {
    const {getByTestId} = render(<Login {...props} />);
    const foundIconButton = getByTestId('image');
    fireEvent.press(foundIconButton);
    // expect(props.Linking).toHaveBeenCalled();
  });

  test('Dialog open click ', () => {
    const {getByTestId} = render(<Login {...props} />);
    const foundIconButton = getByTestId('open');
    fireEvent.press(foundIconButton);
    // expect(props.setModalVisible).toHaveBeenCalled();
  });

  test('Dialog domain click ', () => {
    const {getByTestId} = render(<Login {...props} />);
    const foundIconButton = getByTestId('Domain');
    fireEvent.press(foundIconButton);
    // expect(props.setdomainSettings).toHaveBeenCalled();
  });

  // test('submit  click ', () => {
  //   const {getByTestId} = render(<Login {...props} />);
  //   const Button = getByTestId('submit');
  //   fireEvent.press(Button);
  //   // expect(props.setdomainSettings).toHaveBeenCalled();
  // });

  test('Dialog exit click ', () => {
    const onPressMock = jest.fn();
    const {getByTestId} = render(
      <Login {...props} onPressMock={onPressMock} />,
    );
    const foundIconButton = getByTestId('exit');
    fireEvent.press(foundIconButton);
    // expect(onPressMock).toHaveBeenCalled();
  });
    
  test('Dialog click ', () => {
    const onPressMock = jest.fn();
    const {getByTestId} = render(
      <Login {...props} onPressMock={onPressMock} />,
    );
    const foundIconButton = getByTestId('closeApp');
    fireEvent.press(foundIconButton);
    fireEvent.press(getByTestId('closeApp'));
    // expect(onPressMock).toHaveBeenCalled();
  });

  test('modal click ', () => {
    const {getByA11yRole} = render(<Login {...props} />);
    expect(getByA11yRole('modal')).toBeDefined();
  });

  test('Keyboard press event textField', () => {
    // onEventMock = jest.fn();
    const {getByPlaceholderText} = render(<Login {...props} />);
    fireEvent.changeText(getByPlaceholderText('Username'), 'testing');
    expect(getByPlaceholderText('Username').props.value).toEqual('testing');
  });
  test('Keyboard press event textField', () => {
    // onEventMock = jest.fn();
    const {getByPlaceholderText} = render(<Login {...props} />);
    fireEvent.changeText(getByPlaceholderText('Identity'), '123');
    expect(getByPlaceholderText('Identity').props.value).toEqual('123');
  });
  test('Keyboard press event textField', () => {
    // onEventMock = jest.fn();
    const {getByPlaceholderText, getByTestId} = render(<Login {...props} />);
    fireEvent.changeText(getByPlaceholderText('Domain Info'), 'Test');
    // expect(getByTestId('domainName').props.value).toEqual('Test');
  });
});
