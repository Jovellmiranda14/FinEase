import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ImageBackground, Image, TouchableWithoutFeedback } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import styles from '../CSS/SigmUpFormStyles';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const SignUpForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState(''); // State for date of birth
  const [hidePassword, setHidePassword] = useState(true);
  const auth = getAuth();



  const handleSignUp = async () => {
    if (!firstName || !lastName || !phoneNumber || !email || !dob || !password) {
      setErrorMessage('All fields are required. Please fill out all fields.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, phoneNumber,dob);
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
        dob: dob,
        phoneNumber: phoneNumber
      });

      console.log('User created successfully:', user.displayName);
    } catch (error) {
      // console.error('Sign up error:', error);
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address. Please enter a valid email.');
      } else {
        setErrorMessage('Failed to create user. Please try again.');
      }
    }
  };
  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/BI.png')} style={styles.backgroundImage}>
        <View style={styles.content}>
          <TextInput
            style={styles.firstNameInput}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.lastNameInput}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.phoneNumberInput}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType='numeric'
          />
          <TextInput
            style={styles.emailInput}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.dateInput}
            placeholder="Date of Birth: YYYY-MM-DD"
            value={dob}
            onChangeText={setDob}
            autoCapitalize="none"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
             secureTextEntry={hidePassword}  // Use secureTextEntry to hide password
          />
          <TouchableWithoutFeedback onPress={togglePasswordVisibility}>
            <Image 
              source={hidePassword ? require('./assets/hide_password.png')   :require('./assets/unhide_password.png')}
              style={styles.toggleIcon}// Use secureTextEntry to hide password
            /> 
          </TouchableWithoutFeedback >
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <CustomButton title="Create an Account" onPress={handleSignUp} />
          <TouchableOpacity onPress={onBackToLogin}>
            <Text style={styles.registerNow}>Have an Account? Login Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignUpForm;
