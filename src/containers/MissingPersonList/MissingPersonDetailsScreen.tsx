import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { fetchMissingPersonById, updateMissingPerson, deleteMissingPerson, addComment, deleteCommentThunk } from '../../redux/missingPersonSlice';
import Header from '../../components/Header';

const formatISO = (d: Date) => d.toISOString();

const MissingPersonDetailsScreen = () => {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const id = route.params?.id as string;

  const dispatch = useAppDispatch();
  const { selected, loading, error } = useAppSelector((s) => s.missingPerson);

  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [lastSeenDate, setLastSeenDate] = useState<Date>(new Date());
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    dispatch(fetchMissingPersonById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selected) {
      setLastSeenLocation(selected.lastSeenLocation || '');
      try { setLastSeenDate(new Date(selected.lastSeenDateTime)); } catch {}
    }
  }, [selected]);

  const imgUri = useMemo(() => (selected?.filePath || selected?.filepath), [selected]);

  if (loading || !selected) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#20C997" />;
  if (error) return <Text style={{ margin: 24, color: 'red', textAlign: 'center' }}>{error.message || 'Error loading'}</Text>;

  const onSaveUpdate = async (status?: 'missing' | 'found') => {
    await dispatch(updateMissingPerson({
      id,
      lastSeenLocation,
      lastSeenDateTime: formatISO(lastSeenDate),
      missingStatus: status ?? selected.missingStatus,
    }));
    Alert.alert('Updated', 'Missing person details updated');
  };

  const onMarkFound = () => onSaveUpdate('found');
  const onMarkMissing = () => onSaveUpdate('missing');

  const onDelete = async () => {
    await dispatch(deleteMissingPerson(id));
    nav.goBack();
  };

  const onAddComment = async () => {
    if (!newComment.trim()) return;
    await dispatch(addComment({ missingPerson: id, body: newComment.trim() }));
    setNewComment('');
    dispatch(fetchMissingPersonById(id));
  };

  const onDeleteComment = async (commentId: string) => {
    await dispatch(deleteCommentThunk(commentId));
    dispatch(fetchMissingPersonById(id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Header title="Missing Person Details" />
      <FlatList
        data={selected.comments || []}
        keyExtractor={(c) => c._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            {imgUri ? <Image source={{ uri: imgUri }} style={styles.hero} /> : null}

            <Text style={styles.title}>{selected.personName} {selected.missingStatus === 'found' ? '(FOUND)' : ''}</Text>
            <Text style={styles.meta}>Age: {selected.age} • Contact: {selected.contact}</Text>

            <Text style={styles.label}>Last Seen Location</Text>
            <TextInput
              value={lastSeenLocation}
              onChangeText={setLastSeenLocation}
              style={styles.input}
              placeholder="e.g. Mmabatho Mall, Entrance 2"
            />

            <Text style={styles.label}>Last Seen Date/Time</Text>
            <TextInput
              value={lastSeenDate.toISOString()}
              onChangeText={(t) => { const d = new Date(t); if (!isNaN(d.valueOf())) setLastSeenDate(d); }}
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.btn, styles.primary]} onPress={() => onSaveUpdate()}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              {selected.missingStatus === 'missing' ? (
                <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={onMarkFound}>
                  <Text style={styles.btnText}>Mark as Found</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={onMarkMissing}>
                  <Text style={styles.btnText}>Mark Missing</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.btn, styles.danger]} onPress={onDelete}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.title, { marginTop: 20 }]}>Comments</Text>
            <View style={styles.commentInputRow}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                style={[styles.input, { flex: 1 }]}
                placeholder="Write a comment"
              />
              <TouchableOpacity style={[styles.btn, styles.primary]} onPress={onAddComment}>
                <Text style={styles.btnText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={{ flex: 1, color: '#333' }}>{item.body}</Text>
            <TouchableOpacity onPress={() => onDeleteComment(item._id)}>
              <Text style={{ color: '#cc0000', fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#666', marginTop: 8, paddingHorizontal: 16 }}>No comments yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  primary: {
    backgroundColor: '#002E15',
  },
  secondary: {
    backgroundColor: '#444',
  },
  danger: {
    backgroundColor: '#cc0000',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
  },
});

export default MissingPersonDetailsScreen;
