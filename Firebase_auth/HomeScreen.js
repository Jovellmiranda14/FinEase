import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Animated, Image, Button, ImageBackground } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { useNavigation } from '@react-navigation/native';
import { getDownloadURL, ref as storageRef, getStorage } from "firebase/storage";
import { LinearGradient } from 'expo-linear-gradient';
// Images
import records from './assets/records.png';
import tasks from './assets/tasks.png';
import OnlineBanking from './assets/online_banking.png';
import Rewards from './assets/rewards.png';
import GoalSetting from './assets/goal_setting.png';
import investment from './assets/investment.webp'; 


const HomeScreen = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  const cards = [
    { id: 2, name: 'Records', image: records },
    { id: 3, name: 'TaskCalendar', image: tasks },
    { id: 4, name: 'Online Banking', image: OnlineBanking },
    { id: 5, name: 'Rewards', image: Rewards },
    { id: 6, name: 'Goal Setting', image: GoalSetting },
    { id: 7, name: 'Investment', image: investment },
  ];

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
    if (searchQuery.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filteredCard = cards.filter((card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards(filteredCard);
    }
  }, [searchQuery]);

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
    setIsSidebarOpen(!isSidebarOpen);
  };
  const fetchUserProfile = async (uid) => {
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
    <ImageBackground source={require('./assets/2ndBI.png')} style={styles.backgroundImage}>
      {/*-------------------------------- ----Header-------------------------------- */}
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
        {/*-------------------------------- ----Header-------------------------------- */}
        <TextInput
          placeholder="Search"
          style={styles.searchBar}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, styles.doubleCard]}
        >
          <Image
            source={require('./assets/Carousel1.png')}
            style={styles.imageCarousel}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {filteredCards.length > 0 && filteredCards.map(card => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, card.name === 'TaskCalendar' || card.name === 'Rewards' || card.name === 'Investment' ? styles.specialCard : styles.normalCard]}
            onPress={() => navigation.navigate(card.name)}
          >
            <Image source={card.image} style={styles.imageStyle} />
            <Text style={styles.cardText}>{card.name}</Text>
            <View style={styles.bottomBorderFill} />
          </TouchableOpacity>
        ))}
        </View>
{/*-------------------------------- ----Navigation-------------------------------- */}
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
            {user ? (
              <TouchableOpacity onPress={handleAuthentication} style={[styles.buttonContainer, { position: 'absolute', bottom: 20 }]}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            ) : null}
          </LinearGradient>
        </Modal>
        {/*-------------------------------- ----Navigation-------------------------------- */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
    fontSize: 35,
    color: 'white',
    top: 10,
  },
  logo: {
    height: 50,
    width: 50,
    top: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  card: {
    width: '48%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'flex-end',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
  },
  normalCard: {
    width: '48%',
    height: 150,
    backgroundColor: '#416ABC',
    borderRadius: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
  },
  specialCard: {
    width: '48%',
    height: 150,
    backgroundColor: '#416ABC',
    borderRadius: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardText: {
    color: 'black',
    textAlign: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    zIndex: 1,
  },
  cardTextTop: {
    bottom: 'auto',
    top: 10,
    zIndex: 1,
  },
  cardImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomBorderFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  doubleCard: {
    width: '100%',
    height: 150,
    backgroundColor: '#416ABC',
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
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
  sidebarName: {
    marginBottom: 10,
    fontSize: 18, 
    color: 'white',
    textAlign: "center",
    width: '100%',
    top: -35,
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    left: 22,
    padding: 1,

    borderRadius: 5,
    zIndex: 1,
  }, 
  closeButtonText: {
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
    top: 10,
  },
  sidebarIcon: {
    width: 85,
    height: 85,
    borderRadius: 55,
    marginRight: 4,
    top: -45,
  },
  imageStyle: {
    width: 105,
    height: 105,
    top: -25,
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
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  imageCarousel: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

});

export default HomeScreen;
