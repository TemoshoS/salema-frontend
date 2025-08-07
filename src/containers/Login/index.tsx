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
import messaging from '@react-native-firebase/messaging';
import {registerDevice} from '../../redux/authSlice';

export default function Login() {
  const [email, setEmail] = useState('admin@mail.com');
  const [password, setPassword] = useState('adminpass');

  const dispatch = useAppDispatch();
  const {error, loading} = useAppSelector(state => state.auth);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (error) {
      if (error.status === 403) {
        Alert.alert('Not Verified', error.message);
      } else if (error.status === 404) {
        Alert.alert('Login Failed', 'Account not found.');
      } else {
        Alert.alert('Login Failed', error.message || 'Something went wrong.');
      }
  
      dispatch(resetPage());
    }
  }, [error]);
  
  

  const onLoginPressed = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in both email and password.');
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
  
    try {
      // Step 1: Dispatch login and wait for result
      const resultAction = await dispatch(login({email, password}));
  
      if (login.fulfilled.match(resultAction)) {
        // Step 2: Get the access token
        const accessToken = resultAction.payload?.access_token;
  
        // Step 3: Get the FCM token from Firebase
        const fcmToken = await messaging().getToken();
  
        // Step 4: Register the device with backend
        if (fcmToken && accessToken) {
          await dispatch(
            registerDevice({
              fcmToken,
              configuration: `Bearer ${accessToken}`,
            }),
          );
        }
      } else if (login.rejected.match(resultAction)) {
        // This will be handled by useEffect, so no need to do anything here.
      }
    } catch (error) {
      console.error('Login or FCM setup error:', error);
      Alert.alert('Error', 'Something went wrong during login.');
    }
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
          
              <CommonButton needTopSpace text="LOG IN" onPress={onLoginPressed} />
           

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
