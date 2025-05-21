import React, {useEffect} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  deleteClient,
  getClients,
  updateClientList,
} from '../../redux/clientSlice';
import Header from '../../components/Header';
import styles from './styles';
import {ClientType} from '../../types';
import {SwipeListView} from 'react-native-swipe-list-view';
import EmptyContainer from '../../components/EmptyContainer';
import {useNavigation} from '@react-navigation/native';

export default function ClientList() {
  const dispatch = useAppDispatch();
  const {clients, deleteId} = useAppSelector(state => state.client);
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getClients());
  }, []);

  useEffect(() => {
    if (deleteId) {
      dispatch(
        updateClientList(clients?.filter(item => item._id !== deleteId)),
      );
    }
  }, [deleteId]);

  const handleDelete = (id: string) => {
    dispatch(deleteClient(id));
  };

  const renderHiddenItem = ({item}: {item: ClientType}) => (
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

  const renderItem = ({item}: {item: ClientType}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        navigation.navigate('ClientDetails', item);
      }}
      style={styles.cardView}>
      <Text style={styles.header}>{item.firstName}</Text>
      <Text style={styles.itemText}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <Header title="Client List" />

      {clients?.length === 0 || clients === null ? (
        <EmptyContainer title="No Clients" />
      ) : (
        <SwipeListView
          data={clients}
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
