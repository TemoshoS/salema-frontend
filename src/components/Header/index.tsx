import React from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {store, useAppDispatch, useAppSelector} from '../../redux/store';
import {
  deRegisterDevice,
  logoutSuccess,
  toggleDrawer,
} from '../../redux/authSlice';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {persistStore} from 'redux-persist';
import {RoleStrings} from '../../constants/constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showButtons?: boolean;
  isEditEnabled?: boolean;
  onEditPressed?: () => void;
}
const Header: React.FC<HeaderProps> = ({
  title = 'Salema',
  showBackButton = true,
  showButtons = true,
  isEditEnabled = false,
  onEditPressed,
}) => {
  const {isLoggedIn} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {name} = useRoute();
  const {accessToken, userDetails} = useAppSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            dispatch(
              deRegisterDevice({configuration: `Bearer ${accessToken}`}),
            );
            const persistor = persistStore(store);
            // Clear persisted data
            persistor.purge();
            dispatch(logoutSuccess());
          },
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
        ) : isLoggedIn ? (
          <TouchableOpacity onPress={() => dispatch(toggleDrawer(true))}>
            <Icon name="menu" size={30} color="#fff" />
          </TouchableOpacity>
        ) : null}
        <Text numberOfLines={1} style={styles.headerText}>
          {title}
        </Text>
      </View>

      {isLoggedIn && showButtons ? (
        <View style={{flexDirection: 'row'}}>
          {name === 'OfficerProfile' ? (
            <TouchableOpacity onPress={onEditPressed} style={{marginEnd: 10}}>
              <MaterialIcons
                name={!isEditEnabled ? 'edit' : 'edit-off'}
                size={25}
                color="white"
              />
            </TouchableOpacity>
          ) : null}
          {name !== 'CallEmergencyService' &&
          userDetails?.role === RoleStrings.GU ? (
            <TouchableOpacity
              style={{marginEnd: 10}}
              onPress={() => navigation.navigate('CallEmergencyService')}>
              <Icon name="microphone" size={30} color="#fff" />
            </TouchableOpacity>
          ) : null}
          {name !== 'OfficerProfile' && userDetails?.role === RoleStrings.SO ? (
            <TouchableOpacity
              style={{marginEnd: 10}}
              onPress={() => navigation.navigate('OfficerProfile')}>
              <Ionicons name="person-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>
          ) : null}
          {name !== 'Profile' && userDetails?.role === RoleStrings.GU ? (
            <TouchableOpacity
              style={{marginEnd: 10}}
              onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="logout" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
export default Header;
