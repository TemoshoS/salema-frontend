import React, { useEffect, useState } from 'react';
import { Alert, View, PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import axiosInstance from '../../utils/axiosInstance';
import { triggerEmergencySms } from '../../utils/shake';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AutoVoiceListener = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);

  useEffect(() => {
    Voice.onSpeechResults = handleSpeechResults;
    Voice.onSpeechError = handleSpeechError;
    fetchCommands();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (commands.length > 0) {
      autoListen(); // Start auto listening when commands are loaded
    }
  }, [commands]);

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
    return true;
  };

  const autoListen = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    try {
      await Voice.start('en-US');
      setIsRecording(true);
      console.log('Auto listening started...');
    } catch (err) {
      console.error('Auto listen start error:', err);
    }
  };

  const restartListening = async () => {
    try {
      await Voice.stop();
      await Voice.start('en-US');
      console.log('Restarted listening...');
    } catch (err) {
      console.error('Restart error:', err);
    }
  };

  const handleSpeechResults = (e: any) => {
    const spokenText = e.value?.[0]?.toLowerCase().trim() || '';
    console.log('Heard:', spokenText);

    const matchedCommand = commands.find(cmd => {
      const phrase = cmd.toLowerCase().trim();
      return spokenText.includes(phrase) || phrase.includes(spokenText);
    });

    if (matchedCommand) {
      triggerAction(matchedCommand);
    } else {
      console.log('No command matched');
    }

    restartListening(); // Always restart listening
  };

  const triggerAction = async (phrase: string) => {
    Alert.alert('Trigger Phrase Detected', `"${phrase}" matched! Sending emergency SMS...`);
    console.log('Triggering emergency SMS...');

    try {
      await triggerEmergencySms();
    } catch (error) {
      console.error('Failed to trigger emergency SMS:', error);
    }
  };

  const handleSpeechError = (e: any) => {
    console.error('Speech error:', e.error);
    restartListening(); // Attempt to recover listening
  };

  const fetchCommands = async () => {
    try {
      const response = await axiosInstance.get(`/voice-command/v1/client`);
      const voiceCmds = response.data.voiceCommands || [];
      const phrases = voiceCmds.map((cmd: any) => cmd.text.toLowerCase());
      setCommands(phrases);
      console.log('Commands loaded:', phrases);
    } catch (error) {
      console.error('Failed to fetch commands:', error);
    }
  };

  return (
    <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 999 }}>
      <MaterialIcons name="mic" size={30} color={isRecording ? 'red' : 'grey'} />
    </View>
  );
};

export default AutoVoiceListener;
