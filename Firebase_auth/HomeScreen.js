import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Animated, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RecordsScreen from './RecordsScreen';
import TaskCalendarScreen from './TaskCalendarScreen';
// Import other screens similarly

const HomePage = ({ navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    // Example function to fetch user data based on email
    const fetchUserData = async (email) => {
      // Make API call or retrieve data from your database
      // This is a placeholder, replace it with your actual implementation
      const userData = await yourUserDataFetchingFunction(email);
      // Extract user name from userData
      setUserName(userData.name);
    };

    // Call fetchUserData with the user's email
    const userEmail = 'user@example.com'; // Replace with actual user's email
    fetchUserData(userEmail);
  }, []);

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
        <Image source={require('./assets/user-icon.png')} style={styles.userIcon} />
      </View>
      {/* Search Bar */}
      <TextInput
        placeholder="Search"
        style={styles.searchBar}
      />
      <View style={styles.cardsContainer}>
        {/* Clickable Cards */}
        <TouchableOpacity
          style={[styles.card, styles.doubleCard]}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.cardText}>Welcome to Finease! Goals for Today?</Text>
        </TouchableOpacity>
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
      </View>
      {/* Sidebar */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isSidebarOpen}
        onRequestClose={toggleSidebar}
      >
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
          <Text style={styles.sidebarItem}>{userName}</Text>
          <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarItem}>
            <Text>Records</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarItem}>
            <Text>Task/Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarItem}>
            <Text>Online Banking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarItem}>
            <Text>Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarItem}>
            <Text>Goal Setting</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarItem}>
            <Text>Investment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
});

export default HomePage;
