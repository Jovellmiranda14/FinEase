import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: 250,
  },
  addGoalContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    maxWidth: '90%',
  },
  goalText: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    marginLeft: 10,
  },
  completedCheckbox: {
    backgroundColor: '#007BFF',
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 20,
    width: '80%',
  },
  progressText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default styles;
