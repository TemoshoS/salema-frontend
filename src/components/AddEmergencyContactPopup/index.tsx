import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import styles from './styles';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  createEmergencyContacts,
  resetPage,
} from '../../redux/emergencyContactSlice';
import FormTextInput from '../FormTextInput';
import {PLEASE_FILL_ALL_THE_FIELDS} from '../../constants/constants';

type AddEmergencyContactProps = {
  modalVisible: boolean;

  onClosePressed: () => void;
  onSuccess: () => void;
};

interface EmergencyContactData {
  email: string;
  name: string;
  relationship: string;
  phone: string;
}
const AddEmergencyContactPopup: React.FC<AddEmergencyContactProps> = ({
  modalVisible,
  onClosePressed,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [emergencyContact, setEmergenctContact] =
    useState<EmergencyContactData>({
      email: '',
      name: '',
      relationship: '',
      phone: '',
    });
  const {success} = useAppSelector(state => state.emergencyContacts);

  useEffect(() => {
    if (success) {
      onSuccess();
      dispatch(resetPage());
    }
  }, [success]);

  const handleSave = () => {
    const {name, email, relationship, phone} = emergencyContact;

    if (name === '' || email === '' || relationship === '' || phone === '') {
      Alert.alert('', PLEASE_FILL_ALL_THE_FIELDS);
    }
    dispatch(
      createEmergencyContacts({
        email: email,
        name: name,
        relationship: relationship,
        phone: phone,
      }),
    );
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
            <View style={styles.header}>
              <Text style={styles.title}>Add Emergency Contact</Text>
              <TouchableOpacity onPress={() => onClosePressed()}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            <FormTextInput
              label="Name"
              value={emergencyContact.name}
              onTextChanged={text =>
                setEmergenctContact({...emergencyContact, name: text})
              }
            />
            <FormTextInput
              label="Email"
              value={emergencyContact.email}
              onTextChanged={text =>
                setEmergenctContact({...emergencyContact, email: text})
              }
            />
            <FormTextInput
              label="Relationship"
              value={emergencyContact.relationship}
              onTextChanged={text =>
                setEmergenctContact({...emergencyContact, relationship: text})
              }
            />
            <FormTextInput
              label="Phone"
              value={emergencyContact.phone}
              onTextChanged={text =>
                setEmergenctContact({...emergencyContact, phone: text})
              }
            />
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

export default AddEmergencyContactPopup;
