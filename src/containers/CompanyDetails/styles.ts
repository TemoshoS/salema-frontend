import {StyleSheet} from 'react-native';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';
import {BLACK, WHITE} from '../../constants/colors';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 16,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
    width: '40%',
  },
  text: {
    fontSize: 16,
    fontFamily: ROBOTO,
    color: BLACK,
    width: '60%',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  verifyButton: {
    flex: 1,
    backgroundColor: '#20C997', // Teal green
    padding: 12,
    margin: 5,
    borderRadius: 12,
    elevation: 2,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#E74C3C', // Soft red
    padding: 12,
    margin: 5,
    borderRadius: 12,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 12,
    margin: 10,
    borderRadius: 12,
    elevation: 2,
    marginHorizontal: 16,
  },
  deactivateButton: {
    backgroundColor: '#F39C12',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 5,
    borderRadius: 12,
    elevation: 2,
  },

  buttonText: {
    textAlign: 'center',
    color: WHITE,
    fontFamily: ROBOTO_BOLD,
    fontSize: 16,
  },
});
