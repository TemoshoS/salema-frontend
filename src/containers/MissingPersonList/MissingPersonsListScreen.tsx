import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchMissingPersons, deleteMissingPerson } from '../../redux/missingPersonSlice';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const ItemCard = ({ item, onPressView, onPressDelete }: any) => {
  const imgUri = item.filePath || item.filepath;

  return (
    <TouchableOpacity style={styles.card} onPress={onPressView} activeOpacity={0.8}>
      {imgUri ? (
        <Image source={{ uri: imgUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.personName}</Text>
        <Text style={styles.meta}>Age: {item.age} • Status: {item.missingStatus}</Text>
        <Text style={styles.meta} numberOfLines={1}>Last seen: {item.lastSeenLocation}</Text>
      </View>

      <TouchableOpacity onPress={onPressDelete} style={styles.deleteBtn} activeOpacity={0.7}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const MissingPersonsListScreen = () => {
  const dispatch = useAppDispatch();
  const nav = useNavigation<any>();
  const { items, loading, error } = useAppSelector((s) => s.missingPerson);

  useEffect(() => {
    dispatch(fetchMissingPersons());
  }, [dispatch]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#20C997" />;
  if (error) return <Text style={{ margin: 24, color: 'red', textAlign: 'center' }}>{error.message || 'Error loading'}</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Header title="Missing People" />
      <FlatList
        data={items}
        keyExtractor={(it) => it._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPressView={() => nav.navigate('MissingPersonDetails', { id: item._id })}
            onPressDelete={() => dispatch(deleteMissingPerson(item._id))}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  noImageText: {
    fontSize: 10,
    color: '#888',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222',
  },
  meta: {
    fontSize: 13,
    color: '#555',
  },
  deleteBtn: {
    marginLeft: 12,
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MissingPersonsListScreen;
