import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Animated, Image, Button } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { getDatabase, ref, onValue } from '@firebase/database';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const HomeScreen = () => {
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation prop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [user, setUser] = useState(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [searchQuery, setSearchQuery] = useState('');
const [filteredCards, setFilteredCards] = useState([]);

const cards = [
  { id: 2, name: 'Records' },
  { id: 3, name: 'Task/Calendar' },
  { id: 4, name: 'Online Banking' },
  { id: 5, name: 'Rewards' },
  { id: 6, name: 'Goal Setting' },
  { id: 7, name: 'Investment' },
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


  // Sort
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If the search query is blank, show all cards
      setFilteredCards(cards);
    } else {
      // If there's a search query, filter the cards based on the query
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
      setUser(null); // Clear the user state after logout
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
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Sidebar Button */}
        <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarButton}>
          <Text style={styles.sidebarButtonText}>≡</Text>
        </TouchableOpacity>
        {/* Logo */}
        <Text style={styles.logo}>Logo</Text>
        {/* User Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
            <TextInput
        placeholder="Search"
        style={styles.searchBar}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

<View style={styles.cardsContainer}>
  {/* Clickable Cards */}
  <TouchableOpacity
    style={[styles.card, styles.doubleCard]}
  >
    <Text style={styles.cardText}>Welcome to Finease! Goals for Today?</Text>
  </TouchableOpacity>
  {/* Filtered Cards */}
  {filteredCards.length > 0 ? (
    filteredCards.map(card => (
      <TouchableOpacity
        key={card.id}
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate(card.name)}
      >
        <Text>{card.name}</Text>
      </TouchableOpacity>
    ))
  ) : (
    <>
      <TouchableOpacity
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate('Records')}
      >
        <Text>Records</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate('TaskCalendar')}
      >
        <Text>Task/Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate('OnlineBanking')}
      >
        <Text>Online Banking</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate('Rewards')}
      >
        <Text>Rewards</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate('GoalSetting')}
      >
        <Text>Goal Setting</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.card, styles.normalCard]}
        onPress={() => navigation.navigate('Investment')}
      >
        <Text>Investment</Text>
      </TouchableOpacity>
    </>
  )}
</View>
      {/* Sidebar */}
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
            <Text>Records</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TaskCalendar')} style={styles.sidebarItem}>
            <Text>Task/Calendar</Text>
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
          {user ? ( // Render logout button if user is logged in
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
    backgroundColor: '#fff',
    padding: 20,
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
    fontSize: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    width: '48%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    textAlign: 'center', // Center align text within the card
  },
  doubleCard: {
    width: '100%', // Occupies the full width of the container
  },
  normalCard: {
    width: '48%', // Occupies half of the container
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
    width: 30, // Adjust as needed
    height: 30, // Adjust as needed
    borderRadius: 15, // Half of the width and height to make it a circle
    marginRight: 10, // Adjust as needed
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
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default HomeScreen;
