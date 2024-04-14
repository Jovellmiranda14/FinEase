import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker'; // Import from expo-image-picker
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    // Get the currently signed-in user
    const user = auth.currentUser;
    if (user) {
      // Retrieve user profile from the database
      const userRef = ref(db, 'users/' + user.uid);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // If user profile exists, set it to state
            setUserProfile(snapshot.val());
            // If user profile includes profile image, set it to state
            if (snapshot.val().profileImage) {
              setProfileImage(snapshot.val().profileImage);
            }
          } else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error('Error getting user profile:', error);
        });
    }
  }, [auth, db]);

  const handleSelectImage = async () => {
    // Open image picker to select or take a photo
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // If image selection is not cancelled, upload the image
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storage = getStorage();
      const imageRef = storageRef(storage, 'profile_images/' + auth.currentUser.uid);
      
      // Upload image to Firebase Storage
      await uploadString(imageRef, blob, 'data_url');

      // Get download URL of the uploaded image
      const downloadURL = await getDownloadURL(imageRef);
      
      // Save download URL to user profile in the database
      const user = auth.currentUser;
      const userRef = ref(db, 'users/' + user.uid);
      await update(userRef, {
        profileImage: downloadURL
      });

      // Update state with the download URL
      setProfileImage(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
      {userProfile && (
        <View style={styles.profile}>
          <Text>Email: {userProfile.email}</Text>
          <Text>First Name: {userProfile.firstName}</Text>
          <Text>Last Name: {userProfile.lastName}</Text>
          <Text>Phone Number: {userProfile.phoneNumber || 'N/A'}</Text>
        </View>
      )}
      <Button title="Select Profile Picture" onPress={handleSelectImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profile: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});

export default UserProfile;
