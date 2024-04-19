import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Animated, Image, Button, ImageBackground } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { useNavigation } from '@react-navigation/native';
import { getDownloadURL, ref as storageRef } from "firebase/storage";



//Images
import records from './assets/records.png';
import tasks from './assets/tasks.png';
import OnlineBanking from './assets/online_banking.png';
import Rewards from './assets/rewards.png';
import GoalSetting from './assets/goal_setting.png';
import investment from './assets/investment.webp';


const HomeScreen = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [user, setUser] = useState(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');


  const cards = [
    { id: 2, name: 'Records' , image: records},
    { id: 3, name: 'TaskCalendar', image: tasks },
    { id: 4, name: 'Online Banking', image: OnlineBanking },
    { id: 5, name: 'Rewards' , image: Rewards},
    { id: 6, name: 'Goal Setting' , image: GoalSetting},
    { id: 7, name: 'Investment', image: investment },
  ];

  const database = getDatabase();
  const auth = getAuth();

  useEffect(() => {
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
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filteredCard = cards.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards(filteredCard);
    }
  }, [searchQuery]);

  const handleAuthentication = async () => {
    try {
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
  
  return (
    <ImageBackground source={require('./assets/2ndBI.png')} style={styles.backgroundImage}>
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
          <Text style={[styles.cardText, styles.cardTextTop]}>Welcome to Finease! Goals for Today?</Text>
          <View style={styles.bottomBorderFill} />
        </TouchableOpacity>

    {filteredCards.length > 0 ? (
      filteredCards.map(card => (
      <TouchableOpacity
        key={card.id}
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate(card.name)}
      >
        <Image source={card.image} style={styles.imageStyle} />
        <Text style={styles.cardText}>{card.name}</Text>
        <View style={styles.bottomBorderFill} />
      </TouchableOpacity>
    ))
  ) : null}
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
            <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
            <Text style={styles.sidebarItem}>{firstName} {lastName}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Records')} style={styles.sidebarItem}>
              <Text>TaskCalendar</Text>
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
    fontSize: 25,
    color: 'white',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
  cardText: {
    color: 'black',
    textAlign: 'center',
    position: 'absolute',
    bottom: 10, // Adjust the bottom position
    left: 0,
    right: 0,
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    zIndex: 1, // Set z-index to bring text above the border
},
  cardTextTop: {
    bottom: 'auto',
    top: 10,
    zIndex: 1, // Add zIndex to bring text above the border
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
  },
  sidebarItem: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
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
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
//HEHE
imageStyle: {
    width: 100, // Specify the desired width
    height: 100, // Specify the desired height
  },
});

export default HomeScreen;
