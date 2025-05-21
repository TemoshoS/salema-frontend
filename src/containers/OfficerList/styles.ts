import {StyleSheet} from 'react-native';
import {BLACK, THEME_COLOR, WHITE} from '../../constants/colors';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';

export default StyleSheet.create({
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
    marginHorizontal: 10,
    marginTop: 20, // Some margin around the card
  },
  header: {
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },
  itemText: {
    fontSize: 16,
    fontFamily: ROBOTO,
    color: BLACK,
  },
  rowFront: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deactivateButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 10,
    marginLeft:5,
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
