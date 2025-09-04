import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002E15',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  feature: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#002E15',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  dangerAlert: {
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
  },
  dangerText: {
    color: '#c62828',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  safeText: {
    color: '#2e7d32',
    fontSize: 18,
    textAlign: 'center',
  },
});
