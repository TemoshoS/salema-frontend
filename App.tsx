/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import messaging from '@react-native-firebase/messaging';

import { store, persistor, useAppSelector } from './src/redux/store';
import { THEME_COLOR } from './src/constants/colors';
import AuthNavigation from './src/navigation/AuthNavigation';
import AppNavigation from './src/navigation/AppNavigation';
import { AdminStack } from './src/navigation/AdminNavigation';
import { SecurityCompanyStack } from './src/navigation/SecurityCompanyStack';
import { SecurityOfficerNavigation } from './src/navigation/SecurityOfficerNavigation';

import { RoleStrings } from './src/constants/constants';
import BackgroundLocationTracker from './src/utils/BackgroundGeoLocation';
import { setupShakeListener } from './src/utils/shake';
import AutoVoiceListener from './src/containers/AutoListener';

const RootNavigator = () => {
  const { isLoggedIn, userDetails } = useAppSelector(state => state.auth);
  const { emergencyContacts } = useAppSelector(state => state.emergencyContacts);
  const role = userDetails?.role;

  useEffect(() => {
    if (
      role === RoleStrings.GU &&
      Array.isArray(emergencyContacts) &&
      emergencyContacts.length > 0
    ) {
      console.log('userDetails:', userDetails);

      const userName = userDetails?.name || 'User'; // fallback if name not available
      const unsubscribeShake = setupShakeListener(emergencyContacts, userName);
      return () => unsubscribeShake(); // Cleanup on unmount
    }
  }, [emergencyContacts, role, userDetails?.name]);
  

  if (!isLoggedIn) return <AuthNavigation />;

  return (
    <>
      {role === RoleStrings.AD ? (
        <AdminStack />
      ) : role === RoleStrings.MG ? (
        <SecurityCompanyStack />
      ) : role === RoleStrings.SO ? (
        <SecurityOfficerNavigation />
      ) : (
        <>
          <AppNavigation />
        </>
      )}
    </>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: THEME_COLOR,
  };

  useEffect(() => {
    (async () => {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });

      if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      } else if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }
    })();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <RootNavigator />
          <BackgroundLocationTracker />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

export default App;
