import React, { useState } from 'react';
import { Text, TextInput, Button, View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import ForgotPassword from './ForgotPassword';
import SignUpForm from './SignUpForm';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const auth = getAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in successfully:', user.email);
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Invalid email or password.');
    }
  };

  const handleRegisterNow = () => {
    setShowSignUpForm(true);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <View style={styles.container}>
        <ImageBackground source={require('./BI.jpg')} style={styles.backgroundImage}>
      {showSignUpForm ? (
        <SignUpForm onBackToLogin={() => setShowSignUpForm(false)} />
      ) : showForgotPassword ? (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      ) : (
        <View style={styles.content}>
          <TextInput
          style={styles.emailInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
          style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>


          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <CustomButton title="Login" onPress={handleLogin} />


          <TouchableOpacity onPress= {handleRegisterNow}>
             <Text style={styles.registerNow}>No Account? Register Now!</Text>
          </TouchableOpacity>
        </View>
        
      )}
      </ImageBackground>
    </View>
  );
};
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
    width: '115%',
    height: '8%',
  },
  passwordInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: '115%',
    height: '8%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: 'white',
    textDecorationLine: 'underline'
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  registerNow: {
    marginTop: 20,
    color: 'white',
    textDecorationLine: 'underline'
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
});


export default LoginForm;
