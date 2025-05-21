import {StyleSheet} from 'react-native';
import {BLACK, WHITE} from '../../constants/colors';
import {ROBOTO} from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    // padding: 16,
    backgroundColor: WHITE,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photoContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    color: '#aaa',
  },
  dateText: {fontSize: 16, color: BLACK, fontFamily: ROBOTO, marginStart: 10},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
});
