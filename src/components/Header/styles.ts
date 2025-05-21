import {StyleSheet} from 'react-native';
import {THEME_COLOR} from '../../constants/colors';

export default StyleSheet.create({
  header: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginStart: 10,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    // width: '70%',
    color: 'white',
  },
  backArrow: {width: 30, height: 30, marginStart: 10},
  icon: {width: 30, height: 30, marginStart: 5},
});
