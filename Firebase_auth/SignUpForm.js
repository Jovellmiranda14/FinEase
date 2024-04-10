import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const SignUpForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const auth = getAuth();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user's profile with first name and last name
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Save additional user data to database
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      await set(userRef, {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        dateOfBirth: dateOfBirth,
      });

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

        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="none"
      />
      <TextInput

        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
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
