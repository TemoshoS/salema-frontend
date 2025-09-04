/**
 * App.tsx
 * Danger Zone Notifications Working Version
 */

import React, { useEffect } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
  LogBox,
} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

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
import DangerZoneAlert from './src/containers/Ecommerce';


LogBox.ignoreLogs([
  'Support for defaultProps will be removed from function components in a future major release.',
]);

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

const RootNavigator = () => {
  const { isLoggedIn, userDetails } = useAppSelector((state) => state.auth);
  const { emergencyContacts } = useAppSelector((state) => state.emergencyContacts);
  const role = userDetails?.role;

  // Create notification channel once
  // Shake listener for emergency contacts
  useEffect(() => {
    if (role === RoleStrings.GU && emergencyContacts?.length) {
      const userName = userDetails?.name || 'User';
      const unsubscribeShake = setupShakeListener(emergencyContacts, userName);
      return () => unsubscribeShake();
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
        <AppNavigation />
      )}
    </>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Request notification permissions (Android 13+ and iOS)
    (async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      } else {
        const authStatus = await messaging().requestPermission();
        if (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
          console.log('Notification permission granted:', authStatus);
        }
      }
    })();

    // Single foreground listener
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      PushNotification.localNotification({
        channelId: 'danger-alerts',
        title:
          remoteMessage?.data?.title ||
          remoteMessage?.notification?.title ||
          'Danger Zone Alert',
        message:
          remoteMessage?.data?.body ||
          remoteMessage?.notification?.body ||
          'You are near a danger zone!',
        playSound: true,
        soundName: 'default',
        importance: 'high',
        // reduce stacking
        tag: remoteMessage?.data?.collapseKey || 'danger-zone',
        group: 'danger-zone',
        // id: 777, // uncomment to replace the previous instead of stacking
      });
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView
          style={{ flex: 1, paddingTop: STATUSBAR_HEIGHT, backgroundColor: THEME_COLOR }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <RootNavigator />
          <DangerZoneAlert />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

export default App;
