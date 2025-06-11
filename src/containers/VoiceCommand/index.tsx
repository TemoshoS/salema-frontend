import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Button, Alert, View, Text, PermissionsAndroid, Platform, ScrollView } from 'react-native';
import Voice from '@react-native-voice/voice';
import axiosInstance from '../../utils/axiosInstance';

const VoiceCommand = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [commands, setCommands] = useState([]);
 

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    fetchCommands();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio.',
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
    }
    return true;
  };

  const onSpeechResults = async (e: any) => {
    const spokenText = e.value?.[0]?.toLowerCase() || '';
    console.log('Processed text:', spokenText);

    if (!spokenText) {
      Alert.alert('No phrase detected');
      setIsRecording(false);
      return;
    }

    try {
      const res = await axiosInstance.post('/voice-command/v1/save-recording', {
        phrase: spokenText,
      });

      const { recognized, message } = res.data;

      if (recognized) {
        Alert.alert('Saved', message || `"${spokenText}" saved successfully!`);
      } else {
        Alert.alert('Notice', message || `Saved phrase: "${spokenText}" (unrecognized command)`);
      }

      fetchCommands(); // Refresh list
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save phrase');
    } finally {
      setIsRecording(false);
    }
  };

  const onSpeechError = (e: any) => {
    console.log('Speech recognition error:', e.error);
    Alert.alert('Speech Error', e.error.message || 'Unknown error');
    setIsRecording(false);
  };

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required.');
      return;
    }

    try {
      setIsRecording(true);
      await Voice.start('en-US');
      console.log('Started listening...');
    } catch (error) {
      console.error('Voice start error:', error);
      setIsRecording(false);
      Alert.alert('Error', 'Could not start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      console.log('Stopped listening...');
    } catch (error) {
      console.error('Voice stop error:', error);
      Alert.alert('Error', 'Could not stop recording');
    }
  };

  const fetchCommands = async () => {
    try {
      
const response = await axiosInstance.get(`/voice-command/v1/client`);
      setCommands(response.data.voiceCommands || []);
      console.log('Fetched commands:', response.data.voiceCommands);
    } catch (error) {
      console.error('Error fetching commands:', error);
      Alert.alert('Error', 'Failed to fetch voice commands.');
    }
  };
  

  return (
    <ScrollView style={{ flex: 1 }}>
    <Header title="Voice Command" />
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}>Tap to record a trigger phrase:</Text>

      {!isRecording ? (
        <Button title="Start Recording" onPress={startRecording} />
      ) : (
        <Button title="Stop Recording" color="red" onPress={stopRecording} />
      )}

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Saved Voice Commands:
        </Text>
        {commands.length > 0 ? (
          commands.map((cmd: any) => (
            <Text key={cmd._id} style={{ color: 'black' }}>
            • {cmd.text}
          </Text>
          ))
        ) : (
          <Text>No voice commands found.</Text>
        )}
      </View>
      </View>
    </ScrollView>
  );
};

export default VoiceCommand;