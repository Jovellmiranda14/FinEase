import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

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

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

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
        dob: dob,
        phoneNumber: phoneNumber
      });

      console.log('User created successfully:', user.displayName);
    } catch (error) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address. Please enter a valid email.');
      } else {
        setErrorMessage('Failed to create user. Please try again.');
      }
    }
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
            placeholder="Phone Number (Optional)"
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
            secureTextEntry={hidePassword} // Use secureTextEntry to hide password
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              source={hidePassword ? require('./assets/hide_password.png') : require('./assets/unhide_password.png')}
              style={styles.toggleIcon}// Use secureTextEntry to hide password
            /> 
          </TouchableOpacity>
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
  firstNameInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    marginTop: 190,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 15,
  },
  lastNameInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 15,
  },
  phoneNumberInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 15,
  },
  emailInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 15,
  },
  dateInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 15,
  },
  passwordInput: {
    height: 40,
    width: 300,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 15,
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
    bottom: 44,
    left: 120,
  },
});

export default SignUpForm;
