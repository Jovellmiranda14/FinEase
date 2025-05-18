import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 90,
    alignItems: 'center',
  },
  emailInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    padding: 10,
    marginTop: 160,
    marginBottom: 10,
    width: 250,
    height: '8.5%',
  },
  passwordInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: 250,
    height: '8.5%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: 'white',
    textDecorationLine: 'underline',
    bottom: 40,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  registerNow: {
    marginTop: 20,
    color: 'white',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    width: '70%',
    height: '9%',
    backgroundColor: '#492FAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal',
  },
  toggleIcon: {
    width: 32,
    height: 32,
    bottom: 44,
    left: 93,
  },
});

export default styles;
