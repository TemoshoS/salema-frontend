import {StyleSheet} from 'react-native';
import {ROBOTO_BOLD} from '../../constants/fonts';
import {BLACK, WHITE} from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  menuButtonText: {
    color: WHITE,
    fontFamily: ROBOTO_BOLD,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: ROBOTO_BOLD,
    margin: 20,
    color: BLACK,
  },
  navigationButton: {
    paddingVertical: 15,
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginStart: 20,
  },
  radiocontainer: {
    backgroundColor: '#007bff',
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
  },
  radioText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
