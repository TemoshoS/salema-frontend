import {StyleSheet} from 'react-native';
import {BLACK, WHITE} from '../../constants/colors';
import {ROBOTO, ROBOTO_BOLD} from '../../constants/fonts';

export default StyleSheet.create({
  cardView: {
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#20C997',
  },
  header: {
    fontSize: 18,
    fontFamily: ROBOTO_BOLD,
    color: '#333',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 15,
    fontFamily: ROBOTO,
    color: '#666',
    marginBottom: 4,
  },
  rowFront: {
    backgroundColor: WHITE,
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
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  deleteText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    color: '#555',
    fontFamily: ROBOTO,
    fontSize: 20,
    marginBottom: 100,
  },
});
