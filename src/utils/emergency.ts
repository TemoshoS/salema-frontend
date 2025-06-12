import { store } from '../redux/store';
import { Alert } from 'react-native';
import Shake from 'react-native-shake';
import { getCurrentLocation, requestLocationPermission } from './location';
import { sendSms } from './sms';

let cachedContacts: { phone: string; name: string }[] = [];

const sendEmergencySms = async (userName: string) => {
  const securityPhones = store.getState().securityCompany.phones.map(p => p.phone);

  if (cachedContacts.length === 0 && securityPhones.length === 0) {
    Alert.alert('No emergency contacts or security companies set.');
    return;
  }

  Alert.alert('Sending emergency SMS...');

  const hasPermission = await requestLocationPermission();
  const coords = hasPermission ? await getCurrentLocation() : null;

  let message = `Hi, it's ${userName}. I'm in danger and need help.`;
  message += coords
    ? ` My location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
    : ' My location could not be determined.';

  const allPhones = [...cachedContacts.map(c => c.phone), ...securityPhones];

  for (const phone of new Set(allPhones)) {
    if (phone?.trim()) {
      await sendSms(phone, message);
    }
  }
};

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
