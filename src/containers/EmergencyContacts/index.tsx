import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux/store';

import Header from '../../components/Header';
import styles from './styles';
import {EmergencyContactsType} from '../../types';
import {SwipeListView} from 'react-native-swipe-list-view';
import EmptyContainer from '../../components/EmptyContainer';
import {
  deleteEmergencyContacts,
  getEmergencyContacts,
  updateEmergencyContactList,
} from '../../redux/emergencyContactSlice';
import AddEmergencyContactPopup from '../../components/AddEmergencyContactPopup';



export default function EmergencyContacts() {
  const dispatch = useAppDispatch();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const {emergencyContacts, deleteId} = useAppSelector(
    state => state.emergencyContacts,
  );

  useEffect(() => {
    dispatch(getEmergencyContacts());
  }, []);

  useEffect(() => {
    if (deleteId) {
      dispatch(
        updateEmergencyContactList(
          emergencyContacts?.filter(item => item._id !== deleteId),
        ),
      );
    }
  }, [deleteId]);

  const handleDelete = (id: string) => {
    dispatch(deleteEmergencyContacts(id));
  };

  const renderHiddenItem = ({item}: {item: EmergencyContactsType}) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Delete',
            'Are you sure you want to delete this contact?',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Delete',
                onPress: () => handleDelete(item._id),
                style: 'destructive',
              },
            ],
          );
        }}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}: {item: EmergencyContactsType}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {}}
      style={styles.cardView}>
      <Text style={styles.header}>{item.name}</Text>
      <Text style={styles.itemText}>{item.relationship}</Text>
      <Text
        style={
          styles.itemText
        }>{`Voice Command : ${item.voiceCommandText}`}</Text>
      {/* <Text style={styles.requestText}>{item.contact}</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <Header title="Emergency Contacts" />

      {emergencyContacts?.length === 0 || emergencyContacts === null ? (
        <EmptyContainer title="No Emergency Contacts" />
      ) : (
        <SwipeListView
          data={emergencyContacts}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75} // Width of the hidde     n delete button
          disableRightSwipe // Only allow swipe to the left
        />
      )}

      <AddEmergencyContactPopup
        modalVisible={isPopupVisible}
        onClosePressed={() => {
          setPopupVisible(false);
        }}
        onSuccess={() => {
          setPopupVisible(false);
          dispatch(getEmergencyContacts());
        }}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setPopupVisible(true)}>
        <Text style={styles.floatingText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
