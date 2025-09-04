import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Header from '../../components/Header';
import styles from './styles';
import {EmergencyContactsType} from '../../types';
import EmptyContainer from '../../components/EmptyContainer';
import {
  deleteEmergencyContacts,
  getEmergencyContacts,
  updateEmergencyContactList,
} from '../../redux/emergencyContactSlice';
import AddEmergencyContactPopup from '../../components/AddEmergencyContactPopup';
import Icon from 'react-native-vector-icons/FontAwesome';
import {THEME_COLOR} from '../../constants/colors';

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
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this contact?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => dispatch(deleteEmergencyContacts(id)), style: 'destructive'},
      ],
    );
  };

  const renderItem = ({item}: {item: EmergencyContactsType}) => (
    <View style={styles.cardView}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Icon name="user" size={28} color={THEME_COLOR} />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.header}>{item.name}</Text>
        <Text style={styles.itemText}>{item.relationship}</Text>
        <Text style={styles.requestText}>{item.phone}</Text>
  
      </View>

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButtonCard} onPress={() => handleDelete(item._id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <Header title="Emergency Contacts" />

      {emergencyContacts?.length === 0 || emergencyContacts === null ? (
        <EmptyContainer title="No Emergency Contacts" />
      ) : (
        <FlatList
          data={emergencyContacts}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 100}}
        />
      )}

      <AddEmergencyContactPopup
        modalVisible={isPopupVisible}
        onClosePressed={() => setPopupVisible(false)}
        onSuccess={() => {
          setPopupVisible(false);
          dispatch(getEmergencyContacts());
        }}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={() => setPopupVisible(true)}>
        <Text style={styles.floatingText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
