import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Voice from '@react-native-voice/voice';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {VOICE_OFF, VOICE_ON} from '../../constants/assets';
import Header from '../../components/Header';
import {
  getvoiceCommands,
  sendAlertToEmergencyContact,
} from '../../redux/voiceNoteSlice';
import {VoiceCommandsType} from '../../types';
import GetLocation from 'react-native-get-location';

interface Output {
  [key: string]: {id: string; name: string};
}

const CallEmergencyService = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const {voiceCommands} = useAppSelector(state => state.voiceCommand);

  const dispatch = useAppDispatch();

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      stopListening();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (voiceCommands.length > 0) {
      startListening();
    }
  }, [voiceCommands]);

  // useEffect(() => {
  //   dispatch(getvoiceCommands());
  // }, []);

  const onSpeechResults = async (event: any) => {
    console.log('voiceCommands text:', {voiceCommands});
    const result = await voiceCommands.reduce(
      (acc: Output, item: VoiceCommandsType) => {
        if (item.emergencyContact) {
          acc[item.text.toLowerCase()] = {
            id: item.emergencyContact._id,
            name: item.emergencyContact.name,
          };
        }
        return acc;
      },
      {},
    );

    const text = event.value[0].toLowerCase();
    console.log('Processed text:', {text, result});
    if (result[text] !== undefined) {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(coordinate => {
          console.log(coordinate);
          const body = {
            location: {
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            },
            emergencyID: result[text].id,
          };
          dispatch(sendAlertToEmergencyContact(body));
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });

      setRecognizedText(
        `Panic Alert is being sent to ${result[text].name} ..please hold on`,
      );
    } else {
      setRecognizedText(`Unrecognized command: "${text}"`);
    }

    stopListening();
  };

  const onSpeechError = (error: any) => {
    setIsListening(false);
    console.log('Speech recognition error:', error);
  };

  const startListening = async () => {
    try {
      console.log('Starting listening...');
      setIsListening(true);
      setRecognizedText('');
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      console.log('Stopping listening...');
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.log('Error stopping voice recognition:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Call Emergency Contact" />
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            isListening ? stopListening() : startListening();
          }}>
          <Image
            source={isListening ? VOICE_ON : VOICE_OFF}
            style={{width: 50, height: 50}}
          />
        </TouchableOpacity>
        <Text style={styles.speakText}>
          {isListening ? 'Listening...' : ''}
        </Text>
        <Text style={styles.speakText}>{recognizedText}</Text>
      </View>
    </View>
  );
};

export default CallEmergencyService;
