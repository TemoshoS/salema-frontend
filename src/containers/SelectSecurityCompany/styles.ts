import {StyleSheet} from 'react-native';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';
import {BLACK} from '../../constants/colors';

export default StyleSheet.create({
  container: {flex: 1},
  panicContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
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
  panicText: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'white',
    borderRadius: 5,
  },
  headerText: {
    marginTop: 10,
    marginStart: 10,
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },
  row: {
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  itemContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
    padding: 10,
  },
  text: {
    fontFamily: ROBOTO,
    color: BLACK,
    fontSize: 16,
    textAlign: 'center',
  },
});
