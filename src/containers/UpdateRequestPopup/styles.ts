import {StyleSheet} from 'react-native';
import {BLACK, WHITE} from '../../constants/colors';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: WHITE,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 24,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: BLACK,
    fontFamily: ROBOTO_BOLD,
    fontSize: 16,
  },
  buttonTextSelected: {
    color: WHITE,
    fontFamily: ROBOTO_BOLD,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: ROBOTO_BOLD,
    color: BLACK,
    marginTop: 10,
  },
  officerItem: {
    padding: 10,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOfficer: {
    backgroundColor: '#007BFF',
  },
  officerText: {
    color: BLACK,
    fontFamily: ROBOTO,
    fontSize: 16,
  },
  officerTextSelected: {
    color: WHITE,
    fontFamily: ROBOTO,
    fontSize: 16,
  },
  commentsInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButtonContainer: {
    marginTop: 20,
  },
});
