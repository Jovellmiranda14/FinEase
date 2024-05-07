// Import the necessary modules
import { getDatabase, ref, set, onValue } from 'firebase/database';
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, Modal, Animated, ImageBackground } from 'react-native';
import { getAuth, signOut, sendPasswordResetEmail, onAuthStateChanged  } from '@firebase/auth';

import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage'; // Import storage module
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import { LinearGradient } from 'expo-linear-gradient';


// CustomButton component
const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Userprofile component
const Userprofile = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // State to store the profile picture
  const [dob, setDob] = useState(null);
  const [age, setAge] = useState(null);
  const [user, setUser] = useState('');
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const auth = getAuth();
  const storage = getStorage();

  // Function to handle picture upload
  const handleUploadPicture = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library not granted');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      const user = auth.currentUser;
  
      // Send password reset email to the user's email address
      await sendPasswordResetEmail(auth, user.email);
  
      // setSuccessMessage('Password reset email sent. Please check your inbox.');
  
      // Set a timeout to clear the success message after a certain period (e.g., 1 minute)
      setTimeout(() => {
        // setSuccessMessage('');
      }, 60000); // 1 minute in milliseconds
  
      // Clear any existing error message
      setErrorMessage('');
    } catch (error) {
      // console.error('Error sending password reset email:', error.message);
      if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many requests. Please wait for one minute before trying again.');
  
        // Set a timeout to clear the error message after a certain period (e.g., 1 minute)
        setTimeout(() => {
          // setErrorMessage('');
        }, 60000); // 1 minute in milliseconds
      } else {
        setErrorMessage('Failed to send password reset email. Please try again later.');
      }
      // Clear any existing success message

    }
  };
  
  
  const database = getDatabase();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const { firstName, lastName, email, dob, phoneNumber } = userData;
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setDob(dob);
            setPhoneNumber(phoneNumber);
          }
        });
      } else {
        // Clear profile-related states when user is logged out
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
      }
    });
  
    return () => unsubscribe();
  }, [database]);
  const handleAuthentication = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not logged in.');
      }

      // console.log('User logged out successfully!');
      await signOut(auth);
      setUser(null);
    } catch (error) {
      // console.error('Logout error:', error);
    }
  };
  useEffect(() => {
    const database = getDatabase();
    const userRef = ref(database, `users/${user.uid}`); // Replace 'userId' with the appropriate path in your database

    // Fetch user data including firstName, lastName, and dob from the database
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setDob(userData.dob || null); // Assuming 'dob' is stored in the database
      }
    });
  }, []); // Run once on component mount

  useEffect(() => {
    // Calculate age when dob changes
    if (dob) {
      const dobDate = new Date(dob);
      const age = calculateAgeFromDateOfBirth(dobDate);
      setAge(age);
    }
  }, [dob]);

  
  function calculateAgeFromDateOfBirth(dob) {
    const currentDate = new Date(); // Current date
    const dobDate = new Date(dob); // Date of birth
  
    let age = currentDate.getFullYear() - dobDate.getFullYear(); // Initial age calculation
  
    // Check if the birthday for this year has not occurred yet
    if (
      currentDate.getMonth() < dobDate.getMonth() ||
      (currentDate.getMonth() === dobDate.getMonth() && currentDate.getDate() < dobDate.getDate())
    ) {
      age--; // Subtract 1 from age if the birthday hasn't occurred yet this year
    }
  
    return age;
  }
  



  // Function to handle profile picture press
  const handleProfilePicturePress = async () => {
    // Open the image picker when the profile picture is pressed
    handleUploadPicture();
  };
  const toggleSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsSidebarOpen(false));
    } else {
      setIsSidebarOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
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
        // console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePictureURL();
  }, []); // Empty dependency array to ensure this effect runs only once on mount

  return (<ImageBackground source={require('./assets/2ndBI.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarButton}>
              <Text style={styles.sidebarButtonText}>≡</Text>
            </TouchableOpacity>
            <Image source={require('./assets/logo-modified.png')} style={styles.logo} />
          </View>
      <View style={styles.profileDetails}>
      <TouchableOpacity onPress={handleProfilePicturePress}>
  {profilePicture ? (
    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
  ) : (
    <Image source={require('./assets/user-icon.png')} style={styles.profilePicture} />
  )}
</TouchableOpacity>
        <Text style={styles.sectionTitle}>{firstName} {lastName}</Text>
        <Text style={styles.sectionTitle}> Username</Text>
        <Text style={styles.detailText}>Age: {age}</Text>
        <Text style={styles.detailText}>Phone: {phoneNumber}</Text>
        <Text style={styles.detailText}>Email: {email}</Text>
        <Text style={styles.detailText}>Date of Birth: {dob}</Text>
      </View>
      <Modal
            animationType="none"
            transparent={true}
            visible={isSidebarOpen}
            onRequestClose={toggleSidebar}
          >
            <LinearGradient
              colors={['rgba(16,42,96,0.97)', 'rgba(49,32,109,0.97)']}
              style={[styles.sidebar, { left: isSidebarOpen ? 0 : -300 }]}
            >
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Image source={require('./assets/left_arrow.png')} />
          </TouchableOpacity>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.sidebarIcon} />
              ) : (
                <Image source={require('./assets/user-icon.png')} style={styles.sidebarIcon} />
              )}
              <Text style={styles.sidebarName}>{firstName} {lastName}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.sidebarItem}>
              <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>Home</Text>
                    </View>
            </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Records')} style={styles.sidebarItem}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Records</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('TaskCalendar')} style={styles.sidebarItem}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>TaskCalendar</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('OnlineBanking')} style={styles.sidebarItem}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Online Banking</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Rewards')} style={styles.sidebarItem}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Rewards</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Goal Setting')} style={styles.sidebarItem}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Goal Setting</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Investment')} style={[styles.sidebarItem, { marginBottom: 20 }]}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Investment</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangePassword} style={[styles.buttonContainer, { bottom: 20 }]}>
                  <Text style={styles.buttonText}>Password Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAuthentication} style={[styles.buttonContainer, { position: 'absolute', bottom: 20 }]}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>

            </LinearGradient>
          </Modal>
  
    
    </View>
    </ImageBackground>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    height: 50,
    width: 50,
    top: 10,
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
  detailText:{
    color: 'white'
  }
  ,
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
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  sidebarContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  }, 
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  sidebarIcon: {
    width: 85,
    height: 85,
    borderRadius: 55,
    marginRight: 4,
    top: -45,
  },  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    borderRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },  
  sidebarItem: {
    marginBottom: 10, 
    color: 'white',
    textAlign: "center",
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },  
  sidebarButtonText: {
    fontSize: 35,
    color: 'white',
    top: 10,
  },    
  sidebarButton: {
    padding: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },  buttonText: {
    color: 'white',
    textAlign: 'center',
  },  
  sidebarName: {
    marginBottom: 10,
    fontSize: 18, 
    color: 'white',
    textAlign: "center",
    width: '100%',
    top: -35,
  },
});

export default Userprofile;
