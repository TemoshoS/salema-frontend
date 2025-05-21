import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import LogoBanner from '../../components/LogoBanner';
import CommonButton from '../../components/CommonButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
type RequestListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AuthHome'
>;
export default function AuthHome() {
  const navigation = useNavigation<RequestListNavigationProp>();
  return (
    <View style={styles.container}>
      <View>
        <Header showBackButton={false} />
        <LogoBanner />
        <CommonButton
          needTopSpace
          text="Sign Up as Client"
          onPress={() => navigation.navigate('Register')}
        />
        <CommonButton
          needTopSpace
          text="Sign Up as Security Company"
          onPress={() => navigation.navigate('SecurityCompanyRegister')}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
