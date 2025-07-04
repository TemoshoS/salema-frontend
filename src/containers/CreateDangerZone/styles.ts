import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontWeight: '600',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  clearButton:{

  },
  clearText:{
    
  }
});

export default styles;
