import messaging from '@react-native-firebase/messaging';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import axiosInstance from './axiosInstance';
import { store } from '../redux/store';

/**
 * Setup Firebase Cloud Messaging
 */
export const setupFCM = async (userId: string) => {
  try {
    // Request notification permission based on platform
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted');
      
      // Get FCM token
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      
      // Create device ID
      const deviceId = `${Platform.OS}-${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
      
      // Save to backend
      await saveFCMToken(fcmToken, deviceId, userId);

      // Listen for token refresh
      messaging().onTokenRefresh(async (newToken) => {
        console.log('FCM Token refreshed:', newToken);
        await saveFCMToken(newToken, deviceId, userId);
      });
    }
  } catch (error) {
    console.error('FCM setup error:', error);
  }
};

/**
 * Save FCM token to backend
 */
const saveFCMToken = async (fcmToken: string, deviceId: string, userId: string) => {
  try {
    await axiosInstance.post('/fcm-token/v1/save', {
      fcmToken,
      deviceId,
      userId
    });
  } catch (error) {
    console.error('Failed to save FCM token:', error);
  }
};

/**
 * Setup foreground notification handler
 */
export const setupForegroundHandler = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification:', remoteMessage);
    
    // Get current state to check user role
    const state = store.getState();
    
    
   
    
    Alert.alert(
      remoteMessage.notification?.title || 'Alert',
      remoteMessage.notification?.body || 'Notification received',
      [{ text: 'OK' }]
    );
  });
};

/**
 * Check if app was opened from notification
 */
export const checkInitialNotification = async () => {
  const initialNotification = await messaging().getInitialNotification();
  
  if (initialNotification) {
    console.log('App opened from notification:', initialNotification);
    // You might want to navigate to specific screen here
    // navigation.navigate('NotificationScreen', { notification: initialNotification });
  }
};

/**
 * Background handler (should be called once at app startup)
 */
export const setupBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification:', remoteMessage);
    // Process your background notification here
  });
};