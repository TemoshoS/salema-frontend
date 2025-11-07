import React, { useEffect, useState } from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // <-- import ActivityIndicator
} from 'react-native';
import styles from './styles';
import Header from '../../components/Header';
import FormTextInput from '../../components/FormTextInput';
import LogoBanner from '../../components/LogoBanner';
import CommonButton from '../../components/CommonButton';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { login, resetPage } from '../../redux/authSlice';
import { validateEmail } from '../../utils/helper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import axiosInstance from '../../utils/axiosInstance';
import messaging from '@react-native-firebase/messaging';
import { registerDevice } from '../../redux/authSlice';
import { getEmergencyContacts } from '../../redux/emergencyContactSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { error, loading, userDetails } = useAppSelector(state => state.auth);

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
      const resultAction = await dispatch(login({ email, password }));

      if (login.fulfilled.match(resultAction)) {
        const payload = resultAction.payload as any;
        await dispatch(getEmergencyContacts());
        const accessToken = payload?.access_token;
        const fcmToken = await messaging().getToken();

        if (fcmToken && accessToken) {
          await dispatch(
            registerDevice({
              fcmToken,
              configuration: `Bearer ${accessToken}`,
            }),
          );
        }
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
      Alert.alert('Success', 'A reset code has been sent to your email.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('SetNewPassword', { email });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1 }}>
        <Header title="" />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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

          {loading ? (
            <ActivityIndicator size="large" color="#20C997" style={{ marginTop: 20 }} />
          ) : (
            <CommonButton needTopSpace text="LOG IN" onPress={onLoginPressed} />
          )}

          <View style={styles.footer}>
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={{ color: '#20C997' }}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
