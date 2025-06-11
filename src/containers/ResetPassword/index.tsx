import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../utils/axiosInstance';
import styles from './styles'; 

const SetNewPassword = ({route}: any) => {
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
      await axiosInstance.post('/user/v1/set-new-password', {
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
    <View style={styles.container}>
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Enter new password"
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
      />
      <TouchableOpacity style={styles.button} onPress={handleSetPassword}>
        <Text style={styles.buttonText}>Set Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetNewPassword;
