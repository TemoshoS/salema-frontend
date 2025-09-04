/**
 * @format
 */
import './gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import App from './App';
import { name as appName } from './app.json';

// --- Create Android channel once at startup ---
PushNotification.createChannel(
  {
    channelId: 'danger-alerts',
    channelName: 'Danger Alerts',
    importance: 4,      // high
    vibrate: true,
    soundName: 'default',
  },
  (created) => console.log(`📣 danger-alerts channel ${created ? 'created' : 'exists'}`)
);

// --- (Optional) simple de-dupe helper by messageId ---
const seen = new Set();
function shouldNotify(id) {
  if (!id) return true;         // allow if no id is provided
  if (seen.has(id)) return false;
  seen.add(id);
  setTimeout(() => seen.delete(id), 60_000); // expire after 60s
  return true;
}

// --- Background handler: runs when app is quit or in background ---
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  try {
    if (!shouldNotify(remoteMessage?.messageId)) return;

    const title =
      remoteMessage?.data?.title ||
      remoteMessage?.notification?.title ||
      'Danger Zone Alert';

    const message =
      remoteMessage?.data?.body ||
      remoteMessage?.notification?.body ||
      'You are near a danger zone!';

    PushNotification.localNotification({
      channelId: 'danger-alerts',
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      // collapse/group so repeats don’t spam
      tag: remoteMessage?.data?.collapseKey || 'danger-zone',
      group: 'danger-zone',
      // optional: use a constant id to replace previous notification instead of stacking
      // id: 777,
    });
  } catch (e) {
    console.log('BG message handler error:', e);
  }
});

AppRegistry.registerComponent(appName, () => App);
