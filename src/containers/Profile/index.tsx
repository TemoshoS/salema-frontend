import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {useNavigation} from '@react-navigation/native';
import {getClientProfile, updateClientProfile} from '../../redux/profileSlice';

export default function Profile() {
  const [name, setName] = useState<string>('');
  const [surName, setSurname] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contact, setContact] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const {profileDetails} = useAppSelector(state => state.profile);

  useEffect(() => {
    dispatch(getClientProfile());
  }, []);

  useEffect(() => {
    setName(profileDetails.firstName);
    setSurname(profileDetails.surname);
    setAddress(profileDetails.address);
    setContact(profileDetails.contact);
  }, [profileDetails]);
  return (
    <View>
      <Header title="Profile" />

      <FormTextInput
        label="Name"
        value={name}
        onTextChanged={text => setName(text)}
      />
      <FormTextInput
        label="Surname"
        value={surName}
        onTextChanged={text => setSurname(text)}
      />
      <FormTextInput
        label="Contact"
        value={contact}
        onTextChanged={text => setContact(text)}
      />

      <FormTextInput
        label="Address/Location"
        value={address}
        onTextChanged={text => setAddress(text)}
      />
      <CommonButton
        text="Update Profile"
        onPress={() => {
          dispatch(
            updateClientProfile({
              firstName: name,
              surname: surName,
              contact: contact,
              address: address,
            }),
          );
          Alert.alert('', 'Profile Updated Sucessfully');
          navigation.goBack();
        }}
      />
    </View>
  );
}
