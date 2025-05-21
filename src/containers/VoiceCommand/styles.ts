import {StyleSheet} from 'react-native';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';
import {BLACK, THEME_COLOR, WHITE} from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: ROBOTO,
    fontSize: 18,
    margin: 10,
    color: BLACK,
  },
  recognizedText: {
    fontSize: 16,
    fontFamily: ROBOTO,
    color: 'blue',
    marginVertical: 20,
  },
  cardView: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff', // White background
    padding: 20, // Padding inside the card
    borderRadius: 10, // Rounded corners
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Shadow for Android
    elevation: 5,
    marginHorizontal: 10,
    marginTop: 20, // Some margin around the card
  },
  dropDown: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 1,
  },
  speakText: {
    color: BLACK,
    fontFamily: ROBOTO,
    fontSize: 16,
    marginTop: 10,
  },
  emergencyContactSelected: {color: BLACK, fontFamily: ROBOTO, fontSize: 16},
  emergencyContactText: {color: WHITE, fontFamily: ROBOTO, fontSize: 16},
  voiceCommandHeader: {
    margin: 20,
    marginStart: 20,
    color: BLACK,
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    textAlign: 'center',
  },
  commandCorrectText: {
    textAlign: 'center',
    margin: 20,
    color: BLACK,
    fontSize: 18,
    fontFamily: ROBOTO,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingRight: 20,
    justifyContent: 'space-evenly',
  },
  verifyButton: {
    width: '50%',
    backgroundColor: THEME_COLOR,
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
  deleteButton: {
    width: '50%',
    backgroundColor: 'red',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
});
