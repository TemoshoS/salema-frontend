import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Shake from 'react-native-shake';
import Geolocation from 'react-native-geolocation-service';
import { store } from '../redux/store';
import axiosInstance from '../utils/axiosInstance';

let cachedContacts: { phone: string; name: string }[] = [];

type SecurityCompany = {
  companyName: string;
  phone: string;
};

const sendSms = async (phoneNumber: string, message: string) => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    console.warn('⚠️ Skipping SMS: Invalid phone number');
    return;
  }

  try {
    const response = await axiosInstance.post('/send-sms', {
      to: phoneNumber.trim(),
      message,
    });

    const data = response.data;
    if (data.success) {
      console.log(`✅ SMS sent to ${phoneNumber}`);
    } else {
      console.log(`❌ Failed to send SMS to ${phoneNumber}:`, data.error);
    }
  } catch (error: any) {
    console.error(`❌ Error sending SMS to ${phoneNumber}:`, error.message || error);
  }
};

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to send it in emergency SMS.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
  return true; // Assume granted on iOS
};

const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error(`Error getting location (code ${error.code}): ${error.message}`);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });
};

// Main emergency SMS function
const sendEmergencySms = async (userName: string) => {
  if (cachedContacts.length === 0) {
    Alert.alert('No emergency contacts set.');
  }

  const hasPermission = await requestLocationPermission();
  const coords = hasPermission ? await getCurrentLocation() : null;

  let message = `Hi, it's ${userName}. I'm in danger and need help.`;
  if (coords) {
    message += ` My location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  } else {
    message += ' My location could not be determined.';
  }

  // 1️⃣ Send to user emergency contacts
  for (const contact of cachedContacts) {
    if (!contact.phone) continue;
    console.log(`📞 Sending SMS to contact: ${contact.phone}`);
    await sendSms(contact.phone, message);
  }

  // 2️⃣ Send to nearest verified security company
  if (coords) {
    try {
      const { auth } = store.getState();
      const token = auth?.accessToken;

      const response = await axiosInstance.post(
        '/security-company/v1/nearest',
        { latitude: coords.latitude, longitude: coords.longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nearest: SecurityCompany = response.data?.nearestCompany;
      if (nearest && nearest.phone) {
        console.log(`📞 Sending SMS to nearest security: ${nearest.phone}`);
        await sendSms(nearest.phone, message);
      } else {
        console.warn('No verified security company nearby.');
      }
    } catch (error: any) {
      console.error('Error fetching nearest security company:', error.message || error);
    }
  }
};

// Shake listener setup
export const setupShakeListener = (contacts: { phone: string; name: string }[], userName: string) => {
  cachedContacts = contacts;

  const subscription = Shake.addListener(() => {
    sendEmergencySms(userName);
  });

  return () => subscription.remove();
};

// Manual trigger
export const triggerEmergencySms = async (userName: string) => {
  await sendEmergencySms(userName);
};
