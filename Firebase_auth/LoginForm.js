import React, { useState } from 'react';
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';



const LoginForm = ({ onRegisterNow }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

    
  return (
    <View>
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
     <TouchableOpacity >
        <Text>Forgot Password</Text>
      </TouchableOpacity> 

      {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} color="#3498db" />



      <TouchableOpacity onPress={onRegisterNow}>
        <Text>Register Now</Text>
      </TouchableOpacity>


    </View>
  );
};

export default LoginForm;
