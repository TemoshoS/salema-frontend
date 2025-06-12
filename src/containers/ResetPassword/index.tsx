import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import FormTextInput from '../../components/FormTextInput';
import CommonButton from '../../components/CommonButton';
import axiosInstance from '../../utils/axiosInstance';
import styles from './styles';

const SetNewPassword = ({ route }: any) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { email, token } = route.params;

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      await axiosInstance.post('/user/v1/reset-with-token', {
        email,
        token,
        newPassword: password,
      });
      Alert.alert('Success', 'Password updated successfully');
      navigation.navigate('Login');
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
        <Header title="Set New Password" />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <FormTextInput
            label="New Password"
            value={password}
            isPassword
            onTextChanged={setPassword}
            placeholder="Enter new password"
          />
          <FormTextInput
            label="Confirm Password"
            value={confirmPassword}
            isPassword
            onTextChanged={setConfirmPassword}
            placeholder="Confirm new password"
          />
          <View style={{ marginTop: 20 }}>
            <CommonButton text="Set Password" onPress={handleSetPassword} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SetNewPassword;
