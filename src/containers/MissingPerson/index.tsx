import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import styles from './styles';
import Header from '../../components/Header';
import FormTextInput from '../../components/FormTextInput';
import CommonButton from '../../components/CommonButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {addMissingPersons, resetPage} from '../../redux/missingPersonSlice';
import DateTimePickerComponent from '../../components/DateTimePicker';
import {useNavigation} from '@react-navigation/native';
interface ImagePickerResult {
  fileName?: string;
  fileSize?: number;
  height?: number;
  originalPath?: string;
  type?: string;
  uri?: string;
  width?: number;
}

interface MissingPerson {
  name: string;
  age: string;
  lastSeen: string;
  lastSeenDate: Date;
  contactInfo: string;
  photo?: ImagePickerResult;
}

const MissingPersonEntry: React.FC = () => {
  const navigation = useNavigation();
  const [person, setPerson] = useState<MissingPerson>({
    name: '',
    age: '',
    lastSeen: '',
    lastSeenDate: new Date(),
    contactInfo: '',
  });
  const dispatch = useAppDispatch();
  const isSuccess = useAppSelector(state => state.missingPerson.success);
  useEffect(() => {
    if (isSuccess) {
      dispatch(resetPage());
      Alert.alert('', 'Missing Person Added');
      navigation.goBack();
    }
  }, [isSuccess]);

  const handleChoosePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.assets && response.assets[0].uri) {
        setPerson({...person, photo: response.assets[0]});
      } else {
        Alert.alert('Error', 'Could not load image');
      }
    });
  };

  const handleSave = () => {
    const {name, age, lastSeen, lastSeenDate, contactInfo, photo} = person;
    if (name && age && lastSeen && contactInfo) {
      const formData = new FormData();
      formData.append('personName', name);
      formData.append('age', parseInt(age));
      formData.append('lastSeenDateTime', lastSeenDate.toISOString());
      formData.append('lastSeenLocation', lastSeen);
      formData.append('contact', contactInfo);

      if (photo) {
        formData.append('image', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName,
        });
      }

      dispatch(addMissingPersons(formData));
    } else {
      Alert.alert('Error', 'Please fill all required fields');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Missing Person Details" showButtons={false} />

      <TouchableOpacity
        onPress={handleChoosePhoto}
        style={styles.photoContainer}>
        {person.photo ? (
          <Image source={{uri: person.photo.uri}} style={styles.photo} />
        ) : (
          <Text style={styles.photoPlaceholder}>Tap to add photo</Text>
        )}
      </TouchableOpacity>
      <FormTextInput
        label="Name"
        onTextChanged={text => setPerson({...person, name: text})}
        value={person.name}
      />

      <FormTextInput
        label="Age"
        isNumeric
        onTextChanged={text => setPerson({...person, age: text})}
        value={person.age}
      />

      <FormTextInput
        label="Last Seen Location"
        onTextChanged={text => setPerson({...person, lastSeen: text})}
        value={person.lastSeen}
      />
      <Text style={styles.dateText}>Last Seen Date</Text>
      <DateTimePickerComponent
        onDateChanged={date => {
          setPerson({...person, lastSeenDate: date});
        }}
      />
      <FormTextInput
        label="Contact Information"
        onTextChanged={text => setPerson({...person, contactInfo: text})}
        value={person.contactInfo}
      />
      <CommonButton text="Save Details" onPress={handleSave} needTopSpace />
    </ScrollView>
  );
};

export default MissingPersonEntry;
