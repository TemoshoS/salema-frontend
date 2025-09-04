import { StyleSheet } from 'react-native';
import { BUTTON_COLOR } from '../../constants/colors'; // where your brand color lives

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // soft light background
  },

  // Chat bubbles
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: BUTTON_COLOR,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#E5E7EB', // light grey for bot
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 15,
    color: '#111827',
  },
  userText: {
    color: '#fff',
  },

  // Input section
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: BUTTON_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
