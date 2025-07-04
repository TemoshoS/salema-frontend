import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  PermissionsAndroid,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header';
import Voice from '@react-native-voice/voice';
import axiosInstance from '../../utils/axiosInstance';
import { triggerEmergencySms } from '../../utils/shake';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface VoiceCommand {
  _id: string;
  text: string;
  type?: string;
}

const SaveVoicePhrase = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [newCommand, setNewCommand] = useState('');
  const userName = useSelector((state: RootState) => state.auth?.userDetails?.name || 'User');

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
      autoListen();
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

    const matchedCommand = commands.find(cmd =>
      spokenText.split(' ').some(word => word === cmd.text.toLowerCase())
    );

    if (matchedCommand) {
      triggerAction(matchedCommand.text);
    } else {
      console.log('No command matched');
    }

    restartListening();
  };

  const triggerAction = async (phrase: string) => {
    Alert.alert('Trigger Phrase Detected', `"${phrase}" matched! Sending emergency SMS...`);
    try {
      await triggerEmergencySms(userName);
    } catch (error) {
      console.error('Failed to trigger emergency SMS:', error);
    }
  };

  const handleSpeechError = (e: any) => {
    console.error('Speech error:', e.error);
    restartListening();
  };

  const fetchCommands = async () => {
    try {
      const response = await axiosInstance.get(`/voice-command/v1/client`);
      const voiceCmds = response.data.voiceCommands || [];
      setCommands(voiceCmds);
      console.log('Commands loaded:', voiceCmds);
    } catch (error) {
      console.error('Failed to fetch commands:', error);
    }
  };

  const saveNewCommand = async () => {
    const trimmed = newCommand.trim().toLowerCase();

    if (!trimmed) {
      return Alert.alert('Error', 'Please enter a valid phrase.');
    }

    if (commands.length >= 5) {
      return Alert.alert('Limit Reached', 'You can only save up to 5 voice phrases.');
    }

    if (commands.some(cmd => cmd.text.toLowerCase() === trimmed)) {
      return Alert.alert('Duplicate Phrase', 'This phrase is already saved.');
    }

    try {
      const res = await axiosInstance.post(`/voice-command/v1/client`, { text: trimmed });
      const saved = res.data.data;
      setCommands(prev => [...prev, saved]);
      setNewCommand('');
      Alert.alert('Success', `"${trimmed}" has been saved.`);
    } catch (err) {
      console.error('Failed to save new command:', err);
      Alert.alert('Error', 'Failed to save new command.');
    }
  };

  const deleteCommand = async (id: string) => {
    try {
      await axiosInstance.delete(`/voice-command/v1/client/hard-delete/${id}`);
      setCommands(prev => prev.filter(cmd => cmd._id !== id));
      Alert.alert('Deleted', 'Voice command deleted successfully.');
    } catch (err) {
      console.error('Failed to delete command:', err);
      Alert.alert('Error', 'Failed to delete voice command.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1 }}>
        <Header title="Voice Command Listener" />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}>
            Listening for saved voice phrases:
          </Text>

          <Text style={{ color: isRecording ? 'green' : 'red', marginBottom: 20 }}>
            Status: {isRecording ? 'Listening...' : 'Not Listening'}
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Saved Voice Commands:
            </Text>
            {commands.length > 0 ? (
              commands.map((cmd) => (
                <View key={cmd._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ flex: 1, color: 'black' }}>• {cmd.text}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert('Confirm Delete', 'Are you sure you want to delete this phrase?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', onPress: () => deleteCommand(cmd._id), style: 'destructive' },
                      ])
                    }>
                    <Text style={{ color: 'red' }}>Delete</Text>
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
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Add New Voice Phrase:</Text>
            <TextInput
              value={newCommand}
              onChangeText={setNewCommand}
              placeholder="Enter a phrase (e.g. help me)"
              style={{
                borderColor: 'gray',
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
                color: 'black',
              }}
            />
            <Button title="Save Command" onPress={saveNewCommand} disabled={commands.length >= 5} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SaveVoicePhrase;
