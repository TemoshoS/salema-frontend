import {StyleSheet} from 'react-native';
import {ROBOTO_BOLD} from '../../constants/fonts';
import {WHITE} from '../../constants/colors';

export default StyleSheet.create({
  commentsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    height: '60%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  commentsTitle: {
    fontSize: 20,
    fontFamily: ROBOTO_BOLD,
    color: '#333',
  },

  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentName: {
    fontSize: 16,
    fontFamily: ROBOTO_BOLD,
    color: '#333',
  },
  commentText: {
    fontSize: 16,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: ROBOTO_BOLD,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
