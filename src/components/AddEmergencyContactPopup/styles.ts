import {StyleSheet} from 'react-native';
import {BLACK, WHITE} from '../../constants/colors';
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: WHITE,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  header: {justifyContent: 'space-between', flexDirection: 'row'},
  title: {
    fontSize: 20,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 24,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },

  saveButtonContainer: {
    marginTop: 20,
  },

  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  
  prefix: {
    fontSize: 16,
    marginRight: 6,
    color: '#333',
  },
  
  phoneTextInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    color: '#000',
  },
  
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  
  callingCode: {
    fontSize: 16,
    marginLeft: 5,
  },
  countryPicker: {
    backgroundColor: WHITE,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },  
});
