import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import renderer from 'react-test-renderer';
import RecentCalls from '../pages/call/recentCalls';
import {render, cleanup, waitFor, screen} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




afterEach(cleanup);

describe('Testing react navigation', () => {
  const props = {
    setUsername: jest.fn(),
  };
  test('snapshot test', () => {
    const tree = renderer.create(<RecentCalls {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('RecentCalls component', async () => {
    AsyncStorage.setItem(
      'history',
      JSON.stringify({
        Calllogs: {
          ['08/26/2020']: [
            {
              uri: '',
              duration: 0,
              type: 'incoming',
              name: '',
              call: '',
            },
          ],
        },
      }),
    );

    const wrapper = render(<RecentCalls {...props} />);
    AsyncStorage.removeItem('history');
  });
});
