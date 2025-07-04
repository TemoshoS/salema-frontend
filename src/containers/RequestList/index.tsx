import React, { useCallback, useEffect, useState } from 'react';
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
import WelcomeHome from '../../components/WelcomeHome';
import { MAIN_ICON, INACTIVEICON, NO, UNDRAW } from '../../constants/assets';

type RequestListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RequestList'
>;

export default function RequestList() {
  const navigation = useNavigation<RequestListNavigationProp>();
  const dispatch = useAppDispatch();

  const serviceRequestArr = useAppSelector(state => state.serviceRequest.items);
  const role = useAppSelector(state => state.auth.userDetails?.role);

  const userDetails = useAppSelector(state => state.auth.userDetails);
  const userName = userDetails?.userName ?? 'user';

  const [currentIcon, setCurrentIcon] = useState(INACTIVEICON);

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
      triggerShakeManually(userName);
      Alert.alert(
        'Emergency Alert',
        'Your emergency contacts have been notified.',
      );
      changeIconTemporary();
    });

    return () => {
      subscription.remove();
    };
  }, [userName]);

  const changeIconTemporary = () => {
    setCurrentIcon(MAIN_ICON);
    setTimeout(() => {
      setCurrentIcon(INACTIVEICON);
    }, 3000);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Requests" showBackButton={false} />
      <WelcomeHome mainIcon={currentIcon} />

      {/* Show panic button only if role is general user */}
      {role === RoleStrings.GU && (
        <TouchableOpacity
          onPress={() => {
            triggerShakeManually(userName);
            changeIconTemporary();
          }}
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            backgroundColor: 'crimson',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 10,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Panic Button</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
