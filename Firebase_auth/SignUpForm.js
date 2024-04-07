import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';


const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [Fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const auth = getAuth();

  

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, Fullname, phoneNumber,dateOfBirth);
      const user = userCredential.user;
      console.log('User created successfully:', user.email);
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Failed to create user. Please try again.');
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      
      <TextInput
        placeholder="Fullname"
        value={Fullname}
        onChangeText={setFullname}
        autoCapitalize="none"
      />
  
      <TextInput
        placeholder="Phone Number"
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
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
            
      {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity>
      <Text style={styles.loginNow}>Login Now</Text>
    </TouchableOpacity>
    </View>
    
  );
};

export default SignUpForm;
