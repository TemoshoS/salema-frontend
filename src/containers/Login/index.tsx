import React, {useEffect, useState} from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import Header from '../../components/Header';
import FormTextInput from '../../components/FormTextInput';
import LogoBanner from '../../components/LogoBanner';
import CommonButton from '../../components/CommonButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {login, resetPage} from '../../redux/authSlice';
import {validateEmail} from '../../utils/helper';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types';
import axiosInstance from '../../utils/axiosInstance'; 

export default function Login() {
  const [email, setEmail] = useState('admin@mail.com');
  const [password, setPassword] = useState('adminpass');

  const dispatch = useAppDispatch();
  const {error, loading} = useAppSelector(state => state.auth);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (error) {
      dispatch(resetPage());
    }
  }, [error]);

  const onLoginPressed = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both email and password.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    dispatch(login({email, password}));
  };

  const onForgotPassword = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email to reset your password.');
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/user/v1/forgot-password', { email });
      const { resetToken } = response.data;
  
      navigation.navigate('SetNewPassword', { email, token: resetToken });
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{flex: 1}}>
        <Header title="" />
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
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
          <View style={{marginTop: 20}}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="green" />
                <Text style={{textAlign: 'center', marginTop: 10}}>Logging in...</Text>
              </>
            ) : (
              <CommonButton needTopSpace text="LOG IN" onPress={onLoginPressed} />
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={{color: '#20C997'}}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
