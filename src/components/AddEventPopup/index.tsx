import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {createEvent} from '../../redux/eventSlice';

type AddEventPopupProps = {
  modalVisible: boolean;
  requestID: string;
  onClosePressed: () => void;
  onSuccess: () => void;
};

const AddEventPopup: React.FC<AddEventPopupProps> = ({
  requestID,
  modalVisible,
  onClosePressed,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBody, setNewEventBody] = useState('');

  const {createEventSuccess} = useAppSelector(state => state.events);

  useEffect(() => {
    if (createEventSuccess) {
      onSuccess();
    }
  }, [createEventSuccess]);

  const handleCreateEvent = () => {
    if (newEventTitle === '' && newEventBody === '') {
      Alert.alert('', 'Please fill all the details');
      return;
    }
    onClosePressed();
    setNewEventTitle('');
    dispatch(
      createEvent({
        requestID,
        eventData: {eventTitle: newEventTitle, eventBody: newEventBody},
      }),
    );
    console.log('Event Created:', newEventTitle);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => onClosePressed()}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Event Title"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Event Body"
              value={newEventBody}
              onChangeText={setNewEventBody}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.updateButton, {backgroundColor: 'blue'}]}
                onPress={handleCreateEvent}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.updateButton, {backgroundColor: 'red'}]}
                onPress={onClosePressed}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddEventPopup;
