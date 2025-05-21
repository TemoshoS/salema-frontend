import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import Voice from '@react-native-voice/voice';
import styles from './styles';
import AddCommandPopup from '../../components/AddCommandPopup';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getEmergencyContacts} from '../../redux/emergencyContactSlice';
import {VOICE_OFF, VOICE_ON} from '../../constants/assets';
import Header from '../../components/Header';
import {
  createvoiceCommands,
  resetPage,
  updateVoiceCommands,
} from '../../redux/voiceNoteSlice';
import {useNavigation} from '@react-navigation/native';
const DEFAULT_VALUE = 'Select an emergency contact';

interface EmergencyContactTypes {
  _id: string;
  client: string;
  createdAt: string;
  email: string;
  isDeleted: boolean;
  name: string;
  phone: string;
  voiceCommandText: string;
  relationship: string;
  updatedAt: string;
}

const VoiceCommand = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [selectedEmergencyContact, setSelectedEmergencyContact] =
    useState<EmergencyContactTypes>({
      _id: '',
      client: '',
      createdAt: '',
      email: '',
      isDeleted: false,
      name: DEFAULT_VALUE,
      phone: '',
      voiceCommandText: '',
      relationship: '',
      updatedAt: '',
    });
  const {emergencyContacts} = useAppSelector(state => state.emergencyContacts);
  const {success, voiceCommands} = useAppSelector(state => state.voiceCommand);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    dispatch(getEmergencyContacts());
  }, []);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  // console.log('voiceCommands', voiceCommands);
  useEffect(() => {
    if (success) {
      dispatch(resetPage());
      Alert.alert('', `Voice Note Added for ${selectedEmergencyContact.name}`);
      navigation.goBack();
    }
  }, [success]);

  // useEffect(() => {
  //   const selectedID = voiceCommands.filter(
  //     item => item.emergencyContact?._id === selectedEmergencyContact._id,
  //   )[0]._id;
  //   console.log('selectedID', selectedID);
  // }, [selectedEmergencyContact]);

  const onSpeechResults = event => {
    const text = event.value[0];

    setRecognizedText(text);

    stopListening();
  };

  const onSpeechError = error => {
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      setRecognizedText('');
      await Voice.start('en-US'); // Set the language for recognition
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };
  const onSaveVoiceNotePressed = () => {
    console.log('sdfsdf', selectedEmergencyContact.voiceCommandText);
    selectedEmergencyContact.voiceCommandText === ''
      ? dispatch(
          createvoiceCommands({
            text: recognizedText,
            type: '',
            emergencyContact: selectedEmergencyContact?._id,
          }),
        )
      : dispatch(
          updateVoiceCommands({
            text: recognizedText,
            type: '',
            emergencyContact: voiceCommands.filter(
              item =>
                item.emergencyContact?._id === selectedEmergencyContact._id,
            )[0]._id,
          }),
        );
  };
  return (
    <View style={styles.container}>
      <Header title="Add Voice Command" />
      <Text style={styles.label}>Emergency Contact</Text>
      <TouchableOpacity
        onPress={() => setDropDownOpen(val => !val)}
        style={styles.dropDown}>
        <Text style={styles.emergencyContactSelected}>
          {selectedEmergencyContact.name
            ? selectedEmergencyContact.name
            : DEFAULT_VALUE}
        </Text>
      </TouchableOpacity>
      {isDropDownOpen
        ? emergencyContacts?.map(item => (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                setSelectedEmergencyContact(item);
                setDropDownOpen(false);
              }}
              style={{
                borderWidth: 1,
                borderColor: '#d3d3d3',
                padding: 12,
                borderRadius: 5,
                marginHorizontal: 10,
                marginBottom: 1,
                backgroundColor: item.voiceCommandText !== '' ? 'green' : 'red',
              }}>
              <Text style={styles.emergencyContactText}>{item.name}</Text>
            </TouchableOpacity>
          ))
        : null}
      {selectedEmergencyContact.name !== DEFAULT_VALUE ? (
        <>
          <Text style={styles.voiceCommandHeader}>
            {selectedEmergencyContact.voiceCommandText === ''
              ? `Add a voice command for ${selectedEmergencyContact.name}`
              : `Update the voice command for ${selectedEmergencyContact.name}`}
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                isListening ? stopListening : startListening();
              }}>
              <Image
                source={isListening ? VOICE_ON : VOICE_OFF}
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
            <Text style={styles.speakText}>
              {isListening ? 'Listening...' : 'Click button to start recording'}
            </Text>
            <Text>{recognizedText}</Text>
          </View>
          {recognizedText !== '' ? (
            <>
              <Text style={styles.commandCorrectText}>
                Is this correct command?
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={onSaveVoiceNotePressed}
                  style={styles.verifyButton}>
                  <Text style={styles.buttonText}>Yes, Save it</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={startListening}
                  style={styles.deleteButton}>
                  <Text style={styles.buttonText}>No, Record Again</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </>
      ) : null}

      <AddCommandPopup
        modalVisible={showPopup}
        recognizedText={recognizedText}
        startListening={() => startListening()}
        stopListening={() => stopListening()}
        onClosePressed={() => setShowPopup(false)}
        onSuccess={() => {}}
        isListening={isListening}
      />
    </View>
  );
};

export default VoiceCommand;
