import {StyleSheet} from 'react-native';
import {ROBOTO} from '../../constants/fonts';
import {BLACK} from '../../constants/colors';

export default StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  emptyText: {
    color: BLACK,
    fontFamily: ROBOTO,
    fontSize: 22,
    marginBottom: 100,
  },
});
