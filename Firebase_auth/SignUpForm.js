import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';

const SignUpForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [Fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const auth = getAuth();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, Fullname);
      const user = userCredential.user;
      await updateProfile(user, { displayName: Fullname }); 
      console.log('User created successfully:', user.displayName);
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Failed to create user. Please try again.');
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Text>Get Started with</Text>
      <Text> FinEase </Text>
      <Text>  </Text>
      <TextInput
        placeholder="UserName"
        value={Fullname}
        onChangeText={setFullname}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Phone Number (Optional)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email Address"
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
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <TouchableOpacity onPress={handleSignUp}>
        <Text>Create an Account</Text>
      </TouchableOpacity>
      <Text>Have an Account?</Text>
      <TouchableOpacity onPress={onBackToLogin}>
        <Text>Login Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpForm;