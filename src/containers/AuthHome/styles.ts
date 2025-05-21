import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  logo: {
    marginTop: 20,
    backgroundColor: 'red',
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3455eb',
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
    borderRadius: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {fontSize: 22, color: 'black'},
  loginText: {
    fontSize: 22,
    color: 'blue',
    fontWeight: 'bold',
    marginStart: 10,
  },
});
