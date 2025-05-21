import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CommentType, EventsType} from '../../types';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {addEventComment} from '../../redux/eventSlice';
interface CommentProps {
  isVisible: boolean;
  eventId: string;
  onClosePressed: () => void;
}

const CommentsPopup: React.FC<CommentProps> = ({
  isVisible,
  eventId,
  onClosePressed,
}) => {
  const [newComment, setNewComment] = useState('');
  const {comments} = useAppSelector(state => state.events);
  const dispatch = useAppDispatch();

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(addEventComment({eventId, eventComment: newComment}));
      setNewComment('');
    }
  };

  return (
    <View style={{flex: 1}}>
      <Modal
        transparent
        animationType="slide"
        visible={isVisible}
        onRequestClose={onClosePressed}>
        <View style={styles.modalOverlay}>
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <TouchableOpacity onPress={onClosePressed}>
                <Icon name="close" size={25} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}: {item: CommentType}) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentName}>
                    {item.profile.firstName + ' ' + item.profile.lastName}
                  </Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              )}
              style={{flex: 1}}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommentsPopup;
