import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const auth = getAuth();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created successfully:', user.email);
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Failed to create user. Please try again.');
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <ImageBackground source={require('./BI.png')} style={styles.background}>
      <TextInput
        style={{ height: 40, width: 300, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={{ height: 40, width: 300, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onLoginNow}>
        <Text style={styles.loginNow}>Login Now</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
    
  );
};

export default SignUpForm;
