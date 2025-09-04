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
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.title}>Add Emergency Contact</Text>
      <TouchableOpacity onPress={onClosePressed}>
        <Text style={styles.closeButton}>X</Text>
      </TouchableOpacity>
    </View>

    {/* Name Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.textInput}
        value={emergencyContact.name}
        onChangeText={text => setEmergencyContact({...emergencyContact, name: text})}
        placeholder="Enter full name"
      />
    </View>

    {/* Email Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.textInput}
        value={emergencyContact.email}
        onChangeText={text => setEmergencyContact({...emergencyContact, email: text})}
        placeholder="Enter email"
        keyboardType="email-address"
      />
    </View>

    {/* Relationship Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Relationship</Text>
      <TextInput
        style={styles.textInput}
        value={emergencyContact.relationship}
        onChangeText={text => setEmergencyContact({...emergencyContact, relationship: text})}
        placeholder="e.g., Father, Sister"
      />
    </View>

    {/* Phone Input */}
    <View style={styles.phoneInputContainer}>
      <TouchableOpacity style={styles.flagContainer} onPress={() => setShowCountryPicker(true)}>
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
      <Text style={styles.prefix}>+{callingCode}</Text>
      <TextInput
        style={styles.phoneTextInput}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
        value={emergencyContact.phone}
        onChangeText={text => setEmergencyContact({...emergencyContact, phone: text})}
      />
    </View>

    {/* Save Button */}
    <TouchableOpacity style={styles.saveButtonContainer} onPress={handleSave}>
      <View style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </View>
    </TouchableOpacity>
  </View>
</View>

      </Modal>
    </View>
  );
};

export default AddEmergencyContactPopup;
