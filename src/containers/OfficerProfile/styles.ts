import {StyleSheet} from 'react-native';
import {BLACK, WHITE} from '../../constants/colors';
import {ROBOTO} from '../../constants/fonts';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f1f2',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  headerText: {
    marginStart: 10,
    fontSize: 24,
    fontFamily: ROBOTO,
    color: BLACK,
  },
  container: {marginStart: 10, marginTop: 10},
  serviceText: {fontSize: 16, color: BLACK, fontFamily: ROBOTO},
  dropDown: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 1,
  },

  label: {
    fontFamily: ROBOTO,
    color: BLACK,
    fontSize: 18,
    marginStart: 10,
    marginBottom: 10,
  },

  gradeText: {
    color: BLACK,
    fontFamily: ROBOTO,
    fontSize: 16,
  },
});
