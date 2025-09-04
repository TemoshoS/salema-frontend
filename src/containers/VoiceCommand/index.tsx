// SaveVoicePhrase.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  PermissionsAndroid,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header';
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import axiosInstance from '../../utils/axiosInstance';
import { triggerEmergencySms } from '../../utils/shake';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import styles from './styles';

interface VoiceCommand {
  _id: string;
  text: string;
  type?: string;
}

// ---------- helpers ----------
const normalize = (s: string) =>
  (s ?? '')
    .toLowerCase()
    .trim()
    // strip punctuation but keep letters/numbers/spaces (unicode-friendly)
    .replace(/[^\p{L}\p{N}\s]/gu, '');

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const makeWordBoundaryRegex = (phrase: string) =>
  new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'i');

const RN_LOCALE = 'en-ZA'; // better ZA recognition

const SaveVoicePhrase = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [newCommand, setNewCommand] = useState('');

  const userName =
    useSelector((state: RootState) => state.auth?.userDetails?.name) || 'User';

  // useRef to hold latest commands in handlers without stale closures
  const commandsRef = useRef<VoiceCommand[]>([]);
  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  // ---------- permissions ----------
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone to recognize speech.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS: make sure Info.plist includes:
    // NSMicrophoneUsageDescription and NSSpeechRecognitionUsageDescription
    return true;
  };

  // ---------- lifecycle wiring ----------
  useEffect(() => {
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechPartialResults = handleSpeechPartialResults;
    Voice.onSpeechError = handleSpeechError;
    Voice.onSpeechEnd = handleSpeechEnd;
    Voice.onSpeechStart = () => setRecognizing(true);

    fetchCommands();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start listening automatically once commands are available
  useEffect(() => {
    if (commands.length > 0) {
      autoListen();
    } else {
      setIsRecording(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands.length]);

  // ---------- listening controls ----------
  const autoListen = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;
    if (recognizing) return; // guard

    try {
      await Voice.start(RN_LOCALE);
      setRecognizing(true);
      setIsRecording(true);
      console.log('Auto listening started...');
    } catch (err) {
      console.error('Auto listen start error:', err);
    }
  };

  const handleSpeechEnd = () => {
    setRecognizing(false);
    // Note: onSpeechEnd fires after stop/cancel—flag shows mic is free to start again.
  };

  const safeRestartListening = async () => {
    if (isRestarting) return;
    setIsRestarting(true);

    try {
      if (recognizing) {
        try {
          await Voice.stop();
        } catch {
          // ignore
        }
      }
    } finally {
      // small backoff prevents "client side error" storms
      setTimeout(async () => {
        try {
          await autoListen();
        } finally {
          setIsRestarting(false);
        }
      }, 1000);
    }
  };

  // ---------- ASR handlers ----------
  const tryMatch = (raw: string) => {
    const spokenText = normalize(raw);
    console.log('Heard:', spokenText);

    const matched = commandsRef.current.find((cmd) => {
      if (!cmd?.text) return false;
      // commands are normalized when loaded
      const re = makeWordBoundaryRegex(cmd.text);
      return re.test(spokenText) || spokenText.includes(cmd.text);
    });

    if (matched) {
      triggerAction(matched.text);
      return true;
    }

    console.log('No command matched');
    return false;
  };

  const handleSpeechResults = (e: SpeechResultsEvent) => {
    const best = e?.value?.[0] ?? '';
    tryMatch(best);
    safeRestartListening();
  };

  const handleSpeechPartialResults = (e: SpeechResultsEvent) => {
    const best = e?.value?.[0] ?? '';
    // If partial already matches, trigger early and restart
    if (tryMatch(best)) {
      safeRestartListening();
    }
  };

  const handleSpeechError = (e: SpeechErrorEvent) => {
    console.error('Speech error:', e?.error || e);
    // code 7 = no match (silence/noise); code 5 = client-side/sequence error
    safeRestartListening();
  };

  // ---------- actions ----------
  const triggerAction = async (phrase: string) => {
    Alert.alert(
      'Trigger Phrase Detected',
      `"${phrase}" matched! Sending emergency SMS...`
    );
    try {
      await triggerEmergencySms(userName);
    } catch (error) {
      console.error('Failed to trigger emergency SMS:', error);
    }
  };

  // ---------- API ----------
  const fetchCommands = async () => {
    try {
      const response = await axiosInstance.get(`/voice-command/v1/client`);
      const voiceCmds: VoiceCommand[] = (response.data?.voiceCommands ?? []).map(
        (c: VoiceCommand) => ({
          ...c,
          text: normalize(c.text),
        })
      );
      setCommands(voiceCmds);
      console.log('Commands loaded (normalized):', voiceCmds);
    } catch (error) {
      console.error('Failed to fetch commands:', error);
    }
  };

  const saveNewCommand = async () => {
    const trimmed = normalize(newCommand);

    if (!trimmed) {
      return Alert.alert('Error', 'Please enter a valid phrase.');
    }
    if (commands.length >= 5) {
      return Alert.alert(
        'Limit Reached',
        'You can only save up to 5 voice phrases.'
      );
    }
    if (commands.some((cmd) => cmd.text === trimmed)) {
      return Alert.alert('Duplicate Phrase', 'This phrase is already saved.');
    }

    try {
      const res = await axiosInstance.post(`/voice-command/v1/client`, {
        text: trimmed,
      });
      const savedServer: VoiceCommand = res.data?.data;
      const saved: VoiceCommand = {
        ...(savedServer || { _id: Date.now().toString(), text: trimmed }),
        text: trimmed, // enforce normalized in state
      };
      setCommands((prev) => [...prev, saved]);
      setNewCommand('');
      Alert.alert('Success', `"${trimmed}" has been saved.`);
    } catch (err) {
      console.error('Failed to save new command:', err);
      Alert.alert('Error', 'Failed to save new command.');
    }
  };

  const deleteCommand = async (id: string) => {
    try {
      await axiosInstance.delete(`/voice-command/v1/hard-delete/${id}`);
      setCommands((prev) => prev.filter((cmd) => cmd._id !== id));
      Alert.alert('Deleted', 'Voice command deleted successfully.');
    } catch (err) {
      console.error('Failed to delete voice command:', err);
      Alert.alert('Error', 'Failed to delete voice command.');
    }
  };

  // ---------- UI ----------
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Header title="Voice Command Listener" />

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.voiceCommandHeader}>
            Listening for saved voice phrases:
          </Text>

          <Text
            style={[
              styles.commandCorrectText,
              { color: isRecording ? 'green' : 'red' },
            ]}
          >
            Status: {isRecording ? 'Listening…' : 'Not Listening'}
          </Text>

          <View>
            <Text style={styles.label}>Saved Voice Commands:</Text>

            {commands.length > 0 ? (
              commands.map((cmd) => (
                <View key={cmd._id} style={styles.cardView}>
                  <Text style={{ flex: 1,color: 'gray' }}>{cmd.text}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        'Confirm Delete',
                        'Are you sure you want to delete this phrase?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            onPress: () => deleteCommand(cmd._id),
                            style: 'destructive',
                          },
                        ]
                      )
                    }
                  >
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ color: 'gray', marginTop: 10 }}>
                No voice phrases saved. Please add one to start listening.
              </Text>
            )}
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={styles.label}>Add New Voice Phrase:</Text>
            <TextInput
              value={newCommand}
              onChangeText={setNewCommand}
              placeholder='Enter a phrase (e.g. "help me")'
              placeholderTextColor="gray"
              style={[styles.dropDown, { color: '#000' }]}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={saveNewCommand}
            />
            <TouchableOpacity
              style={[styles.verifyButton, { opacity: commands.length >= 5 ? 0.5 : 1 }]}
              disabled={commands.length >= 5}
              onPress={saveNewCommand}
            >
              <Text style={styles.buttonText}>Save Command</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SaveVoicePhrase;
