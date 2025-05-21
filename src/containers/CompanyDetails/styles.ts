import {StyleSheet} from 'react-native';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';
import {BLACK, WHITE} from '../../constants/colors';

export default StyleSheet.create({
  headerText: {
    marginStart: 10,
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },
  text: {
    marginRight: 40,
    fontSize: 16,
    fontFamily: ROBOTO,
    color: BLACK,
    width: '50%',
  },
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  buttonRow: {
    flexDirection: 'row',
    paddingRight: 20,
    justifyContent: 'space-evenly',
  },
  verifyButton: {
    width: '50%',
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: WHITE,
    fontFamily: ROBOTO,
    fontSize: 18,
  },
  declineButton: {
    width: '50%',
    backgroundColor: 'red',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  deleteButton: {
    width: '100%',
    backgroundColor: 'red',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },

  deactivateButton: {
    width: '98%',
    backgroundColor: 'red',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
});
