import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {fetchAllSecurityCompany} from '../../redux/securityCompanySlice';
import {firebase} from '@react-native-firebase/messaging';
import {registerDevice} from '../../redux/authSlice';
import GetLocation from 'react-native-get-location';
import {emergencyAlert} from '../../redux/panicSlice';

import EmptyContainer from '../../components/EmptyContainer';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RequestType, RootStackParamList} from '../../types';
import {fetchServiceRequests} from '../../redux/serviceRequestSlice';
import {RoleStrings} from '../../constants/constants';
type RequestListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SecurityCompanyList'
>;
export default function Home() {
  const navigation = useNavigation<RequestListNavigationProp>();
  const dispatch = useAppDispatch();

  const access_token = useAppSelector(state => state.auth.accessToken);

  const [location, setLocation]: any = useState([]);

  useEffect(() => {
    console.log('access_token = ', access_token);
    firebase
      .messaging()
      .getToken()
      .then(token => {
        if (token) {
          // user has a device token
          console.log('FCM token - ' + token);
          dispatch(
            registerDevice({
              fcmToken: token,
              configuration: `Bearer ${access_token}`,
            }),
          );
        } else {
          // user doesn't have a device token yet
          console.log('no FCM token');
        }
      });
  }, [access_token]);

  const panicButton = () => {
    dispatch(
      emergencyAlert({
        location: {
          longitude: location.longitude,
          latitude: location.latitude,
        },
        alertType: 'panic_button',
      }),
    );
  };

  const fetchSecurityCompany = () => {
    dispatch(fetchAllSecurityCompany());
  };

  useEffect(() => {
    fetchSecurityCompany();
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(coordinate => {
        console.log(coordinate);
        setLocation(coordinate);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  }, []);

  const serviceRequestArr = useAppSelector(state => state.serviceRequest.items);
  const role = useAppSelector(state => state.auth.userDetails?.role);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServiceRequests());
    }, []),
  );
  const renderItem = ({item}: {item: RequestType}) => (
    <TouchableOpacity
      onPress={() => {
        role === RoleStrings.MG ||
        role === RoleStrings.SO ||
        role === RoleStrings.AD
          ? navigation.navigate('RequestDetails', item)
          : undefined;
      }}
      style={styles.cardView}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.requestText}>Request #{item?.requestNumber}</Text>
        <Text style={styles.statusText}>{item?.requestStatus}</Text>
      </View>
      <Text style={styles.locationText}>
        Location #{item?.location?.coordinates?.latitude},
        {item?.location?.coordinates?.longitude}
      </Text>
      <Text style={styles.servicesText}>
        Services {item?.requestedServices?.join(', ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <Header />
      {serviceRequestArr.length !== 0 ? (
        <>
          <FlatList
            data={serviceRequestArr}
            renderItem={renderItem}
            style={{height: '100%', marginBottom: 20}}
            keyExtractor={item => item._id} // Adds spacing between rows
          />
        </>
      ) : (
        <EmptyContainer title="No Requests" />
      )}
    </View>
  );
}
