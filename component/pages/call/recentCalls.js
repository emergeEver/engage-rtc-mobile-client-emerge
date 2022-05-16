import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';

// screen width and height based on dimensions
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const RecentCalls = ({setUsername}) => {
  const [Userstate, setUserstate] = useState();

  useEffect(() => {
    getData();
  }, [Userstate]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('history');
      if (value !== null) {
        setUserstate(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const copyHandler = item => {
    setUsername(item['uri']);

    Snackbar.show({
      text: 'Sip uri copied.',
      duration: Snackbar.LENGTH_LONG,
    });
    // navigation.navigate("Home")
  };

  return (
    <ScrollView>
      {Userstate?.Calllogs ? (
        Object.keys(Userstate['Calllogs'])
          .reverse()
          .map((singleDate, i) => {
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            const todayDate = moment().format('DD/MM/YYYY');
            const yesterDate = moment().format('DD/MM/YYYY');
            return (
              <View key={i} style={{backgroundColor: '#E6F7FF'}}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#5C5B5B',
                    margin: 15,
                  }}>
                  {singleDate === todayDate
                    ? 'Today'
                    : singleDate === yesterDate
                    ? 'Yesterday'
                    : 'Older'}
                </Text>
                {Userstate['Calllogs'][singleDate]
                  .slice(0)
                  .reverse()
                  .map((item, i) => {
                    return (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}>
                        <Icon
                          key={i}
                          name={item.call?.video ? 'video-camera' : 'call'}
                          type={
                            item.call?.video ? 'FontAwesome' : 'MaterialIcons'
                          }
                          style={{
                            color:
                              item.type === 'outgoing'
                                ? '#01AD24'
                                : item.type === 'incoming'
                                ? '#01AD24'
                                : item.type === 'missedCall'
                                ? '#E30000'
                                : '#000000',
                            fontSize: 33,
                            marginTop: 10,
                            marginLeft: 18,
                            marginRight: 5,
                          }}
                        />
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 10,
                          }}>
                          <TouchableOpacity onPress={() => copyHandler(item)}>
                            <Text
                              style={{
                                fontSize: 20,
                                marginBottom: 12,
                                marginLeft: 8,
                                color: 'grey',
                              }}>
                              {item.name === null ? 'new user' : item.name}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              marginBottom: 15,
                            }}>
                            <Icon
                              name={
                                item.type === 'outgoing'
                                  ? 'call-made'
                                  : item.type === 'incoming'
                                  ? 'call-received'
                                  : item.type === 'missedCall'
                                  ? 'call-missed'
                                  : 'close'
                              }
                              type={
                                item.type === 'outgoing'
                                  ? 'MaterialCommunityIcons'
                                  : item.type === 'incoming'
                                  ? 'MaterialCommunityIcons'
                                  : item.type === 'missedCall'
                                  ? 'MaterialCommunityIcons'
                                  : 'AntDesign'
                              }
                              style={{
                                color:
                                  item.type === 'outgoing'
                                    ? '#01AD24'
                                    : item.type === 'incoming'
                                    ? '#01AD24'
                                    : item.type === 'missedCall'
                                    ? '#E30000'
                                    : '#000000',
                                fontSize: 16,
                                marginTop: -8,
                                marginLeft: 6,
                              }}
                            />
                            <Text
                              onPress={() => copyHandler(item)}
                              style={{
                                fontSize: 14,
                                marginLeft: 8,
                                color: '#5C5B5B',
                                marginTop: -10,
                              }}>
                              +{item.uri}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                marginLeft: 6,
                                color: '#5C5B5B',
                                marginTop: -10,
                              }}>
                              {item.duration}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            );
          })
      ) : (
        <View
          style={{
            left: SCREEN_WIDTH / 2 - 72,
            marginTop: SCREEN_HEIGHT * 0.39,
          }}>
          <Text
            style={{
              fontSize: SCREEN_WIDTH * 0.05,
              textTransform: 'capitalize',
            }}></Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RecentCalls;
