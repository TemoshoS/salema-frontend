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

export default function Ecommerce() {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <Header title="E-Commerce" />
      <View style={styles.centerContainer}>
        <Text style={{}}>Under Construction</Text>
      </View>
    </View>
  );
}
//
