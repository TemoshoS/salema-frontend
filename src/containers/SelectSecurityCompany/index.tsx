import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {fetchAllSecurityCompany} from '../../redux/securityCompanySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmptyContainer from '../../components/EmptyContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRequest'>;

export default function SelectSecurityCompany() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const securityCompanies = useAppSelector(
    state => state.securityCompany.items,
  );

  const [securityCompaniesArr, setSecurityCompaniesArr]: any = useState([]);

  const renderItem = ({item}: {item: {_id: string; companyName: string}}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CreateRequest', {companyId: item._id});
      }}
      style={styles.cardView}>
      <Text style={styles.text}>{item.companyName}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    dispatch(fetchAllSecurityCompany());
  }, []);

  useEffect(() => {
    setSecurityCompaniesArr(securityCompanies);
  }, [securityCompanies]);

  return (
    <View style={styles.container}>
      <Header />

      {securityCompaniesArr.length !== 0 ? (
        <>
          <Text style={styles.headerText}>
            Select security company to continue
          </Text>
          <FlatList
            data={securityCompaniesArr}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        </>
      ) : (
        <EmptyContainer title="No Security Companies" />
      )}
    </View>
  );
}
