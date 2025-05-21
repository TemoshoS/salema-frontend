import React, {useEffect} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Header from '../../components/Header';
import {DangerZoneData} from '../../types';
import EmptyContainer from '../../components/EmptyContainer';
import {getDangerZones} from '../../redux/dangerZoneSlice';
import styles from './styles';

export default function DangerZoneList() {
  const dispatch = useAppDispatch();
  const {dangerZones} = useAppSelector(state => state.dangerZone);

  useEffect(() => {
    dispatch(getDangerZones());
  }, []);

  const renderItem = ({item}: {item: DangerZoneData}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {}}
      style={styles.cardView}>
      <Text style={styles.header}>{'Location :' + item.name}</Text>
      <Text style={styles.itemText}>{'Radius: ' + item.radius}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <Header title="Danger Zones" />

      {dangerZones?.length === 0 || dangerZones === null ? (
        <EmptyContainer title="No Danger Zones" />
      ) : (
        <FlatList
          data={dangerZones}
          keyExtractor={item => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
