import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Modal, Button } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getDownloadURL, ref as storageRef, getStorage } from "firebase/storage";

const Rewards = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [user, setUser] = useState(null);

  const database = getDatabase();

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

  const fetchUserProfile = async (uid, setProfilePicture) => {
    try {
      const storage = getStorage();
      const profilePictureRef = storageRef(storage, `profile-pictures/${uid}/profile-picture.jpg`);
      const url = await getDownloadURL(profilePictureRef);
      setProfilePicture(url);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setProfilePicture(null); // Reset profile picture if fetch fails
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarButton}>
          <Text style={styles.sidebarButtonText}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>Logo</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.userIcon} />
          ) : (
            <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.rewardsContainer}>
        <Text>Rewards</Text>
        {/* Add your rewards content here */}
      </View>

      <Modal
          animationType="none"
          transparent={true}
          visible={isSidebarOpen}
          onRequestClose={toggleSidebar}>

          <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
              <Text style={styles.closeButton}>≤</Text>
            </TouchableOpacity>
            {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.userIcon} />
          ) : (
            <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
          )}
            <Text style={styles.sidebarItem}>{firstName} {lastName}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.sidebarItem}>
            <Text>Home</Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Records')} style={styles.sidebarItem}>
              <Text>Records</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TaskCalendar')} style={styles.sidebarItem}>
              <Text>TaskCalendar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('OnlineBanking')} style={styles.sidebarItem}>
              <Text>Online Banking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Rewards')} style={styles.sidebarItem}>
              <Text>Rewards</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GoalSetting')} style={styles.sidebarItem}>
              <Text>Goal Setting</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Investment')} style={styles.sidebarItem}>
              <Text>Investment</Text>
            </TouchableOpacity>
            {user ? (
              <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
            ) : null}
          </Animated.View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sidebarButton: {
    padding: 10,
  },
  sidebarButtonText: {
    fontSize: 25,
    color: 'black',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  rewardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 20,
  },
  sidebarItem: {
    marginBottom: 10,
  },
  userIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
});

export default Rewards;
