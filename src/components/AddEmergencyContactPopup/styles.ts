import {StyleSheet} from 'react-native';
import {BLACK, WHITE, THEME_COLOR, GREEN} from '../../constants/colors';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: ROBOTO_BOLD,
    color: THEME_COLOR,
  },
  closeButton: {
    fontSize: 24,
    fontFamily: ROBOTO_BOLD,
    color: '#FF4D4D',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontFamily: ROBOTO_BOLD,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: ROBOTO,
    color: BLACK,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  flagContainer: {
    marginRight: 10,
  },
  prefix: {
    fontSize: 16,
    marginRight: 5,
    color: BLACK,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 16,
    color: BLACK,
    paddingVertical: 0,
  },
  saveButtonContainer: {
    marginTop: 10,
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: WHITE,
    fontSize: 16,
    fontFamily: ROBOTO_BOLD,
  },
});
