import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Modal, Button, ImageBackground } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getDownloadURL, ref as storageRef, getStorage } from "firebase/storage";
import { LinearGradient } from 'expo-linear-gradient';


const Onlinebanking = ({navigation}) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [user, setUser] = useState(null);


  const database = getDatabase();
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
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const { firstName, lastName } = userData;
            setFirstName(firstName || '');
            setLastName(lastName || '');
            // Assuming fetchUserProfile fetches the profile picture based on user ID
            fetchUserProfile(user.uid, setProfilePicture);
          }
        });
      } else {
        // Clear profile picture URL when user is logged out
        setProfilePicture(null);
      }
    });
  
    return () => unsubscribe();
  }, [database]);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const { firstName, lastName } = userData;
            setFirstName(firstName);
            setLastName(lastName);
          }
        });
        // Fetch profile picture URL when user is logged in
        fetchUserProfile(user.uid, setProfilePicture);
      } else {
        // Clear profile picture URL when user is logged out
        setProfilePicture(null);
      }
    });
    return () => unsubscribe();
  }, [database]);

  const fetchUserProfile = async (uid, setProfilePicture) => {
    try {
      const storage = getStorage();
      const profilePictureRef = storageRef(storage, `profile-pictures/${uid}/profile-picture.jpg`);
      const url = await getDownloadURL(profilePictureRef);
      setProfilePicture(url);
    } catch (error) {
      // console.error('Error fetching profile picture:', error);
      setProfilePicture(null); // Reset profile picture if fetch fails
    }
  };

  const handleAuthentication = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not logged in.');
      }

      console.log('User logged out successfully!');
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
 

  return (
    <ImageBackground source={require('./assets/ONLINE BANKING.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
    <View style={styles.header}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarButton}>
              <Text style={styles.sidebarButtonText}>≡</Text>
            </TouchableOpacity>
            <Image source={require('./assets/logo-modified.png')} style={styles.logo} />
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.userIcon} />
            ) : (
              <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
            )}
            </TouchableOpacity>
          </View>

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
         <TouchableOpacity onPress={() => navigation.navigate('Online Banking')} style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Online Banking</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Rewards</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity style={styles.sidebarItem}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Goal Setting</Text>
           </View>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('Investment')} style={[styles.sidebarItem, { marginBottom: 20 }]}>
           <View style={styles.buttonContainer}>
             <Text style={styles.buttonText}>Investment</Text>
           </View>
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
    top: 10,
  },
  sidebarButtonText: {
    fontSize: 35,
    color: 'white',
    top: 10,
  },
  
  sidebarButton: {
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    left: 22,
    padding: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  sidebarItem: {
    marginBottom: 10, 
    color: 'white',
    textAlign: "center",
    width: '100%',
  },
  sidebarIcon: {
    width: 85,
    height: 85,
    borderRadius: 55,
    marginRight: 4,
    top: -45,
  },
      sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonText: {
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
});

export default Onlinebanking; // Need ng ibang Name
