import {StyleSheet} from 'react-native';
import {THEME_COLOR, WHITE} from '../../constants/colors';
import {ROBOTO} from '../../constants/fonts';

export default StyleSheet.create({
  container: {},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addSkillButton: {
    backgroundColor: THEME_COLOR,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
  },
  addSkillText: {
    fontFamily: ROBOTO,
    fontSize: 18,
    color: WHITE,
    textAlign: 'center',
  },
  skillItem: {
    fontSize: 16,
    padding: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderWidth: 1,
    marginHorizontal: 10,
    marginTop: 2,
    borderColor: '#d3d3d3',
  },
});
