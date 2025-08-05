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

type ApiResponse = {
  status: string;
  phones: SecurityCompany[];
};

// Send SMS via backend
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


// Get current location
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

// Request location permission on Android
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

const getSecurityCompanyPhones = async (): Promise<string[]> => {
  try {
    const { auth } = store.getState();
    const token = auth?.accessToken;

    const response = await axiosInstance.get<ApiResponse>('/security-company/v1/phones', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    console.log('📡 Security companies response:', JSON.stringify(data));

    const validCompanies = (data.phones || []).filter(
      (company) => company.phone && typeof company.phone === 'string' && company.phone.trim() !== ''
    );

    const uniquePhones = new Set(validCompanies.map((company) => company.phone.trim()));

    return Array.from(uniquePhones);
  } catch (error) {
    console.error('Error fetching security companies:', error);
    return [];
  }
};




const sendEmergencySms = async (userName: string) => {
  const securityPhones = await getSecurityCompanyPhones();

  if (cachedContacts.length === 0 && securityPhones.length === 0) {
    Alert.alert('No emergency contacts or security companies set.');
    return;
  }

  Alert.alert('Sending emergency SMS...');

  const hasPermission = await requestLocationPermission();
  const coords = hasPermission ? await getCurrentLocation() : null;

  let message = `Hi, it's ${userName}. I'm in danger and need help.`;
  if (coords) {
    message += ` My location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  } else {
    message += ' My location could not be determined.';
  }

  // Send to emergency contacts
  for (const phone of securityPhones) {
    if (!phone) {
      console.warn('⚠️ Skipping security phone with missing number');
      continue;
    }
    console.log(`📞 Sending SMS to security company: ${phone}`);
    await sendSms(phone, message);
  }
  

  // Send to security companies
  for (const phone of securityPhones) {
    if (!phone) {
      console.warn('⚠️ Skipping security phone with missing number');
      continue;
    }
    await sendSms(phone, message);
  }
};

// Public exports
export const triggerShakeManually = async (userName: string) => {
  await sendEmergencySms(userName);
};

export const triggerEmergencySms = async (userName: string) => {
  await sendEmergencySms(userName);
};

export const setupShakeListener = (
  contacts: { phone: string; name: string }[],
  userName: string
) => {
  cachedContacts = contacts;

  const subscription = Shake.addListener(() => {
    triggerShakeManually(userName);
  });

  return () => subscription.remove();
};
