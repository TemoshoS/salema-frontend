// DangerZoneAlert.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import axiosInstance from '../../utils/axiosInstance';

const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const DISTANCE_FILTER_M = 50;       // only react to ~50m change

const DangerZoneAlert: React.FC = () => {
  const [isNearDanger, setIsNearDanger] = useState<boolean | null>(null);
  const [dangerZoneName, setDangerZoneName] = useState<string>('');
  const lastAlertAtRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestLocationPermissions = async () => {
    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (fine !== PermissionsAndroid.RESULTS.GRANTED) return false;

      // Android 10+ background location if you need alerts with app in bg
      if (Platform.Version >= 29) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
      }
      return true;
    }
    // iOS: request "always" if you need alerts with app killed
    return true;
  };

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      // optional: send token to backend once & on refresh
      // await axiosInstance.post('/fcm-token', { token });
      messaging().onTokenRefresh(async (t) => {
        setFcmToken(t);
        // await axiosInstance.post('/fcm-token', { token: t });
      });
    } catch (e) {
      console.log('FCM token error', e);
    }
  };

  const checkDangerZone = async (latitude: number, longitude: number) => {
    const now = Date.now();
    if (now - lastAlertAtRef.current < COOLDOWN_MS) {
      // skip frequent server calls
      return;
    }
    try {
      const res = await axiosInstance.post('/danger-zone/v1/check', {
        location: { latitude, longitude },
        fcmToken, // so server can target THIS device if it wants
      });

      if (res.data.status === 'OK' && res.data.message?.includes('within')) {
        const zoneName =
          res.data.zone?.name ||
          res.data.message.split('-')[1]?.trim() ||
          'Unknown Danger Zone';

        setIsNearDanger(true);
        setDangerZoneName(zoneName);
        lastAlertAtRef.current = now;

        // Local notification (if server didn’t send FCM)
        PushNotification.localNotification({
          channelId: 'danger-alerts',
          title: 'Danger Zone Alert',
          message: `Safety Alert: You’ve entered a dangerous area — ${zoneName}`,
          playSound: true,
          soundName: 'default',
          importance: 'high',
          tag: 'danger-zone',
          group: 'danger-zone',
        });
      } else {
        setIsNearDanger(false);
        setDangerZoneName('');
      }
    } catch (e) {
      console.log('checkDangerZone error', e);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const ok = await requestLocationPermissions();
      await getFcmToken();
      if (!ok) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to check for danger zones.'
        );
        return;
      }

      // Start watch
      watchIdRef.current = Geolocation.watchPosition(
        (pos) => {
          if (!mounted) return;
          const { latitude, longitude } = pos.coords;
          checkDangerZone(latitude, longitude);
        },
        (err) => console.log('Location error:', err),
        {
          enableHighAccuracy: true,
          distanceFilter: DISTANCE_FILTER_M, // only get callback after x meters
          interval: 60_000, // Android: desired update interval
          fastestInterval: 30_000, // Android
          useSignificantChanges: false, // iOS option if you want very low power
        }
      );
    })();

    return () => {
      mounted = false;
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return null;
};

export default DangerZoneAlert;
