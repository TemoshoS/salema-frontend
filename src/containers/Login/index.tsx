import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import styles from './styles';
import Header from '../../components/Header';
import FormTextInput from '../../components/FormTextInput';
import LogoBanner from '../../components/LogoBanner';
import CommonButton from '../../components/CommonButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {login, resetPage} from '../../redux/authSlice';
import {validateEmail} from '../../utils/helper';

export default function Login() {
  // const [email, setEmail] = useState('client1@mail.com');
  // const [password, setPassword] = useState('clientpass1');
  // const [email, setEmail] = useState('company@mail.com');
  // const [password, setPassword] = useState('companypass1');

  const [email, setEmail] = useState('admin@mail.com');
  const [password, setPassword] = useState('adminpass');
  // const [email, setEmail] = useState('officer@mail.com');
  // const [password, setPassword] = useState('officerpass');

  const dispatch = useAppDispatch();
  const {error} = useAppSelector(state => state.auth);
  useEffect(() => {
    if (error) {
      // Alert.alert('', error.message);
      dispatch(resetPage());
    }
  }, [error]);

  const onLoginPressed = () => {
    if (email === '' && password === '') {
      Alert.alert('Please fill all the details');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email address');
      return;
    }

    dispatch(login({email: email, password}));
  };

  return (
    <View style={styles.container}>
      <View>
        <Header title={''} />
        <LogoBanner />
        <FormTextInput
          label="Email"
          value={email}
          onTextChanged={(text: string) => setEmail(text)}
        />
        <FormTextInput
          label="Password"
          value={password}
          isPassword
          onTextChanged={(text: string) => setPassword(text)}
        />
        <CommonButton needTopSpace text="LOG IN" onPress={onLoginPressed} />
      </View>
      <View style={styles.footer}>
        <Text>Forgot your password?</Text>
      </View>
    </View>
  );
}
//
