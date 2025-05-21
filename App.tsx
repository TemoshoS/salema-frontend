/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';
import { Provider } from 'react-redux';
import { persistor, store, useAppSelector } from './src/redux/store';
import AuthNavigation from './src/navigation/AuthNavigation';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import { THEME_COLOR } from './src/constants/colors';
import { PersistGate } from 'redux-persist/integration/react';

import BackgroundLocationTracker from './src/utils/BackgroundGeoLocation';
import { AdminStack } from './src/navigation/AdminNavigation';
import { RoleStrings } from './src/constants/constants';
import { SecurityCompanyStack } from './src/navigation/SecurityCompanyStack';
import { SecurityOfficerNavigation } from './src/navigation/SecurityOfficerNavigation';
import { setupShakeListener } from './src/utils/shake';

const RootNavigator = () => {
  // Access the isLoggedIn value from the Redux store
  const { isLoggedIn, userDetails } = useAppSelector(state => state.auth);

  return isLoggedIn ? (
    userDetails?.role === RoleStrings.AD ? (
      <AdminStack />
    ) : userDetails?.role === RoleStrings.MG ? (
      <SecurityCompanyStack />
    ) : userDetails?.role === RoleStrings.SO ? (
      <SecurityOfficerNavigation />
    ) : (
      <AppNavigation />
    )
  ) : (
    <AuthNavigation />
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
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
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

    const unsubscribeShake = setupShakeListener();

    return () => {
      unsubscribe;
      unsubscribeShake(); 
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
