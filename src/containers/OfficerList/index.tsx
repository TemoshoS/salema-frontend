import React, {useCallback, useEffect} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  deleteOfficer,
  getOfficers,
  updateOfficerList,
} from '../../redux/officerSlice';
import EmptyContainer from '../../components/EmptyContainer';
import {SwipeListView} from 'react-native-swipe-list-view';
import styles from './styles';
import {OfficerType} from '../../types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export default function OfficerList() {
  const dispatch = useAppDispatch();
  const {officers, deleteId} = useAppSelector(state => state.officers);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(getOfficers());
    }, []),
  );
  useEffect(() => {
    if (deleteId) {
      dispatch(
        updateOfficerList(officers?.filter(item => item._id !== deleteId)),
      );
    }
  }, [deleteId]);

  const handleDelete = (id: string) => {
    dispatch(deleteOfficer(id));
  };

  const renderHiddenItem = ({item}: {item: OfficerType}) => (
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
      <TouchableOpacity
        style={styles.deactivateButton}
        onPress={() => {
          Alert.alert('Delete', 'Are you sure you want to delete this item?', [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Deactivate',
              style: 'destructive',
            },
          ]);
        }}>
        <Text style={styles.deleteText}>Deactivate</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}: {item: OfficerType}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {}}
      style={styles.cardView}>
      <Text
        style={
          styles.header
        }>{`${item.profile.firstName} ${item.profile.lastName}`}</Text>
      <Text style={styles.itemText}>{item.profile.skills.join(', ')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <Header title="Officers" />
      {officers?.length === 0 || officers === null ? (
        <EmptyContainer title="No Officers" />
      ) : (
        <SwipeListView
          data={officers}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75} // Width of the hidde     n delete button
          disableRightSwipe // Only allow swipe to the left
        />
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddOfficer')}>
        <Text style={styles.floatingText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
