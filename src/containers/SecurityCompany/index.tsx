import React, {useCallback, useEffect} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Header from '../../components/Header';
import {SwipeListView} from 'react-native-swipe-list-view';
import styles from './styles';
import {
  deleteSecurityCompany,
  fetchAdminSecurityCompanies,
  updateCompanyList,
} from '../../redux/securityCompanySlice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import EmptyContainer from '../../components/EmptyContainer';

export default function SecurityCompanyList() {
  const dispatch = useAppDispatch();
  const {items, deleteId} = useAppSelector(state => state.securityCompany);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchAdminSecurityCompanies());
    }, []),
  );
  useEffect(() => {
    if (deleteId) {
      dispatch(updateCompanyList(items?.filter(item => item._id !== deleteId)));
    }
  }, [deleteId]);

  const handleDelete = (id: string) => {
    dispatch(deleteSecurityCompany(id));
  };

  const renderHiddenItem = ({item}: {item: any}) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert('Delete', 'Are you sure you want to delete this item?', [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Delete',
              onPress: () => handleDelete(item._id),
              style: 'destructive',
            },
          ]);
        }}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        navigation.navigate('CompanyDetails', item);
      }}
      style={styles.cardView}>
      <Text style={styles.header}>{item.companyName}</Text>
      <Text style={styles.itemText}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <Header title="Security Company List" />
      {items.length === 0 ? (
        <EmptyContainer title="No Security Companies" />
      ) : (
        <SwipeListView
          data={items}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75} // Width of the hidde     n delete button
          disableRightSwipe // Only allow swipe to the left
        />
      )}
    </View>
  );
}
