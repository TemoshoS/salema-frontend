import React, {useEffect, useState} from 'react';
import {
  Alert,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {register, resetPage} from '../../redux/authSlice';
import {PLEASE_FILL_ALL_THE_FIELDS} from '../../constants/constants';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  surName: string;
  street: string;
  locality: string;
  contact: string;
}

export default function Register() {
  const [registerForm, setRegisterForm] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    surName: '',
    street: '',
    locality: '',
    contact: '',
  });

  const dispatch = useAppDispatch();
  const {error} = useAppSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert('', error.message);
      dispatch(resetPage());
    }
  }, [error]);

  const onSignupPressed = () => {
    const {
      name,
      email,
      password,
      confirmPassword,
      surName,
      street,
      locality,
      contact,
    } = registerForm;

    if (
      !name ||
      !surName ||
      !password ||
      !confirmPassword ||
      !email ||
      !street ||
      !locality ||
      !contact
    ) {
      Alert.alert('', PLEASE_FILL_ALL_THE_FIELDS);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('', 'The password and confirmation password do not match.');
      return;
    }

    dispatch(
      register({
        firstName: name,
        password: password,
        surname: surName,
        email: email,
        address: `${street} ${locality}`,
        role: 'GU',
        contact: contact,
      }),
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{flex: 1}}>
        <Header title="" />
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <FormTextInput
            label="Name"
            value={registerForm.name}
            onTextChanged={text => setRegisterForm({...registerForm, name: text})}
          />
          <FormTextInput
            label="Surname"
            value={registerForm.surName}
            onTextChanged={text => setRegisterForm({...registerForm, surName: text})}
          />
          <FormTextInput
            label="Password"
            value={registerForm.password}
            isPassword
            onTextChanged={text => setRegisterForm({...registerForm, password: text})}
          />
          <FormTextInput
            label="Confirm Password"
            value={registerForm.confirmPassword}
            isPassword
            onTextChanged={text =>
              setRegisterForm({...registerForm, confirmPassword: text})
            }
          />
          <FormTextInput
            label="Email"
            value={registerForm.email}
            onTextChanged={text => setRegisterForm({...registerForm, email: text})}
          />
          <FormTextInput
            label="Contact"
            value={registerForm.contact}
            onTextChanged={text => setRegisterForm({...registerForm, contact: text})}
          />
          <View style={{flexDirection: 'row', width: '90%', alignSelf: 'center'}}>
            <FormTextInput
              label="Street"
              value={registerForm.street}
              isHalfWidth
              onTextChanged={text => setRegisterForm({...registerForm, street: text})}
            />
            <FormTextInput
              label="Locality"
              value={registerForm.locality}
              isHalfWidth
              onTextChanged={text => setRegisterForm({...registerForm, locality: text})}
            />
          </View>
          <CommonButton needTopSpace text="Sign Up" onPress={onSignupPressed} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
