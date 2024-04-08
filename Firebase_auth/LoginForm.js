import React, { useState } from 'react';
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native';
import SignUpForm from './SignUpForm';
import ForgotPassword from './ForgotPassword';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

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
    <View>
      {showSignUpForm ? (
        <SignUpForm onBackToLogin={() => setShowSignUpForm(false)} />
      ) : showForgotPassword ? (
        <ForgotPassword onBackToLogin={handleBackToLogin} />
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text>Forgot Password</Text>
          </TouchableOpacity>
          {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}
          <Button title="Login" onPress={handleLogin} color="#3498db" />
          <TouchableOpacity onPress={handleRegisterNow}>
            <Text>Register Now</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LoginForm;
