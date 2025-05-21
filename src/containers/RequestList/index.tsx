import React, {useCallback, useEffect} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';

import styles from './styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {fetchServiceRequests} from '../../redux/serviceRequestSlice';
import EmptyContainer from '../../components/EmptyContainer';
import {RoleStrings} from '../../constants/constants';
import {RequestType, RootStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getvoiceCommands} from '../../redux/voiceNoteSlice';
import RNShake from 'react-native-shake';
import Header from '../../components/Header';
type RequestListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RequestList'
>;
export default function RequestList() {
  const navigation = useNavigation<RequestListNavigationProp>();
  const dispatch = useAppDispatch();

  const serviceRequestArr = useAppSelector(state => state.serviceRequest.items);
  const role = useAppSelector(state => state.auth.userDetails?.role);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServiceRequests());
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (role === RoleStrings.GU) dispatch(getvoiceCommands());
    }, []),
  );
  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      // Alert.alert('Shake event');
      navigation.navigate('CallEmergencyService');
      console.log('Shake event');
    });

    return () => {
      subscription.remove();
    };
  }, []);
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
      <Header title="Requests" showBackButton={false} />
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
