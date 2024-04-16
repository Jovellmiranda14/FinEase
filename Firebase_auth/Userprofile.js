// Import the necessary modules
import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { getAuth, updateProfile, updatePassword } from '@firebase/auth';
import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage'; // Import storage module
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo

// CustomButton component
const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Userprofile component
const Userprofile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // State to store the profile picture
  const [errorMessage, setErrorMessage] = useState('');
  const auth = getAuth();
  const storage = getStorage();

  // Function to update user's profile
  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;

      // Update user's profile with first name and last name
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Update user's email and phone number
      await user.updateEmail(email);
      await user.updatePhoneNumber(phoneNumber);

      console.log('User profile updated successfully:', user.displayName);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  // Function to handle picture upload
  const handleUploadPicture = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library not granted');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        console.log('Image upload cancelled');
        return;
      }

      const selectedImageFile = result.assets[0].uri;
      const storageReference = storageRef(storage, `profile-pictures/${auth.currentUser.uid}/profile-picture.jpg`);

      const response = await fetch(selectedImageFile);
      const blob = await response.blob();
      await uploadBytes(storageReference, blob);

      const downloadURL = await getDownloadURL(storageReference);
      setProfilePicture(downloadURL);

      console.log('Image uploaded successfully:', downloadURL);
    } catch (error) {
      console.error('Image upload error:', error);
      setErrorMessage('Failed to upload profile picture. Please try again.');
    }
  };

  // Function to handle password change
  const handleChangePassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      setResetMessage('Failed to send password reset email. Please try again.');
    }
  };
  



  useEffect(() => {
    // Fetch the profile picture URL when the component mounts
    const fetchProfilePictureURL = async () => {
      try {
        const storageReference = storageRef(storage, `profile-pictures/${auth.currentUser.uid}/profile-picture.jpg`);
        const downloadURL = await getDownloadURL(storageReference);
        setProfilePicture(downloadURL);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePictureURL();
  }, []); // Empty dependency array to ensure this effect runs only once on mount

  return (
    <View style={styles.container}>
      <View style={styles.profileDetails}>
        {profilePicture && <Image source={{ uri: profilePicture }} style={styles.profilePicture} />}
        <Text style={styles.sectionTitle}>User Profile Details</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (Optional)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={handleUploadPicture}>
          <Text style={styles.link}>Upload Profile Picture</Text>
        </TouchableOpacity>
        <CustomButton title="Save Profile" onPress={handleUpdateProfile} />
        <CustomButton title="Change Password" onPress={handleChangePassword} />
      </View>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 15,
  },
  button: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    width: '70%',
    height: 40,
    backgroundColor: '#492FAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  profileDetails: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
});

export default Userprofile;
