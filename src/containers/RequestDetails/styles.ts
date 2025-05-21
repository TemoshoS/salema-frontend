import {StyleSheet} from 'react-native';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';
import {BLACK, GREEN, WHITE} from '../../constants/colors';

export default StyleSheet.create({
  headerText: {
    marginStart: 10,
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },
  text: {
    marginRight: 40,
    fontSize: 16,
    fontFamily: ROBOTO,
    color: BLACK,
    width: '60%',
  },
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  buttonRow: {
    flexDirection: 'row',
    paddingRight: 20,
    justifyContent: 'space-evenly',
  },
  updateButton: {
    width: '50%',
    backgroundColor: 'orange',
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
  eventsHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  eventsText: {
    marginStart: 10,
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
    marginTop: 20,
  },
  cardView: {
    flex: 1,
    backgroundColor: '#fff', // White background
    paddingVertical: 20, // Padding inside the card
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
  eventStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  requestText: {
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },
  statusText: {
    fontSize: 16,
    fontFamily: ROBOTO_BOLD,
    color: GREEN,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
    marginBottom: 10,
  },
  center: {
    alignItems: 'center',
    marginTop: 20,
  },
  commentText: {
    fontFamily: ROBOTO,
    fontSize: 16,
    color: BLACK,
    marginStart: 5,
  },
  bodyText: {
    fontFamily: ROBOTO,
    fontSize: 16,
    color: BLACK,
    marginStart: 20,
  },
  divider: {height: 1, backgroundColor: '#d3d3d3', marginVertical: 10},
  commentRow: {flexDirection: 'row'},
});
