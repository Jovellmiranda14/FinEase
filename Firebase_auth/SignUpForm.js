import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';


const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [Fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const auth = getAuth();

  
// Not Sure 
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, Fullname);
      const user = userCredential.user;
      await updateProfile(user, { displayName: Fullname}); // Update user's display name with full name
      console.log('User created successfully:', user.displayName); // Access user's display name instead of fullName
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Failed to create user. Please try again.');
    }
  };
// Not Sure 
  return (
    <View style={{ alignItems: 'center' }}>
      <Text>Get Started with</Text>
      <Text> FinEase </Text>
      <Text>  </Text>
      <TextInput
      style={{ height: 40, width: 300, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 }}
        placeholder="UserName"
        value={Fullname}
        onChangeText={setFullname}
        autoCapitalize="none"
      />
  
      <TextInput
      style={{ height: 40, width: 300, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 }}
        placeholder="Phone Number (Optional)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        autoCapitalize="none"
      />
            <TextInput
        style={{ height: 40, width: 300, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 }}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      {/* <TextInput
     style={{ height: 40, width: 300, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 }}
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        autoCapitalize="none"
      /> */}

      <TextInput
      style={{ height: 40, width: 300, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
            
      {errorMessage ? <Text >{errorMessage}</Text> : null}
      <TouchableOpacity onPress={handleSignUp}>
        <Text >Create an Account</Text>
      </TouchableOpacity>
      <Text > </Text>
      <Text > </Text>
      <Text >Have an Account?</Text>
      <TouchableOpacity>
      <Text >Login Now</Text>
    </TouchableOpacity>
    </View>
    
  );
};

export default SignUpForm;
