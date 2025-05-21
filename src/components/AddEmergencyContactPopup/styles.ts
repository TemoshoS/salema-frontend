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
});
