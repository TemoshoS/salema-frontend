import {StyleSheet} from 'react-native';
import {BLACK, WHITE} from '../../constants/colors';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    paddingRight: 20,
    justifyContent: 'space-evenly',
  },
});
