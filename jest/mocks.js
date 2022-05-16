import 'react-native-gesture-handler/jestSetup';


jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-snackbar', () => {
  show: jest.fn();
});

jest.mock('react-native-webrtc-rad', () => {
  ({RTCView: component => component});
});


