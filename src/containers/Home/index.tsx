import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, Linking, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {fetchAllSecurityCompany} from '../../redux/securityCompanySlice';
import {firebase} from '@react-native-firebase/messaging';
import {registerDevice} from '../../redux/authSlice';
import GetLocation from 'react-native-get-location';
import {emergencyAlert} from '../../redux/panicSlice';
import { triggerShakeManually } from '../../utils/shake';
import RNShake from 'react-native-shake';
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
  const userDetails = useAppSelector(state => state.auth.userDetails);
  const userName = userDetails?.userName ?? 'user';

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

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      // Pass userName when calling
      triggerShakeManually(userName);
      Alert.alert(
        'Emergency Alert',
        'Your emergency contacts have been notified.',
      );
    });

    return () => {
      subscription.remove();
    };
  }, [ userName]);

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
      <TouchableOpacity
  onPress={() => {
    const lat = item?.location?.coordinates?.latitude;
    const lon = item?.location?.coordinates?.longitude;
    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    if (lat && lon) {
      Linking.openURL(url);
    } else {
      Alert.alert('Invalid location');
    }
  }}>
  <Text style={[styles.locationText, { color: 'blue', textDecorationLine: 'underline' }]}>
    View Location
  </Text>
</TouchableOpacity>

      <Text style={styles.servicesText}>
        Services {item?.requestedServices?.join(', ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title={''} />
  
      {/* Main content below header */}
      {serviceRequestArr.length !== 0 ? (
        <FlatList
          data={serviceRequestArr}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <EmptyContainer title="No Requests" />
      )}
  
      {/* Floating panic button */}
      <TouchableOpacity
        onPress={() => triggerShakeManually(userName)} 
        style={{
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
          backgroundColor: 'crimson',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 10,
          elevation: 5, // Android shadow
          shadowColor: '#000', // iOS shadow
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Panic Button</Text>
      </TouchableOpacity>
    </View>
  );
  
}
