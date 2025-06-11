import React, { useCallback, useEffect } from 'react';
import { Alert, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchServiceRequests } from '../../redux/serviceRequestSlice';
import EmptyContainer from '../../components/EmptyContainer';
import { RoleStrings } from '../../constants/constants';
import { RequestType, RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getvoiceCommands } from '../../redux/voiceNoteSlice';
import RNShake from 'react-native-shake';
import Header from '../../components/Header';
import { triggerShakeManually } from '../../utils/shake';

type RequestListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RequestList'
>;

export default function RequestList() {
  const navigation = useNavigation<RequestListNavigationProp>();
  const dispatch = useAppDispatch();

  const serviceRequestArr = useAppSelector(state => state.serviceRequest.items);
  const role = useAppSelector(state => state.auth.userDetails?.role);

  // Get userDetails from Redux and log it for debugging
  const userDetails = useAppSelector(state => state.auth.userDetails);
  


  // Use userDetails.name if available, else fallback to 'user'
  const userName = userDetails?.userName ?? 'user';

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServiceRequests());
    }, [dispatch]),
  );

  useFocusEffect(
    useCallback(() => {
      if (role === RoleStrings.GU) dispatch(getvoiceCommands());
    }, [dispatch, role]),
  );

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

  const renderItem = ({ item }: { item: RequestType }) => (
    <TouchableOpacity
      onPress={() => {
        if (
          role === RoleStrings.MG ||
          role === RoleStrings.SO ||
          role === RoleStrings.AD
        ) {
          navigation.navigate('RequestDetails', item);
        }
      }}
      style={styles.cardView}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
        <Text
          style={[
            styles.locationText,
            { color: 'blue', textDecorationLine: 'underline' },
          ]}>
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
      <Header title="Requests" showBackButton={false} />
      {serviceRequestArr.length !== 0 ? (
        <FlatList
          data={serviceRequestArr}
          renderItem={renderItem}
          style={{ height: '100%', marginBottom: 20 }}
          keyExtractor={item => item._id} // Adds spacing between rows
        />
      ) : (
        <EmptyContainer title="No Requests" />
      )}

      {/* Floating panic button */}
      <TouchableOpacity
        onPress={() => triggerShakeManually(userName)} // Pass userName here
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

