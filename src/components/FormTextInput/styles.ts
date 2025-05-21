import {StyleSheet} from 'react-native';
import {BLACK} from '../../constants/colors';
import {ROBOTO} from '../../constants/fonts';

export default StyleSheet.create({
  container: {margin: 10},
  textInput: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    fontSize: 18,
    color: BLACK,
    borderColor: '#d3d3d3',
  },
  labelText: {
    color: BLACK,
    fontFamily: ROBOTO,
    fontSize: 16,
  },
});
