import React, { useState } from 'react';
import { Text, TextInput, Button, View, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import ForgotPassword from './ForgotPassword';
import SignUpForm from './SignUpForm';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

import hide_password from  './assets/hide_password.png';
import unhide_password from  './assets/unhide_password.png';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
const MAX_LOGIN_ATTEMPTS = 3;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [hidePassword, setHidePassword] = useState(true);
  const auth = getAuth();
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    } catch (error) {
      setErrorMessage('Invalid email or password.');
      setLoginAttempts(loginAttempts + 1);
      setPassword(''); // Reset password field
      if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        setShowForgotPassword(true); // Redirect to forgot password screen after max attempts
      }
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
  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View style={styles.container}>
      {showSignUpForm ? (
        <SignUpForm onBackToLogin={() => setShowSignUpForm(false)} />
      ) : showForgotPassword ? (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      ) : (
        <ImageBackground source={require('./assets/BI.png')} style={styles.backgroundImage}>
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
            secureTextEntry={hidePassword} 
          />
           <TouchableOpacity onPress={togglePasswordVisibility}>
        <Image
          source={hidePassword ? require('./assets/hide_password.png') : require('./assets/unhide_password.png')}
          style={styles.toggleIcon}
        />
      </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </TouchableOpacity>


          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <CustomButton title="Login" onPress={handleLogin} />


          <TouchableOpacity onPress= {handleRegisterNow}>
             <Text style={styles.registerNow}>No Account? Register Now!</Text>
          </TouchableOpacity>
        </View>
        </ImageBackground>  
      )}
      
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
  toggleIcon: {
    width: 30,
    height: 30,
    bottom: 43,
    left: 90,
  },
});


export default LoginForm;