import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
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
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContactData>({
    email: '',
    name: '',
    relationship: '',
    phone: '',
  });

  const [countryCode, setCountryCode] = useState<CountryCode>('ZA');
  const [callingCode, setCallingCode] = useState('27');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const {success} = useAppSelector(state => state.emergencyContacts);

  useEffect(() => {
    if (success) {
      onSuccess();
      dispatch(resetPage());
    }
  }, [success]);

  const handleSave = () => {
    const { name, email, relationship, phone } = emergencyContact;
  
    if (!name || !email || !relationship || !phone) {
      Alert.alert('', PLEASE_FILL_ALL_THE_FIELDS);
      return;
    }
  
    // Remove any non-digit characters (like spaces, dashes)
    const cleanedPhone = phone.replace(/\D/g, '');
  
    // Remove leading zero if present
    const sanitizedPhone = cleanedPhone.startsWith('0')
      ? cleanedPhone.substring(1)
      : cleanedPhone;
  
    const fullPhone = `+${callingCode}${sanitizedPhone}`;
  
    dispatch(
      createEmergencyContacts({
        email,
        name,
        relationship,
        phone: fullPhone,
      }),
    );

    
  };
  

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onClosePressed}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Emergency Contact</Text>
              <TouchableOpacity onPress={onClosePressed}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>

            <FormTextInput
              label="Name"
              value={emergencyContact.name}
              onTextChanged={text =>
                setEmergencyContact({...emergencyContact, name: text})
              }
            />

            <FormTextInput
              label="Email"
              value={emergencyContact.email}
              onTextChanged={text =>
                setEmergencyContact({...emergencyContact, email: text})
              }
            />

            <FormTextInput
              label="Relationship"
              value={emergencyContact.relationship}
              onTextChanged={text =>
                setEmergencyContact({...emergencyContact, relationship: text})
              }
            />

<View style={styles.phoneInputContainer}>
  <TouchableOpacity
    onPress={() => setShowCountryPicker(true)}
    style={styles.flagContainer}>
    <CountryPicker
      withFilter
      withCallingCode
      withFlag
      withEmoji
      countryCode={countryCode}
      onSelect={onSelectCountry}
      visible={showCountryPicker}
      onClose={() => setShowCountryPicker(false)}
    />
  </TouchableOpacity>

  <View style={styles.phoneInputWrapper}>
    <Text style={styles.prefix}>+{callingCode}</Text>
    <TextInput
      style={styles.phoneTextInput}
      keyboardType="phone-pad"
      placeholder="Enter phone number"
      value={emergencyContact.phone}
      onChangeText={text =>
        setEmergencyContact({...emergencyContact, phone: text})
      }
    />
  </View>
</View>


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
