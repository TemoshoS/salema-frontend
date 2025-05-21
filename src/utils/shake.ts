import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Shake from 'react-native-shake';
import Geolocation from '@react-native-community/geolocation';

// Send SMS via backend
const sendSms = async (phoneNumber: string, message: string) => {
  try {
    const response = await fetch('https://salema-backend1.onrender.com/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, message }),
    });

    const data = await response.json();
    if (data.success) {
      console.log('SMS sent successfully');
    } else {
      console.log('Failed to send SMS:', data.error);
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

// Get current location
const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );
  });
};

// Main shake listener setup
export const setupShakeListener = () => {
  const subscription = Shake.addListener(() => {
    const handleShake = async () => {
      Alert.alert('Shake Detected', 'Sending emergency SMS...');

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied');
          return;
        }
      }

      const coords = await getCurrentLocation();
      const userName = 'Temosho'; // You can get this dynamically

      let message = `Hi, it's ${userName}. I'm in danger and need help.`;
      if (coords) {
        message += ` My location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
      } else {
        message += ' My location could not be determined.';
      }

      await sendSms('+27721371977', message);
    };

    handleShake();
  });

  return () => {
    subscription.remove(); // cleanup
  };
};
