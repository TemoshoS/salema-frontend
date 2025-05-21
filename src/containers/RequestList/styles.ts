import {StyleSheet} from 'react-native';
import {BLACK, GREEN, THEME_COLOR, WHITE} from '../../constants/colors';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';

export default StyleSheet.create({
  headerText: {marginStart: 10, fontSize: 18, fontWeight: 'condensed'},
  row: {
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  cardView: {
    flex: 1,
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
    marginHorizontal: 20,
    marginTop: 20, // Some margin around the card
  },
  requestText: {
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },
  statusText: {
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: GREEN,
  },
  locationText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: ROBOTO,
    color: BLACK,
  },
  servicesText: {
    fontSize: 16,
    fontFamily: ROBOTO,
    color: BLACK,
  },
  floatingButton: {
    backgroundColor: THEME_COLOR,
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingText: {color: WHITE, fontSize: 50, fontFamily: ROBOTO_BOLD},
});
