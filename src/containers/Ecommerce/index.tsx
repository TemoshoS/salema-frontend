import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axiosInstance from '../../utils/axiosInstance';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';


const DangerZoneAlert: React.FC = () => {
  const [isNearDanger, setIsNearDanger] = useState<boolean | null>(null);
  const [dangerZoneName, setDangerZoneName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [locationInterval, setLocationInterval] = useState<NodeJS.Timeout | null>(null);

  // Request location permission (Android)
  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to warn about danger zones nearby.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS: Handle permission differently if needed
      return true; // Assuming permission is granted
    }
  };

  // Call backend to check if user is near a danger zone
  const checkDangerZone = async (latitude: number, longitude: number) => {
    try {
      const res = await axiosInstance.post('/danger-zone/v1/check', {
        location: { latitude, longitude },
      });

      if (res.data.status === 'OK' && res.data.message.includes('within')) {
        // Extract zone name from message or use zone property if available
        const zoneName = res.data.zone?.name
          ? res.data.zone.name
          : res.data.message.split('-')[1]?.trim() || 'Unknown Danger Zone';

        setIsNearDanger(true);
        setDangerZoneName(zoneName);
      } else {
        setIsNearDanger(false);
        setDangerZoneName('');
      }
    } catch (error) {
      console.error('Error checking danger zone:', error);
      setIsNearDanger(null);
      setDangerZoneName('');
    } finally {
      setLoading(false);
    }
  };

  // Start location updates on interval
  const startLocationTracking = () => {
    const interval = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          checkDangerZone(latitude, longitude);
        },
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, 30000); // every 30 seconds

    setLocationInterval(interval);
  };

  useEffect(() => {
    const init = async () => {
      const permissionGranted = await checkLocationPermission();
      if (permissionGranted) {
        startLocationTracking();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to check for danger zones.'
        );
        setLoading(false);
      }
    };
  
    init();
  
    // 🔔 Listen for foreground FCM messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification || {};
  
      PushNotification.localNotification({
        channelId: 'danger-alerts',
        title: title || 'Danger Zone Alert',
        message: body || 'Someone has entered a danger zone.',
      });
    });
  
    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
      unsubscribe(); // Clean up FCM listener
    };
  }, []);
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Checking your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isNearDanger ? (
        <View style={styles.dangerAlert}>
          <Text style={styles.dangerText}>⚠️ Warning!</Text>
          <Text style={styles.dangerText}>You are near: {dangerZoneName}</Text>
          <Text style={styles.dangerText}>Please proceed with caution.</Text>
        </View>
      ) : (
        <Text style={styles.safeText}>✅ You are not near any danger zones.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dangerAlert: {
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
  },
  dangerText: {
    color: '#c62828',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  safeText: {
    color: '#2e7d32',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DangerZoneAlert;
