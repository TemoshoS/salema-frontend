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
    color: 'black',
  },
  container: {marginStart: 10, marginTop: 10},
  serviceText: {fontSize: 16, color: BLACK, fontFamily: ROBOTO},
  itemRow: {
    backgroundColor: WHITE,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  itemRowSelected: {
    backgroundColor: '#3455eb',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  text: {color: 'black', fontSize: 12, fontFamily: ROBOTO},
  textSelected: {color: 'white', fontSize: 12, fontFamily: ROBOTO},
  row: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 20,
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
    fontFamily: ROBOTO,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e6e7e8',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3455eb',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
  },
  locationText: {
    margin: 10,
    fontSize: 16,
    color: 'black',
    fontFamily: ROBOTO,
  },
});
