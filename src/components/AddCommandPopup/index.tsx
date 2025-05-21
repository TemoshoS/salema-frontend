import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';

import {OfficerType} from '../../types';
import {VOICE_OFF, VOICE_ON} from '../../constants/assets';

type UpdateRequestProps = {
  modalVisible: boolean;
  recognizedText: string;
  onClosePressed: () => void;
  onSuccess: () => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
};

const AddCommandPopup: React.FC<UpdateRequestProps> = ({
  modalVisible,
  recognizedText,
  onClosePressed,
  onSuccess,
  isListening,
  startListening,
  stopListening,
}) => {
  const dispatch = useAppDispatch();

  const handleSave = () => {
    // Handle save action here
    // console.log({status, selectedOfficers, comments});
    // dispatch(
    //   updateServiceRequests({
    //     serviceRequestId: serviceReqID,
    //     status: status.toLowerCase(),
    //     assignedOfficers: selectedOfficers.map(item => item._id),
    //     body: comments,
    //   }),
    // );
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => onClosePressed()}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={styles.title}>Add Voice Command</Text>
              <TouchableOpacity onPress={() => onClosePressed()}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
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
                {isListening
                  ? 'Listening...'
                  : 'Click button to start recording'}
              </Text>
              <Text>{recognizedText}</Text>
            </View>
            {/* Save Button */}
            <View style={styles.saveButtonContainer}>
              <Button title="Save" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddCommandPopup;
